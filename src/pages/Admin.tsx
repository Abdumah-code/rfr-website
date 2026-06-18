import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Lock, ShieldAlert, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface User {
  id: number;
  username: string;
  isSuperAdmin?: boolean;
}

export default function Admin() {
  const { loggedInUser, isSuperAdmin } = useOutletContext<{ loggedInUser: string | null; isSuperAdmin: boolean }>();
  const [users, setUsers] = useState<User[]>([]);
  const [newDmName, setNewDmName] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ username: string; password?: string }>({ username: "" });
  const [isLoading, setIsLoading] = useState(true);

  // States for password confirmation modal
  const [confirmAction, setConfirmAction] = useState<{
    type: "add" | "delete";
    userId?: number;
    username?: string;
  } | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  // Triggers the password confirmation modal for adding a member
  const triggerAddPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDmName.trim()) return;
    setConfirmAction({ type: "add" });
    setConfirmPassword("");
    setConfirmError("");
  };

  // Triggers the password confirmation modal for deleting a member
  const triggerDeletePrompt = (id: number, username: string) => {
    const targetUser = users.find(u => u.id === id);
    if (targetUser?.isSuperAdmin) {
      alert("Superadminkontot kan inte tas bort.");
      return;
    }
    setConfirmAction({ type: "delete", userId: id, username });
    setConfirmPassword("");
    setConfirmError("");
  };

  // Runs the actual add member after password verification
  const executeAdd = async () => {
    const baseName = newDmName.trim().toLowerCase();
    
    // Generate a random password
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let randomPassword = "";
    for (let i = 0; i < 10; i++) {
      randomPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: baseName, password: randomPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedPassword(randomPassword);
        setNewDmName("");
        setConfirmAction(null);
        fetchUsers();
      } else {
        setConfirmError(data.message || "Det gick inte att lägga till spelledaren.");
      }
    } catch (err) {
      setConfirmError("Anslutningsfel.");
    }
  };

  // Runs the actual delete member after password verification
  const executeDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setConfirmAction(null);
        fetchUsers();
      } else {
        setConfirmError(data.message || "Det gick inte att ta bort spelledaren.");
      }
    } catch (err) {
      setConfirmError("Anslutningsfel.");
    }
  };

  // Verifies the superadmin password and runs the pending action
  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmPassword) {
      setConfirmError("Lösenord krävs.");
      return;
    }
    setConfirmError("");

    try {
      // Verify admin password by making a login call
      const verifyRes = await fetch('/api/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loggedInUser, password: confirmPassword }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setConfirmError("Felaktigt lösenord för superadmin.");
        return;
      }

      // If password is correct, run the actual action
      if (confirmAction?.type === "add") {
        await executeAdd();
      } else if (confirmAction?.type === "delete" && confirmAction.userId) {
        await executeDelete(confirmAction.userId);
      }
    } catch (err) {
      setConfirmError("Anslutningsfel med servern.");
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ username: user.username, password: "" });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.username.trim()) {
      alert("Användarnamn måste fyllas i.");
      return;
    }
    
    try {
      const payload: any = { username: editForm.username.trim().toLowerCase() };
      if (editForm.password && editForm.password.trim().length >= 4) {
        payload.password = editForm.password.trim();
      }

      const res = await fetch(`/api/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        setEditForm({ username: "" });
        fetchUsers();
      } else {
        alert(data.message || "Det gick inte att spara ändringarna.");
      }
    } catch (err) {
      alert("Anslutningsfel.");
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-20 text-slate-400 font-body">
        <p className="text-xl">Behörighet saknas. Endast superadmin har tillgång till denna sida.</p>
      </div>
    );
  }

  return (
    <section className="w-[min(900px,92%)] mx-auto py-10 relative">
      <div className="bg-slate-900/80 border border-slate-400/10 rounded-xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-br from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Hantera spelledare (DM)
        </h1>
        <p className="text-slate-400 mb-8 max-w-2xl">
          Lägg till, ändra eller ta bort Dungeon Masters. Ändringar lagras i databasen och syns direkt i feedback-formuläret.
        </p>

        <form onSubmit={triggerAddPrompt} className="flex gap-4 mb-8 bg-slate-800/40 p-6 rounded-lg border border-slate-400/20">
          <input
            type="text"
            className="flex-1 p-3 bg-slate-900 border-2 border-slate-400/20 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400 transition-all font-medium"
            placeholder="Användarnamn på ny spelledare"
            value={newDmName}
            onChange={e => setNewDmName(e.target.value)}
          />
          <button
            type="submit"
            className="py-3 px-6 rounded-lg font-bold bg-amber-500 text-black shadow-lg shadow-amber-500/20 hover:scale-105 hover:bg-amber-400 transition-all cursor-pointer"
          >
            Lägg till spelledare
          </button>
        </form>

        {generatedPassword && (
          <div className="mb-8 p-5 rounded-lg bg-gold/10 border border-gold/30">
            <p className="text-sm text-gold-light font-bold mb-1">Framgång! Spelledare skapad.</p>
            <p className="text-sm text-text-main break-all tracking-wider font-mono">
              Lösenord: <span className="select-all text-white font-bold">{generatedPassword}</span>
            </p>
            <p className="text-xs text-muted mt-2 uppercase tracking-wide">
              Vänligen kopiera lösenordet nu. Det kommer inte att visas igen.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center p-8 text-slate-500">Hämtar spelledarlista...</div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-400/10 hover:border-amber-400/30 transition-all">
                {editingId === user.id ? (
                  <div className="flex flex-col w-full gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-body">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Användarnamn</label>
                        <input
                          type="text"
                          className="w-full p-2 bg-slate-900 border border-slate-400/50 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                          value={editForm.username || ""}
                          onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Lösenord (valfritt)</label>
                        <input
                          type="text"
                          className="w-full p-2 bg-slate-900 border border-slate-400/50 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                          placeholder="Minst 4 tecken för att ändra"
                          value={editForm.password || ""}
                          onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded transition-colors cursor-pointer">
                        Avbryt
                      </button>
                      <button onClick={saveEdit} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded transition-colors cursor-pointer">
                        Spara
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center">
                    <div className="mb-3 sm:mb-0">
                      <div className="font-bold text-lg text-slate-200">
                        {user.username === "david" ? "Superadmin" : user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                      </div>
                      <div className="text-sm text-slate-400 mt-1 flex flex-wrap gap-4 font-body">
                        <span>👤 Användarnamn: {user.username}</span>
                        <span>🔑 Roll: {user.username === "david" ? "Superadmin" : "Spelledare"}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end sm:self-auto">
                      {user.username !== "david" && (
                        <>
                          <button
                            onClick={() => startEdit(user)}
                            className="p-2 text-slate-400 hover:text-amber-400 bg-slate-900 rounded-md transition-colors cursor-pointer shadow-sm"
                            title="Ändra"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => triggerDeletePrompt(user.id, user.username)}
                            className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 rounded-md transition-colors cursor-pointer shadow-sm"
                            title="Ta bort"
                          >
                            ❌
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {!isLoading && users.length === 0 && (
            <div className="text-center p-8 text-slate-500">
              Inga spelledare registrerade. Lägg till en ovan!
            </div>
          )}
        </div>
      </div>

      {/* Password Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setConfirmAction(null)} 
              className="absolute inset-0 bg-black/85 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="rfr-card p-8 max-w-sm w-full mx-4 relative z-10 flex flex-col bg-[#0a080f] border-gold/30 shadow-[0_0_50px_rgba(201,160,48,0.15)]"
            >
              <div className="flex items-center gap-3 mb-4 text-gold border-b border-stroke pb-3">
                <Lock className="w-5 h-5 text-gold" />
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider">Bekräfta åtgärd</h3>
              </div>
              
              <p className="text-sm text-muted mb-6 leading-relaxed">
                {confirmAction.type === "add" ? (
                  <>Vänligen ange ditt superadmin-lösenord för att lägga till spelledaren <strong className="text-text-main">"{newDmName}"</strong>.</>
                ) : (
                  <>Vänligen ange ditt superadmin-lösenord för att bannlysa/ta bort spelledaren <strong className="text-text-main">"{confirmAction.username}"</strong>.</>
                )}
              </p>
              
              <form onSubmit={handleConfirmSubmit} className="flex flex-col gap-4">
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(""); }} 
                  className={`rfr-input !py-2.5 !bg-[#13101a] !border-[#2a2435] focus:!border-gold ${confirmError ? 'error' : ''}`}
                  placeholder="Lösenord"
                  autoFocus
                />
                {confirmError && <p className="rfr-error text-left mt-0">{confirmError}</p>}
                
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setConfirmAction(null)} className="btn-secondary w-1/2 !py-2.5 !text-[11px]">Avbryt</button>
                  <button type="submit" className="btn-primary w-1/2 !py-2.5 !text-[11px] font-bold">Bekräfta</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
