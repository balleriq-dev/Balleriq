import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SOURCES = [
  "https://newsfeed.kicker.de/news/aktuell",
  "https://newsfeed.kicker.de/news/bundesliga",
  "https://newsfeed.kicker.de/news/champions-league",
  "https://feeds.bbci.co.uk/sport/football/rss.xml",
  "https://www.skysports.com/rss/12040",
  "https://www.espn.com/espn/rss/soccer/news",
  "https://www.sport1.de/rss/fussball",
  "https://www.spox.com/de/sport/fussball/rss.xml",
  "https://www.bild.de/sport/rss-16725474,feed=rss.bild.html",
  "https://www.goal.com/feeds/en/news",
];

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
}

function extractImage(itemXml) {
  const thumbnail = itemXml.match(/<media:thumbnail[^>]*url="([^"]+)"/);
  if (thumbnail) return thumbnail[1];

  const mediaContent = itemXml.match(/<media:content[^>]*url="([^"]+)"/);
  if (mediaContent) return mediaContent[1];

  const enclosure = itemXml.match(/<enclosure[^>]*url="([^"]+)"/);
  if (enclosure) return enclosure[1];

  const imgTag = itemXml.match(/<img[^>]+src="([^"]+)"/);
  if (imgTag) return imgTag[1];

  return null;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[äöü]/g, (m) => ({ ä: "ae", ö: "oe", ü: "ue" }[m]))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function titleWords(title) {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-zäöüß0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
}

function isSimilarTopic(titleA, titleB) {
  const wordsA = titleWords(titleA);
  const wordsB = titleWords(titleB);
  const overlap = [...wordsA].filter((w) => wordsB.has(w)).length;
  const smaller = Math.min(wordsA.size, wordsB.size) || 1;
  return overlap / smaller > 0.4;
}

async function rewriteArticle(title, description) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: `Du bist Redakteur bei BallerIQ, einer deutschen Fussball-News-Seite. Schreib diese Meldung in eigenen Worten auf Deutsch als vollständigen kurzen Artikel (3-5 Sätze, sachlich, ohne Erfindungen, ohne andere Medien/Quellen zu nennen). Antworte NUR mit validem JSON, keine Erklärungen: {"title": "...", "summary": "eine Zeile Zusammenfassung", "content": "der vollstaendige Artikeltext"}\n\nOriginal-Titel: ${title}\nOriginal-Text: ${description}`,
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

export default async function handler(req, res) {
  const candidates = [];
  let debugSample = null;

  for (const url of SOURCES) {
    try {
      const response = await fetch(url);
      const xml = await response.text();
      const items = xml.split("<item>").slice(1, 4);
      if (req.query.debug && !debugSample && items[0]) {
        debugSample = items[0].slice(0, 1500);
      }
      for (const item of items) {
        const title = extractTag(item, "title");
        const description = extractTag(item, "description");
        const link = extractTag(item, "link");
        const image = extractImage(item);
        if (title) candidates.push({ title, description, link, image });
      }
    } catch (error) {
      // Quelle nicht erreichbar, wird uebersprungen
    }
  }

  const selected = [];
  for (const candidate of candidates) {
    const isDuplicateTopic = selected.some((s) => isSimilarTopic(s.title, candidate.title));
    if (!isDuplicateTopic) selected.push(candidate);
    if (selected.length === 5) break;
  }

  const articles = [];
  const errors = [];
  for (const candidate of selected) {
    try {
      const rewritten = await rewriteArticle(candidate.title, candidate.description || candidate.title);
      const title = rewritten.title || candidate.title;
      articles.push({
        slug: slugify(title),
        category: "BALLERIQ",
        title,
        summary: (rewritten.summary || candidate.description || title).slice(0, 180),
        content: rewritten.content || rewritten.summary || candidate.description || title,
        source: "BallerIQ",
        link: candidate.link,
        image: candidate.image || null,
      });
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (articles.length > 0) {
    const { data: inserted } = await supabase.from("news").insert(articles).select("id");
    const newIds = (inserted || []).map((row) => row.id);
    if (newIds.length > 0) {
      await supabase.from("news").delete().not("id", "in", `(${newIds.join(",")})`);
    }
  }

  res.status(200).json({ success: true, inserted: articles.length, errors, debugSample });
}
