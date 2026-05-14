import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { pushNotificationFor } from "./notifications";

export type LearningStyle =
  | "interactive"
  | "summary"
  | "mindmap"
  | "microtasks"
  | "practical"
  | "video"
  | "smartq"
  | "gradual";

export type StudentProfile = {
  name: string;
  email: string;
  level: number; // 0-100 academic level
  engagement: number; // 0-100
  pace: "slow" | "normal" | "fast";
  weaknesses: string[];
  strengths: string[];
  learningStyle: LearningStyle;
  planVersion: number;
  lastUpdated: number;
  history: { at: number; style: LearningStyle; reason: string }[];
  progress: Record<string, boolean>; // taskId -> done
};

export const STYLE_META: Record<LearningStyle, { label: string; icon: string; desc: string }> = {
  interactive: { label: "التعلم التفاعلي", icon: "💬", desc: "حوار وأسئلة وتطبيق فوري" },
  summary: { label: "التلخيص المبسط", icon: "📝", desc: "نقاط قصيرة وواضحة" },
  mindmap: { label: "الخرائط الذهنية", icon: "🧠", desc: "ربط المفاهيم بصرياً" },
  microtasks: { label: "تقسيم المهام الصغيرة", icon: "🧩", desc: "خطوة خطوة دون إرهاق" },
  practical: { label: "التدريب العملي", icon: "⚙️", desc: "أمثلة وتطبيقات حقيقية" },
  video: { label: "الفيديوهات التعليمية", icon: "🎬", desc: "محتوى مرئي مختار" },
  smartq: { label: "الأسئلة الذكية", icon: "❓", desc: "أسئلة تفتح التفكير" },
  gradual: { label: "التعلم التدريجي", icon: "📈", desc: "من الأبسط إلى الأعقد" },
};

const KEY = (email: string) => `mentora_profile_${email}`;

const defaultProfile = (name: string, email: string): StudentProfile => ({
  name,
  email,
  level: 58,
  engagement: 62,
  pace: "normal",
  weaknesses: ["تحليل البيانات", "الإحصاء التطبيقي"],
  strengths: ["البرمجة الأساسية", "حل المشكلات"],
  learningStyle: "interactive",
  planVersion: 1,
  lastUpdated: Date.now(),
  history: [{ at: Date.now(), style: "interactive", reason: "خطة أولية بناءً على التقييم التشخيصي" }],
  progress: {},
});

type Stage = {
  num: number;
  title: string;
  icon: string;
  color: "warning" | "primary" | "success";
  desc: string;
  items: { id: string; text: string }[];
};

export function generatePlan(p: StudentProfile): Stage[] {
  const weakness = p.weaknesses[0] || "المادة الأضعف";
  const styleName = STYLE_META[p.learningStyle].label;

  const stage1Items: Record<LearningStyle, string[]> = {
    interactive: [`جلسة حوارية حول ${weakness}`, "اختبار تفاعلي قصير يومياً", "نقاش مع زميل دراسة"],
    summary: [`ملخص نقاط ${weakness} في صفحة واحدة`, "بطاقات مراجعة سريعة", "خلاصة أسبوعية مكتوبة"],
    mindmap: [`خريطة ذهنية شاملة لـ ${weakness}`, "ربط المفاهيم بأمثلة حياتية", "إعادة رسم الخريطة من الذاكرة"],
    microtasks: [`تقسيم ${weakness} إلى 5 مهام صغيرة`, "إنجاز مهمة واحدة يومياً", "متابعة الإنجاز في قائمة"],
    practical: [`تطبيق عملي على ${weakness}`, "حل تمارين متدرّجة", "مشروع صغير في نهاية الأسبوع"],
    video: [`فيديوهات مختارة عن ${weakness}`, "تلخيص الفيديو بكلماتك", "مشاهدة بسرعة 1.25x مع توقفات"],
    smartq: [`أسئلة استكشافية حول ${weakness}`, "اكتب 3 أسئلة قبل كل درس", "ناقش الإجابات مع المرشد الذكي"],
    gradual: [`ابدأ بأسهل مفاهيم ${weakness}`, "أضِف مفهوماً جديداً كل يومين", "اختبار تثبيت قبل الانتقال"],
  };

  return [
    {
      num: 1,
      title: `تقوية ${weakness}`,
      icon: STYLE_META[p.learningStyle].icon,
      color: "warning",
      desc: `بأسلوب: ${styleName}`,
      items: stage1Items[p.learningStyle].map((t, i) => ({ id: `s1-${i}`, text: t })),
    },
    {
      num: 2,
      title: "تطوير المهارات",
      icon: "🎯",
      color: "primary",
      desc: p.pace === "slow" ? "جرعات صغيرة وثابتة" : p.pace === "fast" ? "تحديات أعلى للحفاظ على الإيقاع" : "إيقاع متوازن",
      items: [
        { id: "s2-0", text: `دورة تطبيقية في ${weakness}` },
        { id: "s2-1", text: "ورشة عملية مع المرشد" },
        { id: "s2-2", text: "مشروع توظيف ما تعلّمت" },
      ],
    },
    {
      num: 3,
      title: "متابعة وتقييم",
      icon: "📋",
      color: "success",
      desc: p.engagement < 40 ? "متابعة أسبوعية لرفع التفاعل" : "متابعة كل أسبوعين",
      items: [
        { id: "s3-0", text: "اختبار تشخيصي قصير" },
        { id: "s3-1", text: "جلسة مع المرشد الأكاديمي" },
        { id: "s3-2", text: "إعادة تقييم الخطة بناءً على النتائج" },
      ],
    },
  ];
}

type Ctx = {
  profile: StudentProfile;
  plan: Stage[];
  toggleTask: (id: string) => void;
  switchStyle: (style: LearningStyle, reason: string) => void;
  reanalyze: () => void;
  updateProfile: (patch: Partial<StudentProfile>) => void;
};

const ProfileCtx = createContext<Ctx | null>(null);

export function StudentProfileProvider({
  children,
  name,
  email,
  enabled,
}: {
  children: ReactNode;
  name: string;
  email: string;
  enabled: boolean;
}) {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window === "undefined") return defaultProfile(name, email);
    try {
      const raw = localStorage.getItem(KEY(email));
      if (raw) return JSON.parse(raw) as StudentProfile;
    } catch {}
    return defaultProfile(name, email);
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY(email), JSON.stringify(profile));
    } catch {}
  }, [profile, email]);

  const plan = useMemo(() => generatePlan(profile), [profile]);

  const toggleTask = useCallback((id: string) => {
    setProfile((p) => {
      const progress = { ...p.progress, [id]: !p.progress[id] };
      const done = Object.values(progress).filter(Boolean).length;
      const total = generatePlan(p).reduce((n, s) => n + s.items.length, 0);
      const newEngagement = Math.min(100, Math.round((done / total) * 100));
      return { ...p, progress, engagement: Math.max(p.engagement, newEngagement), lastUpdated: Date.now() };
    });
  }, []);

  const switchStyle = useCallback((style: LearningStyle, reason: string) => {
    setProfile((p) => {
      if (style === p.learningStyle) return p;
      pushNotificationFor("student", {
        title: "تم تحديث خطتك العلاجية ✨",
        body: `تم التبديل إلى أسلوب: ${STYLE_META[style].label}.`,
        tone: "success",
      });
      pushNotificationFor("mentor", {
        title: `تغيير خطة لطالب`,
        body: `${p.name} انتقل إلى أسلوب ${STYLE_META[style].label}.`,
        tone: "info",
      });
      return {
        ...p,
        learningStyle: style,
        planVersion: p.planVersion + 1,
        lastUpdated: Date.now(),
        history: [{ at: Date.now(), style, reason }, ...p.history].slice(0, 20),
      };
    });
  }, []);

  const reanalyze = useCallback(() => {
    setProfile((p) => {
      // Pick next style different from current based on weak engagement / pace
      const order: LearningStyle[] = ["interactive", "microtasks", "practical", "video", "summary", "mindmap", "smartq", "gradual"];
      const next = order.find((s) => s !== p.learningStyle) || "summary";
      pushNotificationFor("student", {
        title: "أعدنا تحليل أدائك 🔄",
        body: `الخطة الجديدة تعتمد على ${STYLE_META[next].label}.`,
        tone: "info",
      });
      return {
        ...p,
        learningStyle: next,
        planVersion: p.planVersion + 1,
        lastUpdated: Date.now(),
        history: [{ at: Date.now(), style: next, reason: "إعادة تحليل تلقائية بناءً على الأداء" }, ...p.history].slice(0, 20),
      };
    });
  }, []);

  const updateProfile = useCallback((patch: Partial<StudentProfile>) => {
    setProfile((p) => ({ ...p, ...patch, lastUpdated: Date.now() }));
  }, []);

  // Proactive alert: detect risk (low engagement + low level) once per session
  useEffect(() => {
    if (!enabled) return;
    const flagKey = `mentora_alert_${email}_${profile.planVersion}`;
    if (sessionStorage.getItem(flagKey)) return;
    if (profile.engagement < 45 || profile.level < 50) {
      sessionStorage.setItem(flagKey, "1");
      setTimeout(() => {
        pushNotificationFor("student", {
          title: "تنبيه استباقي ⚠️",
          body: "لاحظنا تباطؤاً في تقدّمك. افتح المرشد الذكي للحصول على خطة بديلة.",
          tone: "warning",
        });
        pushNotificationFor("mentor", {
          title: `طالب يحتاج تدخّل مبكر`,
          body: `${profile.name} يقترب من منطقة الخطر — يُنصح بمراجعة خطته.`,
          tone: "warning",
        });
      }, 2500);
    }
  }, [enabled, email, profile.engagement, profile.level, profile.name, profile.planVersion]);

  if (!enabled) return <>{children}</>;
  return (
    <ProfileCtx.Provider value={{ profile, plan, toggleTask, switchStyle, reanalyze, updateProfile }}>
      {children}
    </ProfileCtx.Provider>
  );
}

export function useStudentProfile(): Ctx | null {
  return useContext(ProfileCtx);
}
