import { SitemapStream, streamToPromise } from "sitemap";
import { writeFileSync } from "fs";

async function generateSitemap() {
  const sitemap = new SitemapStream({
    hostname: "https://nopee.id",
  });

  sitemap.write({
    url: "/",
    changefreq: "daily",
    priority: 1.0,
  });

  sitemap.end();

  const data = await streamToPromise(sitemap);

  writeFileSync(
    "./public/sitemap.xml",
    data.toString()
  );

  console.log("✅ Sitemap generated");
}

generateSitemap();