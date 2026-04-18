export default function Toast({ msg, type }) {
  if (!msg) return null;

  const bg     = type === "error" ? "#ff6b6b22" : "#00e5a022";
  const border = type === "error" ? "#ff6b6b"   : "#00e5a0";

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      background: bg,
      border: `1px solid ${border}`,
      color: border,
      padding: "10px 22px",
      borderRadius: 8,
      fontSize: 13,
      fontFamily: "monospace",
      zIndex: 9999,
      animation: "fadeIn 0.3s ease",
      letterSpacing: 1,
      whiteSpace: "nowrap"
    }}>
      {msg}
    </div>
  );
}
