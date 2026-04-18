import { gradeFromMarks, cgpaColor } from '../helpers';

export default function BarChart({ subjects }) {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, padding: "0 4px" }}>
      {subjects.map((s, i) => {
        const pct = (parseFloat(s.marks) / 100) * 100;
        const { letter, gp } = gradeFromMarks(parseFloat(s.marks));
        const color = cgpaColor(gp);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 9, color: "#aaa", fontFamily: "monospace" }}>{letter}</span>
            <div style={{
              width: "100%",
              background: color,
              height: `${pct}%`,
              borderRadius: "3px 3px 0 0",
              transition: "height 0.5s ease",
              minHeight: 4,
              boxShadow: `0 0 8px ${color}88`
            }} />
            <span style={{
              fontSize: 8, color: "#666",
              maxWidth: 28, textAlign: "center",
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"
            }}>
              {s.name || `S${i + 1}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
