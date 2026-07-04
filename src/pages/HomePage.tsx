import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
//import logo from "../assets/logo-nopee.png";

import banner1 from "../assets/banners/banner-1.jpg";
import banner2 from "../assets/banners/banner-2.jpg";
import banner3 from "../assets/banners/banner-3.jpg";

export default function HomePage() {
  const banners = [banner1, banner2, banner3];

  const [currentBanner, setCurrentBanner] = useState(0);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const loadProducts = async () => {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setDbProducts(data || []);
    }

    setLoadingProducts(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    loadProducts();

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet>
        <title>Nopee. - Fashion Premium untuk Wanita, Pria & Anak</title>

        <link rel="canonical" href="https://www.nopee.id/" />
      </Helmet>

      <Layout>
        <div className="overflow-hidden">
          {/* HERO */}
          <section className="relative min-h-[65vh] overflow-hidden">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  currentBanner === index ? "opacity-100" : "opacity-0"
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

            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-4xl mx-auto text-center">
                  <p className="tracking-[0.5em] text-[#D4B08C] text-xs uppercase mb-5 pt-10">
                    NOPEE.
                  </p>

                  <h1 className="font-luxury text-2xl md:text-4xl font-semibold leading-[0.9] mb-6">
                    Fashion Premium
                  </h1>

                  <p className="text-gray-300 text-lg md:text-1xl leading-relaxed mb-10 max-w-2xl mx-auto">
                    Koleksi fashion premium untuk seluruh keluarga dengan desain elegan dan kualitas
                    terbaik.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

                  <div className="flex gap-3 mt-10 justify-center">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBanner(index)}
                        className={`w-3 h-3 rounded-full transition ${
                          currentBanner === index ? "bg-[#D4B08C]" : "bg-white/40"
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
                  Produk Terbaru
                </h2>

                <p className="text-gray-400">Koleksi terbaru dari katalog Nopee</p>
              </div>

              {loadingProducts ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="
          bg-zinc-900
          rounded-2xl
          overflow-hidden
          border
          border-zinc-800
          animate-pulse
        "
                    >
                      <div className="w-full h-[420px] bg-zinc-800" />

                      <div className="p-6">
                        <div className="h-4 w-24 bg-zinc-800 rounded mb-4" />

                        <div className="h-6 w-3/4 bg-zinc-800 rounded mb-4" />

                        <div className="h-4 w-full bg-zinc-800 rounded mb-2" />

                        <div className="h-4 w-2/3 bg-zinc-800 rounded mb-6" />

                        <div className="h-6 w-32 bg-zinc-800 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : dbProducts.length === 0 ? (
                <div
                  className="
    text-center
      py-20
      border
      border-zinc-800
      rounded-3xl
      bg-zinc-950
    "
                >
                  <div className="text-5xl mb-4">📦</div>

                  <h3 className="text-2xl font-semibold mb-3">Produk Tidak Ditemukan</h3>

                  <p className="text-gray-400">
                    Coba gunakan kata kunci lain atau pilih kategori berbeda.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {dbProducts.slice(0, 6).map((product, index) => {
                    return (
                      <Link key={product.id || index} to={`/product/${product.slug}`}>
                        <div
                          className="
    group
    flex
    flex-col
    h-full
    bg-zinc-900
    rounded-2xl
    overflow-hidden
    border
    border-zinc-800
    hover:border-[#D4B08C]
    hover:-translate-y-1
    hover:shadow-2xl
    transition-all
    duration-300
  "
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="
   w-full
   h-52
   md:h-[420px]
   object-cover
   transition-transform
   duration-500
   group-hover:scale-105
  "
                          />

                          <div className="flex flex-col flex-1 p-4 md:p-6">
                            <p className="text-xs md:text-sm text-[#D4B08C] mb-2">
                              {product.category}
                            </p>

                            <h3 className="text-lg md:text-xl font-semibold mb-2 leading-tight">
                              {product.name}
                            </h3>

                            <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4 line-clamp-2 min-h-[32px] md:min-h-[40px]">
                              {product.description}
                            </p>

                            <span
                              className="
    mt-auto
    pt-4
    text-[#D4B08C]
    font-semibold
    text-lg md:text-xl
    transition
    group-hover:text-[#e8c59f]
  "
                            >
                              Rp {Number(product.price).toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {!loadingProducts && dbProducts.length > 6 && (
                <div className="text-center mt-10">
                  <Link
                    to="/products"
                    className="
        inline-block
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
                    Lihat Semua Produk
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* ABOUT */}
          <section className="py-20 border-t border-zinc-800">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="font-luxury text-4xl md:text-5xl font-semibold mb-6">Tentang Nopee</h2>

              <p className="text-gray-400 leading-relaxed text-lg">
                Nopee menghadirkan koleksi fashion berkualitas untuk wanita, pria dan anak dengan
                desain modern, material nyaman dan harga terjangkau.
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
                  Hubungi kami melalui WhatsApp untuk pemesanan dan informasi produk terbaru.
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
        </div>
      </Layout>
    </>
  );
}
