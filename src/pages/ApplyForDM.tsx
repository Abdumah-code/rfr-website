import { useState } from "react";

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
            {opt}
          </div>
        ))}
      </div>
      {error && <div className="rfr-error" style={{ marginTop: "6px" }}>{error}</div>}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ApplyForDM() {
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
    if (!formData.name.trim()) e.name = "Namn krävs";
    if (!formData.age.trim()) e.age = "Ålder krävs";
    if (!formData.location.trim()) e.location = "Land/stad krävs";
    if (formData.languages.length === 0) e.languages = "Välj minst ett språk";
    if (formData.languages.includes("Annat") && !formData.otherLanguage.trim()) e.otherLanguage = "Specificera språk";
    if (!formData.experienceTime.trim()) e.experienceTime = "Erfarenhet krävs";
    if (formData.systems.length === 0) e.systems = "Välj minst ett system";
    if (formData.systems.includes("Annat") && !formData.otherSystem.trim()) e.otherSystem = "Specificera system";
    if (!formData.sessionCount.trim()) e.sessionCount = "Antal sessions krävs";
    if (formData.playStyle.length === 0) e.playStyle = "Välj minst en spelstil";
    if (!formData.balance) e.balance = "Välj balans";
    if (!formData.format) e.format = "Välj format";
    if ((formData.format === "IRL" || formData.format === "Båda") && !formData.irlContent.trim()) e.irlContent = "Ange stad/område";
    if (formData.visuals.length === 0) e.visuals = "Välj minst ett visuellt format";
    if (!formData.sessionType) e.sessionType = "Välj typ av sessions";
    if (!formData.sessionLength.trim()) e.sessionLength = "Ange sessionslängd";
    if (!formData.wantsPayment) e.wantsPayment = "Välj betalningsalternativ";
    if ((formData.wantsPayment === "Ja" || formData.wantsPayment === "Ibland") && !formData.price.trim()) e.price = "Ange pris";
    if (!formData.freeTrial) e.freeTrial = "Välj alternativ";
    if (formData.playTimes.length === 0) e.playTimes = "Välj minst en tid";
    if (!formData.frequency) e.frequency = "Välj frekvens";
    if (!formData.targetPlayers) e.targetPlayers = "Välj spelartyp";
    if (!formData.guideNew) e.guideNew = "Välj alternativ";
    if (!formData.gameTone) e.gameTone = "Välj ton";
    if (!formData.ruleStrictness) e.ruleStrictness = "Välj regelstriktness";
    if (!formData.conflictHandling.trim()) e.conflictHandling = "Beskriv hur du hanterar konflikter";
    if (!formData.presentation.trim()) e.presentation = "Bion är obligatorisk";
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
    if (!validateForm()) { alert("Vänligen fyll i alla obligatoriska fält."); return; }
    setErrors({});
    setStep("summary");
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = () => {
    const e: Record<string, string> = {};
    if (!formData.contactMethod) e.contactMethod = "Välj hur du vill bli kontaktad";
    if (formData.contactMethod === "Discord" && !formData.contactDiscord.trim()) e.contactDiscord = "Ange ditt Discord-namn";
    if (formData.contactMethod === "E-post" && !formData.contactEmail.trim()) e.contactEmail = "Ange din e-postadress";
    if (formData.contactMethod === "Telefon" && !formData.contactPhone.trim()) e.contactPhone = "Ange ditt telefonnummer";
    if (!formData.consentGiven) e.consentGiven = "Samtycke krävs för att skicka ansökan";
    if (Object.keys(e).length > 0) {
      setErrors(e);
      window.scrollTo(0, document.body.scrollHeight);
      alert("Vänligen fyll i dina kontaktuppgifter och godkänn villkoren.");
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
            Tack för din ansökan!
          </h1>
          <p style={{ color: "var(--muted)", margin: 0 }}>Vi kollar igenom den och hör av oss snart!</p>
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
            Sammanfattning av din ansökan
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
            <SummaryItem label="Namn" value={formData.name} />
            <SummaryItem label="Ålder" value={formData.age} />
            <SummaryItem label="Land/stad" value={formData.location} />
            <SummaryItem label="Språk" value={finalLanguages} />
            <SummaryItem label="Erfarenhet (tid)" value={formData.experienceTime} />
            <SummaryItem label="System" value={finalSystems} />
            <SummaryItem label="Antal sessions" value={formData.sessionCount} />
            <SummaryItem label="Spelstil" value={formData.playStyle} />
            <SummaryItem label="Balans (RP vs Combat)" value={formData.balance} />
            <SummaryItem label="Format" value={formData.format} />
            <SummaryItem label="IRL Stad/Område" value={formData.irlContent} />
            <SummaryItem label="Visuell presentation" value={formData.visuals} />
            <SummaryItem label="Verktyg" value={finalTools} />
            <SummaryItem label="Typ av sessions" value={formData.sessionType} />
            <SummaryItem label="Sessionslängd" value={formData.sessionLength} />
            <SummaryItem label="Ta betalt?" value={formData.wantsPayment} />
            {formData.wantsPayment !== "Nej" && <SummaryItem label="Pris" value={`${formData.price} kr`} />}
            <SummaryItem label="Gratis prova-på" value={formData.freeTrial} />
            <SummaryItem label="Speltider" value={formData.playTimes} />
            <SummaryItem label="Frekvens" value={formData.frequency} />
            <SummaryItem label="Riktar sig till" value={formData.targetPlayers} />
            <SummaryItem label="För nya spelare?" value={formData.guideNew} />
            <SummaryItem label="Ton på spelet" value={formData.gameTone} />
            <SummaryItem label="Regelstriktness" value={formData.ruleStrictness} />
            <SummaryItem label="Konflikthantering" value={formData.conflictHandling} />
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
              📬 Kontakt &amp; Samtycke
            </h3>

            <div style={{ display: "grid", gap: "18px" }}>
              <FieldGroup label="Hur vill du bli kontaktad? *" error={errors.contactMethod}>
                <PillGroup
                  options={["Discord", "E-post", "Telefon"]}
                  selected={formData.contactMethod}
                  onToggle={v => { set("contactMethod", v); setErrors(prev => ({ ...prev, contactMethod: "", contactDiscord: "", contactEmail: "", contactPhone: "" })); }}
                />
              </FieldGroup>

              {formData.contactMethod === "Discord" && (
                <FieldGroup label="Discord-namn *" error={errors.contactDiscord}>
                  <input className={`rfr-input${errors.contactDiscord ? " error" : ""}`} type="text" value={formData.contactDiscord} onChange={e => set("contactDiscord", e.target.value)} />
                </FieldGroup>
              )}
              {formData.contactMethod === "E-post" && (
                <FieldGroup label="E-postadress *" error={errors.contactEmail}>
                  <input className={`rfr-input${errors.contactEmail ? " error" : ""}`} type="email" value={formData.contactEmail} onChange={e => set("contactEmail", e.target.value)} />
                </FieldGroup>
              )}
              {formData.contactMethod === "Telefon" && (
                <FieldGroup label="Telefonnummer *" error={errors.contactPhone}>
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
                      Jag godkänner att Roll for Roleplay kontaktar mig via vald kontaktmetod angående min ansökan. *
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>
                      Vi använder endast dina uppgifter för att hantera din ansökan.
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
              ← Tillbaka &amp; Redigera
            </button>
            <button className="btn-primary" onClick={handleFinalSubmit} style={{ fontSize: "12px" }}>
              📝 &nbsp;Skicka ansökan
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
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 900,
            letterSpacing: "0.06em",
            color: "var(--gold)",
            margin: "0 0 4px",
          }}
        >
          Apply for DM
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "15px" }}>
          Vill du bli en del av RFR DM Team? Fyll i ansökan nedan!
        </p>
      </div>

      <div style={{ display: "grid", gap: "18px" }}>
        {/* Grundinfo */}
        <SectionCard icon="🌍" title="Grundinfo">
          <FieldGroup label="Namn *" error={errors.name}>
            <input className={`rfr-input${errors.name ? " error" : ""}`} type="text" value={formData.name} onChange={e => set("name", e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Ålder *" error={errors.age}>
            <input className={`rfr-input${errors.age ? " error" : ""}`} type="text" value={formData.age} onChange={e => set("age", e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Stad *" error={errors.location}>
            <input className={`rfr-input${errors.location ? " error" : ""}`} type="text" value={formData.location} onChange={e => set("location", e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Språk *" error={errors.languages}>
            <PillGroup multi options={["Svenska", "Engelska", "Annat"]} selected={formData.languages} onToggle={v => toggle("languages", v)} />
            {formData.languages.includes("Annat") && (
              <input className={`rfr-input${errors.otherLanguage ? " error" : ""}`} type="text" placeholder="Specificera..." style={{ marginTop: "10px" }} value={formData.otherLanguage} onChange={e => set("otherLanguage", e.target.value)} />
            )}
            {errors.otherLanguage && <div className="rfr-error">{errors.otherLanguage}</div>}
          </FieldGroup>
        </SectionCard>

        {/* Erfarenhet */}
        <SectionCard icon="🎲" title="Erfarenhet som DM">
          <FieldGroup label="Hur länge har du varit spelledare? *" error={errors.experienceTime}>
            <input className={`rfr-input${errors.experienceTime ? " error" : ""}`} type="text" value={formData.experienceTime} onChange={e => set("experienceTime", e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Vilka system har du lett spel i? *" error={errors.systems}>
            <PillGroup multi options={["D&D 5e (2014 / 2024)", "Pathfinder", "Call of Cthulhu", "LOTR Roleplay", "Annat"]} selected={formData.systems} onToggle={v => toggle("systems", v)} />
            {formData.systems.includes("Annat") && (
              <input className={`rfr-input${errors.otherSystem ? " error" : ""}`} type="text" placeholder="Vilket system?" style={{ marginTop: "10px" }} value={formData.otherSystem} onChange={e => set("otherSystem", e.target.value)} />
            )}
            {errors.otherSystem && <div className="rfr-error">{errors.otherSystem}</div>}
          </FieldGroup>
          <FieldGroup label="Hur många sessions har du ungefär hållit? *" error={errors.sessionCount}>
            <input className={`rfr-input${errors.sessionCount ? " error" : ""}`} type="text" value={formData.sessionCount} onChange={e => set("sessionCount", e.target.value)} />
          </FieldGroup>
        </SectionCard>

        {/* Spelstil */}
        <SectionCard icon="🎭" title="Din spelstil">
          <FieldGroup label="Hur skulle du beskriva din stil? (flerval) *" error={errors.playStyle}>
            <PillGroup multi options={["🎭 Roleplay-fokuserad", "⚔️ Combat-fokuserad", "🧠 Story & narrativ", "🧩 Pussel & exploration", "🎲 Casual / humor", "🧟 Dark / serious"]} selected={formData.playStyle} onToggle={v => toggle("playStyle", v)} />
          </FieldGroup>
          <FieldGroup label="Hur balanserar du RP vs combat? *" error={errors.balance}>
            <PillGroup options={["Mest RP", "Mix", "Mest combat"]} selected={formData.balance} onToggle={v => set("balance", v)} />
          </FieldGroup>
        </SectionCard>

        {/* Hur du spelar */}
        <SectionCard icon="🗺️" title="Hur du spelar">
          <FieldGroup label="Vilka format kan du köra? *" error={errors.format}>
            <PillGroup options={["Online", "IRL", "Båda"]} selected={formData.format} onToggle={v => set("format", v)} />
            {(formData.format === "IRL" || formData.format === "Båda") && (
              <div style={{ marginTop: "10px" }}>
                <input className={`rfr-input${errors.irlContent ? " error" : ""}`} type="text" placeholder="Om IRL, vilken stad/område? *" value={formData.irlContent} onChange={e => set("irlContent", e.target.value)} />
                {errors.irlContent && <div className="rfr-error">{errors.irlContent}</div>}
              </div>
            )}
          </FieldGroup>
          <FieldGroup label="Hur presenterar du spelet visuellt? *" error={errors.visuals}>
            <PillGroup multi options={["Theater of the Mind", "Battlemap (digital)", "Minis & terräng (IRL)", "Mix"]} selected={formData.visuals} onToggle={v => toggle("visuals", v)} />
          </FieldGroup>
          <FieldGroup label="Vilka verktyg använder du? (valfri)">
            <PillGroup multi options={["Roll20", "Foundry", "Discord", "D&D Beyond", "Annat"]} selected={formData.tools} onToggle={v => toggle("tools", v)} />
            {formData.tools.includes("Annat") && (
              <input className="rfr-input" type="text" placeholder="Vilka andra verktyg?" style={{ marginTop: "10px" }} value={formData.otherTool} onChange={e => set("otherTool", e.target.value)} />
            )}
          </FieldGroup>
        </SectionCard>

        {/* Sessionsupplägg */}
        <SectionCard icon="⏱️" title="Sessionsupplägg">
          <FieldGroup label="Vilka typer av sessions erbjuder du? *" error={errors.sessionType}>
            <PillGroup options={["One-shots", "Kampanjer", "Båda"]} selected={formData.sessionType} onToggle={v => set("sessionType", v)} />
          </FieldGroup>
          <FieldGroup label="Hur långa är dina sessions? *" error={errors.sessionLength}>
            <input className={`rfr-input${errors.sessionLength ? " error" : ""}`} type="text" placeholder="T.ex. 3-4 timmar" value={formData.sessionLength} onChange={e => set("sessionLength", e.target.value)} />
          </FieldGroup>
        </SectionCard>

        {/* Betalning */}
        <SectionCard icon="💰" title="Betalning">
          <FieldGroup label="Vill du ta betalt? *" error={errors.wantsPayment}>
            <PillGroup options={["Ja", "Nej", "Ibland"]} selected={formData.wantsPayment} onToggle={v => set("wantsPayment", v)} />
            {(formData.wantsPayment === "Ja" || formData.wantsPayment === "Ibland") && (
              <div style={{ marginTop: "10px" }}>
                <input className={`rfr-input${errors.price ? " error" : ""}`} type="text" placeholder="Pris per spelare (kr)" value={formData.price} onChange={e => set("price", e.target.value)} />
                {errors.price && <div className="rfr-error">{errors.price}</div>}
              </div>
            )}
          </FieldGroup>
          <FieldGroup label="Är du öppen för gratis prova-på sessioner? *" error={errors.freeTrial}>
            <PillGroup options={["Ja", "Nej"]} selected={formData.freeTrial} onToggle={v => set("freeTrial", v)} />
          </FieldGroup>
        </SectionCard>

        {/* Tillgänglighet */}
        <SectionCard icon="🌟" title="Tillgänglighet">
          <FieldGroup label="När spelar du oftast? *" error={errors.playTimes}>
            <PillGroup multi options={["Vardagar kväll", "Helger", "Flexibel"]} selected={formData.playTimes} onToggle={v => toggle("playTimes", v)} />
          </FieldGroup>
          <FieldGroup label="Hur ofta vill du hålla sessions? *" error={errors.frequency}>
            <PillGroup options={["1 gång / vecka", "2–3 gånger / vecka", "1 gång per månad"]} selected={formData.frequency} onToggle={v => set("frequency", v)} />
          </FieldGroup>
        </SectionCard>

        {/* Spelartyper */}
        <SectionCard icon="🧑‍🤝‍🧑" title="Spelartyper & preferenser">
          <FieldGroup label="Vilka spelare riktar du dig till? *" error={errors.targetPlayers}>
            <PillGroup options={["Nybörjare", "Blandat", "Erfarna"]} selected={formData.targetPlayers} onToggle={v => set("targetPlayers", v)} />
          </FieldGroup>
          <FieldGroup label="Är du bekväm med att guida nya spelare? *" error={errors.guideNew}>
            <PillGroup options={["Ja", "Nej"]} selected={formData.guideNew} onToggle={v => set("guideNew", v)} />
          </FieldGroup>
          <FieldGroup label="Vilken ton har dina spel? *" error={errors.gameTone}>
            <PillGroup options={["Lättsam", "Seriös", "Mix"]} selected={formData.gameTone} onToggle={v => set("gameTone", v)} />
          </FieldGroup>
        </SectionCard>

        {/* Regler */}
        <SectionCard icon="⚖️" title="Regler & DM-approach">
          <FieldGroup label="Hur strikt följer du regler? *" error={errors.ruleStrictness}>
            <PillGroup options={["Rules as Written", "Flexibel", "Rule of Cool"]} selected={formData.ruleStrictness} onToggle={v => set("ruleStrictness", v)} />
          </FieldGroup>
          <FieldGroup label="Hur hanterar du konflikter vid bordet? *" error={errors.conflictHandling}>
            <textarea className={`rfr-textarea${errors.conflictHandling ? " error" : ""}`} value={formData.conflictHandling} onChange={e => set("conflictHandling", e.target.value)} placeholder="Beskriv kort din approach..." />
          </FieldGroup>
        </SectionCard>

        {/* Presentation */}
        <SectionCard icon="✍️" title="Presentation">
          <FieldGroup label="Beskriv dig själv som DM (typ bio) *" error={errors.presentation}>
            <textarea className={`rfr-textarea${errors.presentation ? " error" : ""}`} style={{ minHeight: "150px" }} value={formData.presentation} onChange={e => set("presentation", e.target.value)} placeholder="Berätta lite om dig själv! Vem är du bakom systemet, varför du är en bra DM, vad du gillar etc." />
          </FieldGroup>
        </SectionCard>

        {/* Extra */}
        <SectionCard icon="🖼️" title="Extra">
          <FieldGroup label="Profilbild (valfri)">
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
                Redo att granska?
              </div>
              <div style={{ fontSize: "14px", color: "var(--muted)" }}>Se över dina svar innan du skickar.</div>
            </div>
            <button className="btn-primary" onClick={handleProceed} style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
              Gå vidare →
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