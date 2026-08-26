const HEADERS = { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY };

async function holeLineupAusSpiel(matchId, teamId) {
  const response = await fetch(`https://api.football-data.org/v4/matches/${matchId}`, { headers: HEADERS });
  const data = await response.json();
  if (!response.ok) return null;
  const istHeim = String(data.homeTeam?.id) === String(teamId);
  const seite = istHeim ? data.homeTeam : data.awayTeam;
  if (!seite?.lineup || seite.lineup.length === 0) return null;
  return {
    formation: seite.formation || null,
    spieler: seite.lineup.map((p) => ({ name: p.name, pos: p.position, nummer: p.shirtNumber ?? null })),
    bank: (seite.bench || []).map((p) => ({ name: p.name, pos: p.position, nummer: p.shirtNumber ?? null })),
  };
}

async function holeLetztesSpielLineup(teamId) {
  try {
    const response = await fetch(`https://api.football-data.org/v4/teams/${teamId}/matches?status=FINISHED&limit=1`, { headers: HEADERS });
    const data = await response.json();
    const letztesMatch = data.matches?.[0];
    if (!letztesMatch) return null;
    return await holeLineupAusSpiel(letztesMatch.id, teamId);
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const { fixtureId, heimId, gastId } = req.query;
  if (!fixtureId) return res.status(400).json({ available: false, error: "fixtureId fehlt" });

  try {
    let heim = await holeLineupAusSpiel(fixtureId, heimId);
    let gast = await holeLineupAusSpiel(fixtureId, gastId);
    let quelle = "aktuell";

    if (!heim && heimId) {
      heim = await holeLetztesSpielLineup(heimId);
      quelle = "letztes_spiel";
    }
    if (!gast && gastId) {
      gast = await holeLetztesSpielLineup(gastId);
      quelle = "letztes_spiel";
    }

    if (!heim && !gast) {
      return res.status(200).json({ available: false });
    }

    res.status(200).json({
      available: true,
      quelle,
      heimFormation: heim?.formation || null,
      gastFormation: gast?.formation || null,
      heim: heim?.spieler || [],
      gast: gast?.spieler || [],
      heimBank: heim?.bank || [],
      gastBank: gast?.bank || [],
    });
  } catch (error) {
    res.status(200).json({ available: false, error: error.message });
  }
}
