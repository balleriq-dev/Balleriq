import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SOURCES = [
  { url: "https://newsfeed.kicker.de/news/aktuell" },
  { url: "https://newsfeed.kicker.de/news/bundesliga" },
  { url: "https://newsfeed.kicker.de/news/champions-league" },
  { url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
  { url: "https://www.skysports.com/rss/12040" },
  { url: "https://www.espn.com/espn/rss/soccer/news" },
  { url: "https://www.sport1.de/rss/fussball" },
  { url: "https://www.spox.com/de/sport/fussball/rss.xml" },
  { url: "https://www.bild.de/sport/rss-16725474,feed=rss.bild.html" },
  { url: "https://www.goal.com/feeds/en/news" },
];

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[äöü]/g, (m) => ({ ä: "ae", ö: "oe", ü: "ue" }[m]))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export default async function handler(req, res) {
  let totalInserted = 0;
  const report = [];

  for (const source of SOURCES) {
    try {
      const response = await fetch(source.url);
      const xml = await response.text();
      const items = xml.split("<item>").slice(1, 4);

      let insertedForSource = 0;
      for (const item of items) {
        const title = extractTag(item, "title");
        const description = extractTag(item, "description");
        const link = extractTag(item, "link");
        if (!title) continue;

        const slug = slugify(title);
        const { data: existing } = await supabase.from("news").select("id").eq("slug", slug).maybeSingle();
        if (existing) continue;

        await supabase.from("news").insert({
          slug,
          category: "BALLERIQ",
          title,
          summary: (description || title).slice(0, 180),
          content: description || title,
          source: "BallerIQ",
          link,
        });
        insertedForSource++;
        totalInserted++;
      }
      report.push({ inserted: insertedForSource });
    } catch (error) {
      report.push({ error: error.message });
    }
  }

  res.status(200).json({ success: true, totalInserted, report });
}
