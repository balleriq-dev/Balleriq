import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SOURCES = [
  { name: "Kicker", url: "https://newsfeed.kicker.de/news/aktuell" },
  { name: "Kicker Bundesliga", url: "https://newsfeed.kicker.de/news/bundesliga" },
  { name: "Kicker Champions League", url: "https://newsfeed.kicker.de/news/champions-league" },
  { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
  { name: "Sky Sports", url: "https://www.skysports.com/rss/12040" },
  { name: "ESPN FC", url: "https://www.espn.com/espn/rss/soccer/news" },
  { name: "Sport1", url: "https://www.sport1.de/rss/fussball" },
  { name: "Spox", url: "https://www.spox.com/de/sport/fussball/rss.xml" },
  { name: "Bild Sport", url: "https://www.bild.de/sport/rss-16725474,feed=rss.bild.html" },
  { name: "Goal.com", url: "https://www.goal.com/feeds/en/news" },
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

function buildLongerContent(title, description, category) {
  const intro = description || title;
  const kontext = `Die Meldung ordnet sich in die aktuelle Berichterstattung rund um ${category.toLowerCase()} ein und dürfte in den kommenden Stunden weitere Reaktionen von Vereinen, Spielern oder Experten nach sich ziehen.`;
  const ausblick = `BallerIQ beobachtet die Entwicklung weiter und aktualisiert die Übersicht, sobald neue Informationen vorliegen.`;
  return `${intro}\n\n${kontext}\n\n${ausblick}`;
}

export default async function handler(req, res) {
  let totalInserted = 0;
  const report = [];

  for (const source of SOURCES) {
    try {
      const response = await fetch(source.url);
      const xml = await response.text();
      const items = xml.split("<item>").slice(1, 4); // die 3 neuesten je Quelle

      let insertedForSource = 0;
      for (const item of items) {
        const title = extractTag(item, "title");
        const description = extractTag(item, "description");
        if (!title) continue;

        const slug = slugify(title);

        const { data: existing } = await supabase
          .from("news")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (existing) continue;

        const content = buildLongerContent(title, description, source.name);

        await supabase.from("news").insert({
          slug,
          category: source.name.toUpperCase(),
          title,
          summary: (description || title).slice(0, 180),
          content,
          source: source.name,
        });
        insertedForSource++;
        totalInserted++;
      }
      report.push({ source: source.name, inserted: insertedForSource });
    } catch (error) {
      report.push({ source: source.name, error: error.message });
    }
  }

  res.status(200).json({ success: true, totalInserted, report });
}
