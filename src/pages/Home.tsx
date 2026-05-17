import { Link } from "react-router-dom";

const features = [
  {
    icon: "🗡",
    title: "Epic Adventures",
    desc: "Hand-crafted campaigns and one-shots run by experienced Dungeon Masters. Every session tells a story worth remembering.",
  },
  {
    icon: "🎭",
    title: "Skilled DMs",
    desc: "Our DM team is vetted, passionate, and committed to crafting immersive, player-focused experiences at every table.",
  },
  {
    icon: "🌍",
    title: "Community",
    desc: "A serious yet warm community that values great storytelling, thoughtful roleplay, and showing up for your party.",
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 5%" }}>

      {/* ── Hero ── */}
      <section
        style={{
          textAlign: "center",
          padding: "48px 0 56px",
          animation: "slideInUp 0.6s ease-out both",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "24px",
            padding: "6px 16px",
            borderRadius: "100px",
            border: "1px solid rgba(201,160,48,0.25)",
            background: "rgba(201,160,48,0.06)",
          }}
        >
          <span>⚔</span>
          <span>Välkommen till bordet</span>
          <span>⚔</span>
        </div>

        {/* Main title */}
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(38px, 6vw, 78px)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "0.05em",
            color: "var(--text)",
            margin: "0 0 8px",
          }}
        >
          Roll for
        </h1>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(38px, 6vw, 78px)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "0.05em",
            background: "linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 55%, #A07820 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: "0 0 28px",
            textShadow: "none",
            filter: "drop-shadow(0 0 30px rgba(201,160,48,0.3))",
          }}
        >
          Roleplay
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "var(--muted)",
            maxWidth: "520px",
            margin: "0 auto 36px",
            lineHeight: 1.65,
          }}
        >
          Vi bygger ett community för episka äventyr, erfarna DMs och en seriös men varm vibe.
          Din plats vid bordet väntar.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/adventures" className="btn-primary" style={{ fontSize: "12px" }}>
            ⚔ &nbsp;Se Adventures
          </Link>
          <button
            onClick={() => alert("Orders section coming soon!")}
            className="btn-secondary"
            style={{ fontSize: "12px" }}
          >
            Orders
          </button>
        </div>
      </section>

      {/* ── Ornamental divider ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          margin: "0 0 52px",
          opacity: 0.4,
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, var(--gold))" }} />
        <span style={{ color: "var(--gold)", fontSize: "18px" }}>✦</span>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--gold), transparent)" }} />
      </div>

      {/* ── Feature cards ── */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "56px",
          animation: "slideInUp 0.7s ease-out 0.15s both",
        }}
      >
        {features.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="rfr-card"
            style={{ padding: "28px 26px" }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "14px",
                filter: "sepia(1) saturate(3) hue-rotate(10deg)",
              }}
            >
              {icon}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--gold)",
                margin: "0 0 10px",
              }}
            >
              {title}
            </h3>
            <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.65, fontSize: "16px" }}>
              {desc}
            </p>
          </div>
        ))}
      </section>

      {/* ── Who we are ── */}
      <section
        className="rfr-card"
        style={{
          padding: "36px 36px",
          marginBottom: "20px",
          animation: "slideInUp 0.7s ease-out 0.25s both",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 300px" }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--text)",
                margin: "0 0 14px",
              }}
            >
              Who We Are
            </h2>
            <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.7, fontSize: "17px" }}>
              Roll for Roleplay är ett community byggt för dem som tar sitt äventyr på allvar.
              Vi matchar spelare med skickliga DMs, skapar minnen vid bordet och håller en seriös
              men välkomnande stämning. Hur sessions funkar, vad vi värdesätter, och varför RFR
              är annorlunda — det är vad vi handlar om.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minWidth: "180px",
            }}
          >
            {[
              { num: "50+", label: "Sessions run" },
              { num: "8+", label: "Active DMs" },
              { num: "100+", label: "Players served" },
            ].map(({ num, label }) => (
              <div
                key={label}
                style={{
                  textAlign: "center",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  background: "rgba(201,160,48,0.06)",
                  border: "1px solid rgba(201,160,48,0.14)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "24px",
                    fontWeight: 900,
                    color: "var(--gold)",
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}