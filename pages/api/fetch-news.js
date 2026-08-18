import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SOURCES = [
  { url: "https://newsfeed.kicker.de/news/aktuell", lang: "de" },
  { url: "https://newsfeed.kicker.de/news/bundesliga", lang: "de" },
  { url: "https://newsfeed.kicker.de/news/champions-league", lang: "de" },
  { url: "https://feeds.bbci.co.uk/sport/football/rss.xml", lang: "en" },
  { url: "https://www.skysports.com/rss/12040", lang: "en" },
  { url: "https://www.espn.com/espn/rss/soccer/news", lang: "en" },
  { url: "https://www.sport1.de/rss/fussball", lang: "de" },
  { url: "https://www.spox.com/de/sport/fussball/rss.xml", lang: "de" },
  { url: "https://www.bild.de/sport/rss-16725474,feed=rss.bild.html", lang: "de" },
  { url: "https://www.goal.com/feeds/en/news", lang: "en" },
];

async function translateToGerman(title, description) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Übersetze diese Fussball-News ins Deutsche. Antworte NUR mit validem JSON, keine Erklärungen: {"title": "...", "summary": "..."}\n\nTitel: ${title}\nText: ${description}`,
        },
      ],
    }),
  });
  const data = await response.json();
  if (!data.content || !data.content[0]) {
    throw new Error("Anthropic-Antwort ohne content: " + JSON.stringify(data).slice(0, 200));
  }
  const text = data.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text);
}

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
      let translationErrors = [];
      for (const item of items) {
        let title = extractTag(item, "title");
        let description = extractTag(item, "description");
        const link = extractTag(item, "link");
        if (!title) continue;

        const slug = slugify(title);
        const { data: existing } = await supabase.from("news").select("id").eq("slug", slug).maybeSingle();
        if (existing) continue;

        if (source.lang === "en") {
          try {
            const translated = await translateToGerman(title, description || title);
            title = translated.title || title;
            description = translated.summary || description;
          } catch (error) {
            translationErrors.push(error.message);
          }
        }

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
      report.push({ inserted: insertedForSource, translationErrors });
    } catch (error) {
      report.push({ error: error.message });
    }
  }

  res.status(200).json({ success: true, totalInserted, report });
}
