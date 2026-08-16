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

export const SPIELE = {
  bl: [
    { id: "m1", heim: "Bayern München", gast: "Dortmund", zeit: "18:30", pHeim: 58, pX: 24, pGast: 18 },
    { id: "m2", heim: "Leverkusen", gast: "RB Leipzig", zeit: "20:30", pHeim: 45, pX: 27, pGast: 28 },
  ],
  cl: [
    { id: "m3", heim: "Real Madrid", gast: "Man City", zeit: "21:00", pHeim: 41, pX: 26, pGast: 33 },
    { id: "m4", heim: "PSG", gast: "Inter", zeit: "21:00", pHeim: 52, pX: 25, pGast: 23 },
  ],
};

export const TABELLE = {
  bl: [
    { id: "t1", team: "Bayern München", sp: 24, pkt: 58, tore: "62:21", form: ["S","S","U","S","S"] },
    { id: "t2", team: "Leverkusen", sp: 24, pkt: 52, tore: "55:28", form: ["S","U","S","N","S"] },
    { id: "t3", team: "Dortmund", sp: 24, pkt: 47, tore: "48:32", form: ["N","S","S","U","S"] },
    { id: "t4", team: "RB Leipzig", sp: 24, pkt: 44, tore: "45:30", form: ["S","N","U","S","S"] },
  ],
};

export const TEAMS = {
  t1: {
    name: "Bayern München",
    liga: "Bundesliga",
    torePro: 2.6, gegentorePro: 0.9, ballbesitz: 62, ecken: 6.4, karten: 1.8,
    kader: [
      { id: "p1", name: "Harry Kane", pos: "Sturm" },
      { id: "p2", name: "Jamal Musiala", pos: "Mittelfeld" },
      { id: "p3", name: "Joshua Kimmich", pos: "Mittelfeld" },
      { id: "p4", name: "Manuel Neuer", pos: "Tor" },
    ],
  },
  t2: {
    name: "Leverkusen",
    liga: "Bundesliga",
    torePro: 2.3, gegentorePro: 1.2, ballbesitz: 57, ecken: 5.8, karten: 2.1,
    kader: [
      { id: "p5", name: "Florian Wirtz", pos: "Mittelfeld" },
      { id: "p6", name: "Granit Xhaka", pos: "Mittelfeld" },
    ],
  },
};

export const SPIELER = {
  p1: { name: "Harry Kane", team: "Bayern München", pos: "Sturm", spiele: 24, tore: 21, assists: 6, schuesse: 3.8, karten: 0.3, passquote: 79, rating: 8.6 },
  p2: { name: "Jamal Musiala", team: "Bayern München", pos: "Mittelfeld", spiele: 22, tore: 9, assists: 8, schuesse: 2.4, karten: 0.5, passquote: 86, rating: 8.1 },
  p3: { name: "Joshua Kimmich", team: "Bayern München", pos: "Mittelfeld", spiele: 24, tore: 2, assists: 11, schuesse: 1.3, karten: 1.1, passquote: 91, rating: 7.9 },
  p4: { name: "Manuel Neuer", team: "Bayern München", pos: "Tor", spiele: 23, tore: 0, assists: 0, schuesse: 0, karten: 0.2, passquote: 82, rating: 7.4 },
  p5: { name: "Florian Wirtz", team: "Leverkusen", pos: "Mittelfeld", spiele: 23, tore: 12, assists: 14, schuesse: 2.9, karten: 0.4, passquote: 88, rating: 8.7 },
  p6: { name: "Granit Xhaka", team: "Leverkusen", pos: "Mittelfeld", spiele: 24, tore: 3, assists: 5, schuesse: 1.1, karten: 1.4, passquote: 90, rating: 7.6 },
};
