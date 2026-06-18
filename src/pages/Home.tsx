import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HomeContent {
  eyebrow: string;
  title1: string;
  title2: string;
  description: string;
  cta1: string;
  cta2: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;
  aboutTitle: string;
  aboutDesc: string;
  metric1Num: string;
  metric1Label: string;
  metric2Num: string;
  metric2Label: string;
  metric3Num: string;
  metric3Label: string;
}

const defaultContent: HomeContent = {
  eyebrow: "Välkommen till bordet",
  title1: "Roll for",
  title2: "Roleplay",
  description: "Vi bygger ett community för episka äventyr, erfarna spelledare och en seriös men varm stämning. Din plats vid bordet väntar.",
  cta1: "Se äventyr",
  cta2: "Bli spelledare",
  feat1Title: "Episka Äventyr",
  feat1Desc: "Handgjorda kampanjer och one-shots ledda av erfarna spelledare. Varje spelpass berättar en historia värd att minnas.",
  feat2Title: "Skickliga Spelledare",
  feat2Desc: "Vårt DM-team är engagerat, passionerat och dedikerat till att skapa fängslande, spelarfokuserade upplevelser vid varje bord.",
  feat3Title: "Gemenskap",
  feat3Desc: "En seriös men varm gemenskap som värdesätter bra berättande, genomtänkt rollspel och att ställa upp för sin grupp.",
  aboutTitle: "Vilka vi är",
  aboutDesc: "Roll for Roleplay är en gemenskap byggd för dem som tar sina äventyr på allvar. Vi matchar spelare med skickliga spelledare, skapar minnen vid bordet och håller en seriös men välkomnande stämning. Hur spelpassen fungerar, vad vi värdesätter, och varför RFR är annorlunda — det är vad vi handlar om.",
  metric1Num: "50+",
  metric1Label: "Spelpass körda",
  metric2Num: "8+",
  metric2Label: "Aktiva spelledare",
  metric3Num: "100+",
  metric3Label: "Spelare välkomnade"
};

export default function Home() {
  const { isSuperAdmin } = useOutletContext<{ isSuperAdmin: boolean }>();
  const [content, setContent] = useState<HomeContent>(() => {
    const saved = localStorage.getItem("rfr_home_content");
    return saved ? JSON.parse(saved) : defaultContent;
  });

  const [editingContent, setEditingContent] = useState<{
    key: keyof HomeContent;
    value: string;
    isTextarea: boolean;
  } | null>(null);

  const handleEditContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContent) {
      const updated = { ...content, [editingContent.key]: editingContent.value };
      setContent(updated);
      localStorage.setItem("rfr_home_content", JSON.stringify(updated));
      setEditingContent(null);
    }
  };

  const AdminEditButton = ({
    contentKey,
    isTextarea = false,
    className = ""
  }: {
    contentKey: keyof HomeContent;
    isTextarea?: boolean;
    className?: string;
  }) => {
    if (!isSuperAdmin) return null;
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEditingContent({ key: contentKey, value: content[contentKey], isTextarea });
        }}
        className={`absolute -top-3 -right-6 text-gold/40 hover:text-gold bg-[#0b0811] hover:bg-black rounded-full p-1.5 border border-gold/20 hover:border-gold/50 transition-all duration-300 z-20 shadow-md ${className}`}
        title="Redigera text"
      >
        <Settings className="w-3.5 h-3.5" />
      </button>
    );
  };

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
        <div style={{ marginBottom: "24px" }}>
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
              padding: "6px 16px",
              borderRadius: "100px",
              border: "1px solid rgba(201,160,48,0.25)",
              background: "rgba(201,160,48,0.06)",
              position: "relative"
            }}
          >
            <span>⚔</span>
            <span>{content.eyebrow}</span>
            <span>⚔</span>
            <AdminEditButton contentKey="eyebrow" className="top-1 -right-6" />
          </div>
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
            margin: "0 0 8px"
          }}
        >
          {content.title1}
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
            filter: "drop-shadow(0 0 30px rgba(201,160,48,0.3))"
          }}
        >
          {content.title2}
        </h1>

        {/* Description */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              maxWidth: "520px",
              margin: "0 auto 36px"
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "var(--muted)",
                lineHeight: 1.65,
                margin: 0
              }}
            >
              {content.description}
            </p>
            <AdminEditButton contentKey="description" isTextarea className="top-2 -right-8" />
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginTop: "10px" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Link to="/adventures" className="btn-primary" style={{ fontSize: "12px" }}>
              ⚔ &nbsp;{content.cta1}
            </Link>
            <AdminEditButton contentKey="cta1" className="top-1 -right-8" />
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Link to="/apply" className="btn-secondary" style={{ fontSize: "12px" }}>
              {content.cta2}
            </Link>
            <AdminEditButton contentKey="cta2" className="top-1 -right-8" />
          </div>
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
        {/* Feature 1 */}
        <div className="rfr-card" style={{ padding: "28px 26px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "28px", marginBottom: "14px", filter: "sepia(1) saturate(3) hue-rotate(10deg)" }}>
            🗡
          </div>
          <div style={{ position: "relative", display: "inline-block", alignSelf: "flex-start" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--gold)", margin: "0 0 10px" }}>
              {content.feat1Title}
            </h3>
            <AdminEditButton contentKey="feat1Title" className="top-0 -right-8" />
          </div>
          <div style={{ position: "relative", flex: 1 }}>
            <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.65, fontSize: "16px" }}>
              {content.feat1Desc}
            </p>
            <AdminEditButton contentKey="feat1Desc" isTextarea className="top-0 -right-8" />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="rfr-card" style={{ padding: "28px 26px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "28px", marginBottom: "14px", filter: "sepia(1) saturate(3) hue-rotate(10deg)" }}>
            🎭
          </div>
          <div style={{ position: "relative", display: "inline-block", alignSelf: "flex-start" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--gold)", margin: "0 0 10px" }}>
              {content.feat2Title}
            </h3>
            <AdminEditButton contentKey="feat2Title" className="top-0 -right-8" />
          </div>
          <div style={{ position: "relative", flex: 1 }}>
            <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.65, fontSize: "16px" }}>
              {content.feat2Desc}
            </p>
            <AdminEditButton contentKey="feat2Desc" isTextarea className="top-0 -right-8" />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="rfr-card" style={{ padding: "28px 26px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "28px", marginBottom: "14px", filter: "sepia(1) saturate(3) hue-rotate(10deg)" }}>
            🌍
          </div>
          <div style={{ position: "relative", display: "inline-block", alignSelf: "flex-start" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--gold)", margin: "0 0 10px" }}>
              {content.feat3Title}
            </h3>
            <AdminEditButton contentKey="feat3Title" className="top-0 -right-8" />
          </div>
          <div style={{ position: "relative", flex: 1 }}>
            <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.65, fontSize: "16px" }}>
              {content.feat3Desc}
            </p>
            <AdminEditButton contentKey="feat3Desc" isTextarea className="top-0 -right-8" />
          </div>
        </div>
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
            <div style={{ position: "relative", display: "inline-block" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text)", margin: "0 0 14px" }}>
                {content.aboutTitle}
              </h2>
              <AdminEditButton contentKey="aboutTitle" className="top-0 -right-8" />
            </div>
            <div style={{ position: "relative" }}>
              <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.7, fontSize: "17px" }}>
                {content.aboutDesc}
              </p>
              <AdminEditButton contentKey="aboutDesc" isTextarea className="top-0 -right-8" />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minWidth: "180px",
            }}
          >
            {/* Metric 1 */}
            <div
              style={{
                textAlign: "center",
                padding: "14px 20px",
                borderRadius: "10px",
                background: "rgba(201,160,48,0.06)",
                border: "1px solid rgba(201,160,48,0.14)",
                position: "relative"
              }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 900, color: "var(--gold)", lineHeight: 1, marginBottom: "4px" }}>
                  {content.metric1Num}
                </div>
                <AdminEditButton contentKey="metric1Num" className="top-0 -right-8" />
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
                  {content.metric1Label}
                </div>
                <AdminEditButton contentKey="metric1Label" className="top-0 -right-8" />
              </div>
            </div>

            {/* Metric 2 */}
            <div
              style={{
                textAlign: "center",
                padding: "14px 20px",
                borderRadius: "10px",
                background: "rgba(201,160,48,0.06)",
                border: "1px solid rgba(201,160,48,0.14)",
                position: "relative"
              }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 900, color: "var(--gold)", lineHeight: 1, marginBottom: "4px" }}>
                  {content.metric2Num}
                </div>
                <AdminEditButton contentKey="metric2Num" className="top-0 -right-8" />
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
                  {content.metric2Label}
                </div>
                <AdminEditButton contentKey="metric2Label" className="top-0 -right-8" />
              </div>
            </div>

            {/* Metric 3 */}
            <div
              style={{
                textAlign: "center",
                padding: "14px 20px",
                borderRadius: "10px",
                background: "rgba(201,160,48,0.06)",
                border: "1px solid rgba(201,160,48,0.14)",
                position: "relative"
              }}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 900, color: "var(--gold)", lineHeight: 1, marginBottom: "4px" }}>
                  {content.metric3Num}
                </div>
                <AdminEditButton contentKey="metric3Num" className="top-0 -right-8" />
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>
                  {content.metric3Label}
                </div>
                <AdminEditButton contentKey="metric3Label" className="top-0 -right-8" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Content Edit Modal */}
      <AnimatePresence>
        {editingContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingContent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="rfr-card p-8 max-w-lg w-full mx-4 relative z-10 flex flex-col bg-[#0a080f] shadow-[0_0_60px_rgba(201,160,48,0.15)]"
            >
              <h3 className="font-heading text-xl font-bold text-gold-light mb-6 tracking-wide uppercase flex items-center gap-3">
                  <Settings className="w-5 h-5" /> Redigera text
              </h3>
              
              <form onSubmit={handleEditContentSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="rfr-label text-left text-[12px] opacity-80 mb-2">Innehållsvärde</label>
                  {editingContent.isTextarea ? (
                      <textarea
                          value={editingContent.value}
                          onChange={(e) => setEditingContent({...editingContent, value: e.target.value})}
                          className="rfr-textarea !bg-[#13101a] !border-[#2a2435] focus:!border-gold"
                          rows={4}
                          autoFocus
                      />
                  ) : (
                      <input
                          type="text"
                          value={editingContent.value}
                          onChange={(e) => setEditingContent({...editingContent, value: e.target.value})}
                          className="rfr-input !py-3 !bg-[#13101a] !border-[#2a2435] focus:!border-gold"
                          autoFocus
                      />
                  )}
                </div>

                <div className="flex gap-3 mt-2 justify-end">
                  <button type="button" onClick={() => setEditingContent(null)} className="btn-secondary">
                    Avbryt
                  </button>
                  <button type="submit" className="btn-primary shadow-[0_4px_15px_rgba(201,160,48,0.3)]">
                    Spara ändringar
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
