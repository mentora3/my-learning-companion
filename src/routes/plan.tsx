import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Mentora — خطتي الذكية" },
      { name: "description", content: "خطة دراسية ذكية مخصصة لتحسين مستواك في التحليل الإحصائي." },
    ],
  }),
  component: PlanPage,
});

const stages = [
  { num: 1, icon: "📘", title: "أساسيات الإحصاء", desc: "مفاهيم أساسية في الإحصاء الوصفي والاستدلالي", progress: 100, status: "مكتملة" },
  { num: 2, icon: "📊", title: "تحليل البيانات", desc: "التعرف على طرق تحليل البيانات وتفسيرها", progress: 6, status: "قيد التنفيذ" },
  { num: 3, icon: "🧪", title: "الاختبار والتطبيق", desc: "تطبيق ما تم تعلمه على تمارين واختبارات", progress: 0, status: "لم تبدأ" },
  { num: 4, icon: "💼", title: "مشروع تطبيقي", desc: "تنفيذ مشروع نهائي لتحليل بيانات حقيقية", progress: 0, status: "لم تبدأ" },
];

function PlanPage() {
  const [tab, setTab] = useState<"current" | "history">("current");
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">خطتي 🎯</h1>
        <p className="text-muted-foreground mt-1">مسارك الذكي نحو إتقان مهاراتك</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
        <button
          onClick={() => setTab("current")}
          className={`py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "current" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
        >
          الخطة الحالية
        </button>
        <button
          onClick={() => setTab("history")}
          className={`py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "history" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
        >
          سجل الخطط
        </button>
      </div>

      {tab === "current" ? (
        <>
          {/* Active plan card */}
          <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 text-nav-foreground shadow-[var(--shadow-elegant)] relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-3 py-1 rounded-full bg-success/20 text-success font-bold">نشطة</span>
                <span className="text-xs text-nav-foreground/70">10 مارس – 25 مايو 2024</span>
              </div>
              <h2 className="text-xl font-bold text-nav-foreground mb-2">خطة التفوق في التحليل الإحصائي</h2>
              <p className="text-sm text-nav-foreground/80">
                خطة مخصصة لتحسين مستواك في مقرر التحليل الإحصائي وبناء مهارات تحليل البيانات.
              </p>
            </div>
          </div>

          {/* Progress overview */}
          <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">التقدم الكلي للخطة</h3>
              <span className="text-lg font-black text-primary">60%</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-5">
              <div className="h-full bg-[image:var(--gradient-primary)] rounded-full" style={{ width: "60%" }} />
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { v: "8", l: "المهام الكلية" },
                { v: "5", l: "المكتملة" },
                { v: "2", l: "الاختبارات" },
                { v: "12", l: "أيام متبقية" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-xl font-black text-foreground">{s.v}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stages */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">مراحل الخطة</h3>
            <div className="space-y-3">
              {stages.map((s) => (
                <div key={s.num} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-xl">{s.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground text-sm">{s.num}. {s.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      s.progress === 100 ? "bg-success/15 text-success" :
                      s.progress > 0 ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>{s.status}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.progress === 100 ? "bg-success" : "bg-primary"}`} style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl bg-card p-8 shadow-[var(--shadow-soft)] border border-border/50 text-center">
          <div className="text-4xl mb-2">📚</div>
          <h3 className="font-bold text-foreground">لا توجد خطط سابقة بعد</h3>
          <p className="text-sm text-muted-foreground mt-1">ستظهر خططك المكتملة هنا</p>
        </div>
      )}
    </div>
  );
}
