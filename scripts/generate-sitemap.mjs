import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SITE_URL = "https://balihany.com";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchIds(table, statusCol = "status") {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq(statusCol, "approved");
  if (error) {
    console.error(`Error fetching ${table}:`, error.message);
    return [];
  }
  return data.map((r) => r.id);
}

function urlEntry(loc, priority = "0.5", changefreq = "weekly") {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  const [conciergeIds, menageIds, designerIds] = await Promise.all([
    fetchIds("concierge_companies"),
    fetchIds("menage_companies"),
    fetchIds("designers"),
  ]);

  const entries = [
    urlEntry(`${SITE_URL}/`, "1.0", "daily"),
    urlEntry(`${SITE_URL}/concierge`, "0.9", "daily"),
    urlEntry(`${SITE_URL}/menage`, "0.9", "daily"),
    urlEntry(`${SITE_URL}/designers`, "0.9", "daily"),
    urlEntry(`${SITE_URL}/calculator`, "0.8", "weekly"),
    urlEntry(`${SITE_URL}/blog`, "0.7", "weekly"),
    urlEntry(`${SITE_URL}/contact`, "0.6", "monthly"),
    urlEntry(`${SITE_URL}/about`, "0.5", "monthly"),
    urlEntry(`${SITE_URL}/concierge-signup`, "0.5", "monthly"),
    urlEntry(`${SITE_URL}/terms`, "0.3", "yearly"),
    urlEntry(`${SITE_URL}/privacy`, "0.3", "yearly"),
    ...conciergeIds.map((id) => urlEntry(`${SITE_URL}/concierge/${id}`, "0.7", "weekly")),
    ...menageIds.map((id) => urlEntry(`${SITE_URL}/menage/${id}`, "0.7", "weekly")),
    ...designerIds.map((id) => urlEntry(`${SITE_URL}/designers/${id}`, "0.7", "weekly")),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

  const outPath = resolve(__dirname, "..", "public", "sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");
  console.log(`Sitemap generated with ${entries.length} URLs -> ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
