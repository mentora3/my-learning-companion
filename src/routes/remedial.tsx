import { toast } from "sonner";
import { createFileRoute } from "@tanstack/react-router";
import { useStudentProfile, STYLE_META, type LearningStyle, generatePlan } from "@/lib/student-profile";
import { Check, RefreshCw, Sparkles } from "lucide-react";

export const Route = createFileRoute("/remedial")({
  head: () => ({
    meta: [
      { title: "Mentora — الخطة العلاجية" },
      { name: "description", content: "خطة علاجية تكيّفية مخصّصة لكل طالب بناءً على مستواه وأسلوب تعلّمه." },
    ],
  }),
  component: RemedialPage,
});

const colorMap: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  warning: { bg: "bg-warning/15", text: "text-warning-foreground", ring: "ring-warning", dot: "bg-warning" },
  primary: { bg: "bg-primary/15", text: "text-primary", ring: "ring-primary", dot: "bg-primary" },
  success: { bg: "bg-success/15", text: "text-success", ring: "ring-success", dot: "bg-success" },
};

const STYLE_KEYS: LearningStyle[] = [
  "interactive",
  "summary",
  "mindmap",
  "microtasks",
  "practical",
  "video",
  "smartq",
  "gradual",
];

function RemedialPage() {
  const ctx = useStudentProfile();

  if (!ctx) {
    return (
      <div className="rounded-2xl bg-card p-6 text-center text-muted-foreground">
        الخطة العلاجية متاحة لحساب الطالب.
      </div>
    );
  }

  const { profile, plan, toggleTask, switchStyle, reanalyze } = ctx;
  const total = plan.reduce((n, s) => n + s.items.length, 0);
  const done = Object.entries(profile.progress).filter(([, v]) => v).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center text-2xl shrink-0">
          {STYLE_META[profile.learningStyle].icon}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl">خطتك العلاجية المخصّصة 💡</h1>
          <p className="text-sm text-muted-foreground mt-1">
            مبنية على مستواك ({profile.level}/100) ونقاط ضعفك وأسلوب تعلّمك المفضل.
            الخطة مرنة وتتغيّر معك.
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 text-nav-foreground shadow-[var(--shadow-elegant)]">
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-2xl font-black text-primary-glow">{plan.length}</div>
            <div className="text-[10px] text-nav-foreground/70 mt-1">مراحل</div>
          </div>
          <div>
            <div className="text-2xl font-black text-primary-glow">{total}</div>
            <div className="text-[10px] text-nav-foreground/70 mt-1">مهام</div>
          </div>
          <div>
            <div className="text-2xl font-black text-primary-glow">{pct}%</div>
            <div className="text-[10px] text-nav-foreground/70 mt-1">إنجاز</div>
          </div>
          <div>
            <div className="text-2xl font-black text-primary-glow">v{profile.planVersion}</div>
            <div className="text-[10px] text-nav-foreground/70 mt-1">إصدار الخطة</div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary-glow transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Learning style switcher */}
      <div className="rounded-2xl bg-card p-5 border border-border/50 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> أسلوب التعلم
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              غيّر الأسلوب وسيُعاد بناء الخطة بالكامل لتناسبك.
            </div>
          </div>
          <button
            onClick={() => {
              reanalyze();
              toast.success("أُعيد تحليل ملفك وتم اقتراح أسلوب جديد.");
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg"
          >
            <RefreshCw className="h-3.5 w-3.5" /> إعادة تحليل
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STYLE_KEYS.map((s) => {
            const active = s === profile.learningStyle;
            const m = STYLE_META[s];
            return (
              <button
                key={s}
                onClick={() => {
                  switchStyle(s, "اختيار يدوي من الطالب");
                  toast.success(`تم التحديث إلى: ${m.label}`);
                }}
                className={`text-right p-3 rounded-xl border transition-all ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]"
                    : "bg-card hover:bg-muted border-border"
                }`}
              >
                <div className="text-xl mb-1">{m.icon}</div>
                <div className="text-xs font-bold">{m.label}</div>
                <div className={`text-[10px] mt-0.5 ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {m.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-4">
        {plan.map((s) => {
          const c = colorMap[s.color];
          return (
            <div key={s.num} className="rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)] border border-border/50">
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
              <ul className="space-y-1.5 mt-4 pt-3 border-t border-border/50">
                {s.items.map((it) => {
                  const done = !!profile.progress[it.id];
                  return (
                    <li key={it.id}>
                      <button
                        onClick={() => toggleTask(it.id)}
                        className={`w-full text-right flex items-start gap-2 text-sm rounded-lg p-2 hover:bg-muted/60 transition-colors text-foreground`}
                      >
                        <span
                          className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                            done ? "bg-success border-success text-white" : `border-border ${c.dot}/0`
                          }`}
                        >
                          {done && <Check className="h-3 w-3" />}
                        </span>
                        <span>{it.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* History */}
      {profile.history.length > 1 && (
        <div className="rounded-2xl bg-card p-5 border border-border/50">
          <div className="font-bold text-foreground mb-2 text-sm">سجل تعديلات الخطة</div>
          <ul className="space-y-1.5 text-xs">
            {profile.history.slice(0, 5).map((h, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="font-bold text-foreground">{STYLE_META[h.style].label}</span>
                <span>— {h.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => toast.success(`خطتك تحتوي ${generatePlan(profile).length} مراحل بأسلوب ${STYLE_META[profile.learningStyle].label}`)}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-[var(--shadow-glow)]"
      >
        عرض الخطة الكاملة ←
      </button>
    </div>
  );
}
