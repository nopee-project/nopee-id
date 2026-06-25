import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";

type Product = {
id: string;
slug: string;
name: string;
price: number;
description: string | null;
image: string;
category: string;
};

export default function ProductDetailPage() {
const { slug } = useParams();
const navigate = useNavigate();

const [product, setProduct] = useState<Product | null>(null);
const [loading, setLoading] = useState(true);
const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  const loadProduct = async () => {
    if (slug) {
      await fetchProduct();
    }
  };

  loadProduct();
}, [slug]);

async function fetchProduct() {
setLoading(true);


const { data, error } = await supabase
  .from("products")
  .select("*")
  .eq("slug", slug);

if (error || !data || data.length === 0) {
  setProduct(null);
  setRelatedProducts([]);
  setLoading(false);
  return;
}

const selectedProduct = data[0];

setProduct(selectedProduct);

const { data: related } = await supabase
  .from("products")
  .select("*")
  .eq("category", selectedProduct.category)
  .neq("id", selectedProduct.id)
  .limit(4);

setRelatedProducts(related || []);

setLoading(false);


}

const openWhatsApp = () => {
if (!product) return;


const productUrl = window.location.href;

const message = `


Halo Nopee,

Saya ingin memesan produk:

Nama Produk: ${product.name}
Harga: Rp ${Number(product.price).toLocaleString("id-ID")}

Link Produk:
${productUrl}

Apakah masih tersedia?
`;


const whatsappUrl = `https://wa.me/6287887978989?text=${encodeURIComponent(
  message
)}`;

window.open(whatsappUrl, "_blank");


};

if (loading) {
return ( <div className="bg-black min-h-screen flex items-center justify-center"> <div className="animate-pulse text-[#D4B08C] text-xl">
Memuat Produk... </div> </div>
);
}

if (!product) {
return ( <div className="bg-black min-h-screen flex items-center justify-center text-white">
Produk tidak ditemukan </div>
);
}

return (
<> <Helmet>
  <title>{product.name} | Nopee</title>

  <meta
    name="description"
    content={product.description || product.name}
  />

  <link
    rel="canonical"
    href={`https://nopee.id/product/${product.slug}`}
  />

  <meta property="og:title" content={product.name} />

  <meta
    property="og:description"
    content={product.description || product.name}
  />

  <meta property="og:image" content={product.image} />

  <meta
    property="og:url"
    content={`https://nopee.id/product/${product.slug}`}
  />
</Helmet>

  <div className="bg-black min-h-screen text-white">
    <div className="max-w-7xl mx-auto px-6 py-10 pb-32">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4B08C] transition mb-8"
      >
        ← Kembali ke Beranda
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="lg:sticky lg:top-8">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="
              w-full
              rounded-3xl
              border
              border-zinc-800
              object-cover
              shadow-2xl
            "
          />
        </div>

        <div>
          <span
            className="
              inline-block
              px-4
              py-2
              rounded-full
              bg-zinc-900
              border
              border-zinc-800
              text-[#D4B08C]
              text-sm
              mb-5
            "
          >
            {product.category}
          </span>

          <h1 className="text-4xl lg:text-5xl font-bold mb-5">
            {product.name}
          </h1>

          <p className="text-4xl font-bold text-[#D4B08C] mb-8">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </p>

          <div className="border-t border-zinc-800 pt-6">
            <h2 className="text-lg font-semibold mb-3">
              Deskripsi Produk
            </h2>

            <p className="text-gray-400 leading-relaxed whitespace-pre-line">
              {product.description?.trim()
                ? product.description
                : "Deskripsi produk belum tersedia."}
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span className="text-gray-500">Kategori</span>
                <span>{product.category}</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-3">
                <span className="text-gray-500">Status</span>
                <span className="text-green-500">Tersedia</span>
              </div>
            </div>
          </div>

          <div className="mt-10 hidden md:block">
            <button
              onClick={openWhatsApp}
              className="
                w-full
                py-4
                rounded-xl
                bg-[#D4B08C]
                text-black
                font-semibold
                text-lg
                hover:opacity-90
                transition
              "
            >
              Pesan via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>

    {relatedProducts.length > 0 && (
      <section className="max-w-7xl mx-auto px-6 pb-36">
        <h2 className="text-2xl font-bold mb-6">
          Produk Terkait
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {relatedProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.slug}`)}
              className="
                cursor-pointer
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                overflow-hidden
                hover:border-[#D4B08C]
                transition
              "
            >
              <img
                src={item.image}
                alt={item.name}
                className="
                  w-full
                  aspect-square
                  object-cover
                "
              />

              <div className="p-4">
                <h3 className="font-medium line-clamp-2 mb-2">
                  {item.name}
                </h3>

                <p className="text-[#D4B08C] font-semibold">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    <div
      className="
        md:hidden
        fixed
        bottom-0
        left-0
        right-0
        p-4
        bg-black/95
        border-t
        border-zinc-800
        z-50
      "
    >
      <button
        onClick={openWhatsApp}
        className="
          w-full
          py-4
          rounded-xl
          bg-[#D4B08C]
          text-black
          font-semibold
        "
      >
        Pesan via WhatsApp
      </button>
    </div>
  </div>
</>


);
}
