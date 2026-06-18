import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import logo from "./Logo Icon Colored.png";

export default function Layout() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();

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
      alert("Användarnamn och lösenord krävs.");
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
        alert(data.message || "Fel användarnamn eller lösenord");
      }
    } catch (err) {
      alert("Anslutningsfel.");
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
                  { to: "/", label: "Hem" },
                  { to: "/adventures", label: "Äventyr" },
                  { to: "/gamemasters", label: "Spelledare" },
                  { to: "/contact", label: "Kontakt" },
                  ...(!loggedInUser
                    ? [
                        { to: "/apply", label: "Bli spelledare" },
                        { to: "/feedback", label: "Feedback" },
                      ]
                    : []),
                  ...(loggedInUser
                    ? [
                        { to: "/mail", label: "Inkorg", gold: true },
                        { to: "/settings", label: "Inställningar", gold: true },
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
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: "var(--gold-light)",
                      }}
                    >
                      Hej, {loggedInUser} {isSuperAdmin ? "(Superadmin)" : "(Spelledare)"}
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
                      Lämna tavernan
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
      </div>
    </>
  );
}
