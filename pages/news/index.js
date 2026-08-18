import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllNews } from "../../lib/newsData";

export default function AllNews() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllNews().then((data) => {
      setNewsData(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.9)" }}>
        <Link href="/" style={{ color: "#F2F2F0", textDecoration: "none", fontWeight: 700 }}>
          BALLER<span style={{ color: "#8CFF3C" }}>IQ</span>
        </Link>
      </nav>

      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "28px 20px 60px" }}>
        <h1 style={{ fontSize: "20px", marginBottom: "20px", borderLeft: "3px solid #8CFF3C", paddingLeft: "10px" }}>Alle News</h1>
        {loading && <p style={{ color: "#9A9A9A" }}>Lädt...</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {newsData.map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", overflow: "hidden" }}>
                {n.image && (
                  <img src={n.image} alt="" style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
                )}
                <div style={{ padding: "16px" }}>
                <p style={{ fontSize: "10px", color: "#8CFF3C", marginBottom: "6px" }}>{n.category}</p>
                <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>{n.title}</p>
                <p style={{ fontSize: "13px", color: "#9A9A9A", marginBottom: "8px" }}>{n.summary}</p>
                <div style={{ fontSize: "10px", color: "#8CFF3C" }}>
                  Weiterlesen →
                </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
