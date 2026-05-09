import { toast } from "sonner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Mentora — المسار المهني" },
      { name: "description", content: "اكتشف الوظائف الأنسب لمهاراتك ومستوى توافقك معها." },
    ],
  }),
  component: CareerPage,
});

const topMatch = {
  title: "محلل بيانات مبتدئ",
  match: 65,
  desc: "وظيفة تركز على جمع البيانات وتنظيفها وتحليلها لاستخراج رؤى تدعم القرار.",
  skills: [
    { name: "تحليل البيانات", level: 70 },
    { name: "Excel & SQL", level: 75 },
    { name: "Python أساسي", level: 55 },
    { name: "التفكير النقدي", level: 80 },
  ],
};

const otherJobs = [
  { title: "مطور ويب مبتدئ", match: 58, demand: "مرتفع", salary: "8 – 12 ألف ر.س" },
  { title: "أخصائي ذكاء أعمال", match: 53, demand: "متوسط", salary: "9 – 14 ألف ر.س" },
  { title: "أخصائي نظم معلومات", match: 48, demand: "متوسط", salary: "7 – 11 ألف ر.س" },
  { title: "مساعد إدارة مشاريع", match: 45, demand: "مرتفع", salary: "8 – 13 ألف ر.س" },
];

const roadmap = [
  { step: 1, title: "إكمال دورة تحليل البيانات", status: "done", note: "أنجزت 100%" },
  { step: 2, title: "تطبيق على مشروع عملي حقيقي", status: "active", note: "قيد التنفيذ" },
  { step: 3, title: "بناء حقيبة أعمال (Portfolio)", status: "todo", note: "مرحلة قادمة" },
  { step: 4, title: "التقدّم لتدريب صيفي", status: "todo", note: "مرحلة قادمة" },
];

function Ring({ value }: { value: number }) {
  const size = 96;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--muted)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="var(--primary)" strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s" }}
      />
      <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="rotate-90 origin-center fill-foreground font-black text-base">
        {value}%
      </text>
    </svg>
  );
}

function CareerPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">المسار المهني 💼</h1>
        <p className="text-muted-foreground mt-1">اكتشف الوظائف الأنسب لك ومدى توافقها مع مهاراتك</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-foreground flex items-center gap-2">🎯 الأنسب لك</h3>
          <span className="text-[10px] px-2 py-1 rounded-full bg-success/15 text-success font-bold">الأعلى توافقًا</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">أفضل توافق وظيفي حسب مهاراتك الحالية</p>

        <div className="rounded-xl bg-accent/40 p-4 flex items-center gap-4">
          <Ring value={topMatch.match} />
          <div className="flex-1">
            <div className="font-bold text-foreground">{topMatch.title}</div>
            <p className="text-xs text-muted-foreground mt-1">{topMatch.desc}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs font-bold text-muted-foreground mb-3">المهارات المطلوبة</div>
          <div className="space-y-3">
            {topMatch.skills.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.level}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-[image:var(--gradient-primary)] rounded-full" style={{ width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => toast.success("تم فتح تفاصيل الوظيفة")} className="mt-4 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            عرض التفاصيل ←
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-4">وظائف أخرى مقترحة</h3>
        <div className="space-y-3">
          {otherJobs.map((j) => (
            <div key={j.title} className="rounded-xl border border-border/60 p-3 flex items-center gap-3 hover:border-primary/40 transition-colors">
              <div className="text-center min-w-[52px]">
                <div className="text-base font-black text-primary">{j.match}%</div>
                <div className="text-[9px] text-muted-foreground">توافق</div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-foreground">{j.title}</div>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success">طلب {j.demand}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{j.salary}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => toast("جارٍ تحميل المزيد من الوظائف…")} className="mt-4 w-full py-2.5 rounded-lg border border-border text-foreground text-sm font-bold hover:bg-muted transition-colors">
          استكشف المزيد من الوظائف
        </button>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-4">🗺️ خارطة الطريق المهنية</h3>
        <ol className="space-y-3">
          {roadmap.map((r) => (
            <li key={r.step} className="flex items-start gap-3">
              <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-black ${
                r.status === "done" ? "bg-success text-white" :
                r.status === "active" ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {r.status === "done" ? "✓" : r.step}
              </div>
              <div className="flex-1 pb-3 border-b border-border/50 last:border-0">
                <div className="text-sm font-medium text-foreground">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.note}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 text-nav-foreground shadow-[var(--shadow-elegant)]">
        <h3 className="font-bold text-nav-foreground mb-2">🚀 جاهز للخطوة التالية؟</h3>
        <p className="text-sm text-nav-foreground/80 mb-4">
          ابدأ ببناء حقيبة أعمالك واطلع على فرص التدريب المتاحة لتعزيز فرصك في سوق العمل.
        </p>
        <button onClick={() => toast.success("تم تسجيلك في المسار 🚀")} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
          استكشاف الفرص ←
        </button>
      </div>
    </div>
  );
}
