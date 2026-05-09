import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Mentora — المهارات" },
      { name: "description", content: "تقييم مهاراتك الأساسية ومقارنتها بالمستوى المطلوب للوظائف." },
    ],
  }),
  component: SkillsPage,
});

const skills = [
  { name: "التفكير التحليلي", you: 78, target: 85 },
  { name: "التواصل", you: 82, target: 75 },
  { name: "المهارات التقنية", you: 65, target: 90 },
  { name: "العمل الجماعي", you: 80, target: 80 },
  { name: "حل المشكلات", you: 70, target: 85 },
];

// Radar chart with 5 axes
function RadarChart() {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 110;
  const n = skills.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, val: number) => {
    const r = (val / 100) * radius;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };

  const polygon = (key: "you" | "target") =>
    skills.map((s, i) => point(i, s[key]).join(",")).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-xs mx-auto">
      {/* Grid */}
      {[20, 40, 60, 80, 100].map((p) => (
        <polygon
          key={p}
          points={skills.map((_, i) => point(i, p).join(",")).join(" ")}
          fill="none" stroke="var(--border)" strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {skills.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />;
      })}
      {/* Target (dashed green) */}
      <polygon points={polygon("target")} fill="oklch(0.7 0.16 155 / 0.1)" stroke="oklch(0.7 0.16 155)" strokeWidth="2" strokeDasharray="5 4" />
      {/* You (solid primary) */}
      <polygon points={polygon("you")} fill="var(--primary)" fillOpacity="0.25" stroke="var(--primary)" strokeWidth="2" />
      {skills.map((_, i) => {
        const [x, y] = point(i, skills[i].you);
        return <circle key={i} cx={x} cy={y} r="4" fill="var(--primary)" />;
      })}
      {/* Labels */}
      {skills.map((s, i) => {
        const [x, y] = point(i, 122);
        return (
          <text key={s.name} x={x} y={y} textAnchor="middle" dy=".3em" className="fill-foreground text-[10px] font-bold">
            {s.name}
          </text>
        );
      })}
    </svg>
  );
}

function SkillsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">المهارات 🎓</h1>
        <p className="text-muted-foreground mt-1">قارن مهاراتك بالمستوى المطلوب للوظائف</p>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-4 text-center">المهارات الأساسية</h3>
        <RadarChart />
        <div className="flex items-center justify-center gap-5 mt-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> مستواك</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-4 border-t-2 border-dashed border-success" /> المستوى المطلوب</span>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
        <h3 className="font-bold text-foreground mb-4">تفاصيل المهارات</h3>
        <div className="space-y-4">
          {skills.map((s) => {
            const gap = s.target - s.you;
            return (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className={gap > 0 ? "text-warning-foreground" : "text-success"}>
                    {gap > 0 ? `يحتاج +${gap}%` : "متجاوز للمستوى ✓"}
                  </span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div className="absolute h-full bg-success/40" style={{ width: `${s.target}%` }} />
                  <div className="absolute h-full bg-[image:var(--gradient-primary)] rounded-full" style={{ width: `${s.you}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>أنت {s.you}%</span>
                  <span>الهدف {s.target}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
