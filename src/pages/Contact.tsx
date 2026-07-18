import { useState, useRef } from "react";
import { useLang } from "../context/LangContext";
import { useOutletContext } from "react-router-dom";
import { Settings, Upload, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import defaultImage from "../components/contact_default.png";

const DEFAULT_TEXT = "Har du frågor om våra spelbord, vill veta mer om hur du ansöker som spelledare, eller vill komma i kontakt med oss? Skicka ett meddelande till oss på Discord eller e-post. Vi svarar så fort vi har klivit ut ur fängelsehålan och tvättat av oss sotet från facklorna.\n\nE-post: kontakt@roleforroleplay.se\nDiscord: @roleforroleplay\n\nVi ser fram emot att höra från dig, oavsett om du är en erfaren spelare som letar efter en ny grupp eller en DM som vill bli en del av vårt spelledarteam.";

export default function Contact() {
  const { isSuperAdmin } = useOutletContext<{ isSuperAdmin: boolean }>();
  const { lang, t } = useLang();
  
  // Header text states
  const [headerContent, setHeaderContent] = useState(() => {
    const saved = localStorage.getItem("rfr_contact_header");
    return saved ? JSON.parse(saved) : {
      eyebrow: lang === "en" ? "✉ Contact Us" : "✉ Kontakta Oss",
      title: lang === "en" ? "Contact" : "Kontakt",
      description: lang === "en" ? "Reach out to us with your questions." : "Hör av dig till oss med dina funderingar."
    };
  });
  const [editingHeaderField, setEditingHeaderField] = useState<{
    key: "eyebrow" | "title" | "description";
    value: string;
  } | null>(null);

  const [text, setText] = useState(() => {
    return localStorage.getItem("rfr_contact_text") || DEFAULT_TEXT;
  });
  
  const [imageUrl, setImageUrl] = useState(() => {
    return localStorage.getItem("rfr_contact_image") || defaultImage;
  });

  const [isEditingText, setIsEditingText] = useState(false);
  const [editText, setEditText] = useState(text);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim()) {
      setError("Texten kan inte vara tom.");
      return;
    }
    setText(editText.trim());
    localStorage.setItem("rfr_contact_text", editText.trim());
    setIsEditingText(false);
  };

  const handleImageClick = () => {
    if (isSuperAdmin && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Bilden är för stor (max 8MB).");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Image: base64Data,
            fileName: file.name,
          }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          setImageUrl(data.url);
          localStorage.setItem("rfr_contact_image", data.url);
        } else {
          alert(data.message || "Det gick inte att ladda upp bilden.");
        }
      } catch (err) {
        alert("Anslutningsfel med servern.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

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

        <div>
          <div style={{ position: "relative", marginBottom: "10px", display: "inline-block" }}>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(30px, 4.5vw, 52px)",
                fontWeight: 900,
                letterSpacing: "0.05em",
                color: "var(--text)",
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
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "17px" }}>
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

      {/* Grid Container */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "40px",
          alignItems: "center",
          animation: "slideInUp 0.65s ease-out 0.1s both",
        }}
      >
        {/* Content Block */}
        <div className="relative group p-4 rounded-xl" style={{ position: "relative" }}>
          {isSuperAdmin && (
            <button
              onClick={() => {
                setEditText(text);
                setError("");
                setIsEditingText(true);
              }}
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                background: "#0b0811",
                border: "1px solid rgba(201,160,48,0.3)",
                borderRadius: "50%",
                padding: "8px",
                cursor: "pointer",
                color: "var(--gold)",
                zIndex: 20,
              }}
              className="hover:border-gold hover:scale-105 transition-all"
              title="Redigera text"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <div
            className="rfr-card"
            style={{
              padding: "40px 35px",
              border: "1px solid rgba(201,160,48,0.15)",
              background: "rgba(10,8,15,0.45)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "22px",
                color: "var(--gold)",
                marginBottom: "20px",
                letterSpacing: "0.05em",
              }}
            >
              {t("Skriv till Värdshuset", "Write to the Tavern")}
            </h2>
            <p
              style={{
                color: "var(--text)",
                fontSize: "16px",
                lineHeight: "1.75",
                whiteSpace: "pre-wrap",
                margin: 0,
              }}
            >
              {text}
            </p>
          </div>
        </div>

        {/* Image Block */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {isSuperAdmin && (
            <button
              onClick={handleImageClick}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#0b0811",
                border: "1px solid rgba(201,160,48,0.3)",
                borderRadius: "50%",
                padding: "8px",
                cursor: "pointer",
                color: "var(--gold)",
                zIndex: 20,
              }}
              className="hover:border-gold hover:scale-105 transition-all"
              title="Ladda upp bild"
            >
              <Upload className="w-4 h-4" />
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <div
            className="rfr-card"
            onClick={handleImageClick}
            style={{
              padding: "8px",
              overflow: "hidden",
              border: "1px solid rgba(201,160,48,0.25)",
              background: "rgba(201,160,48,0.02)",
              cursor: isSuperAdmin ? "pointer" : "default",
              transition: "transform 0.3s ease, border-color 0.3s ease",
              maxWidth: "450px",
              width: "100%",
            }}
            onMouseEnter={e => {
              if (isSuperAdmin) {
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={e => {
              if (isSuperAdmin) {
                e.currentTarget.style.borderColor = "rgba(201,160,48,0.25)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <div style={{ position: "relative", paddingBottom: "100%", borderRadius: "8px", overflow: "hidden" }}>
              <img
                src={imageUrl}
                alt="Kontakt illustration"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.3s",
                  opacity: isUploading ? 0.3 : 1,
                }}
              />
              {isUploading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gold)",
                    fontFamily: "var(--font-heading)",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Laddar upp...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Text Modal */}
      <AnimatePresence>
        {isEditingText && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingText(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="rfr-card p-6 max-w-lg w-full mx-4 relative z-10 flex flex-col bg-[#0a080f] border-gold/30 shadow-[0_0_50px_rgba(201,160,48,0.15)]"
            >
              <div className="flex items-center justify-between mb-4 border-b border-[#2a2435] pb-3">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold">
                  Redigera text
                </h3>
                <button
                  onClick={() => setIsEditingText(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTextSave} className="flex flex-col gap-4 text-left font-body">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">
                    Kontaktsida text *
                  </label>
                  <textarea
                    rows={8}
                    value={editText}
                    onChange={e => {
                      setEditText(e.target.value);
                      setError("");
                    }}
                    className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors font-body resize-none"
                    placeholder="Skriv kontaktinformation här..."
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-[#E05555] text-xs mt-1 bg-[#E05555]/10 border border-[#E05555]/30 p-2.5 rounded">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-3 mt-4 border-t border-[#2a2435] pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingText(false)}
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
                    localStorage.setItem("rfr_contact_header", JSON.stringify(updated));
                    setEditingHeaderField(null);
                  }
                }}
                className="flex flex-col gap-4 text-left font-body"
              >
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">
                    {editingHeaderField.key === "eyebrow" ? "Ögonbryn (Eyebrow)" : editingHeaderField.key === "title" ? "Titel" : "Beskrivning"}
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