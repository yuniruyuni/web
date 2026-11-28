/**
 * サーバを単一の実行ファイルにまとめる。
 *
 *   bun run build.ts [outfile]   (既定: dist/server)
 *
 * `bun build --compile` をそのまま使わないのは、OTLP gRPC exporter
 * (@opentelemetry/otlp-grpc-exporter-base 0.300 系) が `@grpc/grpc-js` を
 * `createRequire(import.meta.url)` 経由の実行時 require で読むため。
 * バンドラはこれを辿れず、実行ファイルの中では解決できない。
 * 送り先が指定された本番でだけ、最初のスパンを送る時に落ちる。
 *
 * その呼び出しを静的 import に置き換えてから束ねる。
 */
import type { BunPlugin } from "bun";

const GRPC_REQUIRE = '__require("@grpc/grpc-js")';

// OTel 側の実装が変わって置換が一度も当たらなくなると、ビルドは通るのに
// 本番でだけ落ちる元の状態に戻る。置換した数を数え、0 ならビルドを失敗させる。
let rewritten = 0;

const bundleGrpc: BunPlugin = {
  name: "bundle-grpc-js",
  setup(build) {
    build.onLoad(
      { filter: /[\\/]otlp-grpc-exporter-base[\\/]dist[\\/].*\.mjs$/ },
      async ({ path }) => {
        const source = await Bun.file(path).text();
        if (!source.includes(GRPC_REQUIRE))
          return { contents: source, loader: "js" };
        rewritten++;
        return {
          contents: `import * as __grpc_js from "@grpc/grpc-js";\n${source.replaceAll(GRPC_REQUIRE, "__grpc_js")}`,
          loader: "js",
        };
      },
    );
  },
};

const outfile = process.argv[2] ?? "dist/server";

const result = await Bun.build({
  entrypoints: ["src/index.ts"],
  compile: { outfile },
  plugins: [bundleGrpc],
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

if (rewritten === 0) {
  console.error(
    `${GRPC_REQUIRE} が見つからず、@grpc/grpc-js を束ねられませんでした。\n` +
      "@opentelemetry/otlp-grpc-exporter-base の読み込み方を確かめ、build.ts を直してください。",
  );
  process.exit(1);
}
