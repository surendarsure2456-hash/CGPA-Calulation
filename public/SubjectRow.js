const C = {
  card:   "#16162a",
  border: "#2a2a45",
  text:   "#e8e8f0",
  muted:  "#666688",
};

const inputStyle = {
  background:  "transparent",
  border:      "none",
  color:       C.text,
  padding:     "2px 4px",
  fontSize:    13,
  fontFamily:  "'Courier New', monospace",
  outline:     "none",
  width:       "100%",
};

export default function SubjectRow({ subject, index, onChange, onRemove }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 90px 80px 36px",
      gap: 8,
      marginBottom: 8,
      alignItems: "center",
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: 10,
      transition: "border-color 0.2s"
    }}>
      <input
        style={inputStyle}
        placeholder={`Subject ${index + 1}`}
        value={subject.name}
        onChange={e => onChange(index, "name", e.target.value)}
      />
      <input
        style={{ ...inputStyle, textAlign: "center" }}
        type="number" min="0" max="100" placeholder="—"
        value={subject.marks}
        onChange={e => onChange(index, "marks", e.target.value)}
      />
      <input
        style={{ ...inputStyle, textAlign: "center" }}
        type="number" min="1" max="10" placeholder="—"
        value={subject.credits}
        onChange={e => onChange(index, "credits", e.target.value)}
      />
      <button
        onClick={() => onRemove(index)}
        style={{
          background: "transparent",
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: C.muted,
          cursor: "pointer",
          fontSize: 14,
          width: 32, height: 32,
          transition: "all 0.2s"
        }}
      >×</button>
    </div>
  );
}
