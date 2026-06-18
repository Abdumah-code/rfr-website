import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Lock, Key, Hammer } from 'lucide-react';
import { motion } from 'motion/react';

import Layout from './components/Layout';
import Home from './pages/Home';
import Adventures from './pages/Adventures';
import GameMasters from './pages/GameMasters';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';
import Mail from './pages/Mail';
import ApplyForDM from './pages/ApplyForDM';
import Admin from './pages/Admin';
import Settings from './pages/Settings';

export default function App() {
  const [authStatus, setAuthStatus] = useState<{
    hasSiteAccess: boolean;
    user: { id: number; username: string } | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    fetchAuthStatus();
    
    const savedEnd = localStorage.getItem('site_lockout_end');
    if (savedEnd) {
      const remaining = Math.round((parseInt(savedEnd, 10) - Date.now()) / 1000);
      if (remaining > 0) {
        setLockoutTime(remaining);
        setError('För många inloggningsförsök, vänligen försök igen senare.');
      } else {
        localStorage.removeItem('site_lockout_end');
      }
    }
  }, []);

  useEffect(() => {
    if (lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime(prev => {
        const next = prev - 1;
        if (next <= 0) {
          localStorage.removeItem('site_lockout_end');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const fetchAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth-status');
      const data = await res.json();
      if (data.success) {
        setAuthStatus({
          hasSiteAccess: data.hasSiteAccess,
          user: data.user,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;
    if (!passphrase.trim()) {
      setError('Lösenordsfras krävs.');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/site-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passphrase }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassphrase('');
        fetchAuthStatus();
      } else {
        if (res.status === 429 || (data.message && data.message.includes('Too many login attempts'))) {
          setError('För många inloggningsförsök, vänligen försök igen senare.');
          const lockoutDuration = 60;
          const endTimestamp = Date.now() + lockoutDuration * 1000;
          localStorage.setItem('site_lockout_end', endTimestamp.toString());
          setLockoutTime(lockoutDuration);
        } else {
          setError(data.message || 'Felaktigt lösenord för värdshuset.');
        }
      }
    } catch (err) {
      setError('Anslutningsfel.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07050A] flex items-center justify-center text-gold/50 font-heading tracking-widest text-sm">
        Öppnar värdshusportarna...
      </div>
    );
  }

  if (!authStatus?.hasSiteAccess) {
    return (
      <div className="min-h-screen relative font-body text-text-main flex items-center justify-center p-4">
        {/* Dynamic Background */}
        <div className="bg-atmosphere" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rfr-card p-10 w-full max-w-md relative z-10 flex flex-col pt-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-[#110d18]"
        >
          {/* Icon Box */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl border border-stroke bg-[#1a1425] flex items-center justify-center shadow-[0_0_20px_rgba(201,160,48,0.15)]">
            <Hammer className="w-8 h-8 text-gold" />
          </div>

          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-main mb-3">Under konstruktion</h2>
            <p className="text-muted text-[17px]">Sajten är under konstruktion, tack för ditt tålamod. Ange lösenordet för att stiga in.</p>
          </div>

          <form onSubmit={handleUnlock} className="flex flex-col gap-6">
            <div>
              <label className="rfr-label text-left text-[12px] opacity-80 mb-2">Gruppens lösenord</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted group-focus-within:text-gold transition-colors" />
                </div>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => {
                    setPassphrase(e.target.value);
                    setError('');
                  }}
                  disabled={lockoutTime > 0}
                  className={`rfr-input !pl-11 !py-3 !bg-[#0a080f] !border-[#2a2435] focus:!border-gold ${error ? 'error' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="rfr-error text-left mt-2"
                >
                  {lockoutTime > 0 ? `För många inloggningsförsök. Försök igen om ${lockoutTime} sekunder.` : error}
                </motion.p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={lockoutTime > 0}
              className="btn-primary w-full !py-4 !text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {lockoutTime > 0 ? `Låst (${lockoutTime}s)` : 'Lås upp porten'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="adventures" element={<Adventures />} />
          <Route path="gamemasters" element={<GameMasters />} />
          <Route path="contact" element={<Contact />} />
          <Route path="apply" element={<ApplyForDM />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="mail" element={<Mail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
