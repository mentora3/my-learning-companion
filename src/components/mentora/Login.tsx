import { useState } from "react";
import { GraduationCap, UserCog, ArrowLeft, Sparkles } from "lucide-react";
import logo from "@/assets/mentora-logo.png";
import { actions, type Role } from "./store";
import { FF, TEAL, NAVY, MUTED, BORDER } from "./shared";

export function Login() {
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const themeColor = role === "mentor" ? NAVY : TEAL;

  const submit = () => {
    const name = role === "mentor" ? "د. سارة العتيبي" : "أحمد محمد";
    actions.login(role!, name);
  };

  return (
    <div dir="rtl" style={{
      fontFamily: FF, minHeight: "100vh",
      background: `linear-gradient(135deg, ${TEAL}15 0%, #fff 50%, ${NAVY}15 100%)`,
      display: "grid", placeItems: "center", padding: 20,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet" />

      <div style={{
        background: "#fff", borderRadius: 24, padding: 28, width: "100%", maxWidth: 440,
        boxShadow: "0 20px 60px rgba(30,42,56,0.12)", border: `1px solid ${BORDER}`,
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img src={logo} alt="Mentora" style={{ height: 70 }} />
          <p style={{ color: MUTED, margin: "6px 0 0", fontSize: 13 }}>نوجّهك اليوم.. لننجحك غداً</p>
        </div>

        {!role ? (
          <>
            <h2 style={{ textAlign: "center", color: NAVY, margin: "0 0 6px", fontSize: 18 }}>
              اختر طريقة الدخول
            </h2>
            <p style={{ textAlign: "center", color: MUTED, fontSize: 13, marginTop: 0 }}>
              ستحصل على تجربة مخصصة حسب دورك
            </p>

            <button onClick={() => setRole("student")} style={roleBtn(TEAL)}>
              <span style={iconCircle(TEAL)}><GraduationCap size={22} /></span>
              <div style={{ textAlign: "right", flex: 1 }}>
                <div style={{ fontWeight: 700, color: NAVY }}>دخول كطالب</div>
                <div style={{ fontSize: 12, color: MUTED }}>لوحة الأداء، الخطة الذكية، الدردشة مع المرشد</div>
              </div>
            </button>

            <button onClick={() => setRole("mentor")} style={roleBtn(NAVY)}>
              <span style={iconCircle(NAVY)}><UserCog size={22} /></span>
              <div style={{ textAlign: "right", flex: 1 }}>
                <div style={{ fontWeight: 700, color: NAVY }}>دخول كمرشد</div>
                <div style={{ fontSize: 12, color: MUTED }}>إدارة الطلاب، تخصيص الخطط، التحليلات</div>
              </div>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0", color: MUTED, fontSize: 12 }}>
              <Sparkles size={14} color={TEAL} />
              <span>نظام آمن ومدعوم بالذكاء الاصطناعي</span>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setRole(null)} style={{
              background: "transparent", border: "none", cursor: "pointer", color: MUTED,
              display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 14, fontFamily: FF, fontSize: 13,
            }}>
              <ArrowLeft size={16} /> رجوع
            </button>

            <h2 style={{ color: themeColor, margin: "0 0 14px", fontSize: 18 }}>
              {role === "student" ? "دخول الطالب" : "دخول المرشد"}
            </h2>

            <label style={lbl}>البريد الجامعي</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="example@university.edu" style={inp} />

            <label style={lbl}>كلمة المرور</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••" style={inp} />

            <button onClick={submit} style={{
              ...btn(themeColor), marginTop: 16,
            }}>دخول إلى لوحة التحكم</button>

            <button onClick={submit} style={{
              ...btn(themeColor, "outline"), marginTop: 8,
            }}>تسجيل دخول افتراضي (تجريبي)</button>

            <p style={{ fontSize: 11, color: MUTED, textAlign: "center", marginTop: 12 }}>
              بالضغط على دخول فإنك توافق على الشروط والأحكام
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const roleBtn = (color: string): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 12, width: "100%",
  padding: 14, borderRadius: 14, border: `1.5px solid ${BORDER}`, background: "#fff",
  cursor: "pointer", marginTop: 12, fontFamily: FF, transition: ".2s",
});
const iconCircle = (color: string): React.CSSProperties => ({
  width: 44, height: 44, borderRadius: 12, background: color + "1a",
  color, display: "grid", placeItems: "center", flexShrink: 0,
});
const lbl: React.CSSProperties = { display: "block", fontSize: 13, color: NAVY, marginTop: 10, marginBottom: 4, fontWeight: 600 };
const inp: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${BORDER}`,
  fontFamily: FF, fontSize: 14, outline: "none", boxSizing: "border-box",
};
const btn = (color: string, variant: "solid" | "outline" = "solid"): React.CSSProperties => ({
  width: "100%", padding: "11px 16px", borderRadius: 10, fontFamily: FF, fontSize: 14, fontWeight: 700,
  cursor: "pointer", border: variant === "outline" ? `1.5px solid ${color}` : "none",
  background: variant === "outline" ? "#fff" : color, color: variant === "outline" ? color : "#fff",
});
