import { useState, useEffect } from "react";
import { useSearchParams, useOutletContext, useNavigate } from "react-router-dom";
import { Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { adventuresData } from "../data/adventures";

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
  const { isSuperAdmin, loggedInUser, isAuthLoading } = useOutletContext<{ isSuperAdmin: boolean; loggedInUser: string | null; isAuthLoading: boolean }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser, isAuthLoading, navigate]);

  if (isAuthLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", fontFamily: "var(--font-heading)", color: "var(--gold)", letterSpacing: "0.1em" }}>
        Laddar...
      </div>
    );
  }
  
  // Header text states
  const [headerContent, setHeaderContent] = useState(() => {
    const saved = localStorage.getItem("rfr_feedback_header");
    return saved ? JSON.parse(saved) : {
      eyebrow: "💬 Tyck Till",
      title: "Lämna feedback om spelpass/äventyr",
      description: "Dina svar är anonyma och hjälper oss att förbättra framtida äventyr."
    };
  });
  const [editingHeaderField, setEditingHeaderField] = useState<{
    key: "eyebrow" | "title" | "description";
    value: string;
  } | null>(null);

  const [searchParams] = useSearchParams();
  const adventureId = searchParams.get("adventure");
  const [adventures, setAdventures] = useState<any[]>(adventuresData);
  const adventure = adventureId ? adventures.find(a => a.id === adventureId) : null;

  const [playerEmail, setPlayerEmail] = useState("");
  const [dmName, setDmName] = useState("");
  const [ratings, setRatings] = useState({ funRating: 0, storyEngagement: 0, dmClarity: 0 });
  const [feedback, setFeedback] = useState({ bestPart: "", balance: "", dmStrengths: "", improvements: "", playAgain: "", futureInvite: "", futureInfo: "", extraFeedback: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [dms, setDms] = useState<string[]>([]);

  useEffect(() => {
    if (adventure) {
      setDmName(adventure.dm?.toLowerCase() || "");
    }
  }, [adventure]);

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        const res = await fetch('/api/adventures');
        const data = await res.json();
        if (data.success && data.adventures) {
          setAdventures(data.adventures);
        }
      } catch (e) {
        console.error('Failed to fetch adventures:', e);
      }
    };
    const fetchDMs = async () => {
      try {
        const res = await fetch('/api/dms-list');
        const data = await res.json();
        if (data.success && data.users) {
          const list = data.users.map((u: any) => u.username.toLowerCase());
          setDms(list);
        }
      } catch (e) {
        console.error('Failed to fetch DMs:', e);
      }
    };
    fetchAdventures();
    fetchDMs();
  }, []);

  const resetForm = () => {
    setPlayerEmail("");
    setDmName(adventure?.dm?.toLowerCase() || "");
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
    if (!dmName) e.dmName = "Välj spelledare";
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
      adventureTitle: adventure?.title || 'Generell Feedback',
      ratings,
      feedback,
    };
    const existing = JSON.parse(localStorage.getItem("rfr_feedbacks") || "[]");
    localStorage.setItem("rfr_feedbacks", JSON.stringify([newFeedback, ...existing]));
    setSubmitted(true);
    setTimeout(() => { resetForm(); setSubmitted(false); }, 3000);
  };

  const pct = completionPercentage();
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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
          {headerContent.eyebrow && (
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
                marginBottom: "12px",
                padding: "5px 14px",
                borderRadius: "100px",
                border: "1px solid rgba(201,160,48,0.22)",
                background: "rgba(201,160,48,0.05)",
                position: "relative",
              }}
            >
              {headerContent.eyebrow}
              {isSuperAdmin && (
                <button
                  onClick={() => setEditingHeaderField({ key: "eyebrow", value: headerContent.eyebrow })}
                  style={{
                    position: "absolute",
                    top: "-12px",
                    right: "-26px",
                    background: "#0b0811",
                    border: "1px solid rgba(201,160,48,0.2)",
                    borderRadius: "50%",
                    padding: "3px",
                    cursor: "pointer",
                    color: "var(--gold)",
                    zIndex: 10,
                  }}
                  className="hover:border-gold hover:scale-105 transition-all"
                  title="Redigera ögonbryn"
                >
                  <Settings className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <div>
            <div style={{ position: "relative", marginBottom: "4px", display: "inline-block" }}>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 900, letterSpacing: "0.06em", color: "var(--gold)", margin: 0 }}>
                {headerContent.title}
              </h1>
              {isSuperAdmin && (
                <button
                  onClick={() => setEditingHeaderField({ key: "title", value: headerContent.title })}
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "-28px",
                    background: "#0b0811",
                    border: "1px solid rgba(201,160,48,0.2)",
                    borderRadius: "50%",
                    padding: "3px",
                    cursor: "pointer",
                    color: "var(--gold)",
                    zIndex: 10,
                  }}
                  className="hover:border-gold hover:scale-105 transition-all"
                  title="Redigera rubrik"
                >
                  <Settings className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "14px" }}>
              {adventure ? `Feedback för: ${adventure.title}` : headerContent.description}
            </p>
            {isSuperAdmin && !adventure && (
              <button
                onClick={() => setEditingHeaderField({ key: "description", value: headerContent.description })}
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-26px",
                  background: "#0b0811",
                  border: "1px solid rgba(201,160,48,0.2)",
                  borderRadius: "50%",
                  padding: "3px",
                  cursor: "pointer",
                  color: "var(--gold)",
                  zIndex: 10,
                }}
                className="hover:border-gold hover:scale-105 transition-all"
                title="Redigera beskrivning"
              >
                <Settings className="w-3 h-3" />
              </button>
            )}
          </div>
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
            {pct}% färdigt
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "18px" }}>
        {/* Who are you */}
        <SectionCard icon="📧" title="Vem är du?">
          <div>
            <FieldLabel>Din e-postadress *</FieldLabel>
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
            <FieldLabel>Vem var din spelledare (DM)? *</FieldLabel>
            <div style={{ position: "relative" }}>
              <select
                className={`rfr-select${errors.dmName ? " error" : ""}`}
                value={dmName}
                onChange={e => setDmName(e.target.value)}
                style={{
                  borderColor: errors.dmName ? "rgba(200,50,50,0.55)" : undefined,
                }}
              >
                <option value="">-- Välj spelledare --</option>
                {dms.map(dm => (
                  <option key={dm} value={dm}>
                    {dm === 'david' ? 'Superadmin' : capitalize(dm)}
                  </option>
                ))}
              </select>
              <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--muted)" }}>▾</div>
            </div>
            {errors.dmName && <div className="rfr-error">{errors.dmName}</div>}
          </div>
        </SectionCard>

        {/* Ratings */}
        <SectionCard icon="⭐" title="Betygsätt spelpasset">
          <div>
            <FieldLabel>1. Hur roligt hade du det? (1–10) *</FieldLabel>
            <StarRating value={ratings.funRating} max={10} onChange={v => setRatings({ ...ratings, funRating: v })} error={errors.funRating} />
          </div>
          <div>
            <FieldLabel>2. Hur engagerande var berättelsen? (1–10) *</FieldLabel>
            <StarRating value={ratings.storyEngagement} max={10} onChange={v => setRatings({ ...ratings, storyEngagement: v })} error={errors.storyEngagement} />
          </div>
          <div>
            <FieldLabel>3. Hur tydlig var spelledaren? (1–5) *</FieldLabel>
            <StarRating value={ratings.dmClarity} max={5} onChange={v => setRatings({ ...ratings, dmClarity: v })} error={errors.dmClarity} />
          </div>
        </SectionCard>

        {/* Feedback */}
        <SectionCard icon="💬" title="Feedback">
          {[
            { q: "4. Vad tyckte du bäst om? *", key: "bestPart", placeholder: "Berätta vad som var roligast eller mest minnesvärt...", req: true },
            { q: "5. Hur var balansen mellan strid, rollspel och utforskning?", key: "balance", placeholder: "T.ex. För mycket strid, perfekt balans, önskar mer rollspel...", req: false },
            { q: "6. Var det något spelledaren gjorde extra bra?", key: "dmStrengths", placeholder: "Beskriv något spelledaren gjorde riktigt bra...", req: false },
            { q: "7. Finns det något du önskar hade varit annorlunda?", key: "improvements", placeholder: "Konstruktiv kritik uppskattas...", req: false },
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
            <FieldLabel>8. Skulle du vilja spela med oss igen? *</FieldLabel>
            <PillGroup options={["Ja", "Kanske", "Nej"]} selected={feedback.playAgain} onSelect={v => setFeedback({ ...feedback, playAgain: v })} error={errors.playAgain} />
          </div>
          <div>
            <FieldLabel>9. Vill du bli inbjuden till framtida spelpass? *</FieldLabel>
            <PillGroup options={["Ja", "Nej"]} selected={feedback.futureInvite} onSelect={v => setFeedback({ ...feedback, futureInvite: v })} error={errors.futureInvite} />
          </div>
          <div>
            <FieldLabel>10. Vill du få information om kommande äventyr? *</FieldLabel>
            <PillGroup options={["Ja", "Nej"]} selected={feedback.futureInfo} onSelect={v => setFeedback({ ...feedback, futureInfo: v })} error={errors.futureInfo} />
          </div>
          <div>
            <FieldLabel>Övrig feedback</FieldLabel>
            <textarea
              className="rfr-textarea"
              value={feedback.extraFeedback}
              onChange={e => setFeedback({ ...feedback, extraFeedback: e.target.value })}
              placeholder="Är det något mer du vill dela med dig av?"
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
                Redo att skicka in?
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)" }}>Tack för att du tar dig tid att dela med dig av din feedback!</div>
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
      
      {/* Edit Header Modal */}
      <AnimatePresence>
        {editingHeaderField && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingHeaderField(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="rfr-card p-6 max-w-md w-full mx-4 relative z-10 flex flex-col bg-[#0a080f] border-gold/30 shadow-[0_0_50px_rgba(201,160,48,0.15)]"
            >
              <div className="flex items-center justify-between mb-4 border-b border-[#2a2435] pb-3">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold">
                  Redigera rubrik
                </h3>
                <button
                  onClick={() => setEditingHeaderField(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (editingHeaderField.value.trim()) {
                    const updated = { ...headerContent, [editingHeaderField.key]: editingHeaderField.value.trim() };
                    setHeaderContent(updated);
                    localStorage.setItem("rfr_feedback_header", JSON.stringify(updated));
                    setEditingHeaderField(null);
                  }
                }}
                className="flex flex-col gap-4 text-left font-body"
              >
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">
                    {editingHeaderField.key === "eyebrow" ? "Ögonbryn" : editingHeaderField.key === "title" ? "Titel" : "Beskrivning"}
                  </label>
                  {editingHeaderField.key === "description" ? (
                    <textarea
                      rows={4}
                      value={editingHeaderField.value}
                      onChange={e => setEditingHeaderField({ ...editingHeaderField, value: e.target.value })}
                      className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors font-body resize-none"
                      required
                    />
                  ) : (
                    <input
                      type="text"
                      value={editingHeaderField.value}
                      onChange={e => setEditingHeaderField({ ...editingHeaderField, value: e.target.value })}
                      className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                      required
                    />
                  )}
                </div>

                <div className="flex gap-3 mt-4 border-t border-[#2a2435] pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingHeaderField(null)}
                    className="btn-secondary w-1/2 !py-3 !text-[12px]"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    className="btn-primary w-1/2 !py-3 !text-[12px] font-bold"
                  >
                    Spara
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
