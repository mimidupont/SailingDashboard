import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@tamarin.fr");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Identifiants incorrects. Veuillez réessayer.");
    else onLogin(data.session);
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0", padding: 24,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14,165,233,0.08) 0%, transparent 60%)" }}/>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>⛵</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 800, margin: 0,
            background: "linear-gradient(90deg, #e2e8f0 0%, #7dd3fc 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1,
          }}>Tamarin</h1>
          <div style={{ fontSize: 13, color: "#475569", marginTop: 6, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>Carnet de Maintenance</div>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: 36,
        }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Identifiant
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "12px 16px", color: "#e2e8f0", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "12px 16px", color: "#e2e8f0", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ef4444", marginBottom: 20 }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{
            width: "100%", background: loading ? "#0369a1" : "#0ea5e9",
            border: "none", borderRadius: 10, padding: "14px",
            color: "#fff", fontSize: 15, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif", cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#1e3a5f" }}>
          Trisbald 36 · FRA 7284
        </div>
      </div>
    </div>
  );
}
