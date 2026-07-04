import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductGrid from "../components/ProductGrid";

export default function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryName, setCategoryName] = useState("");

  const loadProducts = async () => {
    if (!slug) return;

    setLoading(true);

    const { data: category } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!category) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setCategoryName(category.name);

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category.name)
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setProducts(products || []);
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

        <link rel="canonical" href={`https://nopee.id/category/${slug}`} />
      </Helmet>

      <Layout>
        <div>
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h1 className="text-4xl font-bold mb-10">{categoryName}</h1>

            {loading ? <p>Loading...</p> : <ProductGrid products={products} columns={6} />}
          </div>
        </div>
      </Layout>
    </>
  );
}
