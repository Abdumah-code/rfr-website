import React, { useState, useEffect, useRef } from "react";
// @ts-expect-error webgl-fluid may not include TypeScript declarations in every setup.
import WebGLFluid from "webgl-fluid";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import logo from "./Logo Icon Colored.png";
import { useLang } from "../context/LangContext";
import Footer from "./Footer";


function SmokeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fluidStartedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!fluidStartedRef.current) {
      fluidStartedRef.current = true;

      WebGLFluid(canvas, {
        TRIGGER: "hover",
        IMMEDIATE: true,
        AUTO: false,
        SPLAT_COUNT: 5,

        // Performance
        SIM_RESOLUTION: 64,
        DYE_RESOLUTION: 512,
        CAPTURE_RESOLUTION: 512,
        PRESSURE_ITERATIONS: 12,

        // Fluid movement
        DENSITY_DISSIPATION: 1.2,
        VELOCITY_DISSIPATION: 0.3,
        PRESSURE: 0.8,
        CURL: 30,
        SPLAT_RADIUS: 0.08,
        SPLAT_FORCE: 5000,

        // Purple dye
        SPLAT_COLOR: {
          r: 0.35,
          g: 0.08,
          b: 0.75,
        },

        COLORFUL: false,
        COLOR_UPDATE_SPEED: 0,

        // Appearance
        SHADING: true,
        TRANSPARENT: true,
        BACK_COLOR: {
          r: 7,
          g: 5,
          b: 10,
        },

        BLOOM: true,
        BLOOM_ITERATIONS: 3,
        BLOOM_RESOLUTION: 128,
        BLOOM_INTENSITY: 0.4,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,

        SUNRAYS: false,
        PAUSED: false,
      });
    }

    /*
     * webgl-fluid reads event.offsetX and event.offsetY.
     * Synthetic MouseEvent does not reliably calculate those values,
     * so we explicitly define them before dispatching the event.
     */
    const sendCanvasMouseEvent = (
      type: "mousemove" | "mousedown",
      sourceEvent: MouseEvent,
    ) => {
      const rect = canvas.getBoundingClientRect();
      const offsetX = sourceEvent.clientX - rect.left;
      const offsetY = sourceEvent.clientY - rect.top;

      const forwardedEvent = new MouseEvent(type, {
        clientX: sourceEvent.clientX,
        clientY: sourceEvent.clientY,
        screenX: sourceEvent.screenX,
        screenY: sourceEvent.screenY,
        buttons: sourceEvent.buttons,
        button: sourceEvent.button,
        bubbles: false,
        cancelable: true,
        view: window,
      });

      Object.defineProperty(forwardedEvent, "offsetX", {
        configurable: true,
        value: offsetX,
      });

      Object.defineProperty(forwardedEvent, "offsetY", {
        configurable: true,
        value: offsetY,
      });

      canvas.dispatchEvent(forwardedEvent);
    };

    const forwardMouseMove = (event: MouseEvent) => {
      sendCanvasMouseEvent("mousemove", event);
    };

    const forwardMouseDown = (event: MouseEvent) => {
      sendCanvasMouseEvent("mousedown", event);
    };

    window.addEventListener("mousemove", forwardMouseMove, { passive: true });
    window.addEventListener("mousedown", forwardMouseDown, { passive: true });

    return () => {
      window.removeEventListener("mousemove", forwardMouseMove);
      window.removeEventListener("mousedown", forwardMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.88,
      }}
    />
  );
}

export default function Layout() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const { lang, t, toggleLang } = useLang();

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  const fetchAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth-status');
      const data = await res.json();
      if (data.success && data.user) {
        setLoggedInUser(data.user.username);
        setUserId(data.user.id);
        setIsSuperAdmin(!!data.user.isSuperAdmin);
      } else {
        setLoggedInUser(null);
        setUserId(null);
        setIsSuperAdmin(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      alert(t("Användarnamn och lösenord krävs.", "Username and password are required."));
      return;
    }
    try {
      const res = await fetch('/api/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsername("");
        setPassword("");
        await fetchAuthStatus();
      } else {
        alert(data.message || t("Fel användarnamn eller lösenord", "Incorrect username or password"));
      }
    } catch (err) {
      alert(t("Anslutningsfel.", "Connection error."));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setLoggedInUser(null);
      setUserId(null);
      setIsSuperAdmin(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeaveTavern = async () => {
    try {
      await fetch('/api/site-logout', { method: 'POST' });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  // isSuperAdmin is now state-driven

  return (
    <>
      {/* Atmospheric background */}
      <div className="bg-atmosphere" />
      <SmokeBackground />

      <div className="min-h-screen flex flex-col" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <header
          className="sticky top-0 z-50"
          style={{
            background: "rgba(7, 5, 10, 0.82)",
            backdropFilter: "blur(18px)",
            borderBottom: "1px solid rgba(201, 160, 48, 0.18)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="mx-auto flex items-center justify-between gap-6 py-4"
            style={{ maxWidth: "var(--container)", padding: "14px 5%" }}
          >
            {/* Logo */}
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img
                src={logo}
                alt="Role for Roleplay"
                style={{ height: "208px", width: "208px", objectFit: "contain" }}
              />
            </Link>

            {/* Nav + Auth */}
            <div className="flex items-center gap-6 flex-wrap">
              {/* Navigation links */}
              <nav className="flex items-center gap-1">
                {[
                  { to: "/", label: t("Hem", "Home") },
                  { to: "/adventures", label: t("Äventyr", "Adventures") },
                  { to: "/gamemasters", label: t("Spelledare", "Game Masters") },
                  { to: "/staff", label: "Staff" },
                  { to: "/contact", label: t("Kontakt", "Contact") },
                  ...(!loggedInUser
                    ? [
                        { to: "/apply", label: t("Bli spelledare", "Become a GM") },
                        { to: "/feedback", label: "Feedback" },
                      ]
                    : []),
                  ...(loggedInUser
                    ? [
                        { to: "/mail", label: t("Inkorg", "Inbox"), gold: true },
                        { to: "/settings", label: t("Inställningar", "Settings"), gold: true },
                      ]
                    : []),
                  ...(isSuperAdmin
                    ? [{ to: "/admin", label: "Admin", gold: true }]
                    : []),
                ].map(({ to, label, gold }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      transition: "all 0.18s ease",
                      color: isActive(to)
                        ? "var(--gold)"
                        : gold
                        ? "var(--gold-light)"
                        : "var(--muted)",
                      background: isActive(to)
                        ? "rgba(201,160,48,0.1)"
                        : "transparent",
                      border: isActive(to)
                        ? "1px solid rgba(201,160,48,0.25)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={e => {
                      if (!isActive(to)) {
                        (e.currentTarget as HTMLElement).style.color = "var(--gold-light)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(201,160,48,0.06)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive(to)) {
                        (e.currentTarget as HTMLElement).style.color = gold ? "var(--gold-light)" : "var(--muted)";
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Auth section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  paddingLeft: "16px",
                  borderLeft: "1px solid rgba(201, 160, 48, 0.15)",
                }}
              >
                {!loggedInUser ? (
                  <form
                    onSubmit={handleLogin}
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      type="text"
                      placeholder={t("Användarnamn", "Username")}
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(201,160,48,0.18)",
                        color: "var(--text)",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        width: "118px",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => (e.target.style.borderColor = "rgba(201,160,48,0.5)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(201,160,48,0.18)")}
                    />
                    <input
                      type="password"
                      placeholder={t("Lösenord", "Password")}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(201,160,48,0.18)",
                        color: "var(--text)",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        width: "110px",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => (e.target.style.borderColor = "rgba(201,160,48,0.5)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(201,160,48,0.18)")}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        background: "rgba(201,160,48,0.12)",
                        border: "1px solid rgba(201,160,48,0.35)",
                        color: "var(--gold)",
                        fontFamily: "var(--font-heading)",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                        transition: "all 0.18s ease",
                        textTransform: "uppercase",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(201,160,48,0.22)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,48,0.6)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(201,160,48,0.12)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,160,48,0.35)";
                      }}
                    >
                      {t("Logga in", "Log in")}
                    </button>
                    <Link
                      to="/apply"
                      className="btn-primary"
                      style={{ fontSize: "11px", padding: "8px 16px" }}
                    >
                      Ansök
                    </Link>
                  </form>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: "var(--gold-light)",
                      }}
                    >
                      {t("Hej", "Hello")}, {loggedInUser} {isSuperAdmin ? "(Superadmin)" : t("(Spelledare)", "(Game Master)")}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="btn-secondary"
                      style={{ fontSize: "10px", padding: "6px 12px" }}
                    >
                      Res dig upp
                    </button>
                    <button
                      onClick={handleLeaveTavern}
                      className="btn-secondary"
                      style={{
                        fontSize: "10px",
                        padding: "6px 12px",
                        borderColor: "rgba(168,40,64,0.3)",
                        color: "#A82840"
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(124,28,46,0.1)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,40,64,0.5)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,40,64,0.3)";
                      }}
                    >
                      {t("Lämna tavernan", "Leave the tavern")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="flex-1 py-10">
          <Outlet context={{ loggedInUser, userId, isSuperAdmin, fetchAuthStatus, isAuthLoading }} />
        </main>

        {/* ── Footer ── */}
        <Footer />
      </div>
    </>
  );
}