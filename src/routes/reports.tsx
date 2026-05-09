import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Mentora — تقاريري" },
      { name: "description", content: "تقارير تفصيلية عن أداء الطالب الأكاديمي والمهاري." },
    ],
  }),
  component: ReportsPage,
});

const subjects = [
  { name: "الإحصاء التطبيقي", you: 65, avg: 50 },
  { name: "مبادئ الإدارة", you: 60, avg: 55 },
  { name: "الاقتصاد الجزئي", you: 55, avg: 45 },
  { name: "نظم المعلومات", you: 70, avg: 58 },
  { name: "مهارات التواصل", you: 75, avg: 60 },
];

const courses = [
  { code: "B+", grade: "B+", name: "هياكل البيانات", value: 82, tone: "success" },
  { code: "B", grade: "B", name: "قواعد البيانات", value: 76, tone: "success" },
  { code: "C+", grade: "C+", name: "تحليل الأنظمة", value: 65, tone: "warning" },
  { code: "C", grade: "C", name: "الرياضيات المتقطعة", value: 58, tone: "warning" },
  { code: "A", grade: "A", name: "تطوير الويب", value: 90, tone: "success" },
];

const toneClasses: Record<string, string> = {
  success: "bg-success text-white",
  warning: "bg-warning text-warning-foreground",
};

function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">تقاريري 📈</h1>
        <p className="text-muted-foreground mt-1">تحليل شامل لمسارك الدراسي</p>
      </div>

      {/* Filter */}
      <select className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-[var(--shadow-soft)]">
        <option>هذا الفصل الدراسي</option>
        <option>الفصل السابق</option>
        <option>السنة الحالية</option>
      </select>

      {/* Overall performance */}
      <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] border border-border/50">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-foreground">مؤشر الأداء العام</h3>
          <div className="text-right">
            <div className="text-3xl font-black text-primary">78%</div>
            <div className="text-xs text-success">جيد</div>
          </div>
        </div>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-success mt-0.5">📈</span>
            <span className="text-foreground">أداؤك أفضل من <strong>68%</strong> من زملائك</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">↗</span>
            <span className="text-foreground">تحسّن بمقدار <strong>12%</strong> عن الشهر الماضي</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-0.5">●</span>
            <span className="text-foreground">المجال الأكثر يحتاج لتحسين: <strong>المهارات الرقمية</strong></span>
          </li>
        </ul>
      </div>

      {/* Subjects bar chart */}
      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">أداء المواد</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> متوسطك</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-chart-4" /> متوسط القسم</span>
          </div>
        </div>
        <div className="space-y-4">
          {subjects.map((s) => (
            <div key={s.name}>
              <div className="text-xs text-foreground mb-1.5 flex justify-between">
                <span>{s.name}</span>
                <span className="text-muted-foreground">{s.you}%</span>
              </div>
              <div className="flex gap-1 h-6">
                <div className="bg-primary rounded" style={{ width: `${s.you}%` }} />
                <div className="bg-chart-4/60 rounded" style={{ width: `${s.avg}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-4">أداؤك في المقررات — الفصل الحالي</h3>
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black ${toneClasses[c.tone]}`}>{c.grade}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-1">{c.name}</div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.tone === "success" ? "bg-success" : "bg-warning"}`} style={{ width: `${c.value}%` }} />
                </div>
              </div>
              <span className="text-xs font-bold text-muted-foreground w-10 text-left">{c.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="rounded-2xl bg-success/5 border border-success/30 p-5 shadow-[var(--shadow-soft)]">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">💪 نقاط القوة</h3>
        <div className="flex flex-wrap gap-2">
          {["مهارات التواصل", "المشاركة في الأنشطة", "الالتزام بالمواعيد", "التفكير التحليلي"].map((p) => (
            <span key={p} className="px-3 py-1.5 rounded-full bg-success/15 text-success text-xs font-bold">{p}</span>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div className="rounded-2xl bg-warning/10 border border-warning/40 p-5 shadow-[var(--shadow-soft)]">
        <h3 className="font-bold text-warning-foreground mb-3 flex items-center gap-2">🎯 نقاط تحتاج تحسين</h3>
        <div className="flex flex-wrap gap-2">
          {["المهارات الرقمية", "إدارة الوقت", "حل المشكلات"].map((p) => (
            <span key={p} className="px-3 py-1.5 rounded-full bg-warning/20 text-warning-foreground text-xs font-bold">{p}</span>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 text-nav-foreground shadow-[var(--shadow-elegant)]">
        <h3 className="font-bold text-nav-foreground mb-2 flex items-center gap-2">💡 توصية مخصصة لك</h3>
        <p className="text-sm text-nav-foreground/80 mb-4">
          نوصيك بالتركيز على تطوير مهاراتك الرقمية من خلال دورة "أساسيات تحليل البيانات" المتاحة في المنصة.
        </p>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
          استكشاف الدورة ←
        </button>
      </div>
    </div>
  );
}
