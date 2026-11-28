/**
 * トレースの送信を始める。
 *
 * アプリの他の部分より先に呼ぶ。後から呼ぶと、それまでに作られたスパンが
 * どこにも送られない。
 *
 * 送り先が指定されていなければ何もしない。
 */
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { tracingEnabled } from "./index";

let sdk: NodeSDK | null = null;

export function startTracing(): void {
  if (!tracingEnabled()) return;
  sdk = new NodeSDK({ traceExporter: new OTLPTraceExporter() });
  sdk.start();
}

/**
 * 溜まっているぶんを送り切ってから終わる。
 *
 * これが無いと、落ちる直前の — いちばん見たい — スパンが失われる。
 */
export async function stopTracing(): Promise<void> {
  if (!sdk) return;
  await sdk.shutdown();
  sdk = null;
}
