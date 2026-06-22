import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string;
  category: string;
};

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setProduct(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        Produk tidak ditemukan
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4B08C] transition mb-8"
        >
          ← Kembali ke Beranda
        </Link>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Product Image */}
          <div className="lg:sticky lg:top-8">
            <img
              src={product.image}
              alt={product.name}
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

          {/* Product Info */}
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
    <span className="text-green-500">
      Tersedia
    </span>
  </div>
</div>

            </div>

            {/* CTA */}
            <div className="mt-10">
  <button
  onClick={() => {
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

  const whatsappUrl =
    `https://wa.me/6287887978989?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
}}
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
    </div>
  );
}