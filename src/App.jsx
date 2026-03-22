import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

const STATUS_CONFIG = {
  ok:      { label: "OK",        color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  due:     { label: "À prévoir", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  overdue: { label: "En retard", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};
const FILTER_LABELS = { all: "Tout", ok: "OK", due: "À prévoir", overdue: "En retard" };
const inputStyle = { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14, fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", outline:"none" };
const labelStyle = { display:"block", fontSize:12, color:"#64748b", fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" };

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.06em", color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.color}33`, borderRadius:4, padding:"2px 8px", textTransform:"uppercase" }}>{cfg.label}</span>;
}
function StatCard({ label, value, accent }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"18px 22px", minWidth:110, flex:1 }}>
      <div style={{ fontSize:28, fontWeight:800, color:accent, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:"#94a3b8", marginTop:4, fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</div>
    </div>
  );
}

export default function App() {
  const [sections, setSections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ name:"", interval:"", last_done:"", notes:"", status:"ok" });
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [{ data: sData, error: sErr }, { data: tData, error: tErr }] = await Promise.all([
        supabase.from("sections").select("*").order("position"),
        supabase.from("tasks").select("*").order("created_at"),
      ]);
      if (sErr) throw sErr;
      if (tErr) throw tErr;
      setSections(sData); setTasks(tData);
      if (sData.length > 0) setActiveSection(sData[0].id);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const allTasks = tasks;
  const totalOk = allTasks.filter(t => t.status==="ok").length;
  const totalDue = allTasks.filter(t => t.status==="due").length;
  const totalOverdue = allTasks.filter(t => t.status==="overdue").length;
  const healthPct = allTasks.length > 0 ? Math.round((totalOk/allTasks.length)*100) : 0;
  const currentSection = sections.find(s => s.id===activeSection);
  const sectionTasks = tasks.filter(t => t.section_id===activeSection);
  const displayItems = filter==="all" ? sectionTasks : sectionTasks.filter(t => t.status===filter);

  async function markDone(id) {
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("tasks").update({ last_done:today, status:"ok" }).eq("id",id);
    if (error) showToast("Erreur lors de la mise à jour","error");
    else { setTasks(prev => prev.map(t => t.id===id ? {...t, last_done:today, status:"ok"} : t)); showToast("Tâche marquée comme faite ✓"); }
    setSaving(false);
  }

  async function saveEdit() {
    setSaving(true);
    const { error } = await supabase.from("tasks").update({ name:editItem.name, interval:editItem.interval, last_done:editItem.last_done||null, notes:editItem.notes, status:editItem.status }).eq("id",editItem.id);
    if (error) showToast("Erreur lors de la sauvegarde","error");
    else { setTasks(prev => prev.map(t => t.id===editItem.id ? {...t,...editItem} : t)); showToast("Modifications enregistrées"); setEditItem(null); }
    setSaving(false);
  }

  async function addTask() {
    if (!newTask.name.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("tasks").insert({ section_id:activeSection, name:newTask.name, interval:newTask.interval, last_done:newTask.last_done||null, notes:newTask.notes, status:newTask.status }).select().single();
    if (error) showToast("Erreur lors de l'ajout","error");
    else { setTasks(prev => [...prev, data]); showToast("Tâche ajoutée ✓"); setNewTask({ name:"", interval:"", last_done:"", notes:"", status:"ok" }); setShowAddModal(false); }
    setSaving(false);
  }

  async function deleteTask(id) {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    const { error } = await supabase.from("tasks").delete().eq("id",id);
    if (error) showToast("Erreur lors de la suppression","error");
    else { setTasks(prev => prev.filter(t => t.id!==id)); showToast("Tâche supprimée"); }
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e,#0d1b2a)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⛵</div>
        <div style={{ color:"#64748b", fontSize:14 }}>Chargement du carnet de bord…</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:"100vh", background:"#0a0f1e", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", color:"#e2e8f0" }}>
      <div style={{ textAlign:"center", maxWidth:400 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>⚠️</div>
        <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Erreur de connexion</div>
        <div style={{ color:"#64748b", fontSize:13, marginBottom:24 }}>{error}</div>
        <div style={{ fontSize:12, color:"#475569", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:16, textAlign:"left" }}>
          Vérifiez vos variables d'environnement :<br/><br/>
          <code style={{ color:"#0ea5e9" }}>REACT_APP_SUPABASE_URL</code><br/>
          <code style={{ color:"#0ea5e9" }}>REACT_APP_SUPABASE_ANON_KEY</code>
        </div>
        <button onClick={fetchData} style={{ marginTop:20, background:"#0ea5e9", border:"none", borderRadius:8, padding:"10px 24px", color:"#fff", fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Réessayer</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0d1b2a 50%,#0a1628 100%)", fontFamily:"'DM Sans',sans-serif", color:"#e2e8f0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", backgroundImage:"radial-gradient(ellipse 80% 50% at 50% -20%,rgba(14,165,233,0.08) 0%,transparent 60%)" }}/>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)} }`}</style>
      {toast && <div style={{ position:"fixed", top:24, right:24, zIndex:200, background:toast.type==="error"?"#ef4444":"#22c55e", color:"#fff", borderRadius:10, padding:"12px 20px", fontSize:14, fontWeight:600, boxShadow:"0 8px 24px rgba(0,0,0,0.3)", animation:"fadeIn 0.2s ease" }}>{toast.msg}</div>}

      <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
        {/* En-tête */}
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:36, flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
              <span style={{ fontSize:28 }}>⛵</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#0ea5e9", letterSpacing:"0.15em", textTransform:"uppercase" }}>Carnet de Maintenance</span>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,5vw,52px)", fontWeight:800, margin:0, background:"linear-gradient(90deg,#e2e8f0 0%,#7dd3fc 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.1 }}>Tamarin</h1>
            <div style={{ fontSize:14, color:"#64748b", marginTop:4, fontWeight:500 }}>Trisbald 36 · Voile n° FRA 7284</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"16px 24px", textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#64748b", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>État du Navire</div>
            <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke={healthPct>70?"#22c55e":healthPct>50?"#f59e0b":"#ef4444"} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(healthPct/100)*201} 201`} transform="rotate(-90 40 40)"/>
              </svg>
              <div style={{ position:"absolute" }}><div style={{ fontSize:18, fontWeight:800, fontFamily:"'Playfair Display',serif", color:"#e2e8f0" }}>{healthPct}%</div></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:12, marginBottom:32, flexWrap:"wrap" }}>
          <StatCard label="Total tâches" value={allTasks.length} accent="#7dd3fc"/>
          <StatCard label="À jour" value={totalOk} accent="#22c55e"/>
          <StatCard label="À prévoir" value={totalDue} accent="#f59e0b"/>
          <StatCard label="En retard" value={totalOverdue} accent="#ef4444"/>
        </div>

        {/* Onglets */}
        <div style={{ display:"flex", gap:8, marginBottom:24, overflowX:"auto", paddingBottom:4 }}>
          {sections.map(s => {
            const st = tasks.filter(t => t.section_id===s.id);
            const alerts = st.filter(t => t.status!=="ok").length;
            const hasOverdue = st.some(t => t.status==="overdue");
            const isActive = s.id===activeSection;
            return (
              <button key={s.id} onClick={() => { setActiveSection(s.id); setFilter("all"); }} style={{ background:isActive?s.color+"22":"rgba(255,255,255,0.03)", border:`1px solid ${isActive?s.color:"rgba(255,255,255,0.08)"}`, borderRadius:10, padding:"10px 18px", color:isActive?s.color:"#94a3b8", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, cursor:"pointer", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:7, transition:"all 0.2s" }}>
                <span>{s.icon}</span>{s.label}
                {alerts>0 && <span style={{ background:hasOverdue?"#ef4444":"#f59e0b", color:"#fff", fontSize:10, fontWeight:700, borderRadius:99, padding:"1px 6px" }}>{alerts}</span>}
              </button>
            );
          })}
        </div>

        {/* Tableau */}
        {currentSection && (
          <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:`linear-gradient(90deg,${currentSection.color}11 0%,transparent 100%)`, flexWrap:"wrap", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{currentSection.icon}</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#e2e8f0" }}>{currentSection.label}</span>
                <span style={{ fontSize:12, color:"#64748b" }}>({sectionTasks.length} tâches)</span>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                {["all","ok","due","overdue"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ background:filter===f?"rgba(255,255,255,0.1)":"transparent", border:`1px solid ${filter===f?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.06)"}`, borderRadius:6, padding:"4px 12px", color:filter===f?"#e2e8f0":"#64748b", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{FILTER_LABELS[f]}</button>
                ))}
                <button onClick={() => setShowAddModal(true)} style={{ background:currentSection.color, border:"none", borderRadius:8, padding:"6px 14px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginLeft:4 }}>+ Ajouter</button>
              </div>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"rgba(255,255,255,0.02)" }}>
                    {["Tâche","Périodicité","Dernière intervention","État","Observations","Actions"].map(h => (
                      <th key={h} style={{ padding:"10px 20px", textAlign:"left", fontSize:11, fontWeight:700, color:"#475569", letterSpacing:"0.08em", textTransform:"uppercase", borderBottom:"1px solid rgba(255,255,255,0.05)", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((task, idx) => (
                    <tr key={task.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", background:idx%2===0?"transparent":"rgba(255,255,255,0.01)", transition:"background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                      onMouseLeave={e => e.currentTarget.style.background=idx%2===0?"transparent":"rgba(255,255,255,0.01)"}>
                      <td style={{ padding:"13px 20px", fontSize:14, fontWeight:600, color:"#cbd5e1", whiteSpace:"nowrap" }}>{task.name}</td>
                      <td style={{ padding:"13px 20px", fontSize:13, color:"#64748b", whiteSpace:"nowrap" }}>{task.interval||"—"}</td>
                      <td style={{ padding:"13px 20px", fontSize:13, color:"#64748b", whiteSpace:"nowrap" }}>{task.last_done||"—"}</td>
                      <td style={{ padding:"13px 20px" }}><StatusBadge status={task.status}/></td>
                      <td style={{ padding:"13px 20px", fontSize:12, color:"#475569", minWidth:140 }}>{task.notes||<span style={{ color:"#2d3748" }}>—</span>}</td>
                      <td style={{ padding:"13px 20px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => markDone(task.id)} disabled={saving} style={{ background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:6, padding:"4px 10px", color:"#22c55e", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", whiteSpace:"nowrap" }}>✓ Fait</button>
                          <button onClick={() => setEditItem({...task})} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"4px 10px", color:"#94a3b8", fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Modifier</button>
                          <button onClick={() => deleteTask(task.id)} style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:6, padding:"4px 10px", color:"#ef4444", fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayItems.length===0 && <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:"#334155", fontSize:14 }}>Aucune tâche ne correspond à ce filtre.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div style={{ textAlign:"center", marginTop:32, fontSize:12, color:"#1e3a5f" }}>Tamarin · Trisbald 36 · Carnet de maintenance · {new Date().getFullYear()}</div>
      </div>

      {/* Modal Modifier */}
      {editItem && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={() => setEditItem(null)}>
          <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, padding:32, width:"100%", maxWidth:480 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 24px", fontSize:22, color:"#e2e8f0" }}>Modifier la tâche</h2>
            {[{label:"Nom de la tâche",key:"name",type:"text"},{label:"Périodicité",key:"interval",type:"text"},{label:"Dernière intervention",key:"last_done",type:"date"},{label:"Observations",key:"notes",type:"text"}].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} value={editItem[f.key]||""} onChange={e => setEditItem(p => ({...p,[f.key]:e.target.value}))} style={inputStyle}/>
              </div>
            ))}
            <div style={{ marginBottom:24 }}>
              <label style={labelStyle}>État</label>
              <select value={editItem.status} onChange={e => setEditItem(p => ({...p,status:e.target.value}))} style={{...inputStyle,background:"#1e293b"}}>
                <option value="ok">OK</option><option value="due">À prévoir</option><option value="overdue">En retard</option>
              </select>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={() => setEditItem(null)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 20px", color:"#94a3b8", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", fontSize:14 }}>Annuler</button>
              <button onClick={saveEdit} disabled={saving} style={{ background:"#0ea5e9", border:"none", borderRadius:8, padding:"10px 24px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer", fontSize:14, opacity:saving?0.6:1 }}>{saving?"Enregistrement…":"Enregistrer"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter */}
      {showAddModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={() => setShowAddModal(false)}>
          <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, padding:32, width:"100%", maxWidth:480 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", margin:"0 0 8px", fontSize:22, color:"#e2e8f0" }}>Nouvelle tâche</h2>
            <div style={{ fontSize:13, color:"#475569", marginBottom:24 }}>Ajout dans : <strong style={{ color:currentSection?.color }}>{currentSection?.label}</strong></div>
            {[{label:"Nom de la tâche",key:"name",type:"text",placeholder:""},{label:"Périodicité",key:"interval",type:"text",placeholder:"ex. Annuel, 2 ans"},{label:"Dernière intervention",key:"last_done",type:"date",placeholder:""},{label:"Observations",key:"notes",type:"text",placeholder:""}].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={newTask[f.key]||""} onChange={e => setNewTask(p => ({...p,[f.key]:e.target.value}))} style={inputStyle}/>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
              <button onClick={() => setShowAddModal(false)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"10px 20px", color:"#94a3b8", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", fontSize:14 }}>Annuler</button>
              <button onClick={addTask} disabled={saving} style={{ background:currentSection?.color, border:"none", borderRadius:8, padding:"10px 24px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer", fontSize:14, opacity:saving?0.6:1 }}>{saving?"Ajout…":"Ajouter"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
