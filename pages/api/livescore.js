export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const { fixtureId } = req.query;
  if (!fixtureId) return res.status(400).json({ available: false, error: "fixtureId fehlt" });

  try {
    const response = await fetch(`https://api.football-data.org/v4/matches/${fixtureId}`, {
      headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY },
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(200).json({ available: false, error: data.message || `HTTP ${response.status}` });
    }

    res.status(200).json({
      available: true,
      status: data.status,
      minute: data.minute ?? null,
      heimTore: data.score?.fullTime?.home ?? data.score?.halfTime?.home ?? null,
      gastTore: data.score?.fullTime?.away ?? data.score?.halfTime?.away ?? null,
    });
  } catch (error) {
    res.status(200).json({ available: false, error: error.message });
  }
}
