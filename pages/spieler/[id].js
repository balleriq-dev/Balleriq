import Link from "next/link";
import { useRouter } from "next/router";
import { SPIELER } from "../../lib/statsData";

export default function SpielerDetail() {
  const router = useRouter();
  const { id } = router.query;
  const p = SPIELER[id];

  if (!p) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Spieler wird geladen...</p>
      </div>
    );
  }

  const stats = [
    ["⚽ Tore", p.tore],
    ["🎯 Assists", p.assists],
    ["💥 Schüsse / Spiel", p.schuesse],
    ["🟨 Karten / Spiel", p.karten],
    ["📊 Passquote", p.passquote + "%"],
    ["🗓 Spiele", p.spiele],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.95)" }}>
        <Link href="/stats" style={{ color: "#9A9A9A", textDecoration: "none", fontSize: "13px" }}>← Zurück zu Stats</Link>
      </nav>

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "28px 20px 60px" }}>
        <p style={{ fontSize: "11px", color: "#8CFF3C", marginBottom: "8px" }}>{p.team} · {p.pos}</p>
        <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "6px" }}>{p.name}</h1>
        <p style={{ fontSize: "13px", color: "#9A9A9A", marginBottom: "24px" }}>
          BallerIQ Rating <span style={{ color: "#8CFF3C", fontWeight: 700 }}>{p.rating}/10</span>
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
          {stats.map(([label, val]) => (
            <div key={label} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "14px" }}>
              <p style={{ fontSize: "10px", color: "#9A9A9A", marginBottom: "4px" }}>{label}</p>
              <p style={{ fontSize: "22px", fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
