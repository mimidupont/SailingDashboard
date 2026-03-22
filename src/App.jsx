import { useState } from "react";

const SECTIONS = [
  {
    id: "coque",
    label: "Coque & Pont",
    icon: "⛵",
    color: "#0ea5e9",
    items: [
      { id: "h1", name: "Peinture antifouling", interval: "Annuel", lastDone: "2024-04-10", notes: "Coppercoat Ultra utilisé", status: "ok" },
      { id: "h2", name: "Contrôle osmose coque", interval: "2 ans", lastDone: "2023-06-01", notes: "", status: "due" },
      { id: "h3", name: "Inspection boulons de quille", interval: "Annuel", lastDone: "2024-04-10", notes: "Tous serrés au couple", status: "ok" },
      { id: "h4", name: "Palier de safran", interval: "2 ans", lastDone: "2024-04-10", notes: "", status: "ok" },
      { id: "h5", name: "Rebouchage visserie pont", interval: "5 ans", lastDone: "2021-05-01", notes: "Bases chandeliers faites", status: "overdue" },
      { id: "h6", name: "Inspection cadènes", interval: "3 ans", lastDone: "2022-03-15", notes: "", status: "due" },
      { id: "h7", name: "Vannes de cockpit", interval: "Annuel", lastDone: "2024-04-10", notes: "", status: "ok" },
      { id: "h8", name: "Calfatage pont teck", interval: "3 ans", lastDone: "2023-07-01", notes: "Sikaflex 291i", status: "ok" },
    ],
  },
  {
    id: "greement",
    label: "Gréement & Voiles",
    icon: "🪝",
    color: "#f59e0b",
    items: [
      { id: "r1", name: "Gréement dormant", interval: "10 ans", lastDone: "2020-05-01", notes: "1x19 inox 316", status: "due" },
      { id: "r2", name: "Gréement courant", interval: "5 ans", lastDone: "2022-04-01", notes: "Drisses Dyneema", status: "ok" },
      { id: "r3", name: "Chaussettes de barres de flèche", interval: "2 ans", lastDone: "2024-03-01", notes: "", status: "ok" },
      { id: "r4", name: "Inspection pied de mât", interval: "Annuel", lastDone: "2024-04-01", notes: "", status: "ok" },
      { id: "r5", name: "Révision système d'enrouleur", interval: "2 ans", lastDone: "2023-04-01", notes: "Furlex 200S", status: "due" },
      { id: "r6", name: "Inspection grand-voile", interval: "Annuel", lastDone: "2024-04-01", notes: "Bande UV usée", status: "ok" },
      { id: "r7", name: "Inspection génois", interval: "Annuel", lastDone: "2024-04-01", notes: "", status: "ok" },
      { id: "r8", name: "Réglage tension haubans", interval: "Annuel", lastDone: "2024-04-10", notes: "Jauge Loos D02", status: "ok" },
    ],
  },
  {
    id: "moteur",
    label: "Moteur & Propulsion",
    icon: "⚙️",
    color: "#ef4444",
    items: [
      { id: "e1", name: "Huile moteur & filtre", interval: "Annuel / 100h", lastDone: "2024-04-10", notes: "Volvo Penta D2-40, 15W-40", status: "ok" },
      { id: "e2", name: "Turbine eau de mer", interval: "Annuel", lastDone: "2024-04-10", notes: "", status: "ok" },
      { id: "e3", name: "Vérification liquide de refroid.", interval: "Annuel", lastDone: "2024-04-10", notes: "", status: "ok" },
      { id: "e4", name: "Anodes (arbre & hélice)", interval: "Annuel", lastDone: "2024-04-10", notes: "", status: "ok" },
      { id: "e5", name: "Filtre carburant primaire", interval: "Annuel", lastDone: "2024-04-10", notes: "Racor 500", status: "ok" },
      { id: "e6", name: "Filtre carburant secondaire", interval: "Annuel", lastDone: "2024-04-10", notes: "", status: "ok" },
      { id: "e7", name: "Courroie d'entraînement", interval: "2 ans", lastDone: "2023-04-01", notes: "", status: "due" },
      { id: "e8", name: "Rinçage échangeur thermique", interval: "3 ans", lastDone: "2022-04-01", notes: "", status: "overdue" },
      { id: "e9", name: "Inspection hélice", interval: "Annuel", lastDone: "2024-04-10", notes: "Tripale à volets", status: "ok" },
      { id: "e10", name: "Presse-étoupe arbre", interval: "2 ans", lastDone: "2023-04-01", notes: "", status: "due" },
    ],
  },
  {
    id: "electrique",
    label: "Électricité",
    icon: "⚡",
    color: "#a855f7",
    items: [
      { id: "el1", name: "Test parc batteries", interval: "Annuel", lastDone: "2024-03-15", notes: "2x AGM 120Ah", status: "ok" },
      { id: "el2", name: "Connexions quai", interval: "Annuel", lastDone: "2024-03-15", notes: "", status: "ok" },
      { id: "el3", name: "Feux de navigation", interval: "Annuel", lastDone: "2024-03-15", notes: "Tout passé en LED", status: "ok" },
      { id: "el4", name: "Test pompe de cale", interval: "6 mois", lastDone: "2024-09-01", notes: "Auto & manuel OK", status: "due" },
      { id: "el5", name: "Contrôle VHF", interval: "Annuel", lastDone: "2024-03-15", notes: "DSC enregistré", status: "ok" },
      { id: "el6", name: "Mise à jour traceur GPS", interval: "Annuel", lastDone: "2024-03-15", notes: "Garmin 742xs", status: "ok" },
      { id: "el7", name: "Test transpondeur AIS", interval: "Annuel", lastDone: "2024-03-15", notes: "Classe B", status: "ok" },
      { id: "el8", name: "Nettoyage panneaux solaires", interval: "6 mois", lastDone: "2024-10-01", notes: "2x 100W", status: "due" },
    ],
  },
  {
    id: "securite",
    label: "Sécurité & Urgence",
    icon: "🆘",
    color: "#f43f5e",
    items: [
      { id: "s1", name: "Révision radeau de survie", interval: "3 ans", lastDone: "2023-06-01", notes: "6 pers. offshore", status: "ok" },
      { id: "s2", name: "Batterie EPIRB", interval: "5 ans", lastDone: "2021-06-01", notes: "406 MHz homologué", status: "overdue" },
      { id: "s3", name: "Péremption fusées de détresse", interval: "3 ans", lastDone: "2022-06-01", notes: "Vérifier dates DLU", status: "overdue" },
      { id: "s4", name: "Révision gilets de sauvetage", interval: "Annuel", lastDone: "2024-04-01", notes: "4x auto 150N", status: "ok" },
      { id: "s5", name: "Extincteurs", interval: "Annuel", lastDone: "2024-04-01", notes: "2x poudre ABC", status: "ok" },
      { id: "s6", name: "Inspection filières de sécurité", interval: "Annuel", lastDone: "2024-04-01", notes: "", status: "ok" },
      { id: "s7", name: "Équipement homme à la mer", interval: "Annuel", lastDone: "2024-04-01", notes: "Bouée + fer à cheval", status: "ok" },
      { id: "s8", name: "Réapprovisionnement trousse 1ers secours", interval: "Annuel", lastDone: "2024-04-01", notes: "", status: "ok" },
    ],
  },
  {
    id: "plomberie",
    label: "Plomberie & Systèmes",
    icon: "🚿",
    color: "#14b8a6",
    items: [
      { id: "p1", name: "Révision vannes de coque", interval: "Annuel", lastDone: "2024-04-10", notes: "6 au total, graissées", status: "ok" },
      { id: "p2", name: "Inspection cale", interval: "Annuel", lastDone: "2024-04-10", notes: "", status: "ok" },
      { id: "p3", name: "Révision WC (Jabsco)", interval: "2 ans", lastDone: "2023-04-01", notes: "Clapet Joker + turbine", status: "due" },
      { id: "p4", name: "Rinçage réservoir eau douce", interval: "Annuel", lastDone: "2024-04-10", notes: "Cuve inox 150L", status: "ok" },
      { id: "p5", name: "Membrane dessalinisateur", interval: "5 ans", lastDone: "2020-04-01", notes: "Spectra 200GPD", status: "overdue" },
      { id: "p6", name: "Inspection colliers de serrage", interval: "Annuel", lastDone: "2024-04-10", notes: "Tous sous la flottaison", status: "ok" },
    ],
  },
];

const STATUS_CONFIG = {
  ok: { label: "OK", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  due: { label: "À prévoir", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  overdue: { label: "En retard", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
      color: cfg.color, background: cfg.bg,
      border: `1px solid ${cfg.color}33`,
      borderRadius: 4, padding: "2px 8px", textTransform: "uppercase",
    }}>{cfg.label}</span>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12, padding: "18px 22px", minWidth: 110, flex: 1,
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: accent, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("coque");
  const [editItem, setEditItem] = useState(null);
  const [sections, setSections] = useState(SECTIONS);
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", interval: "", lastDone: "", notes: "", status: "ok" });

  const allItems = sections.flatMap(s => s.items.map(i => ({ ...i, section: s.label, sectionId: s.id })));
  const totalOk = allItems.filter(i => i.status === "ok").length;
  const totalDue = allItems.filter(i => i.status === "due").length;
  const totalOverdue = allItems.filter(i => i.status === "overdue").length;

  const currentSection = sections.find(s => s.id === activeSection);
  const displayItems = filter === "all"
    ? currentSection.items
    : currentSection.items.filter(i => i.status === filter);

  const healthPct = Math.round((totalOk / allItems.length) * 100);

  function saveEdit() {
    setSections(prev => prev.map(s => ({
      ...s, items: s.items.map(i => i.id === editItem.id ? editItem : i)
    })));
    setEditItem(null);
  }

  function addTask() {
    if (!newTask.name) return;
    const id = `custom_${Date.now()}`;
    setSections(prev => prev.map(s => s.id === activeSection
      ? { ...s, items: [...s.items, { ...newTask, id }] } : s
    ));
    setNewTask({ name: "", interval: "", lastDone: "", notes: "", status: "ok" });
    setShowAddModal(false);
  }

  function markDone(itemId) {
    const today = new Date().toISOString().split("T")[0];
    setSections(prev => prev.map(s => ({
      ...s, items: s.items.map(i => i.id === itemId ? { ...i, lastDone: today, status: "ok" } : i)
    })));
  }

  const filterLabels = { all: "Tout", ok: "OK", due: "À prévoir", overdue: "En retard" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e2e8f0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14,165,233,0.08) 0%, transparent 60%)`,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* En-tête */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 28 }}>⛵</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0ea5e9", letterSpacing: "0.15em", textTransform: "uppercase" }}>Carnet de Maintenance</span>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, margin: 0,
              background: "linear-gradient(90deg, #e2e8f0 0%, #7dd3fc 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1,
            }}>Tamarin</h1>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 4, fontWeight: 500 }}>Trisbald 36 · Voile n° FRA 7284</div>
          </div>

          {/* Jauge de santé */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, padding: "16px 24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>État du Navire</div>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="32" fill="none"
                  stroke={healthPct > 70 ? "#22c55e" : healthPct > 50 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(healthPct / 100) * 201} 201`}
                  transform="rotate(-90 40 40)"
                  style={{ transition: "stroke-dasharray 0.6s ease" }}
                />
              </svg>
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: "#e2e8f0" }}>{healthPct}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          <StatCard label="Total tâches" value={allItems.length} accent="#7dd3fc" />
          <StatCard label="À jour" value={totalOk} accent="#22c55e" />
          <StatCard label="À prévoir" value={totalDue} accent="#f59e0b" />
          <StatCard label="En retard" value={totalOverdue} accent="#ef4444" />
        </div>

        {/* Onglets de section */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {sections.map(s => {
            const sOverdue = s.items.filter(i => i.status === "overdue").length;
            const sDue = s.items.filter(i => i.status === "due").length;
            const isActive = s.id === activeSection;
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                background: isActive ? s.color + "22" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isActive ? s.color : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "10px 18px",
                color: isActive ? s.color : "#94a3b8",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                cursor: "pointer", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 7, transition: "all 0.2s",
              }}>
                <span>{s.icon}</span>
                {s.label}
                {(sOverdue > 0 || sDue > 0) && (
                  <span style={{
                    background: sOverdue > 0 ? "#ef4444" : "#f59e0b",
                    color: "#fff", fontSize: 10, fontWeight: 700,
                    borderRadius: 99, padding: "1px 6px", minWidth: 16, textAlign: "center",
                  }}>{sOverdue + sDue}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panneau principal */}
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, overflow: "hidden",
        }}>
          {/* En-tête du panneau */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: `linear-gradient(90deg, ${currentSection.color}11 0%, transparent 100%)`,
            flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{currentSection.icon}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>{currentSection.label}</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>({currentSection.items.length} tâches)</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {["all", "ok", "due", "overdue"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? "rgba(255,255,255,0.1)" : "transparent",
                  border: `1px solid ${filter === f ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 6, padding: "4px 12px",
                  color: filter === f ? "#e2e8f0" : "#64748b",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>{filterLabels[f]}</button>
              ))}
              <button onClick={() => setShowAddModal(true)} style={{
                background: currentSection.color, border: "none", borderRadius: 8,
                padding: "6px 14px", color: "#fff", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginLeft: 4,
              }}>+ Ajouter</button>
            </div>
          </div>

          {/* Tableau */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  {["Tâche", "Périodicité", "Dernière intervention", "État", "Observations", "Actions"].map(h => (
                    <th key={h} style={{
                      padding: "10px 20px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: "#475569",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item, idx) => (
                  <tr key={item.id} style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"}
                  >
                    <td style={{ padding: "13px 20px", fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>{item.name}</td>
                    <td style={{ padding: "13px 20px", fontSize: 13, color: "#64748b" }}>{item.interval}</td>
                    <td style={{ padding: "13px 20px", fontSize: 13, color: "#64748b", fontVariantNumeric: "tabular-nums" }}>{item.lastDone || "—"}</td>
                    <td style={{ padding: "13px 20px" }}><StatusBadge status={item.status} /></td>
                    <td style={{ padding: "13px 20px", fontSize: 12, color: "#475569", maxWidth: 200 }}>{item.notes || <span style={{ color: "#2d3748" }}>—</span>}</td>
                    <td style={{ padding: "13px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => markDone(item.id)} style={{
                          background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)",
                          borderRadius: 6, padding: "4px 10px", color: "#22c55e",
                          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        }}>✓ Fait</button>
                        <button onClick={() => setEditItem({ ...item })} style={{
                          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 6, padding: "4px 10px", color: "#94a3b8",
                          fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        }}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {displayItems.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#334155", fontSize: 14 }}>Aucune tâche ne correspond à ce filtre.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pied de page */}
        <div style={{ textAlign: "center", marginTop: 32, fontSize: 12, color: "#1e3a5f" }}>
          Tamarin · Trisbald 36 · Carnet de maintenance · {new Date().getFullYear()}
        </div>
      </div>

      {/* Modal Modifier */}
      {editItem && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }} onClick={() => setEditItem(null)}>
          <div style={{
            background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16, padding: 32, width: "100%", maxWidth: 480,
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", margin: "0 0 24px", fontSize: 22 }}>Modifier la tâche</h2>
            {[
              { label: "Nom de la tâche", key: "name", type: "text" },
              { label: "Périodicité", key: "interval", type: "text" },
              { label: "Dernière intervention", key: "lastDone", type: "date" },
              { label: "Observations", key: "notes", type: "text" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
                <input type={f.type} value={editItem[f.key] || ""} onChange={e => setEditItem(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", outline: "none",
                  }} />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>État</label>
              <select value={editItem.status} onChange={e => setEditItem(prev => ({ ...prev, status: e.target.value }))}
                style={{
                  width: "100%", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", outline: "none",
                }}>
                <option value="ok">OK</option>
                <option value="due">À prévoir</option>
                <option value="overdue">En retard</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setEditItem(null)} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                padding: "10px 20px", color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontSize: 14,
              }}>Annuler</button>
              <button onClick={saveEdit} style={{
                background: "#0ea5e9", border: "none", borderRadius: 8,
                padding: "10px 24px", color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, cursor: "pointer", fontSize: 14,
              }}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter */}
      {showAddModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16, padding: 32, width: "100%", maxWidth: 480,
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", margin: "0 0 8px", fontSize: 22 }}>Nouvelle tâche</h2>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>Ajout dans : <strong style={{ color: currentSection.color }}>{currentSection.label}</strong></div>
            {[
              { label: "Nom de la tâche", key: "name", type: "text" },
              { label: "Périodicité", key: "interval", type: "text", placeholder: "ex. Annuel, 2 ans" },
              { label: "Dernière intervention", key: "lastDone", type: "date" },
              { label: "Observations", key: "notes", type: "text" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder || ""} value={newTask[f.key] || ""} onChange={e => setNewTask(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", outline: "none",
                  }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={() => setShowAddModal(false)} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                padding: "10px 20px", color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontSize: 14,
              }}>Annuler</button>
              <button onClick={addTask} style={{
                background: currentSection.color, border: "none", borderRadius: 8,
                padding: "10px 24px", color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, cursor: "pointer", fontSize: 14,
              }}>Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
