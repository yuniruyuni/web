interface ProductCardProps {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
}

export default function ProductCard({
  title,
  description,
  url,
  image,
  imageAlt,
}: ProductCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col sm:flex-row gap-5 p-6 bg-purple-50 rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all"
    >
      <img
        src={image}
        alt={imageAlt}
        width={800}
        height={500}
        loading="lazy"
        decoding="async"
        className="w-full sm:w-56 sm:shrink-0 aspect-[8/5] object-cover object-top rounded-md border border-purple-200 bg-white"
      />
      <div>
        <h3 className="text-xl font-bold text-purple-800 mb-2">{title}</h3>
        <p className="text-slate-700 text-sm leading-relaxed">{description}</p>
      </div>
    </a>
  );
}
