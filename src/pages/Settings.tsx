import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export default function Settings() {
  const { loggedInUser, userId } = useOutletContext<{ loggedInUser: string | null; userId: number | null }>();
  const navigate = useNavigate();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vänligen fyll i alla fält.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("De nya lösenorden matchar inte.");
      return;
    }

    if (newPassword.length < 4) {
      setError("Lösenordet måste vara minst 4 tecken.");
      return;
    }

    if (loggedInUser?.toLowerCase() === "david") {
      setError("Lösenordet för superadminkontot kan inte ändras här.");
      return;
    }

    try {
      // 1. Verify current password by making a login call
      const verifyRes = await fetch('/api/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loggedInUser, password: currentPassword }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setError("Nuvarande lösenord är felaktigt.");
        return;
      }

      // 2. Perform the update via PUT /api/users/:id
      const updateRes = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const updateData = await updateRes.json();
      if (updateRes.ok && updateData.success) {
        setMessage("Ditt lösenord har uppdaterats framgångsrikt!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(updateData.message || "Det gick inte att uppdatera lösenordet.");
      }
    } catch (err) {
      setError("Anslutningsfel med servern.");
    }
  };

  if (!loggedInUser) return null;

  return (
    <section className="w-[min(600px,92%)] mx-auto py-10">
      <div className="bg-slate-900/80 border border-slate-400/10 rounded-xl p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-br from-amber-400 to-amber-500 bg-clip-text text-transparent">
          Inställningar
        </h1>
        <p className="text-slate-400 mb-8">
          Ändra ditt nuvarande lösenord för ditt spelledarkonto.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
              {message}
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-2">Nuvarande lösenord</label>
            <input
              type="password"
              className="w-full p-3 bg-slate-800 border-2 border-slate-400/20 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400 transition-all font-medium"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Nytt lösenord</label>
            <input
              type="password"
              className="w-full p-3 bg-slate-800 border-2 border-slate-400/20 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400 transition-all font-medium"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Bekräfta nytt lösenord</label>
            <input
              type="password"
              className="w-full p-3 bg-slate-800 border-2 border-slate-400/20 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400 transition-all font-medium"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-lg font-bold bg-amber-500 text-black shadow-lg shadow-amber-500/20 hover:scale-[1.02] hover:bg-amber-400 transition-all cursor-pointer"
          >
            Spara lösenord
          </button>
        </form>
      </div>
    </section>
  );
}
