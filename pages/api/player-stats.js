const RAPIDAPI_HEADERS = {
  "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
  "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
};

const SEASON = 2026;

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ available: false, error: "id fehlt" });

  try {
    const response = await fetch(
      `https://api-football-v1.p.rapidapi.com/v3/players?id=${id}&season=${SEASON}`,
      { headers: RAPIDAPI_HEADERS }
    );
    const data = await response.json();
    const stats = data?.response?.[0]?.statistics?.[0];

    if (!stats) {
      return res.status(200).json({ available: false });
    }

    res.status(200).json({
      available: true,
      spiele: stats.games?.appearences ?? null,
      tore: stats.goals?.total ?? null,
      assists: stats.goals?.assists ?? null,
      schuesse: stats.shots?.total ?? null,
      karten: (stats.cards?.yellow ?? 0) + (stats.cards?.red ?? 0),
      passquote: stats.passes?.accuracy ?? null,
      rating: stats.games?.rating ? Number(stats.games.rating).toFixed(1) : null,
    });
  } catch (error) {
    res.status(200).json({ available: false, error: error.message });
  }
}
