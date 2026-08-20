import { useState, useEffect } from "react";
import Link from "next/link";
import { WETTBEWERBE, getSpiele, getTabelle } from "../lib/statsData";

function formatDatum(datum) {
  if (!datum) return "";
  const heute = new Date();
  const d = new Date(datum + "T00:00:00");
  const diffTage = Math.round((d - new Date(heute.toDateString())) / 86400000);
  if (diffTage === 0) return "Heute";
  if (diffTage === 1) return "Morgen";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}

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
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif", fontSize: "13px" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "12px 20px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.95)" }}>
        <Link href="/" style={{ color: "#F2F2F0", textDecoration: "none", fontWeight: 700, fontSize: "14px" }}>
          BALLER<span style={{ color: "#8CFF3C" }}>IQ</span>
        </Link>
      </nav>

      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "18px 14px 50px" }}>
        <h1 style={{ fontSize: "17px", marginBottom: "12px", borderLeft: "3px solid #8CFF3C", paddingLeft: "8px" }}>Analysen & Stats</h1>

        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "6px", marginBottom: "18px" }}>
          {WETTBEWERBE.map((w) => (
            <button key={w.id} onClick={() => setAktiv(w.id)}
              style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: "16px", fontSize: "11px",
                background: aktiv === w.id ? "#8CFF3C" : "transparent",
                color: aktiv === w.id ? "#000" : "#9A9A9A",
                border: aktiv === w.id ? "none" : "1px solid #1A1A1A", fontWeight: aktiv === w.id ? 600 : 400 }}>
              {w.flag} {w.name}
            </button>
          ))}
        </div>

        <h2 style={{ fontSize: "12px", marginBottom: "8px", color: "#8CFF3C", letterSpacing: "0.5px" }}>⚽ SPIELE</h2>
        {loading && <p style={{ fontSize: "12px", color: "#6E6E6E", marginBottom: "18px" }}>Lädt...</p>}
        {!loading && spiele.length === 0 && <p style={{ fontSize: "12px", color: "#6E6E6E", marginBottom: "18px" }}>Für diesen Wettbewerb liegen aktuell keine Spiele vor.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
          {spiele.map((s) => (
            <div key={s.id} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "8px", padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Link href={`/team/${s.heimId}`} style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "inherit", minWidth: 0 }}>
                  {s.heimLogo && <img src={s.heimLogo} alt="" style={{ width: "16px", height: "16px", objectFit: "contain", flexShrink: 0 }} />}
                  <span style={{ fontSize: "12px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.heim}</span>
                </Link>
                <Link href={`/spiel/${s.id}`} style={{ textAlign: "center", flexShrink: 0, textDecoration: "none" }}>
                  <div style={{ fontSize: "9px", color: "#6E6E6E" }}>{formatDatum(s.datum)}</div>
                  <div style={{ fontSize: "10px", color: "#9A9A9A" }}>{s.zeit}</div>
                </Link>
                <Link href={`/team/${s.gastId}`} style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end", textDecoration: "none", color: "inherit", minWidth: 0 }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "right" }}>{s.gast}</span>
                  {s.gastLogo && <img src={s.gastLogo} alt="" style={{ width: "16px", height: "16px", objectFit: "contain", flexShrink: 0 }} />}
                </Link>
              </div>

              {s.pHeim != null ? (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", height: "5px", borderRadius: "3px", overflow: "hidden", background: "#1A1A1A" }}>
                    <div style={{ width: `${s.pHeim}%`, background: "#8CFF3C" }} />
                    <div style={{ width: `${s.pX}%`, background: "#5A5A5A" }} />
                    <div style={{ width: `${s.pGast}%`, background: "#3A3A3A" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px", fontSize: "9px", color: "#6E6E6E" }}>
                    <span>{s.heim.split(" ")[0]} {s.pHeim}%</span>
                    <span>X {s.pX}%</span>
                    <span>{s.gast.split(" ")[0]} {s.pGast}%</span>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: "10px", color: "#6E6E6E", marginTop: "6px" }}>Prediction noch nicht verfügbar</p>
              )}
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: "12px", margin: "20px 0 8px", color: "#8CFF3C", letterSpacing: "0.5px" }}>📊 TABELLE</h2>
        {!loading && tabelle.length === 0 && <p style={{ fontSize: "12px", color: "#6E6E6E" }}>Keine Tabelle verfügbar.</p>}
        {tabelle.length > 0 && (
          <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "8px", overflow: "hidden" }}>
            {tabelle.map((t, i) => (
              <Link key={t.id} href={`/team/${t.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", padding: "7px 10px", borderBottom: i < tabelle.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                  <span style={{ width: "18px", fontSize: "11px", color: "#6E6E6E" }}>{i + 1}</span>
                  {t.logo && <img src={t.logo} alt="" style={{ width: "14px", height: "14px", objectFit: "contain", marginRight: "6px" }} />}
                  <span style={{ flex: 1, fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.team}</span>
                  <span style={{ fontSize: "10px", color: "#6E6E6E", marginRight: "8px" }}>{t.tore}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#8CFF3C", marginRight: "8px", width: "20px", textAlign: "right" }}>{t.pkt}</span>
                  <span style={{ display: "flex", gap: "2px" }}>
                    {t.form.map((f, j) => (
                      <span key={j} style={{ width: "5px", height: "5px", borderRadius: "50%", background: formFarbe[f] }} />
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
