import React from "react";

export const FF = "'Tajawal', sans-serif";
export const TEAL = "#00bfa6";
export const TEAL_SOFT = "#e0f7f3";
export const NAVY = "#1e2a38";
export const PURPLE = "#8b5cf6";
export const DANGER = "#ef4444";
export const WARN = "#f59e0b";
export const SUCCESS = "#10b981";
export const MUTED = "#6b7280";
export const BORDER = "#e5e7eb";
export const BG = "#f4f7f6";

export const card: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${BORDER}`,
  borderRadius: 16,
  padding: 18,
  boxShadow: "0 1px 3px rgba(16,24,40,.05)",
};

export function Donut({ value, color = TEAL, size = 110, label }: { value: number; color?: string; size?: number; label?: string }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#eef2f7" strokeWidth="9" fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="9" fill="none"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .6s ease" }} />
      <text x="50%" y={label ? "44%" : "50%"} textAnchor="middle" dy="0.35em"
        fontSize={size * 0.2} fontWeight={700} fill="#1e2a38">{value}%</text>
      {label && (
        <text x="50%" y="62%" textAnchor="middle" fontSize={size * 0.11} fill={MUTED}>{label}</text>
      )}
    </svg>
  );
}

export function Bar({ value, color = TEAL }: { value: number; color?: string }) {
  return (
    <div style={{ background: "#eef2f7", borderRadius: 999, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 999, transition: "width .5s ease" }} />
    </div>
  );
}

export function Chip({ label, color = TEAL, bg }: { label: string; color?: string; bg?: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "5px 11px", borderRadius: 999,
      background: bg || color + "1f", color, fontSize: 12, fontWeight: 600,
      margin: "3px 3px 0 0",
    }}>{label}</span>
  );
}

export function StatCard({ icon, title, value, sub, accent }: {
  icon: React.ReactNode; title: string; value: string; sub?: string; accent: string;
}) {
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ color: MUTED, fontSize: 13 }}>{title}</span>
        <span style={{
          width: 38, height: 38, borderRadius: 10, background: accent + "22",
          display: "grid", placeItems: "center", color: accent,
        }}>{icon}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{value}</div>
      {sub && <div style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8 }}>
      <h2 style={{ margin: 0, fontSize: 16, color: NAVY, fontWeight: 700 }}>{children}</h2>
      {action}
    </div>
  );
}

export function Btn({ children, onClick, variant = "primary", color = TEAL, full, size = "md" }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "outline" | "ghost";
  color?: string; full?: boolean; size?: "sm" | "md";
}) {
  const styles: React.CSSProperties = {
    padding: size === "sm" ? "6px 12px" : "10px 16px",
    borderRadius: 10, cursor: "pointer", fontFamily: FF, fontSize: size === "sm" ? 12 : 14,
    fontWeight: 600, transition: ".2s", width: full ? "100%" : undefined,
    border: variant === "outline" ? `1px solid ${color}` : "none",
    background: variant === "primary" ? color : variant === "outline" ? "#fff" : "transparent",
    color: variant === "primary" ? "#fff" : color,
  };
  return <button style={styles} onClick={onClick}>{children}</button>;
}
