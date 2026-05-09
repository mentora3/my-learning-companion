import { useState } from "react";
import { GraduationCap, UserCog, ArrowLeft } from "lucide-react";
import { useAuth, type Role } from "../lib/auth";
import logoUrl from "../assets/mentora-logo.png?url";

const accounts: Record<Role, { name: string; email: string; avatar: string }> = {
  student: { name: "أحمد محمد", email: "ahmed@mentora.edu", avatar: "أ" },
  mentor: { name: "د. خالد العتيبي", email: "khalid@mentora.edu", avatar: "خ" },
};

export function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEnter = (r: Role) => {
    setLoading(true);
    setTimeout(() => login({ role: r, ...accounts[r] }), 600);
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-hero)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-[var(--shadow-elegant)] p-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center mb-6">
          <img src={logoUrl} alt="Mentora" className="h-20 w-20 object-contain mb-3" />
          <h1 className="text-2xl font-black bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Mentora</h1>
          <p className="text-xs text-muted-foreground mt-1">نوجّهك اليوم.. لنجاحك غدًا</p>
        </div>

        {!role ? (
          <>
            <h2 className="text-center font-bold text-foreground mb-1">اختر نوع حسابك</h2>
            <p className="text-xs text-center text-muted-foreground mb-5">للوصول إلى البوابة المناسبة</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole("student")}
                className="group rounded-2xl border-2 border-border p-5 text-center hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/15 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center mb-2 transition-all">
                  <GraduationCap className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <div className="font-bold text-foreground text-sm">طالب</div>
                <div className="text-[10px] text-muted-foreground mt-1">تابع تعلّمك وتقدّمك</div>
              </button>
              <button
                onClick={() => setRole("mentor")}
                className="group rounded-2xl border-2 border-border p-5 text-center hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="h-12 w-12 mx-auto rounded-2xl bg-primary/15 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center mb-2 transition-all">
                  <UserCog className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <div className="font-bold text-foreground text-sm">مرشد أكاديمي</div>
                <div className="text-[10px] text-muted-foreground mt-1">أدر طلابك وخططهم</div>
              </button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-6">
              تسجيل الدخول تجريبي — اختر دورًا للدخول مباشرة
            </p>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button onClick={() => setRole(null)} className="text-xs text-muted-foreground flex items-center gap-1 mb-4 hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> العودة
            </button>
            <div className="text-center mb-5">
              <div className="h-16 w-16 mx-auto rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-2xl font-black text-primary-foreground mb-2">
                {accounts[role].avatar}
              </div>
              <div className="font-bold text-foreground">{accounts[role].name}</div>
              <div className="text-xs text-muted-foreground">{accounts[role].email}</div>
            </div>

            <div className="space-y-3">
              <input
                placeholder="البريد الإلكتروني"
                defaultValue={accounts[role].email}
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                defaultValue="••••••••"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
              />
              <button
                disabled={loading}
                onClick={() => handleEnter(role)}
                className="w-full py-3 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "جارٍ الدخول…" : "دخول"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
