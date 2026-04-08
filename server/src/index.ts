import { createLogger } from "./infra/logger";
import { createApp } from "./presentation";

const logger = createLogger();

const PORT = Number(process.env.PORT ?? 3000);
const app = createApp();

async function shutdown() {
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
