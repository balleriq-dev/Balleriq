import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSpielerBasis } from "../../lib/statsData";

export default function SpielerDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [p, setP] = useState(null);
  const [liveStats, setLiveStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getSpielerBasis(id).then((data) => {
      setP(data);
      setLoading(false);
    });
    fetch(`/api/player-stats?id=${id}`)
      .then((r) => r.json())
      .then(setLiveStats)
      .catch(() => setLiveStats({ available: false }));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Spieler wird geladen...</p>
      </div>
    );
  }

  if (!p) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Spieler nicht gefunden.</p>
      </div>
    );
  }

  const stats = liveStats?.available
    ? [
        ["⚽ Tore", liveStats.tore ?? "-"],
        ["🎯 Assists", liveStats.assists ?? "-"],
        ["💥 Schüsse", liveStats.schuesse ?? "-"],
        ["🟨 Karten", liveStats.karten ?? "-"],
        ["📊 Passquote", liveStats.passquote != null ? liveStats.passquote + "%" : "-"],
        ["🗓 Spiele", liveStats.spiele ?? "-"],
      ]
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.9)" }}>
        <Link href="/stats" style={{ color: "#9A9A9A", textDecoration: "none", fontSize: "13px" }}>← Zurück zu Stats</Link>
      </nav>

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
          {p.foto && <img src={p.foto} alt="" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }} />}
          <div>
            <p style={{ fontSize: "11px", color: "#8CFF3C" }}>{p.pos}</p>
            <h1 style={{ fontSize: "24px", fontWeight: 700 }}>{p.name}</h1>
          </div>
        </div>

        {liveStats?.available && liveStats.rating && (
          <p style={{ fontSize: "13px", color: "#9A9A9A", margin: "14px 0 24px" }}>
            BallerIQ Rating <span style={{ color: "#8CFF3C", fontWeight: 700 }}>{liveStats.rating}/10</span>
          </p>
        )}

        {stats ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
            {stats.map(([label, val]) => (
              <div key={label} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "14px" }}>
                <p style={{ fontSize: "10px", color: "#9A9A9A", marginBottom: "4px" }}>{label}</p>
                <p style={{ fontSize: "22px", fontWeight: 700 }}>{val}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "13px", color: "#6E6E6E", marginTop: "20px" }}>
            {liveStats ? "Für diesen Spieler liegen aktuell keine Saison-Statistiken vor." : "Statistiken werden geladen..."}
          </p>
        )}
      </section>
    </div>
  );
}
