/**
 * 層ごとのトレース。
 *
 * 「アプリが遅い」までは経路 (HAProxy) のログで分かるが、その中のどこかは
 * 分からない。presentation / usecase / repository の境目で区切って、
 * どの層で時間を使っているかを見えるようにする。
 *
 * 送り先はホスト側が環境変数で指定する。アプリはホストの事情を知らない。
 *
 *   OTEL_EXPORTER_OTLP_ENDPOINT=unix:///run/tempo/otlp.sock
 *   OTEL_EXPORTER_OTLP_INSECURE=true
 *   OTEL_SERVICE_NAME=<app>
 *
 * 指定が無ければ何もしない。開発時やテスト時に送り先を用意させないため。
 *
 * このファイルは他のリポジトリへそのまま持っていける。アプリ固有の型にも
 * 名前にも依存させていない。
 */
import { type Span, SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("app");

/** 送り先が指定されているか。無ければ計装ごと省く。 */
export function tracingEnabled(): boolean {
  return Boolean(process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
}

/**
 * 名前を付けて計測する。
 *
 * 失敗はスパンに残す。ここで握り潰すと、遅いうえに失敗している呼び出しが
 * 「ただ遅いだけ」に見える。
 */
export async function traced<T>(
  name: string,
  fn: () => Promise<T> | T,
  attrs?: Record<string, string | number | boolean>,
): Promise<T> {
  if (!tracingEnabled()) return fn();
  return tracer.startActiveSpan(name, async (span: Span) => {
    if (attrs) span.setAttributes(attrs);
    try {
      return await fn();
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        // 例外そのものは載せない。DB ドライバの例外は失敗したクエリや行の
        // 値を含むことがあり、それは通信の内容そのもの。
        message: error instanceof Error ? error.name : "unknown error",
      });
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * オブジェクトのメソッドを一括で計測する。
 *
 * Repository は数が多く、1 つずつ包むと必ず漏れる。まとめて包める場所が
 * あるなら、そこで一度に済ませる。
 */
export function tracedMethods<T extends object>(target: T, prefix: string): T {
  if (!tracingEnabled()) return target;
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      if (typeof value !== "function" || typeof prop !== "string") return value;
      return (...args: unknown[]) =>
        traced(`${prefix}.${prop}`, () => value.apply(obj, args));
    },
  });
}
