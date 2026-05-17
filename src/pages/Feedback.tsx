import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { adventuresData } from "../data/adventures";
import { getDMs } from "../utils/dms";

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rfr-card" style={{ padding: "28px 30px" }}>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--gold)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "0 0 22px",
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      <div style={{ display: "grid", gap: "20px" }}>
        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "var(--font-heading)",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: "10px",
      }}
    >
      {children}
    </label>
  );
}

function PillGroup({
  options,
  selected,
  onSelect,
  error,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {options.map(opt => (
          <div
            key={opt}
            className={`rfr-pill${selected === opt ? " active" : ""}`}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </div>
        ))}
      </div>
      {error && <div className="rfr-error" style={{ marginTop: "6px" }}>{error}</div>}
    </div>
  );
}

function StarRating({
  value,
  max,
  onChange,
  error,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
        {[...Array(max)].map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "8px",
              fontSize: "20px",
              cursor: "pointer",
              border: "1px solid",
              transition: "all 0.15s ease",
              ...(i < value
                ? {
                    background: "linear-gradient(135deg, var(--gold-light), var(--gold))",
                    borderColor: "var(--gold)",
                    color: "#0D0A0A",
                    boxShadow: "0 2px 10px rgba(201,160,48,0.35)",
                  }
                : {
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(201,160,48,0.2)",
                    color: "var(--muted)",
                  }),
            }}
            onMouseEnter={e => {
              if (i >= value) {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,48,0.5)";
                (e.currentTarget as HTMLElement).style.color = "var(--gold)";
              }
            }}
            onMouseLeave={e => {
              if (i >= value) {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,48,0.2)";
                (e.currentTarget as HTMLElement).style.color = "var(--muted)";
              }
            }}
          >
            {i < value ? "★" : "☆"}
          </button>
        ))}
      </div>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.1em", color: value > 0 ? "var(--gold)" : "var(--muted)", opacity: 0.8 }}>
        {value > 0 ? `${value} / ${max}` : "Välj betyg"}
      </div>
      {error && <div className="rfr-error" style={{ marginTop: "4px" }}>{error}</div>}
    </div>
  );
}

export default function Feedback() {
  const [searchParams] = useSearchParams();
  const adventureId = searchParams.get("adventure");
  const adventure = adventureId ? adventuresData.find(a => a.id === adventureId) : null;

  const [playerEmail, setPlayerEmail] = useState("");
  const [dmName, setDmName] = useState(adventure?.dm || "");
  const [ratings, setRatings] = useState({ funRating: 0, storyEngagement: 0, dmClarity: 0 });
  const [feedback, setFeedback] = useState({ bestPart: "", balance: "", dmStrengths: "", improvements: "", playAgain: "", futureInvite: "", futureInfo: "", extraFeedback: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [dms, setDms] = useState<string[]>([]);

  useEffect(() => {
    const dmUsers = getDMs();
    setDms(["David", ...dmUsers.map(dm => dm.name)]);
  }, []);

  const resetForm = () => {
    setPlayerEmail("");
    setDmName(adventure?.dm || "");
    setRatings({ funRating: 0, storyEngagement: 0, dmClarity: 0 });
    setFeedback({ bestPart: "", balance: "", dmStrengths: "", improvements: "", playAgain: "", futureInvite: "", futureInfo: "", extraFeedback: "" });
    setErrors({});
  };

  const completionPercentage = () => {
    const total = 11;
    let filled = 0;
    if (playerEmail && playerEmail.includes("@")) filled++;
    if (dmName) filled++;
    if (ratings.funRating > 0) filled++;
    if (ratings.storyEngagement > 0) filled++;
    if (ratings.dmClarity > 0) filled++;
    if (feedback.bestPart) filled++;
    if (feedback.balance) filled++;
    if (feedback.playAgain) filled++;
    if (feedback.futureInvite) filled++;
    if (feedback.futureInfo) filled++;
    if (feedback.extraFeedback) filled++;
    return Math.round((filled / total) * 100);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!playerEmail) e.playerEmail = "E-post krävs";
    if (playerEmail && !playerEmail.includes("@")) e.playerEmail = "Ogiltig e-post";
    if (!dmName) e.dmName = "Välj DM";
    if (ratings.funRating === 0) e.funRating = "Betygsätt sessionen";
    if (ratings.storyEngagement === 0) e.storyEngagement = "Betygsätt berättelsen";
    if (ratings.dmClarity === 0) e.dmClarity = "Betygsätt tydlighet";
    if (!feedback.bestPart) e.bestPart = "Skriv något du gillade";
    if (!feedback.playAgain) e.playAgain = "Välj ett alternativ";
    if (!feedback.futureInvite) e.futureInvite = "Välj ett alternativ";
    if (!feedback.futureInfo) e.futureInfo = "Välj ett alternativ";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) { alert("Vänligen fyll i alla obligatoriska fält."); return; }
    const newFeedback = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      playerEmail,
      dmName,
      adventureTitle: adventure?.title,
      ratings,
      feedback,
    };
    const existing = JSON.parse(localStorage.getItem("rfr_feedbacks") || "[]");
    localStorage.setItem("rfr_feedbacks", JSON.stringify([newFeedback, ...existing]));
    setSubmitted(true);
    setTimeout(() => { resetForm(); setSubmitted(false); }, 3000);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          className="rfr-card"
          style={{
            padding: "56px 64px",
            textAlign: "center",
            border: "1px solid rgba(201,160,48,0.4)",
            boxShadow: "0 0 60px rgba(201,160,48,0.12)",
            animation: "slideInUp 0.5s ease-out both",
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "26px", color: "var(--gold)", margin: "0 0 10px", letterSpacing: "0.04em" }}>
            Tack för din feedback!
          </h1>
          <p style={{ color: "var(--muted)", margin: 0 }}>Ditt svar har skickats till DM.</p>
        </div>
      </div>
    );
  }

  const pct = completionPercentage();

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 5% 100px" }}>
      {/* Sticky header */}
      <div
        style={{
          position: "sticky",
          top: "72px",
          zIndex: 40,
          background: "rgba(7,5,10,0.9)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(201,160,48,0.12)",
          padding: "16px 0",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 900, letterSpacing: "0.06em", color: "var(--gold)", margin: "0 0 4px" }}>
            🎲 RFR Session Feedback
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "14px" }}>
            {adventure ? `Feedback för: ${adventure.title}` : "Vad tyckte du om denna session?"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              height: "4px",
              width: "160px",
              borderRadius: "2px",
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                borderRadius: "2px",
                background: "linear-gradient(90deg, var(--gold), var(--gold-light))",
                transition: "width 0.4s ease",
                boxShadow: "0 0 8px rgba(201,160,48,0.5)",
              }}
            />
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.1em", color: "var(--muted)" }}>
            {pct}% komplett
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "18px" }}>
        {/* Who are you */}
        <SectionCard icon="📧" title="Vem är du?">
          <div>
            <FieldLabel>Din E-post *</FieldLabel>
            <input
              type="email"
              className={`rfr-input${errors.playerEmail ? " error" : ""}`}
              value={playerEmail}
              onChange={e => setPlayerEmail(e.target.value)}
              placeholder="namn@example.com"
            />
            {errors.playerEmail && <div className="rfr-error">{errors.playerEmail}</div>}
          </div>
          <div>
            <FieldLabel>Vem var din DM? *</FieldLabel>
            <div style={{ position: "relative" }}>
              <select
                className={`rfr-select${errors.dmName ? " error" : ""}`}
                value={dmName}
                onChange={e => setDmName(e.target.value)}
                style={{
                  borderColor: errors.dmName ? "rgba(200,50,50,0.55)" : undefined,
                }}
              >
                <option value="">-- Välj DM --</option>
                {dms.map(dm => (<option key={dm} value={dm}>{dm}</option>))}
              </select>
              <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted)" }}>▾</div>
            </div>
            {errors.dmName && <div className="rfr-error">{errors.dmName}</div>}
          </div>
        </SectionCard>

        {/* Ratings */}
        <SectionCard icon="⭐" title="Betygsätt sessionen">
          <div>
            <FieldLabel>1. Hur roligt hade du det? (1–10) *</FieldLabel>
            <StarRating value={ratings.funRating} max={10} onChange={v => setRatings({ ...ratings, funRating: v })} error={errors.funRating} />
          </div>
          <div>
            <FieldLabel>2. Hur engagerande var berättelsen? (1–10) *</FieldLabel>
            <StarRating value={ratings.storyEngagement} max={10} onChange={v => setRatings({ ...ratings, storyEngagement: v })} error={errors.storyEngagement} />
          </div>
          <div>
            <FieldLabel>3. Hur tydlig var DM? (1–5) *</FieldLabel>
            <StarRating value={ratings.dmClarity} max={5} onChange={v => setRatings({ ...ratings, dmClarity: v })} error={errors.dmClarity} />
          </div>
        </SectionCard>

        {/* Feedback */}
        <SectionCard icon="💬" title="Feedback">
          {[
            { q: "4. Vad tyckte du bäst om? *", key: "bestPart", placeholder: "Berätta vad som var roligast...", req: true },
            { q: "5. Var det lagom mycket strid, rollspel och utforskning?", key: "balance", placeholder: "För mycket strid? Perfekt balans?", req: false },
            { q: "6. Något DM gjorde extra bra?", key: "dmStrengths", placeholder: "Beskriv något DM gjorde riktigt bra...", req: false },
            { q: "7. Något du önskar var annorlunda?", key: "improvements", placeholder: "Konstruktiv kritik är uppskattat...", req: false },
          ].map(({ q, key, placeholder, req }) => (
            <div key={key}>
              <FieldLabel>{q}</FieldLabel>
              <textarea
                className={`rfr-textarea${req && errors[key] ? " error" : ""}`}
                value={(feedback as any)[key]}
                onChange={e => setFeedback({ ...feedback, [key]: e.target.value })}
                placeholder={placeholder}
              />
              {req && errors[key] && <div className="rfr-error">{errors[key]}</div>}
            </div>
          ))}
        </SectionCard>

        {/* Future play */}
        <SectionCard icon="🎯" title="Framtida spel">
          <div>
            <FieldLabel>8. Skulle du vilja spela igen? *</FieldLabel>
            <PillGroup options={["Ja", "Kanske", "Nej"]} selected={feedback.playAgain} onSelect={v => setFeedback({ ...feedback, playAgain: v })} error={errors.playAgain} />
          </div>
          <div>
            <FieldLabel>9. Vill du bli inbjuden till framtida spel? *</FieldLabel>
            <PillGroup options={["Ja", "Nej"]} selected={feedback.futureInvite} onSelect={v => setFeedback({ ...feedback, futureInvite: v })} error={errors.futureInvite} />
          </div>
          <div>
            <FieldLabel>10. Vill du få info om framtida äventyr? *</FieldLabel>
            <PillGroup options={["Ja", "Nej"]} selected={feedback.futureInfo} onSelect={v => setFeedback({ ...feedback, futureInfo: v })} error={errors.futureInfo} />
          </div>
          <div>
            <FieldLabel>Övrig feedback</FieldLabel>
            <textarea
              className="rfr-textarea"
              value={feedback.extraFeedback}
              onChange={e => setFeedback({ ...feedback, extraFeedback: e.target.value })}
              placeholder="Något mer du vill dela med dig av?"
              style={{ minHeight: "80px" }}
            />
          </div>
        </SectionCard>

        {/* Sticky submit */}
        <div
          style={{
            position: "sticky",
            bottom: "20px",
            background: "rgba(7,5,10,0.96)",
            border: "1px solid rgba(201,160,48,0.28)",
            borderRadius: "14px",
            padding: "22px 26px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.4), 0 0 40px rgba(201,160,48,0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text)", marginBottom: "4px" }}>
                Redo att skicka?
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)" }}>Tack för att du delar din feedback!</div>
            </div>
            <button className="btn-primary" onClick={handleSubmit} style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
              🎲 &nbsp;Skicka feedback
            </button>
          </div>

          {Object.keys(errors).length > 0 && (
            <div
              style={{
                marginTop: "14px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(200,50,50,0.08)",
                border: "1px solid rgba(200,50,50,0.25)",
                color: "#E07070",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚠ Vänligen fyll i alla obligatoriska fält
            </div>
          )}
        </div>
      </div>
    </div>
  );
}