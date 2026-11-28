import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { context, SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import {
  InMemorySpanExporter,
  SimpleSpanProcessor,
  TracerProvider,
} from "@opentelemetry/sdk-trace";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { createApp } from "../index";
import { requestSpan } from "./request-span";

const exporter = new InMemorySpanExporter();
let staticDir = "";

beforeAll(async () => {
  context.setGlobalContextManager(
    new AsyncLocalStorageContextManager().enable(),
  );
  trace.setGlobalTracerProvider(
    new TracerProvider({
      spanProcessors: [new SimpleSpanProcessor({ exporter })],
    }),
  );
  staticDir = await mkdtemp(join(tmpdir(), "web-request-span-"));
  await writeFile(join(staticDir, "index.html"), "<!doctype html>");
});

afterAll(async () => {
  await rm(staticDir, { recursive: true, force: true });
});

beforeEach(() => exporter.reset());

function app(): Hono {
  const app = new Hono();
  app.use(requestSpan());
  app.get("/x", (c) => c.text("ok"));
  app.get("/a", (c) => c.text("nope", 404));
  app.get("/b", (c) => c.text("boom", 500));
  app.get("/p/:id", (c) => c.text("ok"));
  return app;
}

describe("要求のスパン", () => {
  // yuniview はこの SERVER スパンを要求 1 件として数える。
  test("要求ごとに方法・経路・状態を持つ SERVER スパンが 1 本残る", async () => {
    await app().request("/x");

    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].kind).toBe(SpanKind.SERVER);
    expect(spans[0].name).toBe("GET /x");
    expect(spans[0].attributes).toEqual({
      "http.request.method": "GET",
      "http.route": "/x",
      "http.response.status_code": 200,
    });
    expect(spans[0].status.code).toBe(SpanStatusCode.UNSET);
  });

  // web が返すのはほぼ静的ファイル。ここが数えられないと要求がほぼ見えない。
  test("静的ファイルの配信にも張る", async () => {
    const a = new Hono();
    a.use(requestSpan());
    a.use("/*", serveStatic({ root: staticDir }));
    const res = await a.request("/index.html");
    expect(res.status).toBe(200);

    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].kind).toBe(SpanKind.SERVER);
    expect(spans[0].attributes["http.route"]).toBe("/*");
    expect(spans[0].attributes["http.response.status_code"]).toBe(200);
  });

  // 4xx は呼ぶ側の誤り。こちらの異常ではないので失敗にしない。
  test("5xx だけを失敗にする", async () => {
    const a = app();
    await a.request("/a");
    await a.request("/b");

    const [notFound, boom] = exporter.getFinishedSpans();
    expect(notFound.attributes["http.response.status_code"]).toBe(404);
    expect(notFound.status.code).toBe(SpanStatusCode.UNSET);
    expect(boom.attributes["http.response.status_code"]).toBe(500);
    expect(boom.status.code).toBe(SpanStatusCode.ERROR);
  });

  test("問い合わせ文字列も経路の実際の値も残さない", async () => {
    await app().request("/p/SECRET-ID?token=secret-value");

    const [span] = exporter.getFinishedSpans();
    expect(span.name).toBe("GET /p/:id");
    expect(span.attributes["http.route"]).toBe("/p/:id");
    const recorded = JSON.stringify([span.name, span.attributes]);
    expect(recorded).not.toContain("SECRET-ID");
    expect(recorded).not.toContain("secret-value");
  });

  // 健康確認は数秒ごとに来る。数えると本物の要求が埋もれる。
  test("健康確認には張らない", async () => {
    const a = new Hono();
    a.use(requestSpan());
    a.get("/health", (c) => c.json({ status: "ok" }));
    await a.request("/health");
    expect(exporter.getFinishedSpans()).toHaveLength(0);
  });
});

// 部品だけ正しくても、アプリに組み込まれていなければ yuniview には何も届かない。
describe("createApp に組み込まれている", () => {
  test("存在しないパスも静的配信の経路として数える", async () => {
    const res = await createApp().request("/stream?x=1");
    expect(res.status).toBe(404);

    const spans = exporter.getFinishedSpans();
    expect(spans).toHaveLength(1);
    expect(spans[0].kind).toBe(SpanKind.SERVER);
    expect(spans[0].attributes).toEqual({
      "http.request.method": "GET",
      "http.route": "/*",
      "http.response.status_code": 404,
    });
  });

  test("API の要求も経路の型で数える", async () => {
    const res = await createApp().request("/api/usage/visit", {
      method: "POST",
    });
    expect(res.status).toBe(400);

    const [span] = exporter.getFinishedSpans();
    expect(span.name).toBe("POST /api/usage/visit");
    expect(span.attributes["http.route"]).toBe("/api/usage/visit");
  });

  test("健康確認は数えない", async () => {
    await createApp().request("/health");
    expect(exporter.getFinishedSpans()).toHaveLength(0);
  });
});
