import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const replies: { match: RegExp; reply: string }[] = [
  { match: /(تحليل|بيانات|إحصاء)/, reply: "بناءً على أدائك، أنصحك بالتركيز على وحدة Pandas هذا الأسبوع. هل أرشّح لك تمارين عملية؟ 📊" },
  { match: /(خطة|خطتي)/, reply: "خطتك الحالية مكتملة بنسبة 60%. المرحلة التالية: تطبيق ما تعلمته على مشروع صغير." },
  { match: /(وقت|مذاكرة|مذكرة)/, reply: "جرّب تقنية بومودورو: 25 دقيقة تركيز ثم 5 راحة. ستحسّن إنتاجيتك بشكل ملحوظ ⏰" },
  { match: /(وظيفة|مهنة|عمل)/, reply: "أعلى تطابق وظيفي معك حاليًا: محلل بيانات مبتدئ (65%). أنصحك ببناء portfolio بسيط 💼" },
  { match: /(شكر|تمام|ok)/, reply: "بالتوفيق دائمًا! أنا هنا متى احتجتني 🌟" },
];

function getReply(text: string): string {
  for (const r of replies) if (r.match.test(text)) return r.reply;
  return "سؤال رائع! دعني أفكر… بشكل عام، أنصحك بمراجعة لوحة الأداء وتحديد المهارة الأضعف للبدء بها. هل تريد توصية مخصصة أكثر؟ 🤔";
}

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "مرحبًا 👋 أنا مرشدك الذكي في Mentora. كيف أساعدك اليوم؟" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { role: "ai", text: getReply(t) }]), 600);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="المساعد الذكي"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-40 w-[min(380px,calc(100vw-3rem))] h-[480px] bg-card rounded-2xl shadow-[var(--shadow-elegant)] border border-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[image:var(--gradient-hero)] p-4 text-nav-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-glow" />
              </div>
              <div>
                <div className="font-bold text-sm">مرشدك الذكي</div>
                <div className="text-[10px] text-nav-foreground/70 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> متصل
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card text-foreground border border-border rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="اكتب سؤالك…"
              className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary"
            />
            <button onClick={send} className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
