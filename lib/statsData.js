import { supabase } from "./supabaseClient";

export const WETTBEWERBE = [
  { id: "bl", name: "Bundesliga", flag: "🇩🇪" },
  { id: "pl", name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "ll", name: "La Liga", flag: "🇪🇸" },
  { id: "sa", name: "Serie A", flag: "🇮🇹" },
  { id: "l1", name: "Ligue 1", flag: "🇫🇷" },
  { id: "cl", name: "Champions League", flag: "🏆" },
  { id: "el", name: "Europa League", flag: "🥈" },
  { id: "ecl", name: "Conference League", flag: "🥉" },
  { id: "wm", name: "WM-Quali", flag: "🌍" },
];

const LIGA_NAMEN = {
  bl: "Bundesliga",
  pl: "Premier League",
  ll: "La Liga",
  sa: "Serie A",
  l1: "Ligue 1",
  cl: "Champions League",
  el: "Europa League",
  ecl: "Conference League",
  wm: "WM-Quali",
};

export async function getSpiele(ligaId) {
  const liga = LIGA_NAMEN[ligaId];
  const { data, error } = await supabase
    .from("spiele")
    .select("*")
    .eq("liga", liga)
    .order("datum", { ascending: true });

  if (error || !data) return [];
  return data.map((s) => ({
    id: s.id,
    heim: s.heim_name,
    gast: s.gast_name,
    zeit: s.zeit,
    pHeim: s.p_heim,
    pX: s.p_x,
    pGast: s.p_gast,
  }));
}

export async function getTabelle(ligaId) {
  const liga = LIGA_NAMEN[ligaId];
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("liga", liga)
    .order("platz", { ascending: true });

  if (error || !data) return [];
  return data.map((t) => ({
    id: t.id,
    team: t.name,
    sp: t.spiele,
    pkt: t.punkte,
    tore: `${t.tore_erzielt ?? "-"}:${t.tore_kassiert ?? "-"}`,
    form: (t.form || "").split("").slice(-5),
  }));
}

export async function getTeam(id) {
  const { data: team, error } = await supabase.from("teams").select("*").eq("id", id).single();
  if (error || !team) return null;

  const { data: kader } = await supabase.from("spieler").select("*").eq("team_id", id).order("name");

  return {
    name: team.name,
    liga: team.liga,
    logo: team.logo,
    torePro: team.tore_pro,
    gegentorePro: team.gegentore_pro,
    karten: team.karten,
    kader: (kader || []).map((p) => ({ id: p.id, name: p.name, pos: p.pos })),
  };
}

export async function getSpielerBasis(id) {
  const { data, error } = await supabase.from("spieler").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}
