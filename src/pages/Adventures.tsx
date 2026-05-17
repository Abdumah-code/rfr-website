import { Link } from "react-router-dom";
import { adventuresData } from "../data/adventures";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}/${m}/${y}`;
}

export default function Adventures() {
  return (
    <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 5%" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px", animation: "slideInUp 0.55s ease-out both" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-heading)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "16px",
            padding: "5px 14px",
            borderRadius: "100px",
            border: "1px solid rgba(201,160,48,0.22)",
            background: "rgba(201,160,48,0.05)",
          }}
        >
          <span>🗺</span> Kommande äventyr
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(30px, 4.5vw, 52px)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            color: "var(--text)",
            margin: "0 0 10px",
          }}
        >
          Upcoming Adventures
        </h1>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: "17px" }}>
          Tryck "Intresserad" för att anmäla intresse. Fullt = låst.
        </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "22px",
          animation: "slideInUp 0.65s ease-out 0.1s both",
        }}
      >
        {adventuresData.map((a, i) => {
          const full = a.spotsLeft <= 0;
          const spotsPercent = Math.round(((a.maxPlayers - a.spotsLeft) / a.maxPlayers) * 100);

          return (
            <article
              key={a.id}
              className="rfr-card"
              style={{
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "0",
                animationDelay: `${i * 0.08}s`,
                animation: "slideInUp 0.5s ease-out both",
              }}
            >
              {/* Title row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "18px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "19px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: "var(--text)",
                    margin: 0,
                    lineHeight: 1.3,
                    flex: 1,
                  }}
                >
                  {a.title}
                </h2>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "5px 10px",
                    borderRadius: "100px",
                    background: "rgba(201,160,48,0.1)",
                    border: "1px solid rgba(201,160,48,0.3)",
                    color: "var(--gold)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {a.language}
                </div>
              </div>

              {/* Details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px 20px",
                  marginBottom: "20px",
                }}
              >
                {[
                  { label: "Datum", value: `${formatDate(a.date)} · ${a.time}` },
                  { label: "DM", value: a.dm },
                  { label: "Plats", value: a.location },
                  { label: "Max spelare", value: String(a.maxPlayers) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "9px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        marginBottom: "3px",
                        opacity: 0.8,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: "15px" }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Spots bar */}
              <div style={{ marginBottom: "22px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: full ? "#E05555" : "var(--gold)",
                      opacity: 0.8,
                    }}
                  >
                    {full ? "Fullt" : `${a.spotsLeft} platser kvar`}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "9px",
                      color: "var(--muted)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {a.maxPlayers - a.spotsLeft}/{a.maxPlayers}
                  </span>
                </div>
                <div
                  style={{
                    height: "4px",
                    borderRadius: "2px",
                    background: "rgba(255,255,255,0.07)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${spotsPercent}%`,
                      borderRadius: "2px",
                      background: full
                        ? "linear-gradient(90deg, #7C1C2E, #A82840)"
                        : "linear-gradient(90deg, var(--gold), var(--gold-light))",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "auto" }}>
                <a
                  href={full ? "#" : a.interestUrl}
                  target={full ? undefined : "_blank"}
                  rel="noreferrer"
                  className={full ? "btn-secondary" : "btn-primary"}
                  style={{
                    fontSize: "11px",
                    opacity: full ? 0.45 : 1,
                    pointerEvents: full ? "none" : "auto",
                    cursor: full ? "not-allowed" : "pointer",
                    flex: 1,
                    justifyContent: "center",
                  }}
                  onClick={e => { if (full) e.preventDefault(); }}
                  aria-disabled={full}
                >
                  {full ? "Fullt" : `Intresserad (${a.spotsLeft} kvar)`}
                </a>

                <Link
                  to={`/feedback?adventure=${a.id}`}
                  className="btn-secondary"
                  style={{ fontSize: "11px", flexShrink: 0 }}
                >
                  Feedback
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {adventuresData.length === 0 && (
        <div
          className="rfr-card"
          style={{ padding: "48px", textAlign: "center", marginTop: "20px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.4 }}>🎲</div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "16px",
              letterSpacing: "0.06em",
              color: "var(--muted)",
            }}
          >
            Inga äventyr just nu — kolla tillbaka snart.
          </p>
        </div>
      )}
    </div>
  );
}