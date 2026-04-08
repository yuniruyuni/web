import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

export default function StreamingProducts() {
  const products = [
    {
      title: "Stream Tag Inventory",
      description:
        "Twitchストリーマー向けの配信設定管理ツール。配信テンプレートの作成・保存、タイトル・カテゴリ・タグの一括設定、ワンクリックでの配信設定の適用など、配信準備を効率化する機能を提供します。",
      url: "https://tags.yuniruyuni.net/",
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
          />
        ))}
      </div>
    </section>
  );
}
