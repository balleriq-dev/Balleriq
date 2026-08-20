import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSpielDetail } from "../../lib/statsData";

const formFarbe = { S: "#8CFF3C", U: "#6E6E6E", N: "#5A5A5A", W: "#8CFF3C", D: "#6E6E6E", L: "#5A5A5A" };

function Vergleichszeile({ label, heimVal, gastVal }) {
  const h = Number(heimVal) || 0;
  const g = Number(gastVal) || 0;
  const summe = h + g || 1;
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
        <span style={{ fontWeight: 700 }}>{heimVal ?? "-"}</span>
        <span style={{ color: "#9A9A9A", fontSize: "11px" }}>{label}</span>
        <span style={{ fontWeight: 700 }}>{gastVal ?? "-"}</span>
      </div>
      <div style={{ display: "flex", height: "5px", borderRadius: "3px", overflow: "hidden", background: "#1A1A1A" }}>
        <div style={{ width: `${(h / summe) * 100}%`, background: "#8CFF3C" }} />
        <div style={{ width: `${(g / summe) * 100}%`, background: "#3A3A3A" }} />
      </div>
    </div>
  );
}

export default function SpielDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [spiel, setSpiel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [h2h, setH2h] = useState(null);

  useEffect(() => {
    if (!id) return;
    getSpielDetail(id).then((data) => {
      setSpiel(data);
      setLoading(false);
    });
    fetch(`/api/h2h?fixtureId=${id}`)
      .then((r) => r.json())
      .then(setH2h)
      .catch(() => setH2h({ available: false }));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Spiel wird geladen...</p>
      </div>
    );
  }

  if (!spiel) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Spiel nicht gefunden.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif", fontSize: "13px" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "12px 20px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.95)" }}>
        <Link href="/stats" style={{ color: "#9A9A9A", textDecoration: "none", fontSize: "12px" }}>← Zurück zu Stats</Link>
      </nav>

      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "20px 14px 50px" }}>
        <p style={{ fontSize: "11px", color: "#8CFF3C", textAlign: "center", marginBottom: "16px" }}>{spiel.liga}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link href={`/team/${spiel.heimId}`} style={{ flex: 1, textDecoration: "none", color: "inherit", textAlign: "center" }}>
            {spiel.heimLogo && <img src={spiel.heimLogo} alt="" style={{ width: "48px", height: "48px", objectFit: "contain", marginBottom: "8px" }} />}
            <p style={{ fontSize: "13px", fontWeight: 600 }}>{spiel.heim}</p>
          </Link>
          <div style={{ textAlign: "center", padding: "0 12px" }}>
            <p style={{ fontSize: "18px", fontWeight: 700 }}>{spiel.zeit}</p>
            <p style={{ fontSize: "11px", color: "#9A9A9A" }}>{spiel.datum}</p>
          </div>
          <Link href={`/team/${spiel.gastId}`} style={{ flex: 1, textDecoration: "none", color: "inherit", textAlign: "center" }}>
            {spiel.gastLogo && <img src={spiel.gastLogo} alt="" style={{ width: "48px", height: "48px", objectFit: "contain", marginBottom: "8px" }} />}
            <p style={{ fontSize: "13px", fontWeight: 600 }}>{spiel.gast}</p>
          </Link>
        </div>

        {spiel.pHeim != null ? (
          <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "14px", marginBottom: "24px" }}>
            <p style={{ fontSize: "10px", color: "#8CFF3C", marginBottom: "8px", textAlign: "center" }}>BALLERIQ PREDICTION</p>
            <div style={{ display: "flex", gap: "6px" }}>
              {[["1", spiel.pHeim], ["X", spiel.pX], ["2", spiel.pGast]].map(([label, val]) => (
                <div key={label} style={{ flex: 1, background: "#141414", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#6E6E6E" }}>{label}</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#8CFF3C" }}>{val}%</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: "12px", color: "#6E6E6E", textAlign: "center", marginBottom: "24px" }}>Prediction noch nicht verfügbar</p>
        )}

        {(spiel.heimStats?.form?.length > 0 || spiel.gastStats?.form?.length > 0) && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {(spiel.heimStats?.form || []).map((f, j) => (
                <span key={j} style={{ width: "16px", height: "16px", borderRadius: "50%", background: formFarbe[f] || "#5A5A5A", fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700 }}>{f}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {(spiel.gastStats?.form || []).map((f, j) => (
                <span key={j} style={{ width: "16px", height: "16px", borderRadius: "50%", background: formFarbe[f] || "#5A5A5A", fontSize: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700 }}>{f}</span>
              ))}
            </div>
          </div>
        )}

        <h2 style={{ fontSize: "12px", marginBottom: "14px", color: "#8CFF3C", letterSpacing: "0.5px", textAlign: "center" }}>SAISON-VERGLEICH</h2>
        <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "16px" }}>
          <Vergleichszeile label="Tabellenplatz" heimVal={spiel.heimStats?.platz} gastVal={spiel.gastStats?.platz} />
          <Vergleichszeile label="Tore / Spiel" heimVal={spiel.heimStats?.torePro} gastVal={spiel.gastStats?.torePro} />
          <Vergleichszeile label="Gegentore / Spiel" heimVal={spiel.heimStats?.gegentorePro} gastVal={spiel.gastStats?.gegentorePro} />
        </div>
        <p style={{ fontSize: "10px", color: "#6E6E6E", marginTop: "10px", textAlign: "center", marginBottom: "24px" }}>
          Basiert auf Saison-Durchschnitt. Schüsse, Ecken und Karten sind aktuell nicht verfügbar.
        </p>

        <h2 style={{ fontSize: "12px", marginBottom: "14px", color: "#8CFF3C", letterSpacing: "0.5px", textAlign: "center" }}>H2H – DIREKTE DUELLE</h2>
        {h2h?.available && h2h.spiele.length > 0 && (
          <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", overflow: "hidden" }}>
            {h2h.spiele.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < h2h.spiele.length - 1 ? "1px solid #1A1A1A" : "none" }}>
                <span style={{ fontSize: "10px", color: "#6E6E6E", width: "60px" }}>{m.datum}</span>
                <span style={{ flex: 1, fontSize: "12px", textAlign: "right", paddingRight: "10px" }}>{m.heim}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#8CFF3C" }}>{m.heimTore} : {m.gastTore}</span>
                <span style={{ flex: 1, fontSize: "12px", paddingLeft: "10px" }}>{m.gast}</span>
              </div>
            ))}
          </div>
        )}
        {h2h?.available && h2h.spiele.length === 0 && (
          <p style={{ fontSize: "12px", color: "#6E6E6E", textAlign: "center" }}>Diese Teams sind bisher noch nicht gegeneinander angetreten.</p>
        )}
        {h2h && !h2h.available && (
          <p style={{ fontSize: "12px", color: "#6E6E6E", textAlign: "center" }}>H2H-Daten aktuell nicht verfügbar.</p>
        )}
        {!h2h && (
          <p style={{ fontSize: "12px", color: "#6E6E6E", textAlign: "center" }}>Lädt...</p>
        )}
      </section>
    </div>
  );
}
