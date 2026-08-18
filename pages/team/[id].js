import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getTeam } from "../../lib/statsData";

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
    ["Tore / Spiel", team.torePro ?? "-"],
    ["Gegentore / Spiel", team.gegentorePro ?? "-"],
    ["Karten / Spiel", team.karten ?? "-"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.95)" }}>
        <Link href="/stats" style={{ color: "#9A9A9A", textDecoration: "none", fontSize: "13px" }}>← Zurück zu Stats</Link>
      </nav>

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
          {team.logo && <img src={team.logo} alt="" style={{ width: "48px", height: "48px", objectFit: "contain" }} />}
          <div>
            <p style={{ fontSize: "11px", color: "#8CFF3C", marginBottom: "4px" }}>{team.liga}</p>
            <h1 style={{ fontSize: "26px", fontWeight: 700 }}>{team.name}</h1>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "32px" }}>
          {stats.map(([label, val]) => (
            <div key={label} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "14px" }}>
              <p style={{ fontSize: "10px", color: "#9A9A9A", marginBottom: "4px" }}>{label}</p>
              <p style={{ fontSize: "20px", fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: "15px", marginBottom: "12px", color: "#8CFF3C" }}>👥 Kader</h2>
        {team.kader.length === 0 && <p style={{ fontSize: "13px", color: "#6E6E6E" }}>Kader wird noch geladen.</p>}
        <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", overflow: "hidden" }}>
          {team.kader.map((s, i) => (
            <Link key={s.id} href={`/spieler/${s.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < team.kader.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                <span style={{ fontSize: "13px" }}>{s.name}</span>
                <span style={{ fontSize: "11px", color: "#6E6E6E" }}>{s.pos} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
