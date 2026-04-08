# yuniruyuni.net

Virtual TechLead ゆにるユニのウェブサイトです。簡単なプロフィールや、各種配信サイトへのリンク、配信で使うお洋服リストなどのコンテンツを配信しています。

https://yuniruyuni.net/

## 技術スタック

- **ランタイム / ビルド**: [Bun](https://bun.sh) (workspaces: client, server, e2e)
- **フロントエンド**: React 19, TypeScript, Tailwind CSS v4
- **バックエンド**: Hono (静的配信のみ)
- **リンター**: Biome
- **テスト**: bun:test + happy-dom + Testing Library, Playwright (e2e)
- **画像処理**: sharp (PNG → WebP)
- **デプロイ**: Docker (distroless) → Cloud Run

## セットアップ

```bash
bun install
```

## 開発

```bash
bun run watch:run
```

ローカルサーバー (http://localhost:3000) が起動し、ファイル変更時にホットリロードされます。

## ビルド

```bash
bun run build
```

`client/static/` ディレクトリに静的ファイルが、`server/dist/server` に compile 済み server バイナリが生成されます。

## チェック

```bash
bun run check       # 型 / lint / test を並列実行
bun run check:e2e   # Playwright e2e
bun run fix:lint    # Biome auto-fix
```

## Docker

```bash
docker build -t web .
docker run -p 3000:3000 web
```
