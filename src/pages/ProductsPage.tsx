import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "../components/Layout";
import { supabase } from "../lib/supabase";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<
  {
    id: number;
    name: string;
    slug: string;
  }[]
>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
  loadProducts();
  loadCategories();
}, []);

  useEffect(() => {
  setCurrentPage(1);
}, [search, selectedCategory]);

  async function loadCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error(error);
    return;
  }

  setCategories(data || []);
}

async function loadProducts() {
  setLoading(true);

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  setProducts(data || []);
  setLoading(false);
}


const filteredProducts = products.filter((product) => {

  const matchCategory =
    selectedCategory === "Semua" ||
    product.category === selectedCategory;

  const matchSearch =
    product.name
      .toLowerCase()
      .includes(search.toLowerCase());

  return matchCategory && matchSearch;

});

const productsPerPage =
  window.innerWidth >= 768 ? 24 : 12;


const totalPages = Math.ceil(
  filteredProducts.length / productsPerPage
);

const startIndex =
  (currentPage - 1) * productsPerPage;

const paginatedProducts =
  filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <>
      <Helmet>
        <title>Semua Produk | Nopee</title>

        <link
          rel="canonical"
          href="https://nopee.id/products"
        />
      </Helmet>

      <Layout>
  <div>

        <div className="max-w-7xl mx-auto px-6 py-16">

          <h1 className="font-luxury text-5xl text-center mb-4">
  Semua Produk
</h1>

<p className="text-center text-gray-400 mb-10">
  Jelajahi seluruh koleksi fashion Nopee
</p>

<div className="max-w-md mx-auto mb-10">
  <input
    type="text"
    placeholder="Cari produk..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
      w-full
      px-4
      py-3
      rounded-xl
      bg-zinc-900
      border
      border-zinc-700
      text-white
      placeholder-gray-500
      focus:outline-none
      focus:border-[#D4B08C]
    "
  />
</div>

<div className="flex flex-wrap justify-center gap-3 mb-10">
  <>
  <button
    onClick={() => setSelectedCategory("Semua")}
    className={`
      px-5
      py-2
      rounded-full
      border
      transition
      ${
        selectedCategory === "Semua"
          ? "bg-[#D4B08C] text-black border-[#D4B08C]"
          : "border-zinc-700 text-gray-300 hover:border-[#D4B08C]"
      }
    `}
  >
    Semua
  </button>

  {categories.map((category) => (
    <button
      key={category.id}
      onClick={() => setSelectedCategory(category.name)}
      className={`
        px-5
        py-2
        rounded-full
        border
        transition
        ${
          selectedCategory === category.name
            ? "bg-[#D4B08C] text-black border-[#D4B08C]"
            : "border-zinc-700 text-gray-300 hover:border-[#D4B08C]"
        }
      `}
    >
      {category.name}
    </button>
  ))}
</>
</div>

          {loading ? (
            <div className="text-center">
              Memuat produk...
            </div>
          ) : (
            <>

            <p className="text-center text-gray-500 mb-8">
            Menampilkan {paginatedProducts.length} dari {filteredProducts.length} produk
            </p>

            <ProductGrid
                products={paginatedProducts}
                columns={6}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
</>
          )}

        </div>

      </div>
</Layout>
</>
  );
}