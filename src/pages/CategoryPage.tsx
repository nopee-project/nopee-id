import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductGrid from "../components/ProductGrid";

export default function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = slug
  ?.split("-")
  .map(
    (word) =>
      word.charAt(0).toUpperCase() + word.slice(1)
  )
  .join(" ");

const loadProducts = async () => {
  if (!slug) return;

  setLoading(true);

  const category = slug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (!error) {
    setProducts(data || []);
  }

  setLoading(false);
};

useEffect(() => {
  loadProducts();
}, [slug]);

  return (

    <>
    <Helmet>
  <title>{`${categoryName} | Nopee`}</title>

  <link
    rel="canonical"
    href={`https://nopee.id/category/${slug}`}
  />
</Helmet>

    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">

    <h1 className="text-4xl font-bold mb-10">
  {categoryName}
</h1>

  {loading ? (
    <p>Loading...</p>
  ) : (
    <ProductGrid
      products={products}
      columns={3}
    />
  )}
</div>
    </div>
    </>
  );
}