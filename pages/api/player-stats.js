const RAPIDAPI_HEADERS = {
  "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
  "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
};

const SEASON = 2026;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const { name } = req.query;
  if (!name) return res.status(400).json({ available: false, error: "name fehlt" });

  try {
    const suchResponse = await fetch(
      `https://api-football-v1.p.rapidapi.com/v3/players?search=${encodeURIComponent(name)}&season=${SEASON}`,
      { headers: RAPIDAPI_HEADERS }
    );
    const suchData = await suchResponse.json();
    const treffer = suchData?.response?.[0];
    const stats = treffer?.statistics?.[0];

    if (!treffer) {
      return res.status(200).json({ available: false });
    }

    res.status(200).json({
      available: true,
      foto: treffer.player?.photo ?? null,
      spiele: stats?.games?.appearences ?? null,
      tore: stats?.goals?.total ?? null,
      assists: stats?.goals?.assists ?? null,
      schuesse: stats?.shots?.total ?? null,
      karten: (stats?.cards?.yellow ?? 0) + (stats?.cards?.red ?? 0),
      passquote: stats?.passes?.accuracy ?? null,
      rating: stats?.games?.rating ? Number(stats.games.rating).toFixed(1) : null,
    });
  } catch (error) {
    res.status(200).json({ available: false, error: error.message });
  }
}
