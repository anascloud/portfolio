"use client";
import { useState, FormEvent } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import { X, Lock, UserPlus, LogIn } from "lucide-react";

export default function LoginDialog() {
  const { login, register, setShowLoginDialog } = usePortfolio();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = mode === "login"
      ? await login(email, password)
      : await register(email, password);
    setLoading(false);
    if (success === false) {
      setError(mode === "login" ? "Invalid email or password" : "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-8 w-full max-w-md relative">
        <button onClick={() => setShowLoginDialog(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X />
        </button>
        <div className="flex items-center gap-3 mb-6">
          {mode === "login" ? (
            <Lock className="w-6 h-6 text-indigo-400" />
          ) : (
            <UserPlus className="w-6 h-6 text-indigo-400" />
          )}
          <h2 className="text-2xl font-bold text-indigo-400">
            {mode === "login" ? "Login" : "Register"}
          </h2>
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
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 py-3 rounded font-bold hover:bg-indigo-500 transition disabled:opacity-50">
            {loading
              ? (mode === "login" ? "Logging in..." : "Registering...")
              : (mode === "login" ? "Login" : "Register")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => { setMode("register"); setError(""); }} className="text-indigo-400 hover:underline font-mono">
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => { setMode("login"); setError(""); }} className="text-indigo-400 hover:underline font-mono">
                <LogIn className="w-3 h-3 inline" /> Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}