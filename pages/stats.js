import { useState, useEffect } from "react";
import Link from "next/link";
import { WETTBEWERBE, getSpiele, getTabelle } from "../lib/statsData";

export default function Stats() {
  const [aktiv, setAktiv] = useState("bl");
  const [spiele, setSpiele] = useState([]);
  const [tabelle, setTabelle] = useState([]);
  const [loading, setLoading] = useState(true);
  const formFarbe = { S: "#8CFF3C", U: "#6E6E6E", N: "#5A5A5A" };

  useEffect(() => {
    setLoading(true);
    Promise.all([getSpiele(aktiv), getTabelle(aktiv)]).then(([s, t]) => {
      setSpiele(s);
      setTabelle(t);
      setLoading(false);
    });
  }, [aktiv]);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.95)" }}>
        <Link href="/" style={{ color: "#F2F2F0", textDecoration: "none", fontWeight: 700 }}>
          BALLER<span style={{ color: "#8CFF3C" }}>IQ</span>
        </Link>
      </nav>

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 20px 60px" }}>
        <h1 style={{ fontSize: "20px", marginBottom: "16px", borderLeft: "3px solid #8CFF3C", paddingLeft: "10px" }}>Analysen & Stats</h1>

        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px" }}>
          {WETTBEWERBE.map((w) => (
            <button key={w.id} onClick={() => setAktiv(w.id)}
              style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: "20px", fontSize: "12px",
                background: aktiv === w.id ? "#8CFF3C" : "transparent",
                color: aktiv === w.id ? "#000" : "#9A9A9A",
                border: aktiv === w.id ? "none" : "1px solid #1A1A1A", fontWeight: aktiv === w.id ? 600 : 400 }}>
              {w.flag} {w.name}
            </button>
          ))}
        </div>

        <h2 style={{ fontSize: "15px", marginBottom: "12px", color: "#8CFF3C" }}>⚽ Aktuelle Spiele</h2>
        {spiele.length === 0 && <p style={{ fontSize: "13px", color: "#6E6E6E", marginBottom: "24px" }}>Für diesen Wettbewerb liegen aktuell keine Spiele vor.</p>}
        {spiele.map((s) => (
          <div key={s.id} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "16px", marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>{s.heim}</span>
              <span style={{ fontSize: "11px", color: "#6E6E6E" }}>{s.zeit}</span>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>{s.gast}</span>
            </div>
            {s.pHeim != null ? (
              <>
                <p style={{ fontSize: "10px", color: "#8CFF3C", marginBottom: "6px" }}>BALLERIQ PREDICTION</p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[["1", s.pHeim], ["X", s.pX], ["2", s.pGast]].map(([label, val]) => (
                    <div key={label} style={{ flex: 1, background: "#141414", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "10px", color: "#6E6E6E" }}>{label}</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#8CFF3C" }}>{val}%</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ fontSize: "11px", color: "#6E6E6E" }}>Prediction noch nicht verfügbar</p>
            )}
          </div>
        ))}

        <h2 style={{ fontSize: "15px", margin: "28px 0 12px", color: "#8CFF3C" }}>📊 Tabelle</h2>
        {tabelle.length === 0 && <p style={{ fontSize: "13px", color: "#6E6E6E" }}>Keine Tabelle verfügbar.</p>}
        {tabelle.length > 0 && (
          <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", overflow: "hidden" }}>
            {tabelle.map((t, i) => (
              <Link key={t.id} href={`/team/${t.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: i < tabelle.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                  <span style={{ width: "22px", fontSize: "12px", color: "#6E6E6E" }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: "13px" }}>{t.team}</span>
                  <span style={{ fontSize: "11px", color: "#6E6E6E", marginRight: "10px" }}>{t.tore}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#8CFF3C", marginRight: "10px" }}>{t.pkt}</span>
                  <span style={{ display: "flex", gap: "3px" }}>
                    {t.form.map((f, j) => (
                      <span key={j} style={{ width: "6px", height: "6px", borderRadius: "50%", background: formFarbe[f] }} />
                    ))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
