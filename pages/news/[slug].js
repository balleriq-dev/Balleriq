import Link from "next/link";
import { useRouter } from "next/router";
import newsData from "../../lib/newsData";

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const article = newsData.find((n) => n.slug === slug);

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Artikel wird geladen...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, padding: "16px 24px", borderBottom: "1px solid #1A1A1A", background: "rgba(0,0,0,0.9)" }}>
        <Link href="/news" style={{ color: "#9A9A9A", textDecoration: "none", fontSize: "13px" }}>
          ← Zurück zu News
        </Link>
      </nav>

      <article style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 20px 60px" }}>
        <p style={{ fontSize: "11px", color: "#8CFF3C", marginBottom: "10px" }}>{article.category}</p>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px", lineHeight: 1.3 }}>{article.title}</h1>
        <div style={{ display: "flex", gap: "10px", fontSize: "11px", color: "#6E6E6E", marginBottom: "24px" }}>
          <span>{article.time}</span><span>·</span><span>{article.source}</span>
        </div>
        {article.content.map((p, i) => (
          <p key={i} style={{ fontSize: "15px", lineHeight: 1.7, color: "#D0D0D0", marginBottom: "16px" }}>{p}</p>
        ))}
      </article>
    </div>
  );
}
