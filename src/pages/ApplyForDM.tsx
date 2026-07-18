import { useState, useEffect } from "react";
import { useLang } from "../context/LangContext";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Shared sub-components ──────────────────────────────────────────────────

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div
      className="rfr-card"
      style={{ padding: "28px 30px", animation: "slideInUp 0.5s ease-out both" }}
    >
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "15px",
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
      <div style={{ display: "grid", gap: "18px" }}>
        {children}
      </div>
    </div>
  );
}

function FieldGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="rfr-label">{label}</label>
      {children}
      {error && <div className="rfr-error">{error}</div>}
    </div>
  );
}

function PillGroup({
  options,
  selected,
  onToggle,
  multi = false,
  error,
}: {
  options: string[];
  selected: string | string[];
  onToggle: (val: string) => void;
  multi?: boolean;
  error?: string;
}) {
  const { t } = useLang();
  const optionLabel = (v: string) => ({
    "Svenska": t("Svenska", "Swedish"), "Engelska": t("Engelska", "English"), "Annat": t("Annat", "Other"),
    "På plats (IRL)": t("På plats (IRL)", "In person (IRL)"), "Båda": t("Båda", "Both"),
    "Kampanjer": t("Kampanjer", "Campaigns"), "Ja": t("Ja", "Yes"), "Nej": t("Nej", "No"),
    "Ibland": t("Ibland", "Sometimes"), "Nybörjare": t("Nybörjare", "Beginners"),
    "Erfarna": t("Erfarna", "Experienced"), "Blandat": t("Blandat", "Mixed")
  } as Record<string,string>)[v] || v;
  const isActive = (v: string) =>
    multi ? (selected as string[]).includes(v) : selected === v;

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {options.map(opt => (
          <div
            key={opt}
            className={`rfr-pill${isActive(opt) ? " active" : ""}`}
            onClick={() => onToggle(opt)}
          >
            {optionLabel(opt)}
          </div>
        ))}
      </div>
      {error && <div className="rfr-error" style={{ marginTop: "6px" }}>{error}</div>}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ApplyForDM() {
  const { isSuperAdmin, loggedInUser, isAuthLoading } = useOutletContext<{ isSuperAdmin: boolean; loggedInUser: string | null; isAuthLoading: boolean }>();
  const navigate = useNavigate();
  const { t } = useLang();

  useEffect(() => {
    if (!isAuthLoading && loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser, isAuthLoading, navigate]);

  if (isAuthLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", fontFamily: "var(--font-heading)", color: "var(--gold)", letterSpacing: "0.1em" }}>
        {t("Laddar...", "Loading...")}
      </div>
    );
  }

  // Header text states
  const [headerContent, setHeaderContent] = useState(() => {
    const saved = localStorage.getItem("rfr_apply_header");
    return saved ? JSON.parse(saved) : {
      eyebrow: t("📝 Bli Spelledare", "📝 Become a GM"),
      title: t("Ansök som spelledare (DM)", "Apply as Game Master (GM)"),
      description: t("Vill du bli en del av RFR DM-team? Fyll i ansökan nedan!", "Want to join the RFR GM team? Fill in the application below!")
    };
  });
  const [editingHeaderField, setEditingHeaderField] = useState<{
    key: "eyebrow" | "title" | "description";
    value: string;
  } | null>(null);

  const [step, setStep] = useState<"form" | "summary">("form");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    languages: [] as string[],
    otherLanguage: "",
    experienceTime: "",
    systems: [] as string[],
    otherSystem: "",
    sessionCount: "",
    playStyle: [] as string[],
    balance: "",
    format: "",
    irlContent: "",
    visuals: [] as string[],
    tools: [] as string[],
    otherTool: "",
    sessionType: "",
    sessionLength: "",
    wantsPayment: "",
    price: "",
    freeTrial: "",
    playTimes: [] as string[],
    frequency: "",
    targetPlayers: "",
    guideNew: "",
    gameTone: "",
    ruleStrictness: "",
    conflictHandling: "",
    presentation: "",
    contactMethod: "",
    contactDiscord: "",
    contactEmail: "",
    contactPhone: "",
    consentGiven: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [profilePicName, setProfilePicName] = useState("");

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = t("Namn krävs", "Name required");
    if (!formData.age.trim()) e.age = t("Ålder krävs", "Age required");
    if (!formData.location.trim()) e.location = t("Land/stad krävs", "Country/city required");
    if (formData.languages.length === 0) e.languages = t("Välj minst ett språk", "Select at least one language");
    if (formData.languages.includes("Annat") && !formData.otherLanguage.trim()) e.otherLanguage = t("Specificera språk", "Specify language");
    if (!formData.experienceTime.trim()) e.experienceTime = t("Erfarenhet krävs", "Experience required");
    if (formData.systems.length === 0) e.systems = t("Välj minst ett system", "Select at least one system");
    if (formData.systems.includes("Annat") && !formData.otherSystem.trim()) e.otherSystem = t("Specificera system", "Specify system");
    if (!formData.sessionCount.trim()) e.sessionCount = t("Antal sessions krävs", "Number of sessions required");
    if (formData.playStyle.length === 0) e.playStyle = t("Välj minst en spelstil", "Select at least one play style");
    if (!formData.balance) e.balance = t("Välj balans", "Choose balance");
    if (!formData.format) e.format = t("Välj format", "Choose format");
    if ((formData.format === "IRL" || formData.format === "Båda") && !formData.irlContent.trim()) e.irlContent = t("Ange stad/område", "Enter city/area");
    if (formData.visuals.length === 0) e.visuals = t("Välj minst ett visuellt format", "Select at least one visual format");
    if (!formData.sessionType) e.sessionType = t("Välj typ av sessions", "Choose session type");
    if (!formData.sessionLength.trim()) e.sessionLength = t("Ange sessionslängd", "Enter session length");
    if (!formData.wantsPayment) e.wantsPayment = t("Välj betalningsalternativ", "Choose payment option");
    if ((formData.wantsPayment === "Ja" || formData.wantsPayment === "Ibland") && !formData.price.trim()) e.price = t("Ange pris", "Enter price");
    if (!formData.freeTrial) e.freeTrial = t("Välj alternativ", "Choose option");
    if (formData.playTimes.length === 0) e.playTimes = t("Välj minst en tid", "Select at least one time");
    if (!formData.frequency) e.frequency = t("Välj frekvens", "Choose frequency");
    if (!formData.targetPlayers) e.targetPlayers = t("Välj spelartyp", "Choose player type");
    if (!formData.guideNew) e.guideNew = t("Välj alternativ", "Choose option");
    if (!formData.gameTone) e.gameTone = t("Välj ton", "Choose tone");
    if (!formData.ruleStrictness) e.ruleStrictness = t("Välj regelstriktness", "Choose rule strictness");
    if (!formData.conflictHandling.trim()) e.conflictHandling = t("Beskriv hur du hanterar konflikter", "Describe how you handle conflicts");
    if (!formData.presentation.trim()) e.presentation = t("Presentationen är obligatorisk", "Bio is required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const toggle = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const list = prev[field] as string[];
      return { ...prev, [field]: list.includes(value) ? list.filter(v => v !== value) : [...list, value] };
    });
  };

  const set = (field: keyof typeof formData, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleProceed = () => {
    if (!validateForm()) { alert(t("Vänligen fyll i alla obligatoriska fält.", "Please fill in all required fields.")); return; }
    setErrors({});
    setStep("summary");
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = () => {
    const e: Record<string, string> = {};
    if (!formData.contactMethod) e.contactMethod = t("Välj hur du vill bli kontaktad", "Choose how to be contacted");
    if (formData.contactMethod === "Discord" && !formData.contactDiscord.trim()) e.contactDiscord = t("Ange ditt Discord-namn", "Enter your Discord name");
    if (formData.contactMethod === "E-post" && !formData.contactEmail.trim()) e.contactEmail = t("Ange din e-postadresse", "Enter your email");
    if (formData.contactMethod === "Telefon" && !formData.contactPhone.trim()) e.contactPhone = t("Ange ditt telefonnummer", "Enter your phone number");
    if (!formData.consentGiven) e.consentGiven = t("Samtycke krävs för att skicka ansökan", "Consent required to submit");
    if (Object.keys(e).length > 0) {
      setErrors(e);
      window.scrollTo(0, document.body.scrollHeight);
      alert(t("Vänligen fyll i dina kontaktuppgifter och godkänn villkoren.", "Please fill in your contact details and accept the terms."));
      return;
    }
    setErrors({});
    console.log("DM Application Data:", formData, profilePicName);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setStep("form"); window.scrollTo(0, 0); }, 4000);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
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
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎉</div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "26px",
              color: "var(--gold)",
              margin: "0 0 10px",
              letterSpacing: "0.04em",
            }}
          >
            {t("Tack för din ansökan!", "Thank you for your application!")}
          </h1>
          <p style={{ color: "var(--muted)", margin: 0 }}>{t("Vi går igenom den och hör av oss till dig inom kort!", "We will review it and get back to you shortly!")}</p>
        </div>
      </div>
    );
  }

  // ── Summary screen ──────────────────────────────────────────────────────────
  const SummaryItem = ({ label, value }: { label: string; value: string | string[] }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    const display = Array.isArray(value) ? value.join(", ") : value;
    return (
      <div style={{ borderBottom: "1px solid rgba(201,160,48,0.1)", padding: "10px 0" }}>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "9px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "4px",
            opacity: 0.75,
          }}
        >
          {label}
        </div>
        <div style={{ color: "var(--text)", fontSize: "15px", whiteSpace: "pre-wrap" }}>{display}</div>
      </div>
    );
  };

  if (step === "summary") {
    const finalLanguages = formData.languages.map(l => l === "Annat" ? formData.otherLanguage : l);
    const finalSystems = formData.systems.map(s => s === "Annat" ? formData.otherSystem : s);
    const finalTools = formData.tools.map(t => t === "Annat" ? formData.otherTool : t);

    return (
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 5% 80px" }}>
        <div className="rfr-card" style={{ padding: "36px", marginTop: "8px" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "var(--gold)",
              margin: "0 0 24px",
            }}
          >
            {t("Sammanfattning av din ansökan", "Summary of your application")}
          </h2>

          <div
            style={{
              background: "rgba(7,5,10,0.5)",
              borderRadius: "10px",
              border: "1px solid rgba(201,160,48,0.12)",
              padding: "20px 24px",
              marginBottom: "28px",
            }}
          >
            <SummaryItem label={t("Namn", "Name")} value={formData.name} />
            <SummaryItem label={t("Ålder", "Age")} value={formData.age} />
            <SummaryItem label="Land/stad" value={formData.location} />
            <SummaryItem label={t("Språk", "Languages")} value={finalLanguages} />
            <SummaryItem label="Erfarenhet (tid)" value={formData.experienceTime} />
            <SummaryItem label={t("System", "Systems")} value={finalSystems} />
            <SummaryItem label="Antal sessions" value={formData.sessionCount} />
            <SummaryItem label={t("Spelstil", "Play style")} value={formData.playStyle} />
            <SummaryItem label="Balans (RP vs Combat)" value={formData.balance} />
            <SummaryItem label={t("Format", "Format")} value={formData.format} />
            <SummaryItem label={t("IRL Stad/Område", "IRL city/area")} value={formData.irlContent} />
            <SummaryItem label="Visuell presentation" value={formData.visuals} />
            <SummaryItem label={t("Verktyg", "Tools")} value={finalTools} />
            <SummaryItem label={t("Typ av sessions", "Session type")} value={formData.sessionType} />
            <SummaryItem label={t("Sessionslängd", "Session length")} value={formData.sessionLength} />
            <SummaryItem label="Ta betalt?" value={formData.wantsPayment} />
            {formData.wantsPayment !== "Nej" && <SummaryItem label={t("Pris", "Price")} value={`${formData.price} kr`} />}
            <SummaryItem label="Gratis prova-på" value={formData.freeTrial} />
            <SummaryItem label={t("Speltider", "Play times")} value={formData.playTimes} />
            <SummaryItem label={t("Frekvens", "Frequency")} value={formData.frequency} />
            <SummaryItem label="Riktar sig till" value={formData.targetPlayers} />
            <SummaryItem label="För nya spelare?" value={formData.guideNew} />
            <SummaryItem label="Ton på spelet" value={formData.gameTone} />
            <SummaryItem label="Regelstriktness" value={formData.ruleStrictness} />
            <SummaryItem label={t("Konflikthantering", "Conflict handling")} value={formData.conflictHandling} />
            <SummaryItem label="Presentation/Bio" value={formData.presentation} />
            {profilePicName && <SummaryItem label="Profilbild" value={profilePicName} />}
          </div>

          {/* Contact & consent */}
          <div
            style={{
              background: "rgba(7,5,10,0.5)",
              borderRadius: "10px",
              border: "1px solid rgba(201,160,48,0.12)",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--gold)",
                margin: "0 0 20px",
              }}
            >
              {t("📬 Kontakt & Samtycke", "📬 Contact & Consent")}
            </h3>

            <div style={{ display: "grid", gap: "18px" }}>
              <FieldGroup label={t("Hur vill du bli kontaktad? *", "How do you want to be contacted? *")} error={errors.contactMethod}>
                <PillGroup
                  options={["Discord", "E-post", "Telefon"]}
                  selected={formData.contactMethod}
                  onToggle={v => { set("contactMethod", v); setErrors(prev => ({ ...prev, contactMethod: "", contactDiscord: "", contactEmail: "", contactPhone: "" })); }}
                />
              </FieldGroup>

              {formData.contactMethod === "Discord" && (
                <FieldGroup label={t("Discord-namn *", "Discord name *")} error={errors.contactDiscord}>
                  <input className={`rfr-input${errors.contactDiscord ? " error" : ""}`} type="text" value={formData.contactDiscord} onChange={e => set("contactDiscord", e.target.value)} />
                </FieldGroup>
              )}
              {formData.contactMethod === "E-post" && (
                <FieldGroup label={t("E-postadress *", "Email address *")} error={errors.contactEmail}>
                  <input className={`rfr-input${errors.contactEmail ? " error" : ""}`} type="email" value={formData.contactEmail} onChange={e => set("contactEmail", e.target.value)} />
                </FieldGroup>
              )}
              {formData.contactMethod === "Telefon" && (
                <FieldGroup label={t("Telefonnummer *", "Phone number *")} error={errors.contactPhone}>
                  <input className={`rfr-input${errors.contactPhone ? " error" : ""}`} type="tel" value={formData.contactPhone} onChange={e => set("contactPhone", e.target.value)} />
                </FieldGroup>
              )}

              <div
                style={{
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(201,160,48,0.1)",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ position: "relative", flexShrink: 0, marginTop: "2px" }}>
                    <input
                      type="checkbox"
                      style={{ appearance: "none", width: "20px", height: "20px", borderRadius: "5px", border: "1px solid rgba(201,160,48,0.35)", background: "rgba(7,5,10,0.8)", cursor: "pointer", transition: "all 0.18s" }}
                      checked={formData.consentGiven}
                      onChange={e => { setFormData(prev => ({ ...prev, consentGiven: e.target.checked })); if (e.target.checked) setErrors(prev => ({ ...prev, consentGiven: "" })); }}
                    />
                    {formData.consentGiven && (
                      <svg
                        style={{ position: "absolute", top: "3px", left: "3px", pointerEvents: "none", color: "var(--gold)" }}
                        width="14" height="10" viewBox="0 0 14 10" fill="none"
                      >
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ color: "var(--text)", fontSize: "15px", fontFamily: "var(--font-body)" }}>
                      {t("Jag godkänner att Roll for Roleplay kontaktar mig via vald kontaktmetod angående min ansökan. *", "I consent to Roll for Roleplay contacting me via my chosen method regarding my application. *")}
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>
                      {t("Vi använder endast dina uppgifter för att hantera din ansökan.", "We only use your details to process your application.")}
                    </div>
                  </div>
                </label>
                {errors.consentGiven && <div className="rfr-error" style={{ marginTop: "8px" }}>{errors.consentGiven}</div>}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="btn-secondary"
              onClick={() => { setStep("form"); window.scrollTo(0, 0); }}
              style={{ fontSize: "11px" }}
            >
{t("← Gå tillbaka & redigera", "← Go back & edit")}
            </button>
            <button className="btn-primary" onClick={handleFinalSubmit} style={{ fontSize: "12px" }}>
{t("📝  Skicka in ansökan", "📝  Submit application")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
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
          padding: "18px 0",
          marginBottom: "28px",
        }}
      >
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
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 900,
                letterSpacing: "0.06em",
                color: "var(--gold)",
                margin: 0,
              }}
            >
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
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "15px" }}>
            {headerContent.description}
          </p>
          {isSuperAdmin && (
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

      <div style={{ display: "grid", gap: "18px" }}>
        {/* Grundinfo */}
        <SectionCard icon="🌍" title={t("Grundläggande information", "Basic information")}>
          <FieldGroup label={t("Namn *", "Name *")} error={errors.name}>
            <input className={`rfr-input${errors.name ? " error" : ""}`} type="text" value={formData.name} onChange={e => set("name", e.target.value)} />
          </FieldGroup>
          <FieldGroup label={t("Ålder *", "Age *")} error={errors.age}>
            <input className={`rfr-input${errors.age ? " error" : ""}`} type="text" value={formData.age} onChange={e => set("age", e.target.value)} />
          </FieldGroup>
          <FieldGroup label={t("Stad *", "City *")} error={errors.location}>
            <input className={`rfr-input${errors.location ? " error" : ""}`} type="text" value={formData.location} onChange={e => set("location", e.target.value)} />
          </FieldGroup>
          <FieldGroup label={t("Språk *", "Language *")} error={errors.languages}>
            <PillGroup multi options={["Svenska", "Engelska", "Annat"]} selected={formData.languages} onToggle={v => toggle("languages", v)} />
            {formData.languages.includes("Annat") && (
              <input className={`rfr-input${errors.otherLanguage ? " error" : ""}`} type="text" placeholder={t("Specificera...", "Specify...")} style={{ marginTop: "10px" }} value={formData.otherLanguage} onChange={e => set("otherLanguage", e.target.value)} />
            )}
            {errors.otherLanguage && <div className="rfr-error">{errors.otherLanguage}</div>}
          </FieldGroup>
        </SectionCard>

        {/* Erfarenhet */}
        <SectionCard icon="🎲" title={t("Erfarenhet som spelledare", "Experience as GM")}>
          <FieldGroup label={t("Hur länge har du varit spelledare? *", "How long have you been a GM? *")} error={errors.experienceTime}>
            <input className={`rfr-input${errors.experienceTime ? " error" : ""}`} type="text" value={formData.experienceTime} onChange={e => set("experienceTime", e.target.value)} />
          </FieldGroup>
          <FieldGroup label={t("Vilka system har du lett spel i? *", "Which systems have you run? *")} error={errors.systems}>
            <PillGroup multi options={["D&D 5e (2014 / 2024)", "Pathfinder", "Call of Cthulhu", "LOTR Roleplay", "Annat"]} selected={formData.systems} onToggle={v => toggle("systems", v)} />
            {formData.systems.includes("Annat") && (
              <input className={`rfr-input${errors.otherSystem ? " error" : ""}`} type="text" placeholder={t("Vilket system?", "Which system?")} style={{ marginTop: "10px" }} value={formData.otherSystem} onChange={e => set("otherSystem", e.target.value)} />
            )}
            {errors.otherSystem && <div className="rfr-error">{errors.otherSystem}</div>}
          </FieldGroup>
          <FieldGroup label={t("Hur många spelpass har du ungefär lett? *", "Roughly how many sessions have you run? *")} error={errors.sessionCount}>
            <input className={`rfr-input${errors.sessionCount ? " error" : ""}`} type="text" value={formData.sessionCount} onChange={e => set("sessionCount", e.target.value)} />
          </FieldGroup>
        </SectionCard>

        {/* Spelstil */}
        <SectionCard icon="🎭" title={t("Din spelstil", "Your play style")}>
          <FieldGroup label={t("Hur skulle du beskriva din spelstil? (flervalsval) *", "How would you describe your play style? (multi-select) *")} error={errors.playStyle}>
            <PillGroup multi options={["🎭 Roleplay-fokuserad", "⚔️ Combat-fokuserad", "🧠 Berättelse & narrativ", "🧩 Pussel & utforskning", "🎲 Avslappnad / humor", "🧟 Mörk / seriös"]} selected={formData.playStyle} onToggle={v => toggle("playStyle", v)} />
          </FieldGroup>
          <FieldGroup label={t("Hur balanserar du rollspel (RP) vs strid (combat)? *", "How do you balance roleplay vs combat? *")} error={errors.balance}>
            <PillGroup options={["Mest rollspel", "Blandat", "Mest strid"]} selected={formData.balance} onToggle={v => set("balance", v)} />
          </FieldGroup>
        </SectionCard>

        {/* Hur du spelar */}
        <SectionCard icon="🗺️" title={t("Hur du spelleder", "How you GM")}>
          <FieldGroup label={t("Vilka format kan du spelleda i? *", "Which formats can you GM in? *")} error={errors.format}>
            <PillGroup options={["Online", "På plats (IRL)", "Båda"]} selected={formData.format} onToggle={v => set("format", v)} />
            {(formData.format === "På plats (IRL)" || formData.format === "Båda") && (
              <div style={{ marginTop: "10px" }}>
                <input className={`rfr-input${errors.irlContent ? " error" : ""}`} type="text" placeholder={t("Om på plats (IRL), vilken stad/vilket område? *", "If in person (IRL), which city/area? *")} value={formData.irlContent} onChange={e => set("irlContent", e.target.value)} />
                {errors.irlContent && <div className="rfr-error">{errors.irlContent}</div>}
              </div>
            )}
          </FieldGroup>
          <FieldGroup label={t("Hur presenterar du spelet visuellt? *", "How do you present the game visually? *")} error={errors.visuals}>
            <PillGroup multi options={["Theater of the Mind (berättande)", "Digital battlemap (t.ex. VTT)", "Figurer & terräng (på plats)", "Mix"]} selected={formData.visuals} onToggle={v => toggle("visuals", v)} />
          </FieldGroup>
          <FieldGroup label={t("Vilka verktyg använder du? (valfritt)", "Which tools do you use? (optional)")}>
            <PillGroup multi options={["Roll20", "Foundry", "Discord", "D&D Beyond", "Annat"]} selected={formData.tools} onToggle={v => toggle("tools", v)} />
            {formData.tools.includes("Annat") && (
              <input className="rfr-input" type="text" placeholder={t("Vilka andra verktyg?", "Which other tools?")} style={{ marginTop: "10px" }} value={formData.otherTool} onChange={e => set("otherTool", e.target.value)} />
            )}
          </FieldGroup>
        </SectionCard>

        {/* Sessionsupplägg */}
        <SectionCard icon="⏱️" title={t("Sessionsupplägg", "Session setup")}>
          <FieldGroup label={t("Vilka typer av sessions erbjuder du? *", "What types of sessions do you offer? *")} error={errors.sessionType}>
            <PillGroup options={["One-shots", "Kampanjer", "Båda"]} selected={formData.sessionType} onToggle={v => set("sessionType", v)} />
          </FieldGroup>
          <FieldGroup label={t("Hur långa är dina spelpass i genomsnitt? *", "How long are your sessions on average? *")} error={errors.sessionLength}>
            <input className={`rfr-input${errors.sessionLength ? " error" : ""}`} type="text" placeholder={t("T.ex. 3–4 timmar", "E.g. 3–4 hours")} value={formData.sessionLength} onChange={e => set("sessionLength", e.target.value)} />
          </FieldGroup>
        </SectionCard>

        {/* Betalning */}
        <SectionCard icon="💰" title={t("Betalning & Pris", "Payment & Price")}>
          <FieldGroup label={t("Vill du ta betalt för att spelleda? *", "Do you want to charge for GMing? *")} error={errors.wantsPayment}>
            <PillGroup options={["Ja", "Nej", "Ibland"]} selected={formData.wantsPayment} onToggle={v => set("wantsPayment", v)} />
            {(formData.wantsPayment === "Ja" || formData.wantsPayment === "Ibland") && (
              <div style={{ marginTop: "10px" }}>
                <input className={`rfr-input${errors.price ? " error" : ""}`} type="text" placeholder={t("Pris per spelare (kr)", "Price per player (kr)")} value={formData.price} onChange={e => set("price", e.target.value)} />
                {errors.price && <div className="rfr-error">{errors.price}</div>}
              </div>
            )}
          </FieldGroup>
          <FieldGroup label={t("Är du öppen för en gratis prova-på-session? *", "Are you open to a free trial session? *")} error={errors.freeTrial}>
            <PillGroup options={["Ja", "Nej"]} selected={formData.freeTrial} onToggle={v => set("freeTrial", v)} />
          </FieldGroup>
        </SectionCard>

        {/* Tillgänglighet */}
        <SectionCard icon="🌟" title={t("Tillgänglighet", "Availability")}>
          <FieldGroup label={t("När kan du oftast spela? *", "When can you usually play? *")} error={errors.playTimes}>
            <PillGroup multi options={["Vardagskvällar", "Helger", "Flexibel"]} selected={formData.playTimes} onToggle={v => toggle("playTimes", v)} />
          </FieldGroup>
          <FieldGroup label={t("Hur ofta vill du hålla spelpass? *", "How often do you want to run sessions? *")} error={errors.frequency}>
            <PillGroup options={["1 gång i veckan", "2–3 gånger i veckan", "1 gång i månaden"]} selected={formData.frequency} onToggle={v => set("frequency", v)} />
          </FieldGroup>
        </SectionCard>

        {/* Spelartyper */}
        <SectionCard icon="🧑‍🤝‍🧑" title={t("Spelartyper & preferenser", "Player types & preferences")}>
          <FieldGroup label={t("Vilka spelare riktar du dig till? *", "Which players do you target? *")} error={errors.targetPlayers}>
            <PillGroup options={["Nybörjare", "Blandade", "Erfarna"]} selected={formData.targetPlayers} onToggle={v => set("targetPlayers", v)} />
          </FieldGroup>
          <FieldGroup label={t("Är du bekväm med att guida nybörjare? *", "Are you comfortable guiding beginners? *")} error={errors.guideNew}>
            <PillGroup options={["Ja", "Nej"]} selected={formData.guideNew} onToggle={v => set("guideNew", v)} />
          </FieldGroup>
          <FieldGroup label={t("Vilken ton har dina spel vanligtvis? *", "What tone do your games usually have? *")} error={errors.gameTone}>
            <PillGroup options={["Lättsam", "Seriös", "Blandad"]} selected={formData.gameTone} onToggle={v => set("gameTone", v)} />
          </FieldGroup>
        </SectionCard>

        {/* Regler */}
        <SectionCard icon="⚖️" title={t("Regler & spelledarstil", "Rules & GM style")}>
          <FieldGroup label={t("Hur strikt följer du reglerna? *", "How strictly do you follow the rules? *")} error={errors.ruleStrictness}>
            <PillGroup options={["Rules as Written (bokstavstroget)", "Flexibel", "Rule of Cool (det häftigaste vinner)"]} selected={formData.ruleStrictness} onToggle={v => set("ruleStrictness", v)} />
          </FieldGroup>
          <FieldGroup label={t("Hur hanterar du konflikter vid bordet? *", "How do you handle conflicts at the table? *")} error={errors.conflictHandling}>
            <textarea className={`rfr-textarea${errors.conflictHandling ? " error" : ""}`} value={formData.conflictHandling} onChange={e => set("conflictHandling", e.target.value)} placeholder={t("Beskriv kort din approach...", "Briefly describe your approach...")} />
          </FieldGroup>
        </SectionCard>

        {/* Presentation */}
        <SectionCard icon="✍️" title={t("Presentation & Bio", "Presentation & Bio")}>
          <FieldGroup label={t("Beskriv dig själv som spelledare (din bio) *", "Describe yourself as a GM (your bio) *")} error={errors.presentation}>
            <textarea className={`rfr-textarea${errors.presentation ? " error" : ""}`} style={{ minHeight: "150px" }} value={formData.presentation} onChange={e => set("presentation", e.target.value)} placeholder="Berätta lite om dig själv! Vem är du bakom spelledarskärmen, varför är du en bra spelledare, vad gillar du att fokusera på etc." />
          </FieldGroup>
        </SectionCard>

        {/* Extra */}
        <SectionCard icon="🖼️" title={t("Övrigt", "Other")}>
          <FieldGroup label={t("Profilbild (valfritt)", "Profile picture (optional)")}>
            <input
              type="file"
              accept="image/*"
              style={{ color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "15px" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) setProfilePicName(f.name); }}
            />
          </FieldGroup>
        </SectionCard>

        {/* Sticky footer CTA */}
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
                {t("Redo att granska din ansökan?", "Ready to review your application?")}
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)" }}>{t("Se över dina svar innan du skickar in.", "Review your answers before submitting.")}</div>
            </div>
            <button className="btn-primary" onClick={handleProceed} style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
{t("Granska ansökan →", "Review application →")}
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
{t("⚠ Vänligen fyll i alla obligatoriska fält", "⚠ Please fill in all required fields")}
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
                  {t("Redigera rubrik", "Edit heading")}
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
                    localStorage.setItem("rfr_apply_header", JSON.stringify(updated));
                    setEditingHeaderField(null);
                  }
                }}
                className="flex flex-col gap-4 text-left font-body"
              >
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">
                    {editingHeaderField.key === "eyebrow" ? t("Ögonbryn", "Eyebrow") : editingHeaderField.key === "title" ? t("Titel", "Title") : t("Beskrivning", "Description")}
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