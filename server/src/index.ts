import "./infra/http/install-fetch-guard";
import { createLogger } from "./infra/logger";
import { startTracing, stopTracing } from "./infra/tracing/start";
import { createApp } from "./presentation";

// 何よりも先に始める。後から呼ぶと、それまでのスパンが送られない。
startTracing();

const logger = createLogger();

const PORT = Number(process.env.PORT ?? 3000);
const app = createApp();

async function shutdown() {
  // 溜まっているぶんを送り切る。これが無いと落ちる直前の — いちばん見たい —
  // スパンが失われる。
  await stopTracing();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

logger.info(`Server running on http://localhost:${PORT}`);

export default {
  hostname: "0.0.0.0",
  port: PORT,
  fetch: app.fetch,
  idleTimeout: 120,
};
