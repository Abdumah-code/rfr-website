import { useEffect, useState } from "react";
import { useLang } from "../context/LangContext";

// ── MUSIC PLAYER ───────────────────────────────────────────────────────────
function MusicPlayer() {
  const { t } = useLang();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    const audio = document.getElementById(
      "background-music",
    ) as HTMLAudioElement | null;

    if (!audio) return;

    audio.volume = volume;
    setIsPlaying(!audio.paused);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const toggleMusic = async () => {
    const audio = document.getElementById(
      "background-music",
    ) as HTMLAudioElement | null;

    if (!audio) {
      console.error("Background music element was not found.");
      return;
    }

    try {
      if (audio.paused) {
        audio.muted = false;
        audio.volume = volume;

        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Could not play the music:", error);
      setIsPlaying(false);
    }
  };

  const handleVolume = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);

    const audio = document.getElementById(
      "background-music",
    ) as HTMLAudioElement | null;

    if (!audio) return;

    audio.volume = newVolume;

    if (newVolume === 0) {
      audio.muted = true;
    } else {
      audio.muted = false;
    }

    /*
     * Changing the volume counts as user interaction.
     * Start the music if it is currently paused.
     */
    if (audio.paused && newVolume > 0) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Could not start music:", error);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <button
        type="button"
        onClick={toggleMusic}
        style={{
          background: isPlaying
            ? "rgba(201,160,48,0.12)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${
            isPlaying
              ? "rgba(201,160,48,0.35)"
              : "rgba(255,255,255,0.1)"
          }`,
          borderRadius: "8px",
          padding: "7px 14px",
          cursor: "pointer",
          color: isPlaying ? "var(--gold)" : "var(--muted)",
          fontFamily: "var(--font-heading)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: "7px",
          transition: "all 0.2s ease",
        }}
      >
        <span style={{ fontSize: "14px" }}>
          {isPlaying ? "🔊" : "🔇"}
        </span>

        {isPlaying
          ? t("Musik på", "Music on")
          : t("Musik av", "Music off")}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolume}
        aria-label={t("Musikvolym", "Music volume")}
        style={{
          width: "70px",
          accentColor: "var(--gold)",
          cursor: "pointer",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

// ── LANGUAGE SWITCH ────────────────────────────────────────────────────────
function LangSwitch() {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      style={{
        display: "flex", alignItems: "center", gap: "7px",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px", padding: "7px 14px", cursor: "pointer",
        color: "var(--muted)", fontFamily: "var(--font-heading)", fontSize: "11px",
        fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,48,0.3)";
        (e.currentTarget as HTMLElement).style.color = "var(--gold)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
        (e.currentTarget as HTMLElement).style.color = "var(--muted)";
      }}
    >
      <span style={{ fontSize: "14px" }}>{lang === "sv" ? "🇸🇪" : "🇬🇧"}</span>
      {lang === "sv" ? "Svenska" : "English"}
    </button>
  );
}

// ── WISH FORM ──────────────────────────────────────────────────────────────
function WishForm() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    console.log("Önskemål:", text);
    setSent(true);
    setText("");
    setTimeout(() => { setSent(false); setOpen(false); }, 2500);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: "rgba(201,160,48,0.1)", border: "1px solid rgba(201,160,48,0.3)",
          borderRadius: "8px", padding: "8px 18px", cursor: "pointer",
          color: "var(--gold)", fontFamily: "var(--font-heading)", fontSize: "11px",
          fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s",
        }}
      >
        <span>✨</span> {t("Skicka önskemål", "Send a request")}
      </button>

      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 12px)", left: 0,
          width: "300px", background: "#0f0c17",
          border: "1px solid rgba(201,160,48,0.25)", borderRadius: "12px",
          padding: "20px", boxShadow: "0 -20px 60px rgba(0,0,0,0.7)",
          zIndex: 100,
        }}>
          <div style={{
            fontFamily: "var(--font-heading)", fontSize: "12px", letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--gold)", marginBottom: "10px",
          }}>
            {t("✨ Vad önskar du dig?", "✨ What would you like?")}
          </div>
          <p style={{ color: "var(--muted)", fontSize: "13px", margin: "0 0 12px", lineHeight: 1.5 }}>
            {t(
              "Skriv gärna äventyrstyp, genre, spelledare eller annat du vill uppleva!",
              "Write adventure type, genre, game master preference or anything else!"
            )}
          </p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={t(
              "T.ex. ett skräckäventyr i Ravenloft, mer combat-focus, kortare sessions...",
              "E.g. a horror adventure in Ravenloft, more combat focus, shorter sessions..."
            )}
            rows={4}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,160,48,0.2)",
              borderRadius: "8px", padding: "10px 12px",
              color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "14px",
              resize: "vertical", outline: "none", lineHeight: 1.5,
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(201,160,48,0.5)")}
            onBlur={e => (e.target.style.borderColor = "rgba(201,160,48,0.2)")}
          />
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              style={{
                flex: 1,
                background: sent ? "rgba(80,160,80,0.2)" : "rgba(201,160,48,0.15)",
                border: `1px solid ${sent ? "rgba(80,160,80,0.4)" : "rgba(201,160,48,0.4)"}`,
                borderRadius: "8px", padding: "9px",
                color: sent ? "#6fcf6f" : "var(--gold)",
                fontFamily: "var(--font-heading)", fontSize: "11px", fontWeight: 700,
                letterSpacing: "0.1em", cursor: text.trim() ? "pointer" : "not-allowed",
                opacity: text.trim() ? 1 : 0.5, transition: "all 0.2s",
              }}
            >
              {sent ? t("✓ Skickat!", "✓ Sent!") : t("Skicka", "Send")}
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "9px 14px", cursor: "pointer",
                color: "var(--muted)", fontSize: "12px",
              }}
            >
              {t("Avbryt", "Cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────
export default function Footer() {
  const { lang, t } = useLang();

  const navLinks = lang === "sv"
    ? [
        { href: "/", label: "Hem" },
        { href: "/adventures", label: "Äventyr" },
        { href: "/gamemasters", label: "Spelledare" },
        { href: "/staff", label: "Staff" },
        { href: "/contact", label: "Kontakt" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/adventures", label: "Adventures" },
        { href: "/gamemasters", label: "Game Masters" },
        { href: "/staff", label: "Staff" },
        { href: "/contact", label: "Contact" },
      ];

  return (
    <footer style={{
      borderTop: "1px solid rgba(201,160,48,0.15)",
      background: "rgba(7,5,10,0.9)",
      backdropFilter: "blur(20px)",
      marginTop: "auto",
    }}>
      <div style={{
        maxWidth: "var(--container)", margin: "0 auto", padding: "40px 5% 28px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "32px",
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 900,
            letterSpacing: "0.08em", color: "var(--gold)", marginBottom: "10px",
          }}>
            Role for Roleplay
          </div>
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7, margin: 0 }}>
            {t(
              "En gemenskap för rollspelare i Norrköping och online. Välkommen till tavernan.",
              "A community for roleplayers in Norrköping and online. Welcome to the tavern."
            )}
          </p>
        </div>

        {/* Nav */}
        <div>
          <div style={{
            fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--gold)", opacity: 0.6, marginBottom: "14px",
          }}>
            {t("Navigering", "Navigation")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} style={{
                color: "var(--muted)", fontSize: "14px", textDecoration: "none",
                transition: "color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Social */}
        <div>
          <div style={{
            fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--gold)", opacity: 0.6, marginBottom: "14px",
          }}>
            {t("Hitta oss", "Find us")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { icon: "📸", label: "Instagram", href: "https://www.instagram.com/rollforroleplayofficial/" },
              { icon: "🎵", label: "TikTok", href: "https://www.tiktok.com/@roll.for.roleplay" },
              { icon: "💬", label: "Discord", href: "https://discord.gg/ExH377CmM" },
            ].map(({ icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: "10px",
                color: "var(--muted)", fontSize: "14px", textDecoration: "none",
                transition: "color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                <span style={{ fontSize: "18px" }}>{icon}</span> {label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div style={{
            fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--gold)", opacity: 0.6, marginBottom: "14px",
          }}>
            {t("Kontakt", "Contact")}
          </div>
          <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7, margin: "0 0 14px" }}>
            {t(
              "Frågor? Hör av dig så svarar vi så snart vi kan.",
              "Questions? Reach out and we'll get back to you as soon as possible."
            )}
          </p>
          <a
            href="/contact"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(201,160,48,0.08)", border: "1px solid rgba(201,160,48,0.25)",
              borderRadius: "8px", padding: "9px 18px",
              color: "var(--gold)", fontFamily: "var(--font-heading)",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", textDecoration: "none", transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(201,160,48,0.15)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,48,0.45)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(201,160,48,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,48,0.25)";
            }}
          >
            {t("✉ Kontakta oss", "✉ Contact us")}
          </a>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        maxWidth: "var(--container)", margin: "0 auto", padding: "0 5%",
        borderTop: "1px solid rgba(201,160,48,0.08)",
      }} />

      {/* Bottom bar */}
      <div style={{
        maxWidth: "var(--container)", margin: "0 auto", padding: "18px 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <MusicPlayer />
          <WishForm />
          <LangSwitch />
        </div>
        <div style={{
          fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--muted)", opacity: 0.45,
        }}>
          © {new Date().getFullYear()} Role for Roleplay
        </div>
      </div>
    </footer>
  );
}