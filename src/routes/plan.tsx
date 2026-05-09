import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Mentora — خطتي الذكية" },
      { name: "description", content: "خطة ليان الدراسية الذكية لإتقان مهارات تحليل البيانات." },
    ],
  }),
  component: PlanPage,
});

const steps = [
  { icon: "📘", title: "مراجعة أساسيات الإحصاء الوصفي", status: "done" },
  { icon: "📊", title: "تدريب عملي على مكتبات Pandas & NumPy", status: "active" },
  { icon: "🧪", title: "اختبار تقييم منتصف المدة", status: "todo" },
  { icon: "💼", title: "تسليم المشروع التطبيقي النهائي", status: "todo" },
];

const statusStyles: Record<string, string> = {
  done: "bg-success/10 border-success text-success",
  active: "bg-primary/10 border-primary text-primary",
  todo: "bg-muted border-muted-foreground/30 text-muted-foreground",
};
const statusLabel: Record<string, string> = {
  done: "مكتمل",
  active: "جارٍ الآن",
  todo: "قادم",
};

function PlanPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">خطتك الذكية 🎯</h1>
        <p className="text-muted-foreground mt-1">مسار مخصص يساعدك على الوصول لأهدافك</p>
      </div>

      <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 text-nav-foreground shadow-[var(--shadow-elegant)]">
        <div className="text-sm text-nav-foreground/70 mb-2">الهدف الحالي</div>
        <h2 className="text-xl font-bold text-nav-foreground">إتقان مهارات تحليل البيانات المتقدمة</h2>
        <div className="mt-4 flex items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-glow">⏱ 6 أسابيع</span>
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-glow">🎓 4 مراحل</span>
        </div>
      </div>

      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li
            key={i}
            className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border-r-4 border-primary"
          >
            <div className="text-2xl">{s.icon}</div>
            <div className="flex-1">
              <div className="font-medium text-foreground">{s.title}</div>
              <div className="text-xs text-muted-foreground mt-1">المرحلة {i + 1}</div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyles[s.status]}`}>
              {statusLabel[s.status]}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
