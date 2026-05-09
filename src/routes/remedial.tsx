import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/remedial")({
  head: () => ({
    meta: [
      { title: "Mentora — الخطة العلاجية" },
      { name: "description", content: "خطة علاجية مخصصة بناءً على تحليل أدائك واحتياجاتك." },
    ],
  }),
  component: RemedialPage,
});

const stages = [
  {
    num: 1,
    title: "تقوية أكاديمية",
    icon: "📚",
    color: "warning",
    desc: "مواد داعمة إلزامية",
    items: ["مراجعة أساسيات الإحصاء", "حل تمارين تحليل البيانات", "حضور جلسات استذكار"],
  },
  {
    num: 2,
    title: "تعلم وتطوير",
    icon: "🎯",
    color: "primary",
    desc: "دورات ومصادر مقترحة",
    items: ["دورة Pandas للمبتدئين", "دورة SQL التطبيقية", "ورشة عرض البيانات"],
  },
  {
    num: 3,
    title: "متابعة وتقييم",
    icon: "📋",
    color: "success",
    desc: "جلسة متابعة بعد 4 أسابيع",
    items: ["اختبار تشخيصي", "جلسة مع المرشد الأكاديمي", "تقييم التقدّم"],
  },
];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  warning: { bg: "bg-warning/15", text: "text-warning-foreground", ring: "ring-warning" },
  primary: { bg: "bg-primary/15", text: "text-primary", ring: "ring-primary" },
  success: { bg: "bg-success/15", text: "text-success", ring: "ring-success" },
};

function RemedialPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center text-2xl shrink-0">🎯</div>
        <div>
          <h1 className="text-2xl">الخطة العلاجية المخصصة 💡</h1>
          <p className="text-sm text-muted-foreground mt-1">تم إنشاء هذه الخطة بناءً على تحليل أدائك واحتياجاتك</p>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 text-nav-foreground shadow-[var(--shadow-elegant)]">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-black text-primary-glow">3</div>
            <div className="text-[10px] text-nav-foreground/70 mt-1">مراحل</div>
          </div>
          <div>
            <div className="text-2xl font-black text-primary-glow">12</div>
            <div className="text-[10px] text-nav-foreground/70 mt-1">مهام</div>
          </div>
          <div>
            <div className="text-2xl font-black text-primary-glow">4</div>
            <div className="text-[10px] text-nav-foreground/70 mt-1">أسابيع</div>
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {stages.map((s) => {
          const c = colorMap[s.color];
          return (
            <div key={s.num} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-12 w-12 rounded-xl ${c.bg} flex items-center justify-center text-xl ring-2 ${c.ring} ring-opacity-20`}>
                  {s.icon}
                </div>
                <div className="flex-1">
                  <div className={`text-[10px] font-bold ${c.text}`}>المرحلة {s.num}</div>
                  <div className="font-bold text-foreground">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              </div>
              <ul className="space-y-2 mt-4 pt-3 border-t border-border/50">
                {s.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm text-foreground">
                    <span className={`mt-1 h-1.5 w-1.5 rounded-full ${c.text === "text-primary" ? "bg-primary" : c.text === "text-success" ? "bg-success" : "bg-warning"}`} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-[var(--shadow-glow)]">
        عرض الخطة الكاملة ←
      </button>
    </div>
  );
}
