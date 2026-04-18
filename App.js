import { useState } from 'react';
import Calculator from './pages/Calculator';
import History from './pages/History';
import Toast from './components/Toast';

const C = {
  bg:      "#0a0a12",
  surface: "#11111e",
  border:  "#2a2a45",
  muted:   "#666688",
  accent:  "#00e5a0",
};

export default function App() {
  const [tab,   setTab]   = useState("calculator");
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 2800);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Courier New', monospace", color: "#e8e8f0" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(8px) translateX(-50%) }
          to   { opacity:1; transform:translateY(0) translateX(-50%) }
        }
        input:focus { border-color: #00e5a0 !important; box-shadow: 0 0 0 2px #00e5a022; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.3; }
        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a12; }
        ::-webkit-scrollbar-thumb { background: #2a2a45; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 20px" }}>
        <div style={{
          maxWidth: 560, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 56
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⬡</span>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: 2, color: C.accent }}>CGPA</span>
            <span style={{ color: C.muted, fontSize: 11, letterSpacing: 3, marginTop: 1 }}>CALCULATOR</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["calculator", "history"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background:    tab === t ? `${C.accent}18` : "transparent",
                  border:        "none",
                  borderRadius:  6,
                  color:         tab === t ? C.accent : C.muted,
                  padding:       "6px 14px",
                  fontSize:      11,
                  cursor:        "pointer",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  fontFamily:    "'Courier New', monospace",
                  fontWeight:    tab === t ? 700 : 400,
                  transition:    "all 0.2s",
                }}
              >{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 16px 80px" }}>
        {tab === "calculator"
          ? <Calculator showToast={showToast} />
          : <History    showToast={showToast} />
        }
      </div>

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}
