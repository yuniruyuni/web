FROM oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS build-client
WORKDIR /work
COPY package.json bun.lock /work/
COPY client/package.json /work/client/
COPY server/package.json /work/server/
COPY e2e/package.json /work/e2e/
RUN bun install --frozen-lockfile
COPY client/ /work/client/
# 元画像 (`assets/`) はリポジトリルート直下に置いておく。
# client/bin/image.ts は `../assets/` を参照するため、ここで /work/assets/ にコピーする。
COPY assets/ /work/assets/
WORKDIR /work/client
RUN bun run build

FROM oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS build-server
WORKDIR /work
COPY package.json bun.lock /work/
COPY client/package.json /work/client/
COPY server/package.json /work/server/
COPY e2e/package.json /work/e2e/
RUN bun install --frozen-lockfile
COPY server/ /work/server/
WORKDIR /work/server
RUN bun build src/index.ts --compile --outfile /work/dist/server
# Prove the embedded runtime matches the pinned compiler and retains the guard.
RUN /work/dist/server --runtime-info > /tmp/runtime-info.json \
 && bun -e 'const r = await Bun.file("/tmp/runtime-info.json").json(); if (r.bun !== Bun.version || r.bunRevision !== Bun.revision || r.outboundFetchDecompression !== false) throw new Error("Compiled runtime/guard mismatch"); console.log(JSON.stringify(r));'

FROM gcr.io/distroless/cc-debian12@sha256:e5d81ddde149641e2a9ba55be4545bc125c67de07508b03ba4c22e6eb0ded5aa
WORKDIR /app
COPY --from=build-server /work/dist/server /app/server
COPY --from=build-client /work/client/static/ /app/static/
ENV STATIC_DIR=./static
EXPOSE 3000
CMD ["./server"]
