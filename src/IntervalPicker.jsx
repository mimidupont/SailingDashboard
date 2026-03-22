// IntervalPicker — number input + unit selector
// Stores value as a canonical string: "1 an", "2 ans", "6 mois", "100 heures", etc.
// Special case: value "0" = no periodicity

const UNITS = [
  { value: "heures", label: "Heure(s)", plural: "heures" },
  { value: "mois",   label: "Mois",     plural: "mois"   },
  { value: "ans",    label: "An(s)",    plural: "ans"    },
];

// Parse a canonical interval string back into { qty, unit }
export function parseInterval(str) {
  if (!str) return { qty: 1, unit: "ans" };
  const s = str.toLowerCase().trim();
  if (s.includes("heure")) {
    const m = s.match(/(\d+)/);
    return { qty: m ? parseInt(m[1]) : 1, unit: "heures" };
  }
  if (s.includes("mois")) {
    const m = s.match(/(\d+)/);
    return { qty: m ? parseInt(m[1]) : 1, unit: "mois" };
  }
  // years: "annuel", "1 an", "2 ans", etc.
  const m = s.match(/(\d+)/);
  return { qty: m ? parseInt(m[1]) : 1, unit: "ans" };
}

// Build canonical string from { qty, unit }
export function buildInterval({ qty, unit }) {
  if (!qty || qty <= 0) return "";
  if (unit === "heures") return `${qty} heure${qty > 1 ? "s" : ""}`;
  if (unit === "mois")   return `${qty} mois`;
  if (unit === "ans")    return qty === 1 ? "Annuel" : `${qty} ans`;
  return "";
}

const selectStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#e2e8f0",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
};

export default function IntervalPicker({ value, onChange }) {
  const parsed = parseInterval(value);

  function handleQty(e) {
    const qty = parseInt(e.target.value) || 1;
    onChange(buildInterval({ qty, unit: parsed.unit }));
  }

  function handleUnit(e) {
    onChange(buildInterval({ qty: parsed.qty, unit: e.target.value }));
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {/* Quantity selector */}
      <select value={parsed.qty} onChange={handleQty} style={{ ...selectStyle, width: 90 }}>
        {[1,2,3,4,5,6,7,8,9,10,12,15,18,20,24,36,48,60,100,150,200,250,500].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* Unit selector */}
      <select value={parsed.unit} onChange={handleUnit} style={{ ...selectStyle, flex: 1 }}>
        {UNITS.map(u => (
          <option key={u.value} value={u.value}>{u.label}</option>
        ))}
      </select>

      {/* Preview */}
      <div style={{
        display: "flex", alignItems: "center",
        fontSize: 12, color: "#475569", whiteSpace: "nowrap",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8, padding: "0 12px", minWidth: 80,
      }}>
        {buildInterval({ qty: parsed.qty, unit: parsed.unit }) || "—"}
      </div>
    </div>
  );
}
