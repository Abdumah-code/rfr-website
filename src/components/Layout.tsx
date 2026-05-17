import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { getDMs } from "../utils/dms";

export default function Layout() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();

    if (cleanUsername === "david" && password === "david") {
      setLoggedInUser("David");
      setUsername("");
      setPassword("");
      return;
    }

    const dms = getDMs();
    const dm = dms.find(d => d.username === cleanUsername && d.password === password);
    if (dm) {
      setLoggedInUser(dm.name);
      setUsername("");
      setPassword("");
    } else {
      alert("Fel användarnamn eller lösenord");
    }
  };

  const handleLogout = () => setLoggedInUser(null);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      {/* Atmospheric background */}
      <div className="bg-atmosphere" />

      <div className="min-h-screen flex flex-col">
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
                gap: "10px",
                textDecoration: "none",
              }}
            >
              {/* Try to load the logo image; fallback to SVG emblem */}
              <img
                src="/logo.png"
                alt="RFR"
                style={{ height: "36px", width: "36px", objectFit: "contain" }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  fontSize: "18px",
                  letterSpacing: "0.2em",
                  color: "var(--gold)",
                  textShadow: "0 0 20px rgba(201,160,48,0.4)",
                }}
              >
                RFR
              </span>
            </Link>

            {/* Nav + Auth */}
            <div className="flex items-center gap-6 flex-wrap">
              {/* Navigation links */}
              <nav className="flex items-center gap-1">
                {[
                  { to: "/", label: "Home" },
                  { to: "/adventures", label: "Adventures" },
                  ...(!loggedInUser
                    ? [
                        { to: "/apply", label: "Apply for DM" },
                        { to: "/feedback", label: "Feedback" },
                      ]
                    : []),
                  ...(loggedInUser
                    ? [
                        { to: "/mail", label: "Mail", gold: true },
                        { to: "/settings", label: "Settings", gold: true },
                      ]
                    : []),
                  ...(loggedInUser === "David"
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
                  borderLeft: "1px solid rgba(201,160,48,0.15)",
                }}
              >
                {!loggedInUser ? (
                  <form
                    onSubmit={handleLogin}
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      type="text"
                      placeholder="Användarnamn"
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
                      placeholder="Lösenord"
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
                      Logga in
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
                        letterSpacing: "0.08em",
                        color: "var(--gold)",
                      }}
                    >
                      ⚔ {loggedInUser}
                    </span>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--muted)",
                        fontFamily: "var(--font-heading)",
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        transition: "color 0.18s",
                        textTransform: "uppercase",
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
                    >
                      Logga ut
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="flex-1" style={{ paddingTop: "48px", paddingBottom: "64px" }}>
          <Outlet context={{ loggedInUser }} />
        </main>

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: "1px solid rgba(201,160,48,0.15)",
            background: "rgba(7,5,10,0.7)",
            backdropFilter: "blur(18px)",
            padding: "20px 0",
          }}
        >
          <div
            className="mx-auto flex justify-between items-center gap-4 flex-wrap"
            style={{ maxWidth: "var(--container)", padding: "0 5%" }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-heading)",
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              © {new Date().getFullYear()} Roll for Roleplay
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Privacy", "Terms", "Instagram"].map(link => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--gold)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}