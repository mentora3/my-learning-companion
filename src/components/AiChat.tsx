import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, RefreshCw, ShieldCheck, Flag, Info } from "lucide-react";
import { toast } from "sonner";
import { useStudentProfile, type LearningStyle, STYLE_META } from "@/lib/student-profile";
import { applySafety, reportAIResponse, AI_DISCLOSURE_AR, AI_PRIVACY_NOTICE_AR } from "@/lib/ai-safety";

type Msg = { role: "user" | "assistant"; content: string };

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

function parseSwitch(text: string): LearningStyle | null {
  const m = text.match(/\[SWITCH_STYLE:\s*(\w+)\s*\]/i);
  if (!m) return null;
  const k = m[1].toLowerCase() as LearningStyle;
  return STYLE_KEYS.includes(k) ? k : null;
}

function stripDirective(text: string) {
  return text.replace(/\[SWITCH_STYLE:\s*\w+\s*\]/gi, "").trim();
}

export function AiChat() {
  const ctx = useStudentProfile();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "مرحبًا 👋 أنا مرشد Mentora التقني الذكي. أعرف ملفك الدراسي وأستطيع شرح أي مادة بأي أسلوب يناسبك. لو الخطة الحالية لا تناسبك، فقط قل لي «غيّر الخطة» وسأقترح أسلوباً أفضل.",
    },
  ]);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, streaming]);

  const send = async () => {
    const t = input.trim();
    if (!t || streaming) return;

    const next: Msg[] = [...msgs, { role: "user", content: t }, { role: "assistant", content: "" }];
    setMsgs(next);
    setInput("");
    setStreaming(true);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        body: JSON.stringify({
          messages: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
          profile: ctx
            ? {
                name: ctx.profile.name,
                level: ctx.profile.level,
                weaknesses: ctx.profile.weaknesses,
                strengths: ctx.profile.strengths,
                learningStyle: ctx.profile.learningStyle,
                pace: ctx.profile.pace,
                engagement: ctx.profile.engagement,
              }
            : undefined,
        }),
      });

      if (!res.ok || !res.body) {
        if (res.status === 429) toast.error("الحد الأقصى للطلبات. حاول لاحقاً.");
        else if (res.status === 402) toast.error("رصيد الذكاء الاصطناعي نفد.");
        else toast.error("تعذّر الاتصال بالمرشد الذكي.");
        setMsgs((m) => m.slice(0, -1));
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const s = line.trim();
          if (!s.startsWith("data:")) continue;
          const data = s.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) {
              assistantText += delta;
              const display = stripDirective(assistantText);
              setMsgs((m) => {
                const copy = m.slice();
                copy[copy.length - 1] = { role: "assistant", content: display };
                return copy;
              });
            }
          } catch {
            // ignore non-JSON lines
          }
        }
      }

      // Detect switch directive
      const newStyle = parseSwitch(assistantText);
      if (newStyle && ctx && newStyle !== ctx.profile.learningStyle) {
        ctx.switchStyle(newStyle, "اقتراح من المرشد الذكي بناءً على المحادثة");
        toast.success(`تم تحديث أسلوب التعلم إلى: ${STYLE_META[newStyle].label}`);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast.error("حدث خطأ أثناء الرد.");
        setMsgs((m) => m.slice(0, -1));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const requestPlanChange = () => {
    setInput("الخطة الحالية لا تناسبني، اقترح لي أسلوب تعلم مختلف.");
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
        <div className="fixed bottom-24 left-6 z-40 w-[min(400px,calc(100vw-3rem))] h-[540px] bg-card rounded-2xl shadow-[var(--shadow-elegant)] border border-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[image:var(--gradient-hero)] p-4 text-nav-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-glow" />
              </div>
              <div>
                <div className="font-bold text-sm">مرشد Mentora التقني</div>
                <div className="text-[10px] text-nav-foreground/70 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {ctx ? `أسلوبك: ${STYLE_META[ctx.profile.learningStyle].label}` : "متصل"}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>

          {ctx && (
            <button
              onClick={requestPlanChange}
              className="mx-3 mt-3 inline-flex items-center justify-center gap-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg py-2 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> طلب تغيير أسلوب الخطة العلاجية
            </button>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card text-foreground border border-border rounded-bl-sm"
                  }`}
                >
                  {m.content || (streaming && i === msgs.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={streaming ? "جاري الرد…" : "اسأل عن أي مادة أو طلب…"}
              disabled={streaming}
              className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ring-primary disabled:opacity-60"
            />
            <button
              onClick={send}
              disabled={streaming || !input.trim()}
              className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
