import Link from "next/link";

export default function Bellingham() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.9)" }}>
        <Link href="/" style={{ color: "#9A9A9A", textDecoration: "none", fontSize: "13px" }}>← Zurück</Link>
      </nav>
      <section style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 20px 60px" }}>
        <p style={{ fontSize: "12px", color: "#8CFF3C", marginBottom: "8px" }}>REAL MADRID · MITTELFELD</p>
        <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "6px" }}>Jude Bellingham</h1>
        <p style={{ fontSize: "13px", color: "#9A9A9A", marginBottom: "24px" }}>BallerIQ Rating <span style={{ color: "#8CFF3C", fontWeight: 700 }}>8.9/10</span></p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "28px" }}>
          {[["⚽ Tore", "3"], ["🎯 Assists", "2"], ["💥 Schüsse", "14"], ["🎯 Passquote", "87%"]].map(([label, val]) => (
            <div key={label} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "14px" }}>
              <p style={{ fontSize: "11px", color: "#9A9A9A", marginBottom: "4px" }}>{label}</p>
              <p style={{ fontSize: "20px", fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#0A0A0A", border: "1px solid #8CFF3C33", borderRadius: "12px", padding: "20px" }}>
          <p style={{ fontSize: "12px", color: "#8CFF3C", marginBottom: "8px" }}>🧠 BALLERIQ AI INSIGHT</p>
          <p style={{ fontSize: "13px", color: "#9A9A9A", lineHeight: 1.6 }}>
            Bellingham zählt aktuell zu den effizientesten Box-to-Box-Mittelfeldspielern Europas. Seine Zweikampfquote im letzten Spieldrittel liegt deutlich über dem Ligadurchschnitt, was ihn sowohl offensiv als auch defensiv zu einem Schlüsselspieler macht.
          </p>
        </div>
      </section>
    </div>
  );
}