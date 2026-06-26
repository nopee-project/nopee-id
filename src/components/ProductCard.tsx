import { Link } from "react-router-dom";

type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  category: string;
};

type Props = {
  product: Product;
};

export default function ProductCard({
  product,
}: Props) {
  return (
    <Link to={`/product/${product.slug}`}>
      <div
        className="
          bg-zinc-900
          rounded-2xl
          overflow-hidden
          border
          border-zinc-800
          hover:border-[#D4B08C]
          transition
        "
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-[3/4] object-cover"
        />

        <div className="p-4">

          <p className="text-xs text-[#D4B08C] mb-2">
            {product.category}
          </p>

          <h3 className="font-semibold">
            {product.name}
          </h3>

          <p className="mt-3 text-[#D4B08C] font-semibold">
            Rp{" "}
            {Number(product.price).toLocaleString("id-ID")}
          </p>

        </div>
      </div>
    </Link>
  );
}