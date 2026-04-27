import React, { useState, useEffect } from "react";
import { getDMs, saveDMs, DMUser } from "../utils/dms";
import { useOutletContext } from "react-router-dom";

export default function Admin() {
  const { loggedInUser } = useOutletContext<{ loggedInUser: string | null }>();
  const [dms, setDms] = useState<DMUser[]>([]);
  const [newDmName, setNewDmName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DMUser>>({});

  useEffect(() => {
    setDms(getDMs());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDmName.trim()) return;
    
    const baseName = newDmName.trim();
    
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let randomPassword = "";
    for (let i = 0; i < 12; i++) {
      randomPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newUser: DMUser = {
      id: crypto.randomUUID(),
      name: baseName,
      username: baseName.toLowerCase(),
      password: randomPassword
    };
    
    const updated = [...dms, newUser];
    setDms(updated);
    saveDMs(updated);
    setNewDmName("");
  };

  const handleDelete = (id: string) => {
    if (confirm("Är du säker på att du vill ta bort denna DM?")) {
      const updated = dms.filter(d => d.id !== id);
      setDms(updated);
      saveDMs(updated);
    }
  };

  const startEdit = (dm: DMUser) => {
    setEditingId(dm.id);
    setEditForm({ ...dm });
  };

  const saveEdit = () => {
    if (!editingId || !editForm.name?.trim() || !editForm.username?.trim()) {
      alert("Namn och användarnamn måste fyllas i.");
      return;
    }
    
    const updated = dms.map(d => {
      if (d.id === editingId) {
        return {
          ...d,
          name: editForm.name!.trim(),
          username: editForm.username!.trim().toLowerCase(),
          password: editForm.password?.trim() || ''
        };
      }
      return d;
    });
    
    setDms(updated);
    saveDMs(updated);
    setEditingId(null);
    setEditForm({});
  };

  if (loggedInUser !== "David") {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-xl">Behörighet saknas.</p>
      </div>
    );
  }

  return (
    <section className="w-[min(900px,92%)] mx-auto py-10">
      <div className="bg-slate-900/80 border border-slate-400/10 rounded-xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-br from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Hantera DM:s
        </h1>
        <p className="text-slate-400 mb-8 max-w-2xl">
          Lägg till, ändra eller ta bort Dungeon Masters. Ändringar syns direkt i appens Feedback-formulär.
        </p>

        <form onSubmit={handleAdd} className="flex gap-4 mb-8 bg-slate-800/40 p-6 rounded-lg border border-slate-400/20">
          <input
            type="text"
            className="flex-1 p-3 bg-slate-900 border-2 border-slate-400/20 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400 transition-all font-medium"
            placeholder="Namn på ny DM"
            value={newDmName}
            onChange={e => setNewDmName(e.target.value)}
          />
          <button
            type="submit"
            className="py-3 px-6 rounded-lg font-bold bg-amber-500 text-black shadow-lg shadow-amber-500/20 hover:scale-105 hover:bg-amber-400 transition-all cursor-pointer"
          >
            Lägg till
          </button>
        </form>

        <div className="space-y-4">
          {dms.map((dm) => (
            <div key={dm.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-400/10 hover:border-amber-400/30 transition-all">
              {editingId === dm.id ? (
                <div className="flex flex-col w-full gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Namn</label>
                      <input
                        type="text"
                        className="w-full p-2 bg-slate-900 border border-slate-400/50 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                        value={editForm.name || ""}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Användarnamn</label>
                      <input
                        type="text"
                        className="w-full p-2 bg-slate-900 border border-slate-400/50 rounded text-slate-200 focus:outline-none focus:border-amber-400"
                        value={editForm.username || ""}
                        onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Lösenord</label>
                      <input
                        type="text"
                        className="w-full p-2 bg-slate-900 border border-slate-400/50 rounded text-slate-200 focus:outline-none focus:border-amber-400"
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
                    <div className="font-bold text-lg text-slate-200">{dm.name}</div>
                    <div className="text-sm text-slate-400 mt-1 flex flex-wrap gap-4">
                      <span>👤 {dm.username}</span>
                      <span>🔑 {dm.password}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => startEdit(dm)}
                      className="p-2 text-slate-400 hover:text-amber-400 bg-slate-900 rounded-md transition-colors cursor-pointer shadow-sm"
                      title="Ändra"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(dm.id)}
                      className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 rounded-md transition-colors cursor-pointer shadow-sm"
                      title="Ta bort"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {dms.length === 0 && (
            <div className="text-center p-8 text-slate-500">
              Inga DM:s registrerade. Lägg till en ovan!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
