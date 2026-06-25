import { SitemapStream, streamToPromise } from "sitemap";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

import { createClient } from "@supabase/supabase-js";

dotenv.config();
  "SUPABASE KEY:",
  process.env.VITE_SUPABASE_ANON_KEY ? "FOUND" : "NOT FOUND"
);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function generateSitemap() {
  const sitemap = new SitemapStream({
    hostname: "https://nopee.id",
  });

  // Homepage
  sitemap.write({
    url: "/",
    changefreq: "daily",
    priority: 1.0,
  });

  // Ambil semua produk
  const { data: products, error } = await supabase
    .from("products")
    .select("id");

  if (error) {
    console.error(error);
    return;
  }

  // Tambahkan semua produk ke sitemap
  products.forEach((product) => {
    sitemap.write({
      url: `/product/${product.id}`,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  sitemap.end();

  const data = await streamToPromise(sitemap);

  writeFileSync(
    "./public/sitemap.xml",
    data.toString()
  );

  console.log(
    `✅ Sitemap generated with ${products.length} products`
  );
}

generateSitemap();