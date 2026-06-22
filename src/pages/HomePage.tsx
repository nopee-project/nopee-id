import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import logo from "../assets/logo-nopee.png";

import banner1 from "../assets/banners/banner-1.jpg";
import banner2 from "../assets/banners/banner-2.jpg";
import banner3 from "../assets/banners/banner-3.jpg";

    export default function HomePage() {
  const banners = [banner1, banner2, banner3];

  const [currentBanner, setCurrentBanner] = useState(0);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const loadProducts = async () => {

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });


  if (!error) {
    setDbProducts(data || []);
  }
};

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    loadProducts();

    return () => clearInterval(interval);
    }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-hidden">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#">
            <img
              src={logo}
              alt="Nopee"
              className="h-16 md:h-20 w-auto"
            />
          </a>

          <nav className="hidden md:flex gap-10 text-sm">
            <a
              href="#products"
              className="hover:text-[#D4B08C] transition"
            >
              Produk
            </a>

            <a
              href="#categories"
              className="hover:text-[#D4B08C] transition"
            >
              Kategori
            </a>

            <a
              href="https://wa.me/6287887978989"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#D4B08C] transition"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[80vh] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentBanner === index
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <img
              src={banner}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              <p className="tracking-[0.5em] text-[#D4B08C] text-xs uppercase mb-5 pt-10">
                NOPEE
              </p>

              <h1 className="font-luxury text-2xl md:text-4xl font-semibold leading-[0.9] mb-6">
                Fashion Premium
                <br />
                Untuk Keluarga
              </h1>

              <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                Koleksi fashion wanita, pria, anak dan busana muslim
                dengan kualitas terbaik, desain elegan dan harga
                yang terjangkau.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#products"
                  className="bg-[#D4B08C] text-black px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
                >
                  Lihat Produk
                </a>

                <a
                  href="https://wa.me/6287887978989"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-white/30 px-8 py-4 rounded-xl hover:bg-white/10 transition"
                >
                  WhatsApp
                </a>
              </div>

              <div className="flex gap-3 mt-10">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      currentBanner === index
                        ? "bg-[#D4B08C]"
                        : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUK */}
<section id="products" className="py-20">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-14">
      <h2 className="font-luxury text-4xl md:text-5xl font-semibold mb-4">
        Produk Unggulan
      </h2>

      <p className="text-gray-400">
        Koleksi terbaru dari katalog Nopee
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {(showAllProducts
        ? dbProducts
        : dbProducts.slice(0, 6)
      ).map((product, index) => {
        return (
          <Link
            key={product.id || index}
            to={`/product/${product.id}`}
          >
            <div className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#D4B08C] transition">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[420px] object-cover"
              />

              <div className="p-6">
                <p className="text-sm text-[#D4B08C] mb-2">
                  {product.category}
                </p>

                <h3 className="text-xl font-semibold mb-2">
                  {product.name}
                </h3>

                <p className="text-gray-400 text-sm mb-4">
                  {product.description}
                </p>

                <span className="text-[#D4B08C] font-semibold text-lg">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>

    {dbProducts.length > 6 && (
      <div className="text-center mt-10">
        <button
          onClick={() =>
            setShowAllProducts(!showAllProducts)
          }
          className="
            px-8
            py-3
            rounded-xl
            border
            border-[#D4B08C]
            text-[#D4B08C]
            hover:bg-[#D4B08C]
            hover:text-black
            transition
            font-medium
          "
        >
          {showAllProducts
            ? "Tampilkan Lebih Sedikit"
            : `Lihat Semua Produk (${dbProducts.length})`}
        </button>
      </div>
    )}
  </div>
</section>

      {/* KATEGORI */}
      <section
        id="categories"
        className="py-20 border-t border-zinc-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-luxury text-4xl md:text-5xl font-semibold mb-4">
              Kategori Fashion
            </h2>

            <p className="text-gray-400">
              Beragam pilihan fashion untuk seluruh keluarga
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Fashion Wanita",
              "Fashion Pria",
              "Fashion Anak",
              "Busana Muslim",
            ].map((item) => (
              <div
                key={item}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center hover:border-[#D4B08C] transition"
              >
                <h3 className="text-xl font-semibold">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-luxury text-4xl md:text-5xl font-semibold mb-6">
            Tentang Nopee
          </h2>

          <p className="text-gray-400 leading-relaxed text-lg">
            Nopee menghadirkan koleksi fashion berkualitas untuk wanita,
            pria dan anak dengan desain modern, material nyaman dan
            harga terjangkau.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-3xl p-10 md:p-16 text-center">
            <h2 className="font-luxury text-4xl md:text-5xl font-semibold mb-4">
              Siap Berbelanja?
            </h2>

            <p className="text-gray-400 mb-8">
              Hubungi kami melalui WhatsApp untuk pemesanan
              dan informasi produk terbaru.
            </p>

            <a
              href="https://wa.me/6287887978989"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-[#D4B08C] text-black px-8 py-4 rounded-xl font-semibold"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          © {new Date().getFullYear()} Nopee. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}