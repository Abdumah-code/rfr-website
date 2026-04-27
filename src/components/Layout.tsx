import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getDMs } from "../utils/dms";

export default function Layout() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

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

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <>
      <div className="bg-gradient-animated"></div>

      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 backdrop-blur-[14px] bg-black/55 border-b border-stroke">
          <div className="w-[min(1100px,92%)] mx-auto flex items-center justify-between gap-4 py-3">
            <div className="font-black tracking-[2px] text-base uppercase opacity-95">
              RFR
            </div>
            
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-4">
                <Link to="/" className="no-underline font-bold text-sm opacity-85 hover:opacity-100 hover:-translate-y-[1px] transition-all duration-160 cursor-pointer">
                  Home
                </Link>
                <Link to="/adventures" className="no-underline font-bold text-sm opacity-85 hover:opacity-100 hover:-translate-y-[1px] transition-all duration-160 cursor-pointer">
                  Adventures
                </Link>
                {!loggedInUser && (
                  <>
                    <Link to="/apply" className="no-underline font-bold text-sm opacity-85 hover:opacity-100 hover:-translate-y-[1px] transition-all duration-160 cursor-pointer">
                      Apply for DM
                    </Link>
                    <Link to="/feedback" className="no-underline font-bold text-sm opacity-85 hover:opacity-100 hover:-translate-y-[1px] transition-all duration-160 cursor-pointer">
                      Feedback
                    </Link>
                  </>
                )}
                {loggedInUser && (
                  <>
                    <Link to="/mail" className="no-underline font-bold text-sm text-amber-400 hover:text-amber-300 hover:-translate-y-[1px] transition-all duration-160 cursor-pointer">
                      Mail
                    </Link>
                    <Link to="/settings" className="no-underline font-bold text-sm text-amber-400 hover:text-amber-300 hover:-translate-y-[1px] transition-all duration-160 cursor-pointer">
                      Settings
                    </Link>
                  </>
                )}
                {loggedInUser === "David" && (
                  <Link to="/admin" className="no-underline font-bold text-sm text-amber-400 hover:text-amber-300 hover:-translate-y-[1px] transition-all duration-160 cursor-pointer">
                    Admin
                  </Link>
                )}
              </nav>

              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                {!loggedInUser ? (
                  <form onSubmit={handleLogin} className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Användarnamn" 
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400 w-28 transition-colors"
                    />
                    <input 
                      type="password" 
                      placeholder="Lösenord" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-400 w-28 transition-colors"
                    />
                    <button type="submit" className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/50 text-sm font-bold hover:bg-amber-500/30 transition-colors cursor-pointer">
                      Logga in
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-amber-400 font-bold">Inloggad som {loggedInUser}</span>
                    <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0">Logga ut</button>
                  </div>
                )}
                
                {!loggedInUser && (
                  <button 
                    className="inline-flex items-center justify-center gap-[10px] border-0 cursor-pointer py-2 px-4 rounded-[14px] font-extrabold bg-white/8 bg-transparent text-text-main border border-white/14 hover:bg-white/12 transition-all duration-160 hover:-translate-y-[2px]"
                    onClick={() => alert("Get Started clicked ✅")}
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-12">
          <Outlet context={{ loggedInUser }} />
        </main>

        <footer className="py-[18px] border-t border-stroke bg-black/45 backdrop-blur-[14px]">
          <div className="w-[min(1100px,92%)] mx-auto flex justify-between items-center gap-3 flex-wrap">
            <p className="text-muted m-0">© {new Date().getFullYear()} RFR. All rights reserved.</p>
            <div className="flex gap-[15px]">
              <a href="#" className="no-underline text-sm text-muted hover:text-text-main transition-colors">Privacy</a>
              <a href="#" className="no-underline text-sm text-muted hover:text-text-main transition-colors">Terms</a>
              <a href="#" className="no-underline text-sm text-muted hover:text-text-main transition-colors">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

