import { useState } from "react";
import { useLang } from "../context/LangContext";
import { motion, AnimatePresence } from "motion/react";

interface StatBlock {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

interface StaffMember {
  id: string;
  name: string;
  title: string;
  race: string;
  class: string;
  origin: string;
  bio: string;
  stats: StatBlock;
  roles: string[];
  avatarEmoji: string;
}

const modifier = (score: number) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const staffData: StaffMember[] = [
  {
    id: "pontus",
    name: "Pontus",
    title: "Eventkoordinator",
    race: "Människa",
    class: "Bard",
    origin: "Linköping",
    bio: "Kreativiteten har alltid flödat genom mina ådror. Jag gick med i RFR för att skapa både de mest kaotiska och de lyckligaste minnena.",
    stats: { str: 11, dex: 14, con: 12, int: 13, wis: 8, cha: 16 },
    roles: ["Eventkoordinator", "DM-mentor", "Styrelseledamot"],
    avatarEmoji: "🎵",
  },
  {
    id: "linnea",
    name: "Linnéa",
    title: "Social Media Manager",
    race: "Människa",
    class: "Warlock",
    origin: "Norrköping",
    bio: "Jag dras till världar av magi, äventyr och fantasi. Jag gick med i Roll for Roleplay för att väcka berättelser och legender till liv.",
    stats: { str: 8, dex: 14, con: 13, int: 10, wis: 12, cha: 15 },
    roles: ["Social Media Manager", "Vice styrelseledamot"],
    avatarEmoji: "🔮",
  },
  {
    id: "wilhelm",
    name: "Wilhelm",
    title: "Discord-administratör",
    race: "Människa",
    class: "Wizard",
    origin: "Hudiksvall",
    bio: "Med en passion för att skapa och ha sönder saker online, och kanske även IRL, strävar jag efter att skapa den bästa miljön där alla kan frodas. Med erfarenhet från tidigare styrelser och moderering av communities arbetar jag i bakgrunden för att se till att gemenskapen fungerar smidigt.",
    stats: { str: 10, dex: 8, con: 5, int: 15, wis: 15, cha: 10 },
    roles: ["Discord-administratör", "Styrelseledamot"],
    avatarEmoji: "🧙",
  },
  {
    id: "david",
    name: "David",
    title: "Grundare av RFR",
    race: "Människa",
    class: "Paladin",
    origin: "Norrköping",
    bio: "Driven av en passion för berättande, tärningsslag och att föra människor samman grundade jag RFR för att skapa en välkomnande gemenskap där äventyrare, drömmare och berättare kan mötas, spela och växa.",
    stats: { str: 14, dex: 10, con: 13, int: 12, wis: 14, cha: 16 },
    roles: ["Grundare av RFR", "DM-mentor", "Styrelseledamot"],
    avatarEmoji: "🛡️",
  },
  {
    id: "daniel",
    name: "Daniel",
    title: "Podcastproducent",
    race: "Människa",
    class: "Bard",
    origin: "Karlskoga",
    bio: "Jag dras till ännu oberättade historier, episka äventyr och banden som formas runt bordet. Jag gick med i RFR för att hjälpa våra berättelser att nå bortom tärningarna och in i hjärtat hos dem som vill lyssna. Genom varje samtal och delat äventyr strävar jag efter att hålla berättandets anda levande.",
    stats: { str: 14, dex: 10, con: 17, int: 13, wis: 15, cha: 16 },
    roles: ["Podcastproducent", "Kvalitetsutvecklare", "Styrelseledamot"],
    avatarEmoji: "🎙️",
  },
  {
    id: "abdu",
    name: "Abdu",
    title: "Webbutvecklare",
    race: "Människa",
    class: "Fighter",
    origin: "Uppsala",
    bio: "I RFR vill jag hjälpa till att bygga något meningsfullt, strategiskt och långvarigt, samtidigt som vänskap, gemenskap och delade äventyr står i centrum.",
    stats: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    roles: ["Webbutvecklare", "Styrelseledamot", "Affärsutveckling och strategisk ledning"],
    avatarEmoji: "⚔️",
  },
];



function staffText(value: string, t: (sv: string, en: string) => string): string {
  const translations: Record<string, string> = {
    "Människa": "Human",
    "Eventkoordinator": "Event Coordinator",
    "DM-mentor": "DM Mentor",
    "Styrelseledamot": "Board Member",
    "Social Media Manager": "Social Media Manager",
    "Vice styrelseledamot": "Deputy Board Member",
    "Discord-administratör": "Discord Administrator",
    "Grundare av RFR": "Founder of RFR",
    "Podcastproducent": "Podcast Producer",
    "Kvalitetsutvecklare": "Quality Developer",
    "Webbutvecklare": "Web Developer",
    "Affärsutveckling och strategisk ledning": "Business Development & Strategic Lead",

    "Kreativiteten har alltid flödat genom mina ådror. Jag gick med i RFR för att skapa både de mest kaotiska och de lyckligaste minnena.":
      "Creativity has always flowed through my veins. I joined RFR to bring forth and create both the most chaotic and the happiest of memories.",

    "Jag dras till världar av magi, äventyr och fantasi. Jag gick med i Roll for Roleplay för att väcka berättelser och legender till liv.":
      "Drawn to worlds of magic, adventure and imagination, I joined Roll for Roleplay to bring stories and legends to life.",

    "Med en passion för att skapa och ha sönder saker online, och kanske även IRL, strävar jag efter att skapa den bästa miljön där alla kan frodas. Med erfarenhet från tidigare styrelser och moderering av communities arbetar jag i bakgrunden för att se till att gemenskapen fungerar smidigt.":
      "With a passion to make and break things online, and maybe IRL, I strive to create the best environment for everyone to thrive. With knowledge from past boards and moderation of communities, I work in the background to make sure the community runs smoothly.",

    "Driven av en passion för berättande, tärningsslag och att föra människor samman grundade jag RFR för att skapa en välkomnande gemenskap där äventyrare, drömmare och berättare kan mötas, spela och växa.":
      "Driven by a passion for storytelling, dice rolling and bringing people together, I founded RFR to create a welcoming community where adventurers, dreamers and storytellers can meet, play and grow.",

    "Jag dras till ännu oberättade historier, episka äventyr och banden som formas runt bordet. Jag gick med i RFR för att hjälpa våra berättelser att nå bortom tärningarna och in i hjärtat hos dem som vill lyssna. Genom varje samtal och delat äventyr strävar jag efter att hålla berättandets anda levande.":
      "Drawn to stories yet untold, epic adventures and the bonds forged around the table, I joined RFR to help our tales reach beyond the dice and into the hearts of those willing to listen. Through every conversation and shared adventure, I strive to keep the spirit of storytelling alive.",

    "I RFR vill jag hjälpa till att bygga något meningsfullt, strategiskt och långvarigt, samtidigt som vänskap, gemenskap och delade äventyr står i centrum.":
      "In RFR I want to help build something meaningful, strategic and long-lasting while keeping friendship, connection and shared adventures at the center."
  };

  return translations[value] ? t(value, translations[value]) : value;
}

const STAT_LABELS: (keyof StatBlock)[] = ["str", "dex", "con", "int", "wis", "cha"];
const STAT_NAMES: Record<keyof StatBlock, string> = {
  str: "STY", dex: "SMI", con: "KON", int: "INT", wis: "VIS", cha: "KAR",
};

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "10px 8px", border: "1px solid rgba(201,160,48,0.25)",
      borderRadius: "8px", background: "rgba(201,160,48,0.04)", minWidth: "54px",
    }}>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: "9px", letterSpacing: "0.12em", color: "var(--gold)", opacity: 0.8, marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 900, color: "var(--text)", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{
        fontFamily: "var(--font-heading)", fontSize: "13px", fontWeight: 700,
        color: "var(--gold)", marginTop: "2px",
        borderTop: "1px solid rgba(201,160,48,0.2)", paddingTop: "4px", width: "100%", textAlign: "center"
      }}>
        {modifier(value)}
      </div>
    </div>
  );
}

function CharacterSheet({ member, onClose }: { member: StaffMember; onClose: () => void }) {
  const { t } = useLang();
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 24 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="rfr-card relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a080f]"
          style={{ padding: "36px" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "transparent", border: "1px solid rgba(201,160,48,0.2)",
              color: "var(--muted)", borderRadius: "6px", padding: "4px 10px",
              cursor: "pointer", fontFamily: "var(--font-heading)", fontSize: "11px",
              letterSpacing: "0.1em",
            }}
          >
            {t("✕ STÄNG", "✕ CLOSE")}
          </button>

          {/* Sheet header */}
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap" }}>
            <div style={{
              fontSize: "64px", lineHeight: 1,
              background: "rgba(201,160,48,0.06)", border: "1px solid rgba(201,160,48,0.2)",
              borderRadius: "12px", padding: "12px 16px",
            }}>
              {member.avatarEmoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.2em", color: "var(--gold)", opacity: 0.7, textTransform: "uppercase", marginBottom: "4px" }}>
                {staffText(member.title, t)}
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 900, color: "var(--text)", margin: "0 0 6px", letterSpacing: "0.05em" }}>
                {staffText(member.name, t)}
              </h2>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[staffText(member.race, t), staffText(member.class, t), member.origin].map(tag => (
                  <span key={tag} style={{
                    fontFamily: "var(--font-heading)", fontSize: "10px", fontWeight: 600,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "3px 10px", borderRadius: "100px",
                    background: "rgba(201,160,48,0.08)", border: "1px solid rgba(201,160,48,0.2)",
                    color: "var(--gold)",
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Origin + primary role */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: t("Ursprung", "Origin"), value: member.origin },
              { label: t("Huvuduppdrag", "Primary Quest"), value: staffText(member.title, t) },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: "12px 16px", border: "1px solid rgba(201,160,48,0.15)", borderRadius: "8px", background: "rgba(201,160,48,0.03)" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7, marginBottom: "4px" }}>{label}</div>
                <div style={{ color: "var(--text)", fontSize: "15px" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Stat block */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.6, marginBottom: "12px" }}>
              {t("⚔ Egenskapsvärden", "⚔ Ability Scores")}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {STAT_LABELS.map(s => (
                <StatBox key={s} label={t(STAT_NAMES[s], ({ str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA" } as Record<keyof StatBlock, string>)[s])} value={member.stats[s]} />
              ))}
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.6, marginBottom: "10px" }}>
              {t("📖 Om mig", "📖 About Me")}
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "16px", margin: 0 }}>{staffText(member.bio, t)}</p>
          </div>
          {/* Quest roles */}
          <div style={{ marginBottom: "4px" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.6, marginBottom: "12px" }}>
              {t("⚔ Uppdrag", "⚔ Quests")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {member.roles.map(role => (
                <div
                  key={role}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "11px 14px",
                    border: "1px solid rgba(201,160,48,0.15)",
                    borderRadius: "8px",
                    background: "rgba(201,160,48,0.03)",
                    color: "var(--text)",
                  }}
                >
                  <span style={{ color: "var(--gold)" }}>⚔</span>
                  <span>{staffText(role, t)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function Staff() {
  const { t } = useLang();
  const [selected, setSelected] = useState<StaffMember | null>(null);

  return (
    <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 5%" }}>

      {/* Header */}
      <section style={{ textAlign: "center", padding: "48px 0 52px", animation: "slideInUp 0.6s ease-out both" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          fontFamily: "var(--font-heading)", fontSize: "11px", letterSpacing: "0.2em",
          textTransform: "uppercase", color: "var(--gold)",
          padding: "6px 16px", borderRadius: "100px",
          border: "1px solid rgba(201,160,48,0.25)", background: "rgba(201,160,48,0.06)",
          marginBottom: "24px",
        }}>
          <span>🛡</span><span>{t("Vårt team", "Our team")}</span><span>🛡</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 5vw, 60px)",
          fontWeight: 900, letterSpacing: "0.05em", color: "var(--text)", margin: "0 0 16px",
        }}>
          {t("Möt spelledarna", "Meet the Game Masters")}
        </h1>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "clamp(16px, 2vw, 19px)",
          color: "var(--muted)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65,
        }}>
          {t("Personerna bakom äventyren. Klicka på ett kort för att se deras karaktärsblad.", "The people behind the adventures. Click a card to see their character sheet.")}
        </p>
      </section>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "0 0 52px", opacity: 0.4 }}>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, var(--gold))" }} />
        <span style={{ color: "var(--gold)", fontSize: "18px" }}>✦</span>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, var(--gold), transparent)" }} />
      </div>

      {/* Staff cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "24px",
        marginBottom: "60px",
        animation: "slideInUp 0.7s ease-out 0.15s both",
      }}>
        {staffData.map((member, i) => (
          <motion.div
            key={member.id}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setSelected(member)}
            className="rfr-card"
            style={{
              padding: "0", cursor: "pointer", overflow: "hidden",
              animationDelay: `${i * 0.1}s`,
              animation: "slideInUp 0.5s ease-out both",
            }}
          >
            {/* Avatar area */}
            <div style={{
              background: "linear-gradient(135deg, rgba(100,30,160,0.15) 0%, rgba(201,160,48,0.06) 100%)",
              borderBottom: "1px solid rgba(201,160,48,0.15)",
              padding: "36px 24px 28px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
            }}>
              <div style={{
                fontSize: "56px", lineHeight: 1,
                background: "rgba(201,160,48,0.06)", border: "1px solid rgba(201,160,48,0.18)",
                borderRadius: "50%", width: "90px", height: "90px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {member.avatarEmoji}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", opacity: 0.7, marginBottom: "4px" }}>
                  {staffText(member.title, t)}
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--text)", letterSpacing: "0.04em" }}>
                  {staffText(member.name, t)}
                </div>
              </div>
            </div>

            {/* Info area */}
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                {[staffText(member.race, t), staffText(member.class, t)].map(tag => (
                  <span key={tag} style={{
                    fontFamily: "var(--font-heading)", fontSize: "9px", letterSpacing: "0.1em",
                    textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px",
                    background: "rgba(201,160,48,0.07)", border: "1px solid rgba(201,160,48,0.18)",
                    color: "var(--gold)",
                  }}>{tag}</span>
                ))}
                <span style={{
                  fontFamily: "var(--font-heading)", fontSize: "9px", letterSpacing: "0.1em",
                  textTransform: "uppercase", padding: "3px 8px", borderRadius: "100px",
                  background: "rgba(100,30,160,0.1)", border: "1px solid rgba(100,30,160,0.25)",
                  color: "#b06ee8",
                }}>{member.origin}</span>
              </div>

              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, margin: "0 0 16px" }}>
                {staffText(member.bio, t).slice(0, 100)}…
              </p>

              <div style={{
                fontFamily: "var(--font-heading)", fontSize: "10px", letterSpacing: "0.12em",
                textTransform: "uppercase", color: "var(--gold)", opacity: 0.6,
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <span>📜</span> {t("Se karaktärsblad", "View Character Sheet")}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Character sheet modal */}
      {selected && (
        <CharacterSheet member={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}