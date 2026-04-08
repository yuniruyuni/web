import { describe, expect, test } from "bun:test";
import { createApp } from "./index";

describe("createApp", () => {
  test("/health が {status:'ok'} を返す", async () => {
    const app = createApp();
    const res = await app.fetch(new Request("http://localhost/health"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  test("存在しないパスは 404 を返す (SPA fallback を行わない)", async () => {
    const app = createApp();
    const res = await app.fetch(new Request("http://localhost/stream"));
    expect(res.status).toBe(404);
  });
});
