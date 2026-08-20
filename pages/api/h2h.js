export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const { fixtureId } = req.query;
  if (!fixtureId) return res.status(400).json({ available: false, error: "fixtureId fehlt" });

  try {
    const response = await fetch(`https://api.football-data.org/v4/matches/${fixtureId}/head2head?limit=5`, {
      headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY },
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(200).json({ available: false, error: data.message || `HTTP ${response.status}` });
    }

    const spiele = (data.matches || []).map((m) => ({
      datum: m.utcDate ? m.utcDate.slice(0, 10) : null,
      heim: m.homeTeam?.name,
      gast: m.awayTeam?.name,
      heimTore: m.score?.fullTime?.home,
      gastTore: m.score?.fullTime?.away,
    }));

    res.status(200).json({ available: true, spiele });
  } catch (error) {
    res.status(200).json({ available: false, error: error.message });
  }
}
