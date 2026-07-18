import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  const handleEnter = () => {
    setVisible(false);
    setTimeout(onEnter, 700);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#07050A",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "32px",
          }}
        >
          {/* Ambient purple glow */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `
              radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100,30,160,0.25) 0%, transparent 65%),
              radial-gradient(ellipse 40% 30% at 20% 80%, rgba(70,10,120,0.15) 0%, transparent 55%),
              radial-gradient(ellipse 40% 30% at 80% 20%, rgba(80,20,130,0.1) 0%, transparent 50%)
            `,
          }} />

          {/* Logo / title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ textAlign: "center", position: "relative" }}
          >
            <div style={{
              fontFamily: "var(--font-heading)", fontSize: "12px", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "var(--gold)", opacity: 0.6,
              marginBottom: "16px",
            }}>
              ✦ Välkommen ✦
            </div>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(36px, 7vw, 72px)",
              fontWeight: 900, letterSpacing: "0.06em",
              color: "var(--text)", margin: 0, lineHeight: 1.1,
            }}>
              Role for Roleplay
            </h1>
            <div style={{
              width: "120px", height: "1px", margin: "20px auto",
              background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }} />
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "16px",
              color: "var(--muted)", margin: 0, letterSpacing: "0.05em",
            }}>
              Din plats vid bordet väntar.
            </p>
          </motion.div>

          {/* Enter button */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            onClick={handleEnter}
            style={{
              fontFamily: "var(--font-heading)", fontSize: "13px", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "16px 48px", borderRadius: "10px",
              background: "rgba(201,160,48,0.12)",
              border: "1px solid rgba(201,160,48,0.45)",
              color: "var(--gold)", cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 0 40px rgba(201,160,48,0.08)",
            }}
            whileHover={{
              background: "rgba(201,160,48,0.2)",
              boxShadow: "0 0 60px rgba(201,160,48,0.15)",
              scale: 1.03,
            }}
            whileTap={{ scale: 0.97 }}
          >
            🎲 Gå in i tavernan
          </motion.button>

          {/* Music note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            style={{
              fontFamily: "var(--font-heading)", fontSize: "10px",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--muted)", opacity: 0.4,
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            <span>🔊</span> Musik startar när du går in
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}