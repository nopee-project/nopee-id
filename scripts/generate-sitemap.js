import { SitemapStream, streamToPromise } from "sitemap";
import { writeFileSync } from "fs";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const SITE_URL = "https://nopee.id";

async function generateSitemap() {
  try {
    const sitemap = new SitemapStream({
      hostname: SITE_URL,
    });

    // Homepage
    sitemap.write({
      url: "/",
      changefreq: "daily",
      priority: 1.0,
    });

    // Ambil semua produk
    const { data: products, error } = await supabase.from("products").select("slug, created_at");

    if (error) {
      console.error("❌ Failed to fetch products:", error);
      process.exit(1);
    }

    // Tambahkan semua produk ke sitemap
    products?.forEach((product) => {
      sitemap.write({
        url: `/product/${product.slug}`,
        lastmod: product.created_at,
        changefreq: "weekly",
        priority: 0.8,
      });
    });

    sitemap.end();

    const xml = await streamToPromise(sitemap);

    writeFileSync("./public/sitemap.xml", xml.toString());

    console.log(`✅ Sitemap generated successfully with ${products?.length || 0} products`);
  } catch (err) {
    console.error("❌ Sitemap generation failed:", err);
    process.exit(1);
  }
}

generateSitemap();
