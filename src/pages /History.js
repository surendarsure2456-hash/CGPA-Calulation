import { useState, useEffect } from 'react';
import CGPARing from '../components/CGPARing';
import BarChart from '../components/BarChart';
import { cgpaColor, gradeFromMarks } from '../helpers';
import { Storage } from '../storage';

const C = {
  card:   "#16162a",
  border: "#2a2a45",
  text:   "#e8e8f0",
  muted:  "#666688",
  accent: "#00e5a0",
};

const btnGhost = {
  background:  "transparent",
  border:      `1px solid ${C.border}`,
  borderRadius: 8,
  color:       C.muted,
  padding:     "9px 16px",
  fontSize:    12,
  cursor:      "pointer",
  fontFamily:  "'Courier New', monospace",
  letterSpacing: 1,
};

export default function History({ showToast }) {
  const [history,    setHistory]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const records = await Storage.fetchAll();
      setHistory(records);
    } catch (e) {
      showToast("Failed to load history", "error");
    }
    setLoading(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await Storage.delete(id);
    setHistory(h => h.filter(r => r.id !== id));
    showToast("Deleted");
  };

  const overallCGPA = history.length
    ? (history.reduce((a, r) => a + r.cgpa, 0) / history.length).toFixed(2)
    : null;

  return (
    <div>
      {/* Overall Banner */}
      {overallCGPA && (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: 20, marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 4 }}>
              CUMULATIVE CGPA
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: cgpaColor(parseFloat(overallCGPA)) }}>
              {overallCGPA}
            </div>
            <div style={{ fontSize: 10, color: C.muted }}>
              across {history.length} semester{history.length > 1 ? "s" : ""}
            </div>
          </div>
          <CGPARing value={parseFloat(overallCGPA)} size={90} />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", color: C.muted, padding: 40, fontSize: 12, letterSpacing: 2 }}>
          LOADING...
        </div>
      )}

      {/* Empty */}
      {!loading && history.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: C.muted, fontSize: 12, letterSpacing: 2 }}>
          NO RECORDS YET<br />
          <span style={{ fontSize: 10, opacity: 0.5 }}>calculate & save a semester first</span>
        </div>
      )}

      {/* Records */}
      {history.map((record) => (
        <div
          key={record.id}
          onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
          style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 12, marginBottom: 12,
            cursor: "pointer", overflow: "hidden", transition: "all 0.2s"
          }}
        >
          {/* Card Header */}
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                background: `${cgpaColor(record.cgpa)}18`,
                border: `1px solid ${cgpaColor(record.cgpa)}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: cgpaColor(record.cgpa)
              }}>
                {record.cgpa.toFixed(1)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{record.semester}</div>
                <div style={{ fontSize: 10, color: C.muted }}>
                  {record.subjects?.length} subjects · {record.totalCredits} credits · {new Date(record.savedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={(e) => handleDelete(record.id, e)}
                style={{ ...btnGhost, padding: "4px 10px", fontSize: 11 }}
              >DEL</button>
              <span style={{ color: C.muted, fontSize: 14 }}>
                {expandedId === record.id ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {/* Expanded */}
          {expandedId === record.id && (
            <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${C.border}` }}>
              <div style={{ marginTop: 12 }}>
                <BarChart subjects={record.subjects} />
              </div>
              <div style={{ marginTop: 12 }}>
                {record.subjects?.map((s, i) => {
                  const { letter, gp } = gradeFromMarks(parseFloat(s.marks));
                  return (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "6px 0", borderBottom: `1px solid ${C.border}33`, fontSize: 11
                    }}>
                      <span style={{ color: C.muted }}>{s.name || `Subject ${i + 1}`}</span>
                      <span>
                        <span style={{ color: C.muted }}>{s.marks}/100 · </span>
                        <span style={{ color: cgpaColor(gp) }}>{letter}</span>
                        <span style={{ color: C.muted }}> · {s.credits}cr</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}

      {history.length > 0 && (
        <button onClick={loadHistory} style={{ ...btnGhost, width: "100%", marginTop: 8 }}>
          ↻ REFRESH
        </button>
      )}
    </div>
  );
}
