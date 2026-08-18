import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllNews } from "../lib/newsData";

export default function Home() {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    getAllNews().then((data) => setNewsData(data.slice(0, 3)));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      {/* Sticky Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(6px)" }}>
        <span style={{ fontWeight: 700, letterSpacing: "1px" }}>BALLER<span style={{ color: "#8CFF3C" }}>IQ</span></span>
        <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "#9A9A9A", textTransform: "uppercase", letterSpacing: "1px", overflowX: "auto", whiteSpace: "nowrap" }}>
          <Link href="/news" style={{ color: "#9A9A9A", textDecoration: "none" }}>News</Link>
          <span>Live</span>
          <span>Ligen</span>
          <Link href="/stats" style={{ color: "#9A9A9A", textDecoration: "none" }}>Stats</Link>
        </div>
      </nav>

      {/* Live Ticker */}
      <div style={{ overflow: "hidden", borderBottom: "1px solid #1A1A1A", padding: "8px 0", background: "#0A0A0A" }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker 25s linear infinite", fontSize: "11px", color: "#9A9A9A", gap: "40px" }}>
          <span style={{ color: "#8CFF3C" }}>🔴 LIVE Real Madrid 2:1 Barcelona 67'</span>
          <span>F. Wirtz +9,7%</span>
          <span>⚽ Inter 1:1 Milan</span>
          <span style={{ color: "#8CFF3C" }}>V. Osimhen +6,2%</span>
        </div>
      </div>

      {/* Logo-Banner */}
      <div style={{ width: "100%", background: "#000", borderBottom: "1px solid #1A1A1A" }}>
        <img src="/logo.png" alt="BallerIQ" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      {/* HERO: Match of the Day */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "28px 20px" }}>
        <p style={{ fontSize: "12px", color: "#8CFF3C", letterSpacing: "1px", marginBottom: "10px" }}>⚡ MATCH OF THE DAY</p>
        <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "12px", padding: "20px", boxShadow: "0 0 20px rgba(140,255,60,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600 }}>Real Madrid</span>
            <span style={{ fontSize: "12px", color: "#9A9A9A" }}>20:45</span>
            <span style={{ fontSize: "16px", fontWeight: 600 }}>Barcelona</span>
          </div>

          <p style={{ fontSize: "11px", color: "#8CFF3C", marginBottom: "6px" }}>BALLERIQ PREDICTION</p>
          {[["Real Madrid", 62], ["Unentschieden", 21], ["Barcelona", 17]].map(([label, val]) => (
            <div key={label} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9A9A9A", marginBottom: "3px" }}>
                <span>{label}</span><span>{val}%</span>
              </div>
              <div style={{ height: "5px", background: "#1A1A1A", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${val}%`, height: "100%", background: "#8CFF3C" }} />
              </div>
            </div>
          ))}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "18px", fontSize: "11px", color: "#9A9A9A" }}>
            <div>xG <b style={{ color: "#F2F2F0" }}>1.8</b></div>
            <div>Ballbesitz <b style={{ color: "#F2F2F0" }}>58%</b></div>
            <div>Ecken <b style={{ color: "#F2F2F0" }}>6</b></div>
          </div>

          <Link href="/match-analyse">
            <button style={{ marginTop: "18px", width: "100%", padding: "12px", background: "#8CFF3C", color: "#000", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "13px" }}>
              MATCH ANALYSIEREN →
            </button>
          </Link>
        </div>
      </section>

      {/* AI INSIGHT */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px 28px" }}>
        <div style={{ background: "#0A0A0A", border: "1px solid #8CFF3C33", borderRadius: "12px", padding: "20px" }}>
          <p style={{ fontSize: "12px", color: "#8CFF3C", marginBottom: "8px" }}>🧠 BALLERIQ AI INSIGHT</p>
          <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "10px" }}>Warum Bellingham heute entscheidend sein könnte</p>
          <p style={{ fontSize: "13px", color: "#9A9A9A", lineHeight: 1.5, marginBottom: "12px" }}>
            Bellingham kommt aktuell auf durchschnittlich 2,4 Schüsse pro Spiel und hat in den letzten 5 Spielen 3 Tore erzielt.
          </p>
          <p style={{ fontSize: "12px", color: "#8CFF3C", marginBottom: "14px" }}>BallerIQ Rating: 8.7/10</p>
          <Link href="/spieler/bellingham">
            <button style={{ padding: "10px 16px", background: "transparent", color: "#8CFF3C", border: "1px solid #8CFF3C", borderRadius: "8px", fontSize: "12px" }}>
              VOLLSTÄNDIGE ANALYSE →
            </button>
          </Link>
        </div>
      </section>

      {/* MARKTBEWEGUNGEN */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px 28px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px", borderLeft: "3px solid #8CFF3C", paddingLeft: "10px" }}>📈 Marktbewegungen</h2>
        <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", overflow: "hidden" }}>
          {[
            { name: "F. Wirtz", val: "+9.7%", up: true },
            { name: "L. Yamal", val: "+7.8%", up: true },
            { name: "J. Bellingham", val: "+3.4%", up: true },
            { name: "V. Osimhen", val: "-4.2%", up: false },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < 3 ? "1px solid #1A1A1A" : "none" }}>
              <span style={{ fontSize: "13px" }}>{p.name}</span>
              <span style={{ fontSize: "13px", color: p.up ? "#8CFF3C" : "#FF5C5C" }}>{p.val} {p.up ? "🟢" : "🔴"}</span>
            </div>
          ))}
        </div>
        <Link href="/marktwerte">
          <button style={{ marginTop: "12px", padding: "10px 16px", background: "transparent", color: "#9A9A9A", border: "1px solid #1A1A1A", borderRadius: "8px", fontSize: "12px" }}>
            ALLE MARKTWERTE →
          </button>
        </Link>
      </section>

      {/* PLAYER OF THE DAY */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px 28px" }}>
        <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "12px", padding: "20px" }}>
          <p style={{ fontSize: "12px", color: "#8CFF3C", marginBottom: "8px" }}>🔥 PLAYER OF THE DAY</p>
          <p style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>Jude Bellingham</p>
          <p style={{ fontSize: "12px", color: "#9A9A9A", marginBottom: "14px" }}>BallerIQ Rating <span style={{ color: "#8CFF3C", fontWeight: 700 }}>8.9/10</span></p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", fontSize: "12px", color: "#9A9A9A", marginBottom: "16px" }}>
            <div>⚽ Tore: <b style={{ color: "#F2F2F0" }}>3</b></div>
            <div>🎯 Assists: <b style={{ color: "#F2F2F0" }}>2</b></div>
            <div>💥 Schüsse: <b style={{ color: "#F2F2F0" }}>14</b></div>
            <div>🎯 Passquote: <b style={{ color: "#F2F2F0" }}>87%</b></div>
          </div>
          <Link href="/spieler/bellingham">
            <button style={{ padding: "10px 16px", background: "transparent", color: "#8CFF3C", border: "1px solid #8CFF3C", borderRadius: "8px", fontSize: "12px" }}>
              SPIELER ANALYSIEREN →
            </button>
          </Link>
        </div>
      </section>

      {/* News Grid */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px 28px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px", borderLeft: "3px solid #8CFF3C", paddingLeft: "10px" }}>Top News</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {newsData.map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", overflow: "hidden" }}>
                {n.image && (
                  <img src={n.image} alt="" style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }} />
                )}
                <div style={{ padding: "16px" }}>
                  <p style={{ fontSize: "10px", color: "#8CFF3C", marginBottom: "6px" }}>{n.category}</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>{n.title}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6E6E6E" }}>
                    <span>{n.source}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/news">
          <button style={{ marginTop: "16px", padding: "10px 16px", background: "transparent", color: "#9A9A9A", border: "1px solid #1A1A1A", borderRadius: "8px", fontSize: "12px" }}>
            ALLE NEWS →
          </button>
        </Link>
      </section>

      {/* HEUTIGE SPIELE */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px 28px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px", borderLeft: "3px solid #8CFF3C", paddingLeft: "10px" }}>⚽ Heutige Spiele</h2>
        {[
          { liga: "🇬🇧 Premier League", spiel: "Arsenal vs Chelsea", zeit: "18:30" },
          { liga: "🇪🇸 La Liga", spiel: "Real Madrid vs Barcelona", zeit: "20:45" },
          { liga: "🇮🇹 Serie A", spiel: "Inter vs Milan", zeit: "21:00" },
        ].map((m, i) => (
          <div key={i} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "14px 16px", marginBottom: "10px" }}>
            <p style={{ fontSize: "10px", color: "#8CFF3C", marginBottom: "6px" }}>{m.liga}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "14px" }}>{m.spiel}</span>
              <span style={{ fontSize: "12px", color: "#9A9A9A" }}>{m.zeit}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", fontSize: "10px", color: "#9A9A9A" }}>
              <span style={{ border: "1px solid #1A1A1A", borderRadius: "6px", padding: "4px 8px" }}>LIVE</span>
              <span style={{ border: "1px solid #1A1A1A", borderRadius: "6px", padding: "4px 8px" }}>STATS</span>
              <span style={{ border: "1px solid #1A1A1A", borderRadius: "6px", padding: "4px 8px" }}>ANALYSE</span>
              <span style={{ border: "1px solid #1A1A1A", borderRadius: "6px", padding: "4px 8px" }}>PREDICTION</span>
            </div>
          </div>
        ))}
      </section>

      {/* Top 5 Ligen */}
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
