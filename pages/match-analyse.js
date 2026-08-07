import Link from "next/link";

export default function MatchAnalyse() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.9)" }}>
        <Link href="/" style={{ color: "#9A9A9A", textDecoration: "none", fontSize: "13px" }}>← Zurück</Link>
      </nav>
      <section style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 20px 60px" }}>
        <p style={{ fontSize: "12px", color: "#8CFF3C", marginBottom: "10px" }}>⚡ MATCH ANALYSE</p>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>Real Madrid vs. Barcelona</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {[["Form (letzte 5)", "S S U S S"], ["Heimform", "4S 1U"], ["Auswärtsform Barça", "3S 1U 1N"], ["Direkte Duelle", "3S 1U 1N"]].map(([label, val]) => (
            <div key={label} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "14px" }}>
              <p style={{ fontSize: "11px", color: "#9A9A9A", marginBottom: "4px" }}>{label}</p>
              <p style={{ fontSize: "15px", fontWeight: 700 }}>{val}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "12px", padding: "20px" }}>
          <p style={{ fontSize: "13px", color: "#9A9A9A", lineHeight: 1.6, marginBottom: "12px" }}>
            Real Madrid geht mit der besseren Heimbilanz und aktuell stabilerer Defensive als leichter Favorit in dieses Duell. Barcelona zeigt sich jedoch offensiv sehr variabel und erzielte in den letzten drei Auswärtsspielen im Schnitt über zwei Tore pro Partie.
          </p>
          <p style={{ fontSize: "13px", color: "#9A9A9A", lineHeight: 1.6 }}>
            BallerIQ erwartet ein torreiches, offenes Spiel mit leichten Vorteilen für die Gastgeber in der Schlussphase.
          </p>
        </div>
      </section>
    </div>
  );
}