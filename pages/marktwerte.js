import Link from "next/link";

const marktwerte = [
  { name: "F. Wirtz", team: "Bayer Leverkusen", wert: "130 M €", val: "+9.7%", up: true },
  { name: "L. Yamal", team: "FC Barcelona", wert: "180 M €", val: "+7.8%", up: true },
  { name: "J. Bellingham", team: "Real Madrid", wert: "180 M €", val: "+3.4%", up: true },
  { name: "V. Osimhen", team: "Napoli", wert: "110 M €", val: "-4.2%", up: false },
  { name: "E. Haaland", team: "Manchester City", wert: "170 M €", val: "+1.2%", up: true },
  { name: "K. Mbappé", team: "Real Madrid", wert: "160 M €", val: "-2.1%", up: false },
];

export default function Marktwerte() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.9)" }}>
        <Link href="/" style={{ color: "#9A9A9A", textDecoration: "none", fontSize: "13px" }}>← Zurück</Link>
      </nav>
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: "20px", marginBottom: "20px", borderLeft: "3px solid #8CFF3C", paddingLeft: "10px" }}>📈 Alle Marktwerte</h1>
        <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", overflow: "hidden" }}>
          {marktwerte.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: i < marktwerte.length - 1 ? "1px solid #1A1A1A" : "none" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>{p.name}</p>
                <p style={{ fontSize: "11px", color: "#6E6E6E" }}>{p.team}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "13px" }}>{p.wert}</p>
                <p style={{ fontSize: "11px", color: p.up ? "#8CFF3C" : "#FF5C5C" }}>{p.val} {p.up ? "🟢" : "🔴"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}