import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Mentora — تقارير الأداء" },
      { name: "description", content: "تقارير تفصيلية عن أداء ليان، نقاط القوة ومجالات التحسين." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">تقارير الأداء 📈</h1>
        <p className="text-muted-foreground mt-1">تحليل شامل لمسارك الدراسي</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] border border-border/50">
          <h3 className="text-sm text-muted-foreground mb-2">الأداء العام</h3>
          <div className="text-3xl font-black text-foreground">78%</div>
          <div className="text-success text-sm mt-1">جيد جداً</div>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-[var(--shadow-soft)] border border-border/50">
          <h3 className="text-sm text-muted-foreground mb-2">الترتيب في الفصل</h3>
          <div className="text-3xl font-black text-foreground">5<span className="text-base text-muted-foreground"> / 32</span></div>
          <div className="text-primary text-sm mt-1">من أعلى 20%</div>
        </div>
      </div>

      <div className="rounded-2xl bg-[image:var(--gradient-card)] p-6 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">💪 نقاط القوة</h3>
        <ul className="space-y-2">
          {["التواصل الفعال مع الزملاء", "الالتزام بالمواعيد النهائية", "التفكير النقدي والتحليل"].map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-foreground">
              <span className="text-success">✓</span> {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-warning/10 border border-warning/40 p-6 shadow-[var(--shadow-soft)]">
        <h3 className="font-bold text-warning-foreground mb-3 flex items-center gap-2">🎯 مجالات التحسين</h3>
        <ul className="space-y-2">
          {["تحليل البيانات العميق وتفسير النتائج", "مهارات إدارة الوقت خلال الاختبارات"].map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-foreground/80">
              <span className="text-warning">→</span> {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 text-nav-foreground shadow-[var(--shadow-elegant)]">
        <h3 className="font-bold text-nav-foreground mb-2">💡 توصية ذكية</h3>
        <p className="text-sm text-nav-foreground/80">
          خصّص 30 دقيقة يومياً لحلّ تمارين عملية على Pandas، وستلاحظين تحسناً ملحوظاً خلال أسبوعين.
        </p>
      </div>
    </div>
  );
}
