import { createFileRoute } from "@tanstack/react-router";
import { Users, TrendingUp, AlertTriangle, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [{ title: "Mentora — لوحة المرشد" }, { name: "description", content: "نظرة عامة لمرشد Mentora." }],
  }),
  component: MentorOverview,
});

function Stat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-black text-foreground mt-1">{value}</div>
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function MentorOverview() {
  const distribution = [
    { label: "متفوّق", value: 8, color: "bg-success" },
    { label: "جيد جدًا", value: 14, color: "bg-primary" },
    { label: "متوسط", value: 7, color: "bg-warning" },
    { label: "يحتاج تدخّل", value: 3, color: "bg-destructive" },
  ];
  const total = distribution.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">لوحة المرشد 🎓</h1>
        <p className="text-muted-foreground mt-1">نظرة شاملة على أداء طلابك</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={Users} label="إجمالي الطلاب" value="32" tone="bg-primary/15 text-primary" />
        <Stat icon={TrendingUp} label="متوسط الأداء" value="74%" tone="bg-success/15 text-success" />
        <Stat icon={AlertTriangle} label="يحتاجون تدخّل" value="3" tone="bg-destructive/15 text-destructive" />
        <Stat icon={GraduationCap} label="خطط نشطة" value="18" tone="bg-warning/15 text-warning-foreground" />
      </div>

      {/* Distribution */}
      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-4">توزيع الطلاب حسب الأداء</h3>
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          {distribution.map((d) => (
            <div key={d.label} className={d.color} style={{ width: `${(d.value / total) * 100}%` }} />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {distribution.map((d) => (
            <div key={d.label} className="flex items-center gap-2 text-sm">
              <span className={`h-3 w-3 rounded-full ${d.color}`} />
              <span className="text-foreground">{d.label}</span>
              <span className="text-muted-foreground mr-auto">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend */}
      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-4">تطوّر الأداء — آخر 6 أسابيع</h3>
        <div className="flex items-end gap-2 h-40">
          {[55, 62, 60, 68, 71, 74].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-[image:var(--gradient-primary)] rounded-t-lg transition-all" style={{ height: `${v}%` }} />
              <span className="text-[10px] text-muted-foreground">أ{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest activity */}
      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-4">آخر النشاطات</h3>
        <ul className="space-y-3">
          {[
            { who: "أحمد محمد", what: "سلّم مشروع تطوير الويب", time: "قبل 10 د", tone: "success" },
            { who: "سارة الحربي", what: "تخلّفت عن تسليم واجبين", time: "قبل ساعة", tone: "destructive" },
            { who: "نورة القحطاني", what: "أكملت 80% من خطتها", time: "قبل 3 س", tone: "primary" },
          ].map((a, i) => (
            <li key={i} className="flex items-center gap-3 text-sm pb-3 border-b border-border/50 last:border-0 last:pb-0">
              <span className={`h-2 w-2 rounded-full ${a.tone === "success" ? "bg-success" : a.tone === "destructive" ? "bg-destructive" : "bg-primary"}`} />
              <div className="flex-1">
                <span className="font-bold text-foreground">{a.who}</span>{" "}
                <span className="text-muted-foreground">{a.what}</span>
              </div>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
