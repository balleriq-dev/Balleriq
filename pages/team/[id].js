import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getTeam } from "../../lib/statsData";

const formFarbe = { S: "#8CFF3C", U: "#6E6E6E", N: "#5A5A5A", W: "#8CFF3C", D: "#6E6E6E", L: "#5A5A5A" };

export default function TeamDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getTeam(id).then((data) => {
      setTeam(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Team wird geladen...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Team nicht gefunden.</p>
      </div>
    );
  }

  const stats = [
    ["Tabellenplatz", team.platz ?? "-"],
    ["Punkte", team.punkte ?? "-"],
    ["Spiele", team.spiele ?? "-"],
    ["Tore geschossen", team.toreErzielt ?? "-"],
    ["Tore kassiert", team.toreKassiert ?? "-"],
    ["Tore / Spiel", team.torePro ?? "-"],
    ["Gegentore / Spiel", team.gegentorePro ?? "-"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif", fontSize: "13px" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "12px 20px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.95)" }}>
        <Link href="/stats" style={{ color: "#9A9A9A", textDecoration: "none", fontSize: "12px" }}>← Zurück zu Stats</Link>
      </nav>

      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "20px 14px 50px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          {team.logo && <img src={team.logo} alt="" style={{ width: "40px", height: "40px", objectFit: "contain" }} />}
          <div>
            <p style={{ fontSize: "10px", color: "#8CFF3C", marginBottom: "3px" }}>{team.liga}</p>
            <h1 style={{ fontSize: "20px", fontWeight: 700 }}>{team.name}</h1>
          </div>
        </div>

        {team.form.length > 0 && (
          <div style={{ display: "flex", gap: "5px", margin: "10px 0 18px" }}>
            {team.form.map((f, j) => (
              <span key={j} style={{ width: "18px", height: "18px", borderRadius: "50%", background: formFarbe[f] || "#5A5A5A", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700 }}>
                {f}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "8px", marginBottom: "24px" }}>
          {stats.map(([label, val]) => (
            <div key={label} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "8px", padding: "10px" }}>
              <p style={{ fontSize: "9px", color: "#9A9A9A", marginBottom: "3px" }}>{label}</p>
              <p style={{ fontSize: "16px", fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: "10px", color: "#6E6E6E", marginBottom: "18px" }}>
          Ecken, Fouls und Ballbesitz pro Spiel sind über unsere aktuelle Datenquelle nicht verfügbar.
        </p>

        <h2 style={{ fontSize: "12px", marginBottom: "8px", color: "#8CFF3C", letterSpacing: "0.5px" }}>👥 KADER</h2>
        {team.kader.length === 0 && <p style={{ fontSize: "12px", color: "#6E6E6E" }}>Kader wird noch geladen.</p>}
        <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "8px", overflow: "hidden" }}>
          {team.kader.map((s, i) => (
            <Link key={s.id} href={`/spieler/${s.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", borderBottom: i < team.kader.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                <span style={{ fontSize: "12px" }}>{s.name}</span>
                <span style={{ fontSize: "10px", color: "#6E6E6E" }}>{s.pos} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
