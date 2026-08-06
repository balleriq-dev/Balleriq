export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#F2F2F0", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center", padding: "40px 20px", borderBottom: "1px solid #1A1A1A" }}>
        <h1 <img src="/IMG_8424.png" alt="BallerIQ" style={{ maxWidth: "300px", margin: "0 auto", display: "block" }} />
        <p style={{ color: "#8CFF3C", fontSize: "12px", letterSpacing: "2px", marginTop: "8px" }}>
          SMARTER FOOTBALL INTELLIGENCE
        </p>
      </div>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>News</h2>
        <p style={{ color: "#9A9A9A" }}>Hier erscheinen bald die täglichen Fussball-News.</p>
      </div>
    </div>
  );
}