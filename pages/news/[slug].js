import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getNewsBySlug } from "../../lib/newsData";

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getNewsBySlug(slug).then((data) => {
      setArticle(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Artikel wird geladen...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", padding: "40px", fontFamily: "Inter, sans-serif" }}>
        <p>Artikel nicht gefunden.</p>
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
          <span>{article.source}</span>
        </div>
        <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#D0D0D0" }}>{article.content}</p>
      </article>
    </div>
  );
}
