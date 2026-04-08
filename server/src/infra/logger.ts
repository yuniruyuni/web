export function createLogger() {
  return {
    info: (msg: string) => console.log(`[info] ${msg}`),
    warn: (msg: string) => console.warn(`[warn] ${msg}`),
    error: (msg: string) => console.error(`[error] ${msg}`),
  };
}
