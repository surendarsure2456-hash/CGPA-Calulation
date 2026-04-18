import { cgpaColor } from '../helpers';

export default function CGPARing({ value, size = 120 }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / 10, 1);
  const offset = circ - pct * circ;
  const color = cgpaColor(value);

  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}
    >
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
      <text x="50" y="46" textAnchor="middle" fill={color}
        fontSize="18" fontWeight="700" fontFamily="'Courier New', monospace">
        {value.toFixed(2)}
      </text>
      <text x="50" y="60" textAnchor="middle" fill="#666"
        fontSize="8" fontFamily="sans-serif" letterSpacing="2">
        CGPA
      </text>
    </svg>
  );
}
