import ProductCard from "./ProductCard";
import CatalogCard from "./CatalogCard";

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
  products: Product[];
  columns?: 3 | 4 | 6;
};

export default function ProductGrid({
  products,
  columns = 3,
}: Props) {
  let gridClass = "";

  if (columns === 3) {
    gridClass = "grid grid-cols-1 md:grid-cols-3 gap-8";
  }

  if (columns === 4) {
    gridClass = "grid grid-cols-2 md:grid-cols-4 gap-6";
  }

  if (columns === 6) {
    gridClass =
      "grid grid-cols-2 md:grid-cols-6 gap-4";
  }

  console.log(products);
  
  return (
    <div className={gridClass}>
  {products.map((product) =>
    columns === 6 ? (
      <CatalogCard
        key={product.id}
        product={product}
      />
    ) : (
      <ProductCard
        key={product.id}
        product={product}
      />
    )
  )}
</div>
  );
}