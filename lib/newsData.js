      {/* News Grid */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px 28px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px", borderLeft: "3px solid #8CFF3C", paddingLeft: "10px" }}>Top News</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          {newsData.slice(0, 3).map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "10px", padding: "16px" }}>
                <p style={{ fontSize: "10px", color: "#8CFF3C", marginBottom: "6px" }}>{n.category}</p>
                <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>{n.title}</p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6E6E6E" }}>
                  <span>{n.time}</span><span>{n.source}</span>
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
