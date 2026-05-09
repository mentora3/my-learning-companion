import { createFileRoute } from "@tanstack/react-router";
import logoUrl from "../assets/mentora-logo.png?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mentora — لوحة الأداء" },
      { name: "description", content: "نظرة عامة على أدائك الأكاديمي والمهاري ومسارك المهني." },
    ],
  }),
  component: Home,
});

function QuickStat({ icon, label, value, tone = "primary" }: { icon: string; label: string; value: string; tone?: "primary" | "warning" | "success" }) {
  const tones = {
    primary: "text-primary",
    warning: "text-warning-foreground",
    success: "text-success",
  };
  return (
    <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border border-border/50 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-xl font-black ${tones[tone]}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function Home() {
  const performance = 78;
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Welcome header with logo */}
      <div className="flex items-center gap-4">
        <img src={logoUrl} alt="Mentora" className="h-16 w-16 object-contain bg-white rounded-2xl p-2 shadow-[var(--shadow-soft)]" />
        <div className="flex-1">
          <h1 className="text-2xl">مرحبًا بك 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">جاهزين نواصل رحلتك نحو التميّز؟</p>
        </div>
      </div>

      {/* Performance hero */}
      <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 shadow-[var(--shadow-elegant)] text-nav-foreground relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-nav-foreground/80 text-sm font-medium">مؤشر الأداء العام</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">جيد</span>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-black bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">{performance}%</span>
            <span className="text-success text-xs mb-2">▲ تحسّن +12% عن الشهر الماضي</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[image:var(--gradient-primary)] rounded-full" style={{ width: `${performance}%` }} />
          </div>
          <p className="mt-4 text-sm text-nav-foreground/70">أنت تسير في الاتجاه الصحيح! استمر، وسنساعدك للوصول لأفضل النتائج.</p>
        </div>
      </div>

      {/* Quick stats */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground mb-3">نظرة سريعة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickStat icon="📅" label="الحضور" value="92%" tone="success" />
          <QuickStat icon="⭐" label="المعدل التراكمي" value="3.65" />
          <QuickStat icon="✅" label="إكمال الواجبات" value="85%" tone="success" />
          <QuickStat icon="🛡️" label="مستوى المخاطر" value="منخفض" tone="success" />
        </div>
      </div>

      {/* Graduation progress */}
      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">🎓 التقدم نحو التخرج</h3>
          <span className="text-2xl font-black text-success">68%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-success rounded-full" style={{ width: "68%" }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">102 من 150 ساعة معتمدة</p>
      </div>

      {/* Career paths */}
      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-foreground flex items-center gap-2">💼 مسارك المهني</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">أفضل الوظائف المناسبة لك</p>

        <div className="rounded-xl bg-accent/40 p-4 mb-3 flex items-center justify-between">
          <div>
            <div className="font-bold text-foreground">محلل بيانات مبتدئ</div>
            <div className="text-xs text-muted-foreground mt-1">توافق مع مهاراتك</div>
          </div>
          <div className="text-2xl font-black text-primary">65%</div>
        </div>

        {[
          { title: "مطور ويب مبتدئ", value: 58 },
          { title: "أخصائي ذكاء أعمال", value: 53 },
          { title: "أخصائي نظم معلومات", value: 48 },
        ].map((j) => (
          <div key={j.title} className="flex items-center justify-between py-2.5 border-t border-border/50">
            <span className="text-sm text-foreground">{j.title}</span>
            <span className="text-xs font-bold text-primary px-2 py-1 rounded-full bg-primary/10">{j.value}%</span>
          </div>
        ))}
      </div>

      {/* Smart alert */}
      <div className="rounded-2xl bg-warning/10 border-r-4 border-warning p-5 shadow-[var(--shadow-soft)]">
        <h3 className="flex items-center gap-2 text-warning-foreground font-bold mb-2">
          <span>⚠️</span> تنبيه ذكي
        </h3>
        <p className="text-sm text-foreground/80">
          مستوى التقدم في مادة <strong>تحليل البيانات</strong> يتطلب مراجعة إضافية هذا الأسبوع.
        </p>
      </div>

      {/* Upcoming tasks */}
      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">📅 المهام القادمة</h3>
        <ul className="space-y-3">
          {[
            { date: "25 مايو", title: "واجب مشروع قواعد البيانات", due: "خلال يومين", tone: "destructive" },
            { date: "28 مايو", title: "اختبار منتصف الفصل — تحليل الأنظمة", due: "خلال 5 أيام", tone: "warning" },
            { date: "2 يونيو", title: "تسليم مشروع تطوير الويب", due: "خلال 10 أيام", tone: "primary" },
          ].map((t) => (
            <li key={t.title} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
              <span className={`mt-1.5 h-2 w-2 rounded-full ${t.tone === "destructive" ? "bg-destructive" : t.tone === "warning" ? "bg-warning" : "bg-primary"}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.date} 2024</div>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${t.tone === "destructive" ? "bg-destructive/10 text-destructive" : t.tone === "warning" ? "bg-warning/20 text-warning-foreground" : "bg-primary/10 text-primary"}`}>
                مستحق {t.due}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
