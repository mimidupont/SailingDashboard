import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const inputStyle = {
  width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
  borderRadius:8, padding:"10px 14px", color:"#e2e8f0", fontSize:14,
  fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", outline:"none",
};
const labelStyle = {
  display:"block", fontSize:11, color:"#64748b", fontWeight:600,
  marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em",
};

export default function HistoryModal({ task, boat, onClose, onEntryAdded }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    done_at: new Date().toISOString().split("T")[0],
    notes: "",
    cost: "",
    done_by: "",
  });

  useEffect(() => {
    fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  async function fetchHistory() {
    setLoading(true);
    const { data, error } = await supabase
      .from("maintenance_history")
      .select("*")
      .eq("task_id", task.id)
      .order("done_at", { ascending: false });
    if (!error) setHistory(data);
    setLoading(false);
  }

  async function addEntry() {
    if (!form.done_at) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("maintenance_history")
      .insert({
        task_id: task.id,
        boat_id: boat.id,
        done_at: form.done_at,
        notes: form.notes,
        cost: form.cost ? parseFloat(form.cost) : null,
        done_by: form.done_by,
      })
      .select()
      .single();

    if (!error) {
      setHistory(prev => [data, ...prev]);
      // Update task last_done to the most recent entry
      await supabase.from("tasks").update({ last_done: form.done_at, status: "ok" }).eq("id", task.id);
      onEntryAdded(task.id, form.done_at);
      setForm({ done_at: new Date().toISOString().split("T")[0], notes: "", cost: "", done_by: "" });
      setShowForm(false);
    }
    setSaving(false);
  }

  async function deleteEntry(id) {
    if (!window.confirm("Supprimer cette entrée ?")) return;
    await supabase.from("maintenance_history").delete().eq("id", id);
    setHistory(prev => prev.filter(h => h.id !== id));
  }

  const totalCost = history.reduce((sum, h) => sum + (h.cost || 0), 0);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={onClose}>
      <div style={{ background:"#0f172a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, width:"100%", maxWidth:580, maxHeight:"85vh", display:"flex", flexDirection:"column", overflow:"hidden" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"24px 28px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
            <div>
              <div style={{ fontSize:11, color:"#0ea5e9", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Historique</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#e2e8f0", margin:0 }}>{task.name}</h2>
              <div style={{ fontSize:12, color:"#475569", marginTop:4 }}>{boat.name} · Périodicité : {task.interval || "—"}</div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"6px 12px", color:"#64748b", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:13, flexShrink:0 }}>✕ Fermer</button>
          </div>

          {/* Stats row */}
          {history.length > 0 && (
            <div style={{ display:"flex", gap:16, marginTop:16 }}>
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"8px 14px" }}>
                <div style={{ fontSize:18, fontWeight:800, color:"#7dd3fc", fontFamily:"'Playfair Display',serif" }}>{history.length}</div>
                <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em" }}>Interventions</div>
              </div>
              {totalCost > 0 && (
                <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"8px 14px" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:"#22c55e", fontFamily:"'Playfair Display',serif" }}>{totalCost.toFixed(0)} €</div>
                  <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em" }}>Coût total</div>
                </div>
              )}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"8px 14px" }}>
                <div style={{ fontSize:18, fontWeight:800, color:"#f59e0b", fontFamily:"'Playfair Display',serif" }}>{history[0]?.done_at || "—"}</div>
                <div style={{ fontSize:10, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em" }}>Dernière fois</div>
              </div>
            </div>
          )}
        </div>

        {/* Add entry button or form */}
        <div style={{ padding:"16px 28px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          {!showForm ? (
            <button onClick={() => setShowForm(true)} style={{ background:"#0ea5e9", border:"none", borderRadius:8, padding:"8px 18px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
              + Ajouter une intervention
            </button>
          ) : (
            <div style={{ background:"rgba(14,165,233,0.06)", border:"1px solid rgba(14,165,233,0.15)", borderRadius:12, padding:16 }}>
              <div style={{ fontSize:12, color:"#0ea5e9", fontWeight:700, marginBottom:14, textTransform:"uppercase", letterSpacing:"0.08em" }}>Nouvelle intervention</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input type="date" value={form.done_at} onChange={e => setForm(p => ({...p, done_at:e.target.value}))} style={inputStyle}/>
                </div>
                <div>
                  <label style={labelStyle}>Coût (€)</label>
                  <input type="number" placeholder="0.00" value={form.cost} onChange={e => setForm(p => ({...p, cost:e.target.value}))} style={inputStyle}/>
                </div>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={labelStyle}>Effectué par</label>
                <input type="text" placeholder="ex. Chantier Navals du Port, moi-même…" value={form.done_by} onChange={e => setForm(p => ({...p, done_by:e.target.value}))} style={inputStyle}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={labelStyle}>Notes / pièces utilisées</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({...p, notes:e.target.value}))} placeholder="ex. Turbine Jabsco remplacée, filtre Racor changé…" rows={2} style={{...inputStyle, resize:"vertical"}}/>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => setShowForm(false)} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, padding:"8px 16px", color:"#64748b", fontFamily:"'DM Sans',sans-serif", cursor:"pointer", fontSize:13 }}>Annuler</button>
                <button onClick={addEntry} disabled={saving} style={{ background:"#0ea5e9", border:"none", borderRadius:8, padding:"8px 20px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer", fontSize:13 }}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
              </div>
            </div>
          )}
        </div>

        {/* History timeline */}
        <div style={{ overflowY:"auto", padding:"8px 28px 24px", flex:1 }}>
          {loading ? (
            <div style={{ textAlign:"center", padding:32, color:"#475569", fontSize:13 }}>Chargement…</div>
          ) : history.length === 0 ? (
            <div style={{ textAlign:"center", padding:40 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
              <div style={{ color:"#334155", fontSize:14 }}>Aucune intervention enregistrée.</div>
            </div>
          ) : (
            <div style={{ position:"relative", paddingLeft:20 }}>
              {/* Timeline line */}
              <div style={{ position:"absolute", left:6, top:8, bottom:8, width:2, background:"rgba(255,255,255,0.06)", borderRadius:2 }}/>

              {history.map((entry, idx) => (
                <div key={entry.id} style={{ position:"relative", paddingLeft:24, paddingBottom:idx < history.length-1 ? 20 : 0 }}>
                  {/* Dot */}
                  <div style={{ position:"absolute", left:0, top:6, width:12, height:12, borderRadius:"50%", background: idx===0 ? "#0ea5e9" : "#1e3a5f", border:`2px solid ${idx===0?"#0ea5e9":"#334155"}` }}/>

                  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: (entry.notes || entry.done_by || entry.cost) ? 8 : 0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:13, fontWeight:700, color: idx===0 ? "#0ea5e9" : "#94a3b8" }}>{entry.done_at}</span>
                        {idx === 0 && <span style={{ fontSize:10, background:"rgba(14,165,233,0.15)", color:"#0ea5e9", borderRadius:4, padding:"1px 6px", fontWeight:700 }}>DERNIER</span>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        {entry.cost > 0 && <span style={{ fontSize:12, color:"#22c55e", fontWeight:600 }}>{entry.cost.toFixed(0)} €</span>}
                        <button onClick={() => deleteEntry(entry.id)} style={{ background:"transparent", border:"none", color:"#2d3748", cursor:"pointer", fontSize:13, padding:"0 2px" }}>✕</button>
                      </div>
                    </div>
                    {entry.done_by && <div style={{ fontSize:12, color:"#475569", marginBottom:4 }}>👤 {entry.done_by}</div>}
                    {entry.notes && <div style={{ fontSize:12, color:"#64748b", lineHeight:1.5 }}>{entry.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
