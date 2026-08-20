import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const COMPETITION = "BL1"; // Bundesliga

async function footballData(path) {
  const response = await fetch(`https://api.football-data.org/v4${path}`, {
    headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} bei ${path}: ${data.message || JSON.stringify(data).slice(0, 200)}`);
  }
  return data;
}

function berechnePrediction(heim, gast) {
  const heimForm = (heim?.punkte || 0) / Math.max(heim?.spiele || 1, 1);
  const gastForm = (gast?.punkte || 0) / Math.max(gast?.spiele || 1, 1);
  const heimStaerke = heimForm + 0.35; // Heimvorteil
  const gastStaerke = gastForm;
  const gesamt = heimStaerke + gastStaerke || 1;
  const pHeim = Math.round((heimStaerke / gesamt) * 75);
  const pGast = Math.round((gastStaerke / gesamt) * 75);
  const pX = 100 - pHeim - pGast;
  return { pHeim, pX, pGast };
}

export default async function handler(req, res) {
  const errors = [];
  let teamsUpserted = 0;
  let matchesUpserted = 0;
  let squadsUpserted = 0;
  const teamLookup = {};

  try {
    const standingsData = await footballData(`/competitions/${COMPETITION}/standings`);
    const table = standingsData?.standings?.[0]?.table || [];

    for (const row of table) {
      const team = row.team;
      const toreProSpiel = row.playedGames ? Number((row.goalsFor / row.playedGames).toFixed(1)) : null;
      const gegentoreProSpiel = row.playedGames ? Number((row.goalsAgainst / row.playedGames).toFixed(1)) : null;

      teamLookup[team.id] = { punkte: row.points, spiele: row.playedGames };

      const { error: teamError } = await supabase.from("teams").upsert({
        id: String(team.id),
        name: team.name,
        liga: "Bundesliga",
        logo: team.crest,
        platz: row.position,
        spiele: row.playedGames,
        siege: row.won,
        unentschieden: row.draw,
        niederlagen: row.lost,
        tore_erzielt: row.goalsFor,
        tore_kassiert: row.goalsAgainst,
        punkte: row.points,
        form: row.form,
        tore_pro: toreProSpiel,
        gegentore_pro: gegentoreProSpiel,
      });
      if (teamError) errors.push(`Team ${team.name}: ${teamError.message}`);
      else teamsUpserted++;
    }
  } catch (error) {
    errors.push(`Tabelle: ${error.message}`);
  }

  try {
    const matchesData = await footballData(`/competitions/${COMPETITION}/matches?status=SCHEDULED`);
    const fixtures = (matchesData?.matches || []).slice(0, 10);

    for (const fx of fixtures) {
      const { pHeim, pX, pGast } = berechnePrediction(teamLookup[fx.homeTeam.id], teamLookup[fx.awayTeam.id]);
      const datum = fx.utcDate ? fx.utcDate.slice(0, 10) : null;
      const zeit = fx.utcDate ? fx.utcDate.slice(11, 16) : null;

      const { error: matchError } = await supabase.from("spiele").upsert({
        id: String(fx.id),
        liga: "Bundesliga",
        heim_id: String(fx.homeTeam.id),
        heim_name: fx.homeTeam.name,
        heim_logo: fx.homeTeam.crest,
        gast_id: String(fx.awayTeam.id),
        gast_name: fx.awayTeam.name,
        gast_logo: fx.awayTeam.crest,
        datum,
        zeit,
        p_heim: pHeim,
        p_x: pX,
        p_gast: pGast,
        status: fx.status,
      });
      if (matchError) errors.push(`Spiel ${fx.homeTeam.name} vs ${fx.awayTeam.name}: ${matchError.message}`);
      else matchesUpserted++;
    }
  } catch (error) {
    errors.push(`Spielplan: ${error.message}`);
  }

  try {
    const teamsData = await footballData(`/competitions/${COMPETITION}/teams`);
    for (const team of teamsData?.teams || []) {
      for (const p of team.squad || []) {
        const { error: spielerError } = await supabase.from("spieler").upsert({
          id: String(p.id),
          team_id: String(team.id),
          name: p.name,
          pos: p.position,
        });
        if (!spielerError) squadsUpserted++;
      }
    }
  } catch (error) {
    errors.push(`Kader: ${error.message}`);
  }

  res.status(200).json({ success: true, teamsUpserted, matchesUpserted, squadsUpserted, errors });
}
