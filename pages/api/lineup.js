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

    const heimLineup = data.homeTeam?.lineup || [];
    const gastLineup = data.awayTeam?.lineup || [];

    if (heimLineup.length === 0 && gastLineup.length === 0) {
      return res.status(200).json({ available: false, offiziell: false });
    }

    res.status(200).json({
      available: true,
      offiziell: true,
      heimFormation: data.homeTeam?.formation || null,
      gastFormation: data.awayTeam?.formation || null,
      heim: heimLineup.map((p) => ({ name: p.name, pos: p.position })),
      gast: gastLineup.map((p) => ({ name: p.name, pos: p.position })),
    });
  } catch (error) {
    res.status(200).json({ available: false, error: error.message });
  }
}
