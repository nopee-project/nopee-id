import { Link } from "react-router-dom";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
};

type Props = {
  product: Product;
};

export default function CatalogCard({ product }: Props) {
  console.log(product);

  return (
    <Link to={`/product/${product.slug}`}>
      <div
        className="
          group
          bg-zinc-900
          rounded-xl
          overflow-hidden
          border
          border-zinc-800
          hover:border-[#D4B08C]
          transition
          duration-300
        "
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="
            w-full
            aspect-[3/4]
            object-cover
            group-hover:scale-105
            transition-transform
            duration-300
          "
        />

        <div className="p-3">
          <p className="text-xs text-[#D4B08C] mb-1">{product.category}</p>

          <h3
            className="
              text-sm
              font-semibold
              line-clamp-2
              min-h-[40px]
            "
          >
            {product.name}
          </h3>

          <p
            className="
              text-[#D4B08C]
              font-semibold
              mt-2
              text-sm
            "
          >
            Rp {Number(product.price).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </Link>
  );
}
