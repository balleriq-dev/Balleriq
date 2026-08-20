import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const LIGEN = {
  BL1: "Bundesliga",
  PL: "Premier League",
  PD: "La Liga",
  SA: "Serie A",
  FL1: "Ligue 1",
  CL: "Champions League",
};

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
  const heimSpiele = heim?.spiele || 0;
  const gastSpiele = gast?.spiele || 0;

  if (heimSpiele === 0 && gastSpiele === 0) {
    return { pHeim: 40, pX: 28, pGast: 32 };
  }

  const heimForm = (heim?.punkte || 0) / Math.max(heimSpiele, 1);
  const gastForm = (gast?.punkte || 0) / Math.max(gastSpiele, 1);
  const heimStaerke = heimForm + 0.5; // Heimvorteil
  const gastStaerke = gastForm + 0.15;
  const gesamt = heimStaerke + gastStaerke;
  const pHeim = Math.max(Math.round((heimStaerke / gesamt) * 70), 8);
  const pGast = Math.max(Math.round((gastStaerke / gesamt) * 70), 8);
  const pX = 100 - pHeim - pGast;
  return { pHeim, pX, pGast };
}

function warten(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verarbeiteLiga(code, ligaName, errors) {
  const teamLookup = {};
  let teamsUpserted = 0;
  let matchesUpserted = 0;
  let squadsUpserted = 0;

  try {
    const standingsData = await footballData(`/competitions/${code}/standings`);
    const table = standingsData?.standings?.[0]?.table || [];

    const teamRows = table.map((row) => {
      const team = row.team;
      teamLookup[team.id] = { punkte: row.points, spiele: row.playedGames };
      return {
        id: String(team.id),
        name: team.name,
        liga: ligaName,
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
        tore_pro: row.playedGames ? Number((row.goalsFor / row.playedGames).toFixed(1)) : null,
        gegentore_pro: row.playedGames ? Number((row.goalsAgainst / row.playedGames).toFixed(1)) : null,
      };
    });

    if (teamRows.length > 0) {
      const { error } = await supabase.from("teams").upsert(teamRows);
      if (error) errors.push(`${ligaName} Teams: ${error.message}`);
      else teamsUpserted = teamRows.length;
    }
  } catch (error) {
    errors.push(`${ligaName} Tabelle: ${error.message}`);
  }

  await warten(4000);

  try {
    const matchesData = await footballData(`/competitions/${code}/matches?status=SCHEDULED`);
    const fixtures = (matchesData?.matches || []).slice(0, 10);

    const matchRows = fixtures.map((fx) => {
      const { pHeim, pX, pGast } = berechnePrediction(teamLookup[fx.homeTeam.id], teamLookup[fx.awayTeam.id]);
      return {
        id: String(fx.id),
        liga: ligaName,
        heim_id: String(fx.homeTeam.id),
        heim_name: fx.homeTeam.name,
        heim_logo: fx.homeTeam.crest,
        gast_id: String(fx.awayTeam.id),
        gast_name: fx.awayTeam.name,
        gast_logo: fx.awayTeam.crest,
        datum: fx.utcDate ? fx.utcDate.slice(0, 10) : null,
        zeit: fx.utcDate ? fx.utcDate.slice(11, 16) : null,
        p_heim: pHeim,
        p_x: pX,
        p_gast: pGast,
        status: fx.status,
      };
    });

    if (matchRows.length > 0) {
      const { error } = await supabase.from("spiele").upsert(matchRows);
      if (error) errors.push(`${ligaName} Spielplan: ${error.message}`);
      else matchesUpserted = matchRows.length;
    }
  } catch (error) {
    errors.push(`${ligaName} Spielplan: ${error.message}`);
  }

  await warten(4000);

  try {
    const teamsData = await footballData(`/competitions/${code}/teams`);
    const spielerRows = [];
    for (const team of teamsData?.teams || []) {
      for (const p of team.squad || []) {
        spielerRows.push({
          id: String(p.id),
          team_id: String(team.id),
          name: p.name,
          pos: p.position,
        });
      }
    }
    if (spielerRows.length > 0) {
      const { error } = await supabase.from("spieler").upsert(spielerRows);
      if (error) errors.push(`${ligaName} Kader: ${error.message}`);
      else squadsUpserted = spielerRows.length;
    }
  } catch (error) {
    errors.push(`${ligaName} Kader: ${error.message}`);
  }

  return { teamsUpserted, matchesUpserted, squadsUpserted };
}

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const errors = [];

  const code = req.query.liga || "BL1";
  const ligaName = LIGEN[code];

  if (!ligaName) {
    return res.status(400).json({
      success: false,
      error: `Unbekannter Liga-Code: ${code}. Erlaubt: ${Object.keys(LIGEN).join(", ")}`,
    });
  }

  const ergebnis = await verarbeiteLiga(code, ligaName, errors);

  res.status(200).json({ success: true, liga: ligaName, ...ergebnis, errors });
}
