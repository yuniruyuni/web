import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

export default function StreamingProducts() {
  const products = [
    {
      title: "Stream Tag Inventory",
      description:
        "Twitchストリーマー向けの配信設定管理ツール。配信テンプレートの作成・保存、タイトル・カテゴリ・タグの一括設定、ワンクリックでの配信設定の適用など、配信準備を効率化する機能を提供します。",
      url: "https://tags.yuniruyuni.net/",
      image: "/product-tags.webp",
      imageAlt:
        "配信テンプレートの一覧と、タイトル・カテゴリ・タグを編集する画面",
    },
    {
      title: "Fighter Notes",
      description:
        "Street Fighter 6プレイヤー向けのリプレイ振り返りツール。録画したリプレイ動画をブラウザ内で解析し、被弾した場面や対空・DIなどの傾向を、改善ポイントや練習メニューとともに確認できます。",
      url: "https://fighter.yuniruyuni.net/",
      image: "/product-fighter.webp",
      imageAlt: "リプレイ動画をドロップして解析を始めるトップ画面",
    },
    {
      title: "StreamPainter",
      description:
        "OBSの映像に直接描き込めるWindows向けのローカル完結型オーバーレイ。ペンの筆圧・傾きに対応した描画、円形メニューからのツール・色・スタンプ選択、最大8枚のレイヤー管理などを、配信PCの中だけで完結して利用できます。",
      url: "https://github.com/yuniruyuni/StreamPainter",
      image: "/product-painter.webp",
      imageAlt: "OBS の映像に重ねた描画と、ツールと色を選ぶ円形メニュー",
    },
    {
      title: "StreamShougiBoard",
      description:
        "配信PCの中だけで動く将棋盤。手元のブラウザで駒を動かすと、OBSのブラウザソースに出した盤面がそのとおりに動きます。持ち駒・成り・手番の入れ替え・履歴の巻き戻しに対応し、背景の濃さも調整できます。",
      url: "https://github.com/yuniruyuni/StreamShougiBoard",
      image: "/product-shougi.webp",
      imageAlt: "OBS のブラウザソースに表示される、初期配置の将棋盤と駒台",
    },
    {
      title: "聖剣伝説LOM 武器制作アドバイザー",
      description:
        "聖剣伝説 Legend of Mana の武器鍛冶を支援するツール。手持ちの素材を入力すると、ATKが最大になるテンパリング手順を探索して提示します。追加で入手すると効果の大きい素材も分析して提案します。",
      url: "https://lom.yuniruyuni.net/",
      image: "/product-lom.webp",
      imageAlt:
        "手持ち素材から探索した武器構成を、ATK の高い順に並べた検索結果",
    },
    {
      title: "AutoKanban",
      description:
        "Coding Agentを複数並行で走らせながら進捗をカンバンで俯瞰する、ローカル完結型のタスク管理アプリ。1タスク＝1 Git worktreeで実行を分離し、エージェントとの会話・diff・開発サーバーのログをカンバン上に集約します。",
      url: "https://github.com/yuniruyuni/AutoKanban",
      image: "/product-kanban.webp",
      imageAlt:
        "Todo / In Progress / In Review / Done に分かれたカンバンボード",
    },
    {
      title: "n8n-nodes-twitch",
      description:
        "ワークフロー自動化ツールn8n向けのTwitch連携ノード。34種類のHelix APIリソース操作と、WebSocket経由のEventSubによるリアルタイム通知トリガーに対応しています。",
      url: "https://www.npmjs.com/package/@yuniruyuni/n8n-nodes-twitch",
      image: "/product-n8n-twitch.webp",
      imageAlt:
        "Twitch Trigger から分岐して Twitch API を呼ぶ n8n ワークフローの図",
    },
    {
      title: "n8n-nodes-discord",
      description:
        "ワークフロー自動化ツールn8n向けのDiscord連携ノード。26種類のRESTリソース操作に加えて、Gatewayイベント・Webhook・インタラクション・OAuth2まで幅広くカバーしています。",
      url: "https://www.npmjs.com/package/@yuniruyuni/n8n-nodes-discord",
      image: "/product-n8n-discord.webp",
      imageAlt:
        "Discord Trigger から加工を挟んで Discord を操作する n8n ワークフローの図",
    },
    {
      title: "yunirun",
      description:
        "yuniruyuni.netのVPS上でコンテナ化したアプリを動かす小さなデプロイシステム。GitHub Actionsから短命のSSH証明書で接続し、GHCRからpullしてblue/greenで無停止に入れ替えます。",
      url: "https://github.com/yuniruyuni/yunirun",
      image: "/product-yunirun.webp",
      imageAlt:
        "GitHub Actions から blue/green で入れ替えるまでのデプロイ手順の図",
    },
    {
      title: "Yuni言語",
      description:
        "配信で作っているプログラミング言語。Rust風の所有権システムによるメモリ安全性と、LLVMバックエンドによる最適化を両立し、代数的データ型とパターンマッチングを備えた表現力の高い文法を目指しています。",
      url: "https://github.com/yuniruyuni/yunilang",
      image: "/product-yunilang.webp",
      imageAlt: "構造体・列挙型・ジェネリクスを使った Yuni 言語のコード例",
    },
  ];

  return (
    <section className="bg-white/90 rounded-xl shadow-2xl p-8 max-w-4xl mx-auto my-16">
      <SectionHeader title="🌟これまでに配信で作ったもの🌟" />
      <div className="grid grid-cols-1 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.title}
            title={product.title}
            description={product.description}
            url={product.url}
            image={product.image}
            imageAlt={product.imageAlt}
          />
        ))}
      </div>
    </section>
  );
}
