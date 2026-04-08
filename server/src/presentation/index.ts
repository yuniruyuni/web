import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { compress } from "hono/compress";
import { secureHeaders } from "hono/secure-headers";

const STATIC_DIR = process.env.STATIC_DIR ?? "./static";

export function createApp() {
  const app = new Hono();

  app.use(compress());

  app.use(
    secureHeaders({
      xFrameOptions: "SAMEORIGIN",
      xContentTypeOptions: "nosniff",
      referrerPolicy: "strict-origin-when-cross-origin",
      contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        frameAncestors: ["'none'"],
      },
    }),
  );

  app.get("/health", (c) => c.json({ status: "ok" }));

  app.use("/*", async (c, next) => {
    await next();
    if (c.res.status < 400) {
      c.res.headers.set(
        "Cache-Control",
        "public, max-age=0, stale-while-revalidate=86400",
      );
    }
  });

  // 静的ファイル (SSG 生成された /:id/index.html も含む)
  app.use("/*", serveStatic({ root: STATIC_DIR }));
  // SPA fallback (静的ファイルが無かったときのみ root の index.html を返す)
  app.get("*", serveStatic({ root: STATIC_DIR, path: "index.html" }));

  return app;
}
