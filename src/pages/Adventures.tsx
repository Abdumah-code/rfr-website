import { useState, useEffect, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { adventuresData, Adventure } from "../data/adventures";
import { Plus, Edit, Trash2, X, AlertTriangle, Upload, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Extend the local interface to include imageUrl
export interface AppAdventure extends Adventure {
  imageUrl?: string | null;
}

function formatDate(iso: string) {
  if (!iso || !iso.includes("-")) return iso;
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return iso;
  return `${d}/${m}/${y}`;
}

export default function Adventures() {
  const { isSuperAdmin } = useOutletContext<{ isSuperAdmin: boolean }>();
  const [adventures, setAdventures] = useState<AppAdventure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dms, setDms] = useState<string[]>([]);
  
  // Header text states
  const [headerContent, setHeaderContent] = useState(() => {
    const saved = localStorage.getItem("rfr_adventures_header");
    return saved ? JSON.parse(saved) : {
      eyebrow: "🗺 Kommande äventyr",
      title: "Kommande Äventyr",
      description: "Klicka på \"Intresserad\" för att anmäla intresse. Fullt = låst."
    };
  });
  const [editingHeaderField, setEditingHeaderField] = useState<{
    key: "eyebrow" | "title" | "description";
    value: string;
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdventure, setEditingAdventure] = useState<AppAdventure | null>(null);
  
  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formLanguage, setFormLanguage] = useState("SV/EN");
  const [formDmSelect, setFormDmSelect] = useState("RFR DM Team");
  const [formDmCustom, setFormDmCustom] = useState("");
  const [formMaxPlayers, setFormMaxPlayers] = useState(5);
  const [formSpotsLeft, setFormSpotsLeft] = useState(5);
  const [formLocation, setFormLocation] = useState("Norrköping / Online");
  const [formInterestUrl, setFormInterestUrl] = useState("https://forms.gle/");
  const [formImageUrl, setFormImageUrl] = useState<string | null>(null);
  
  const [formError, setFormError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const adventureImageInputRef = useRef<HTMLInputElement>(null);

  const fetchAdventures = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/adventures');
      const data = await res.json();
      if (data.success && data.adventures) {
        setAdventures(data.adventures);
      } else {
        setAdventures(adventuresData);
      }
    } catch (e) {
      console.error("Failed to fetch adventures:", e);
      setAdventures(adventuresData);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDMs = async () => {
    try {
      const res = await fetch('/api/dms-list');
      const data = await res.json();
      if (data.success && data.users) {
        setDms(data.users.map((u: any) => {
          const name = u.username;
          return name.charAt(0).toUpperCase() + name.slice(1);
        }));
      }
    } catch (e) {
      console.error("Failed to fetch DMs:", e);
    }
  };

  useEffect(() => {
    fetchAdventures();
    fetchDMs();
  }, []);

  const openCreateModal = () => {
    setEditingAdventure(null);
    setFormTitle("");
    setFormDate("");
    setFormTime("18:00");
    setFormLanguage("SV/EN");
    setFormDmSelect("RFR DM Team");
    setFormDmCustom("");
    setFormMaxPlayers(5);
    setFormSpotsLeft(5);
    setFormLocation("Norrköping / Online");
    setFormInterestUrl("https://forms.gle/");
    setFormImageUrl(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (adv: AppAdventure) => {
    setEditingAdventure(adv);
    setFormTitle(adv.title);
    setFormDate(adv.date);
    setFormTime(adv.time);
    setFormLanguage(adv.language);
    
    const dmNameLower = adv.dm.toLowerCase();
    
    if (adv.dm === "RFR DM Team") {
      setFormDmSelect("RFR DM Team");
      setFormDmCustom("");
    } else {
      const match = dms.find(d => d.toLowerCase() === dmNameLower);
      if (match) {
        setFormDmSelect(match);
        setFormDmCustom("");
      } else {
        setFormDmSelect("Annat...");
        setFormDmCustom(adv.dm);
      }
    }
    
    setFormMaxPlayers(adv.maxPlayers);
    setFormSpotsLeft(adv.spotsLeft);
    setFormLocation(adv.location);
    setFormInterestUrl(adv.interestUrl);
    setFormImageUrl(adv.imageUrl || null);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleAdventureImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Bilden är för stor (max 8MB).");
      return;
    }

    setIsUploadingImage(true);
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
          setFormImageUrl(data.url);
        } else {
          alert(data.message || "Det gick inte att ladda upp bilden.");
        }
      } catch (err) {
        alert("Anslutningsfel.");
      } finally {
        setIsUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle.trim() || !formDate || !formTime || !formLanguage.trim() || !formLocation.trim() || !formInterestUrl.trim()) {
      setFormError("Vänligen fyll i alla obligatoriska fält.");
      return;
    }

    const selectedDm = formDmSelect === "Annat..." ? formDmCustom.trim() : formDmSelect;
    if (!selectedDm) {
      setFormError("Spelledare (DM) måste anges.");
      return;
    }

    if (Number(formSpotsLeft) > Number(formMaxPlayers)) {
      setFormError("Platser kvar kan inte vara fler än max antal spelare.");
      return;
    }

    const payload = {
      title: formTitle.trim(),
      date: formDate,
      time: formTime,
      language: formLanguage.trim(),
      dm: selectedDm,
      maxPlayers: Number(formMaxPlayers),
      spotsLeft: Number(formSpotsLeft),
      location: formLocation.trim(),
      interestUrl: formInterestUrl.trim(),
      imageUrl: formImageUrl
    };

    try {
      const url = editingAdventure ? `/api/adventures/${editingAdventure.id}` : '/api/adventures';
      const method = editingAdventure ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchAdventures();
      } else {
        setFormError(data.message || "Ett fel uppstod.");
      }
    } catch (err) {
      setFormError("Anslutningsfel med servern.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Är du säker på att du vill ta bort äventyret "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/adventures/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchAdventures();
      } else {
        alert(data.message || "Det gick inte att ta bort äventyret.");
      }
    } catch (err) {
      alert("Anslutningsfel.");
    }
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "10px" }}>
          <div style={{ position: "relative" }}>
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
          {isSuperAdmin && (
            <button
              onClick={openCreateModal}
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                padding: "10px 20px",
                cursor: "pointer"
              }}
            >
              <Plus className="w-4 h-4" /> Skapa nytt äventyr
            </button>
          )}
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

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "22px",
          animation: "slideInUp 0.65s ease-out 0.1s both",
        }}
      >
        {adventures.map((a, i) => {
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
                overflow: "hidden"
              }}
            >
              {a.imageUrl && (
                <div
                  style={{
                    margin: "-28px -28px 22px -28px",
                    height: "175px",
                    overflow: "hidden",
                    borderBottom: "1px solid rgba(201,160,48,0.18)",
                    position: "relative",
                  }}
                >
                  <img
                    src={a.imageUrl}
                    alt={a.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

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
                  { label: "Spelledare (DM)", value: a.dm },
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

              {/* Admin controls */}
              {isSuperAdmin && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "16px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(201, 160, 48, 0.15)",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "var(--gold)", fontFamily: "var(--font-heading)", letterSpacing: "0.05em", textTransform: "uppercase", opacity: 0.8 }}>
                    Adminverktyg
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => openEditModal(a)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/50 rounded transition-colors cursor-pointer"
                      title="Redigera äventyr"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id, a.title)}
                      className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/50 rounded transition-colors cursor-pointer"
                      title="Ta bort äventyr"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {isLoading && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)", fontFamily: "var(--font-heading)" }}>
          Laddar äventyr...
        </div>
      )}

      {!isLoading && adventures.length === 0 && (
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

      {/* Create/Edit Adventure Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)} 
              className="absolute inset-0 bg-black/85 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="rfr-card p-6 max-w-lg w-full mx-4 relative z-10 flex flex-col bg-[#0a080f] border-gold/30 shadow-[0_0_50px_rgba(201,160,48,0.15)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 border-b border-[#2a2435] pb-3">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-gold">
                  {editingAdventure ? "Redigera äventyr" : "Skapa nytt äventyr"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left font-body">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Titel *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                    placeholder="t.ex. Wolves of Vargheim"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Datum *</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Tid *</label>
                    <input
                      type="time"
                      value={formTime}
                      onChange={e => setFormTime(e.target.value)}
                      className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Språk *</label>
                    <input
                      type="text"
                      value={formLanguage}
                      onChange={e => setFormLanguage(e.target.value)}
                      className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                      placeholder="t.ex. SV/EN"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Spelledare (DM) *</label>
                    <select
                      value={formDmSelect}
                      onChange={e => setFormDmSelect(e.target.value)}
                      className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors text-slate-200"
                    >
                      <option value="RFR DM Team">RFR DM Team</option>
                      {dms.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                      <option value="Annat...">Annat (Skriv själv)...</option>
                    </select>
                  </div>
                </div>

                <AnimatePresence>
                  {formDmSelect === "Annat..." && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Ange eget DM-namn *</label>
                      <input
                        type="text"
                        value={formDmCustom}
                        onChange={e => setFormDmCustom(e.target.value)}
                        className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                        placeholder="t.ex. Matt Mercer"
                        required={formDmSelect === "Annat..."}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Max Spelare *</label>
                    <input
                      type="number"
                      min="1"
                      value={formMaxPlayers}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setFormMaxPlayers(val);
                        if (formSpotsLeft > val) {
                          setFormSpotsLeft(val);
                        }
                      }}
                      className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Platser Kvar *</label>
                    <input
                      type="number"
                      min="0"
                      max={formMaxPlayers}
                      value={formSpotsLeft}
                      onChange={e => setFormSpotsLeft(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Plats *</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                    placeholder="t.ex. Norrköping / Online"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Intresse-länk (Google Forms, etc) *</label>
                  <input
                    type="url"
                    value={formInterestUrl}
                    onChange={e => setFormInterestUrl(e.target.value)}
                    className="w-full p-2.5 bg-[#13101a] border border-[#2a2435] rounded text-slate-200 focus:outline-none focus:border-gold transition-colors"
                    placeholder="https://..."
                    required
                  />
                </div>

                {/* Adventure Image Upload Field */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wide">Bild för äventyret (valfritt)</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => adventureImageInputRef.current?.click()}
                      className="btn-secondary !py-2 !px-4 !text-[11px] font-bold flex items-center gap-2 cursor-pointer"
                      disabled={isUploadingImage}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {formImageUrl ? "Ändra bild" : "Ladda upp bild"}
                    </button>
                    {formImageUrl && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 truncate max-w-[150px]">Bild vald</span>
                        <button
                          type="button"
                          onClick={() => setFormImageUrl(null)}
                          className="text-[#E05555] hover:text-[#ff6666] text-xs cursor-pointer"
                        >
                          Ta bort
                        </button>
                      </div>
                    )}
                    {isUploadingImage && (
                      <span className="text-xs text-gold animate-pulse">Laddar upp...</span>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={adventureImageInputRef}
                    onChange={handleAdventureImageUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  {formImageUrl && (
                    <div style={{ marginTop: "10px", height: "100px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(201,160,48,0.2)" }}>
                      <img src={formImageUrl} alt="Förhandsvisning" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>

                {formError && (
                  <div className="flex items-center gap-2 text-[#E05555] text-xs mt-1 bg-[#E05555]/10 border border-[#E05555]/30 p-2.5 rounded">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex gap-3 mt-4 border-t border-[#2a2435] pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="btn-secondary w-1/2 !py-3 !text-[12px]"
                  >
                    Avbryt
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary w-1/2 !py-3 !text-[12px] font-bold"
                  >
                    {editingAdventure ? "Spara ändringar" : "Skapa äventyr"}
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
                    localStorage.setItem("rfr_adventures_header", JSON.stringify(updated));
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
