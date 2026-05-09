import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mentora — لوحة الأداء" },
      { name: "description", content: "نظرة عامة على أداء ليان: الحضور، المعدل، الواجبات والتنبيهات الذكية." },
    ],
  }),
  component: Home,
});

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[image:var(--gradient-card)] p-5 shadow-[var(--shadow-soft)] text-center border border-border/50">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function Home() {
  const performance = 78;
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">مرحبًا، ليان 👋</h1>
        <p className="text-muted-foreground mt-1">إليك ملخص أدائك التعليمي اليوم</p>
      </div>

      {/* Performance card */}
      <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-8 shadow-[var(--shadow-elegant)] text-nav-foreground relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative">
          <h3 className="text-nav-foreground/80 text-sm font-medium mb-2">مؤشر الأداء العام</h3>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-6xl font-black bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">{performance}%</span>
            <span className="text-success text-sm mb-2">▲ +4% هذا الأسبوع</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[image:var(--gradient-primary)] rounded-full transition-all" style={{ width: `${performance}%` }} />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat icon="📊" label="الحضور" value="92%" />
        <Stat icon="⭐" label="المعدل" value="3.65" />
        <Stat icon="✅" label="الواجبات" value="85%" />
      </div>

      {/* Alert */}
      <div className="rounded-2xl bg-warning/10 border-r-4 border-warning p-5 shadow-[var(--shadow-soft)]">
        <h3 className="flex items-center gap-2 text-warning-foreground font-bold mb-2">
          <span>⚠️</span> تنبيه ذكي
        </h3>
        <p className="text-sm text-foreground/80">
          مستوى التقدم في مادة <strong>تحليل البيانات</strong> يتطلب مراجعة إضافية هذا الأسبوع.
        </p>
      </div>
    </div>
  );
}
