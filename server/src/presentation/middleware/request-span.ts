/**
 * 要求ごとに SERVER スパンを 1 本張る。
 *
 * yuniview はこのスパンを「要求 1 件」として数える。これが無いと、配信は
 * できていても要求数も遅さも失敗も見えない。web が返すのはほぼ静的ファイル
 * なので、静的配信の要求にも張る (ここを serveStatic より前に置く理由)。
 *
 * 送り先が指定されていなければ (開発時・テスト時)、API は何もしない
 * スパンを返すだけなので、ここで分岐しない。
 *
 * 経路は当たった型 (/*, /api/usage/visit) を残し、実際のパスや問い合わせ
 * 文字列は残さない。パスをそのまま名前にすると、存在しないパスを叩く
 * 走査のたびに別の経路が増え、数える単位として役に立たなくなる。
 * 本文・Cookie・ヘッダ (X-Yuniview-Visit を含む) も載せない。
 */
import { SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import type { Context, MiddlewareHandler } from "hono";

/**
 * 張らない経路。
 *
 * 健康確認は数秒ごとに来る。要求として数えると、本物の要求がその中に
 * 埋もれる。落ちていれば経路側の指標に出る。
 */
const SKIP = new Set(["/health"]);

export function requestSpan(): MiddlewareHandler {
  const tracer = trace.getTracer("http");

  return async (c: Context, next) => {
    if (SKIP.has(c.req.path)) return next();

    // 名前は経路が決まってから updateName で入れる。仮の名前に実際のパスを
    // 使うと、伏せたい値がスパンに残る。
    return tracer.startActiveSpan(
      c.req.method,
      { kind: SpanKind.SERVER },
      async (span) => {
        try {
          await next();
        } finally {
          // next() の後で読むこと。前では経路がまだ決まっておらず、この
          // middleware 自身の登録パス (/*) が返る。
          const route = c.req.routePath;
          const status = c.res.status;
          span.updateName(`${c.req.method} ${route}`);
          span.setAttributes({
            "http.request.method": c.req.method,
            "http.route": route,
            "http.response.status_code": status,
          });
          // 5xx だけ失敗にする。4xx は呼ぶ側の誤りで、こちらの異常ではない。
          if (status >= 500) {
            span.setStatus({ code: SpanStatusCode.ERROR });
          }
          span.end();
        }
      },
    );
  };
}
