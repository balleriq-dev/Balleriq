import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const LEAGUE_ID = 78; // Bundesliga
const SEASON = 2026;

const RAPIDAPI_HEADERS = {
  "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
  "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
};

async function apiFootball(path) {
  const response = await fetch(`https://api-football-v1.p.rapidapi.com/v3${path}`, {
    headers: RAPIDAPI_HEADERS,
  });
  const data = await response.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API-Football Fehler bei ${path}: ${JSON.stringify(data.errors)}`);
  }
  return data.response || [];
}

export default async function handler(req, res) {
  const errors = [];
  let teamsUpserted = 0;
  let matchesUpserted = 0;

  try {
    const standings = await apiFootball(`/standings?league=${LEAGUE_ID}&season=${SEASON}`);
    const table = standings?.[0]?.league?.standings?.[0] || [];

    const teamStatsFailed = [];
    for (const row of table) {
      const team = row.team;
      let toreProSpiel = null;
      let gegentoreProSpiel = null;
      let kartenProSpiel = null;

      try {
        const stats = (
          await apiFootball(`/teams/statistics?league=${LEAGUE_ID}&season=${SEASON}&team=${team.id}`)
        );
        const s = Array.isArray(stats) ? stats[0] : stats;
        const gespielt = s?.fixtures?.played?.total || row.all?.played || 1;
        toreProSpiel = s?.goals?.for?.total?.total != null ? Number((s.goals.for.total.total / gespielt).toFixed(1)) : null;
        gegentoreProSpiel = s?.goals?.against?.total?.total != null ? Number((s.goals.against.total.total / gespielt).toFixed(1)) : null;
        const gelb = s?.cards?.yellow ? Object.values(s.cards.yellow).reduce((sum, m) => sum + (m.total || 0), 0) : 0;
        const rot = s?.cards?.red ? Object.values(s.cards.red).reduce((sum, m) => sum + (m.total || 0), 0) : 0;
        kartenProSpiel = Number(((gelb + rot) / gespielt).toFixed(1));
      } catch (error) {
        teamStatsFailed.push(team.name);
      }

      const { error: teamError } = await supabase.from("teams").upsert({
        id: String(team.id),
        name: team.name,
        liga: "Bundesliga",
        logo: team.logo,
        platz: row.rank,
        spiele: row.all?.played,
        siege: row.all?.win,
        unentschieden: row.all?.draw,
        niederlagen: row.all?.lose,
        tore_erzielt: row.all?.goals?.for,
        tore_kassiert: row.all?.goals?.against,
        punkte: row.points,
        form: row.form,
        tore_pro: toreProSpiel,
        gegentore_pro: gegentoreProSpiel,
        karten: kartenProSpiel,
      });
      if (teamError) errors.push(`Team ${team.name}: ${teamError.message}`);
      else teamsUpserted++;
    }
    if (teamStatsFailed.length > 0) errors.push(`Team-Statistiken nicht verfuegbar fuer: ${teamStatsFailed.join(", ")}`);
  } catch (error) {
    errors.push(`Tabelle: ${error.message}`);
  }

  try {
    const fixtures = await apiFootball(`/fixtures?league=${LEAGUE_ID}&season=${SEASON}&next=10`);

    for (const fx of fixtures) {
      let pHeim = null;
      let pX = null;
      let pGast = null;

      try {
        const predictions = await apiFootball(`/predictions?fixture=${fx.fixture.id}`);
        const percent = predictions?.[0]?.predictions?.percent;
        if (percent) {
          pHeim = parseInt(percent.home);
          pX = parseInt(percent.draw);
          pGast = parseInt(percent.away);
        }
      } catch (error) {
        // Keine Prediction verfuegbar, wird ohne Prozentwerte gespeichert
      }

      const datum = fx.fixture.date ? fx.fixture.date.slice(0, 10) : null;
      const zeit = fx.fixture.date ? fx.fixture.date.slice(11, 16) : null;

      const { error: matchError } = await supabase.from("spiele").upsert({
        id: String(fx.fixture.id),
        liga: "Bundesliga",
        heim_id: String(fx.teams.home.id),
        heim_name: fx.teams.home.name,
        heim_logo: fx.teams.home.logo,
        gast_id: String(fx.teams.away.id),
        gast_name: fx.teams.away.name,
        gast_logo: fx.teams.away.logo,
        datum,
        zeit,
        p_heim: pHeim,
        p_x: pX,
        p_gast: pGast,
        status: fx.fixture.status?.short || null,
      });
      if (matchError) errors.push(`Spiel ${fx.teams.home.name} vs ${fx.teams.away.name}: ${matchError.message}`);
      else matchesUpserted++;
    }
  } catch (error) {
    errors.push(`Spielplan: ${error.message}`);
  }

  let squadsUpserted = 0;
  try {
    const { data: teams } = await supabase.from("teams").select("id").eq("liga", "Bundesliga");
    for (const team of teams || []) {
      try {
        const squads = await apiFootball(`/players/squads?team=${team.id}`);
        const players = squads?.[0]?.players || [];
        for (const p of players) {
          const { error: spielerError } = await supabase.from("spieler").upsert({
            id: String(p.id),
            team_id: team.id,
            name: p.name,
            pos: p.position,
            foto: p.photo,
          });
          if (!spielerError) squadsUpserted++;
        }
      } catch (error) {
        errors.push(`Kader Team ${team.id}: ${error.message}`);
      }
    }
  } catch (error) {
    errors.push(`Kader-Uebersicht: ${error.message}`);
  }

  res.status(200).json({
    success: true,
    teamsUpserted,
    matchesUpserted,
    squadsUpserted,
    errors,
  });
}
