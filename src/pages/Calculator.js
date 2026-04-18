import { useState } from 'react';
import SubjectRow from '../components/SubjectRow';
import CGPARing from '../components/CGPARing';
import BarChart from '../components/BarChart';
import { calcCGPA, gradeFromMarks, cgpaColor, cgpaClass } from '../helpers';
import { Storage } from '../storage';

const C = {
  card:   "#16162a",
  border: "#2a2a45",
  text:   "#e8e8f0",
  muted:  "#666688",
  accent: "#00e5a0",
  accent2:"#3dd6f5",
};

const inputStyle = {
  background:  "#0d0d1a",
  border:      `1px solid ${C.border}`,
  borderRadius: 8,
  color:       C.text,
  padding:     "9px 12px",
  fontSize:    13,
  fontFamily:  "'Courier New', monospace",
  outline:     "none",
  width:       "100%",
};

const btnPrimary = {
  background:  `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
  border:      "none",
  borderRadius: 8,
  color:       "#050510",
  padding:     "11px 20px",
  fontSize:    13,
  fontWeight:  700,
  cursor:      "pointer",
  fontFamily:  "'Courier New', monospace",
  letterSpacing: 1,
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

export default function Calculator({ showToast }) {
  const [semName,  setSemName]  = useState("");
  const [subjects, setSubjects] = useState([{ name: "", marks: "", credits: "" }]);
  const [cgpa,     setCgpa]     = useState(null);
  const [loading,  setLoading]  = useState(false);

  const addRow = () => setSubjects([...subjects, { name: "", marks: "", credits: "" }]);

  const removeRow = (i) => {
    const updated = subjects.filter((_, idx) => idx !== i);
    setSubjects(updated.length ? updated : [{ name: "", marks: "", credits: "" }]);
    setCgpa(null);
  };

  const updateSubject = (i, field, val) => {
    const updated = [...subjects];
    updated[i][field] = val;
    setSubjects(updated);
    setCgpa(null);
  };

  const handleCalculate = () => {
    for (const s of subjects) {
      if (!s.marks || !s.credits)                     { showToast("Fill all marks & credits", "error"); return; }
      if (parseFloat(s.marks) < 0 || parseFloat(s.marks) > 100) { showToast("Marks must be 0–100", "error"); return; }
      if (parseFloat(s.credits) <= 0)                 { showToast("Credits must be > 0", "error"); return; }
    }
    setCgpa(calcCGPA(subjects));
  };

  const handleSave = async () => {
    if (cgpa === null)      { showToast("Calculate first!", "error"); return; }
    if (!semName.trim())    { showToast("Enter semester name", "error"); return; }
    setLoading(true);
    try {
      await Storage.save({
        semester:     semName.trim(),
        subjects,
        cgpa,
        savedAt:      new Date().toISOString(),
        totalCredits: subjects.reduce((a, s) => a + parseFloat(s.credits || 0), 0)
      });
      showToast(`Saved "${semName}" ✓`);
      setSemName("");
      setSubjects([{ name: "", marks: "", credits: "" }]);
      setCgpa(null);
    } catch (e) {
      showToast("Save failed", "error");
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Semester Name */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 10, color: C.muted, letterSpacing: 2, display: "block", marginBottom: 6 }}>
          SEMESTER NAME
        </label>
        <input
          style={inputStyle}
          placeholder="e.g. Semester 3 — 2024"
          value={semName}
          onChange={e => setSemName(e.target.value)}
        />
      </div>

      {/* Column Headers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px 36px", gap: 8, marginBottom: 6, padding: "0 2px" }}>
        {["SUBJECT", "MARKS /100", "CREDITS", ""].map((h, i) => (
          <span key={i} style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5 }}>{h}</span>
        ))}
      </div>

      {/* Subject Rows */}
      {subjects.map((s, i) => (
        <SubjectRow key={i} subject={s} index={i} onChange={updateSubject} onRemove={removeRow} />
      ))}

      {/* Grade Preview */}
      {subjects.some(s => s.marks) && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {subjects.map((s, i) => {
            if (!s.marks) return null;
            const { letter, gp } = gradeFromMarks(parseFloat(s.marks));
            return (
              <div key={i} style={{
                background: `${cgpaColor(gp)}18`,
                border: `1px solid ${cgpaColor(gp)}44`,
                borderRadius: 6, padding: "3px 8px",
                fontSize: 10, color: cgpaColor(gp), letterSpacing: 1
              }}>
                {s.name || `S${i + 1}`} · <strong>{letter}</strong> · {gp.toFixed(1)}
              </div>
            );
          })}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button onClick={addRow} style={{ ...btnGhost, flex: 1 }}>+ ADD SUBJECT</button>
        <button onClick={handleCalculate} style={{ ...btnPrimary, flex: 1 }}>CALCULATE</button>
      </div>

      {/* Result */}
      {cgpa !== null && (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: 24, marginBottom: 20
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <CGPARing value={cgpa} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>RESULT</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: C.muted }}>Total Credits</span>
                  <span>{subjects.reduce((a, s) => a + parseFloat(s.credits || 0), 0)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: C.muted }}>Subjects</span>
                  <span>{subjects.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: C.muted }}>Class</span>
                  <span style={{ color: cgpaColor(cgpa) }}>{cgpaClass(cgpa)}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <BarChart subjects={subjects} />
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{ ...btnPrimary, width: "100%", marginTop: 16, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "SAVING..." : "SAVE TO DATABASE"}
          </button>
        </div>
      )}

      {/* Formula */}
      <div style={{
        background: `${C.accent}08`,
        border: `1px solid ${C.accent}22`,
        borderRadius: 8, padding: "10px 14px"
      }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 1, marginBottom: 4 }}>FORMULA</div>
        <div style={{ fontSize: 11, color: C.accent }}>
          GP = Marks ÷ 10 &nbsp;·&nbsp; CGPA = Σ(GP × Credits) ÷ Σ Credits
        </div>
      </div>
    </div>
  );
}
