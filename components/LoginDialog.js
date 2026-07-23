"use client";
import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { X, Lock } from "lucide-react";

export default function LoginDialog() {
  const { login, setShowLoginDialog } = usePortfolio();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-8 w-full max-w-md relative">
        <button onClick={() => setShowLoginDialog(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-indigo-400">Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1 font-mono">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1 font-mono">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 p-3 rounded text-white outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 py-3 rounded font-bold hover:bg-indigo-500 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
