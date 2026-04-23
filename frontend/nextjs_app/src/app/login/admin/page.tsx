"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Coffee, ArrowRight, Shield, AlertCircle, Lock } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("username", identifier);
      formData.append("password", password);

      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Invalid credentials.");
        return;
      }

      const meRes = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const meData = await meRes.json();
      if (meData.role !== "admin") {
        setError("This account does not have admin privileges. Access denied.");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_role", "admin");
      router.push("/dashboard/admin");
    } catch (err) {
      setError("Connection error. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-2 mb-6">
          <div className="bg-brand-600 text-white p-2 rounded-xl">
            <Coffee className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl text-foreground">
            ServeSmart<span className="text-brand-600">AI</span>
          </span>
        </Link>
        <div className="flex justify-center mb-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-2xl">
            <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-foreground">Admin Access</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Lock className="h-4 w-4" /> Authorized personnel only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-border">
          {error && (
            <div className="mb-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Admin Email</label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@servemart.ai"
                className="appearance-none block w-full px-3 py-3 border border-border rounded-xl shadow-sm bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="appearance-none block w-full px-3 py-3 border border-border rounded-xl shadow-sm bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-bold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-60 transition-colors gap-2"
            >
              {loading ? "Verifying..." : (<>Access Control Panel <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Wrong page?{" "}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">
              Go back to login selection
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
