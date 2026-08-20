export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const { teamId } = req.query;
  if (!teamId) return res.status(400).json({ available: false, error: "teamId fehlt" });

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/teams/${teamId}/matches?status=FINISHED&limit=5`,
      { headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY } }
    );
    const data = await response.json();
    if (!response.ok) {
      return res.status(200).json({ available: false, error: data.message || `HTTP ${response.status}` });
    }

    const spiele = (data.matches || [])
      .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
      .map((m) => {
        const istHeim = String(m.homeTeam?.id) === String(teamId);
        const eigenesTor = istHeim ? m.score?.fullTime?.home : m.score?.fullTime?.away;
        const gegnerTor = istHeim ? m.score?.fullTime?.away : m.score?.fullTime?.home;
        let ergebnis = "U";
        if (eigenesTor > gegnerTor) ergebnis = "S";
        else if (eigenesTor < gegnerTor) ergebnis = "N";
        return {
          datum: m.utcDate ? m.utcDate.slice(0, 10) : null,
          gegner: istHeim ? m.awayTeam?.name : m.homeTeam?.name,
          heimspiel: istHeim,
          eigenesTor,
          gegnerTor,
          ergebnis,
        };
      });

    res.status(200).json({ available: true, spiele });
  } catch (error) {
    res.status(200).json({ available: false, error: error.message });
  }
}
