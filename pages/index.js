export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      {/* Sticky Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(6px)" }}>
        <span style={{ fontWeight: 700, letterSpacing: "1px" }}>BALLER<span style={{ color: "#8CFF3C" }}>IQ</span></span>
        <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "#9A9A9A", textTransform: "uppercase", letterSpacing: "1px" }}>
          <span>News</span><span>Marktwerte</span><span>Ligen</span><span>Analyse</span>
        </div>
      </nav>

      {/* Live Ticker */}
      <div style={{ overflow: "hidden", borderBottom: "1px solid #1A1A1A", padding: "8px 0" }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker 25s linear infinite", fontSize: "11px", color: "#9A9A9A", gap: "40px" }}>
          <span>⚽ Bayern 2:1 Dortmund</span>
          <span style={{ color: "#8CFF3C" }}>F. Wirtz +9,7%</span>
          <span>⚽ Real 3:0 Barça</span>
          <span style={{ color: "#8CFF3C" }}>V. Osimhen +6,2%</span>
          <span>⚽ Inter 1:1 Milan</span>
        </div>
      </div>

      {/* News Grid */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 20px 40px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px", borderLeft: "3px solid #8CFF3C", paddingLeft: "10px" }}>News</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {[
            "Bellingham fällt zwei Wochen aus",
            "Leverkusen verlängert mit Xhaka",
            "Napoli verhandelt Osimhen-Klausel",
          ].map((title, i) => (
            <div key={i} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "8px", padding: "16px" }}>
              <p style={{ fontSize: "10px", color: "#8CFF3C", marginBottom: "6px" }}>HEUTE</p>
              <p style={{ fontSize: "14px" }}>{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logo direkt unter den News */}
      <section style={{ textAlign: "center", padding: "20px 20px 40px" }}>
        <img src="/logo.png" alt="BallerIQ" style={{ maxWidth: "420px", width: "80%", margin: "0 auto", display: "block" }} />
      </section>

      {/* Ligen-Vorschau */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px 60px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px", borderLeft: "3px solid #8CFF3C", paddingLeft: "10px" }}>Top 5 Ligen</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["Bundesliga", "Premier League", "La Liga", "Serie A", "Ligue 1"].map((l) => (
            <span key={l} style={{ border: "1px solid #1A1A1A", borderRadius: "20px", padding: "6px 14px", fontSize: "12px", color: "#9A9A9A" }}>{l}</span>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #1A1A1A", padding: "24px", textAlign: "center", fontSize: "10px", color: "#6E6E6E" }}>
        BALLERIQ · Smarter Football Intelligence
      </footer>
    </div>
  );
}