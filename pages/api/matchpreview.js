export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const { heim, gast, heimForm, gastForm, heimPlatz, gastPlatz, heimTore, gastTore } = req.query;
  if (!heim || !gast) return res.status(400).json({ available: false, error: "heim/gast fehlt" });

  try {
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
            content: `Du bist Redakteur bei BallerIQ. Schreib eine kurze, sachliche Vorschau (3-4 Saetze, Deutsch) zu diesem Fussballspiel, basierend NUR auf diesen echten Daten - erfinde nichts: ${heim} (Tabellenplatz ${heimPlatz || "?"}, Form ${heimForm || "?"}, ${heimTore || "?"} Tore/Spiel) gegen ${gast} (Tabellenplatz ${gastPlatz || "?"}, Form ${gastForm || "?"}, ${gastTore || "?"} Tore/Spiel). Erwaehne die aktuelle Form und was für das Spiel wichtig sein koennte. Antworte NUR mit validem JSON: {"text": "..."}`,
          },
        ],
      }),
    });
    const data = await response.json();
    if (!data.content?.[0]) {
      return res.status(200).json({ available: false });
    }
    const text = data.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    res.status(200).json({ available: true, text: parsed.text });
  } catch (error) {
    res.status(200).json({ available: false, error: error.message });
  }
}
