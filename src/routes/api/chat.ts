import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };
type Body = {
  messages?: ChatMsg[];
  profile?: {
    name?: string;
    level?: number;
    weaknesses?: string[];
    strengths?: string[];
    learningStyle?: string;
    pace?: string;
    engagement?: number;
    role?: string;
  };
};

const STYLE_LABEL: Record<string, string> = {
  interactive: "التعلم التفاعلي (حوار وأسئلة وتطبيق)",
  summary: "التلخيص المبسط (نقاط قصيرة وواضحة)",
  mindmap: "الخرائط الذهنية (ربط المفاهيم بصرياً بالنص)",
  microtasks: "تقسيم المهام الصغيرة (خطوة خطوة)",
  practical: "التدريب العملي (أمثلة وكود وتطبيقات)",
  video: "الفيديوهات التعليمية (اقترح فيديوهات مناسبة)",
  smartq: "الأسئلة الذكية (سؤال يفتح التفكير قبل الشرح)",
  gradual: "التعلم التدريجي (من الأبسط إلى الأعقد بثقة)",
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as Body;
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (!messages.length) return new Response("messages required", { status: 400 });

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const p = body.profile ?? {};
        const styleLabel = p.learningStyle ? STYLE_LABEL[p.learningStyle] || p.learningStyle : "غير محدّد";
        const profileBlock = `\n\nملف الطالب الحالي:\n- الاسم: ${p.name ?? "طالب"}\n- المستوى الأكاديمي: ${p.level ?? "—"}/100\n- نقاط الضعف: ${(p.weaknesses ?? []).join("، ") || "—"}\n- نقاط القوة: ${(p.strengths ?? []).join("، ") || "—"}\n- أسلوب التعلم المفضل: ${styleLabel}\n- سرعة التعلم: ${p.pace ?? "متوسطة"}\n- مستوى التفاعل والإنجاز: ${p.engagement ?? 50}%`;

        const safetyPolicy = `\n\nسياسة Mentora للسلامة والمسؤولية (التزم بها حرفياً):\n1) الموثوقية: قدّم معلومات دقيقة، واعترف بعدم اليقين، ولا تختلق مصادر أو أرقاماً.\n2) العدالة والحياد: تجنّب التحيز (جنس/عرق/دين/جنسية) وعامل جميع الطلاب بإنصاف.\n3) حماية القاصرين: لا تُنتج محتوى غير لائق ولا تطلب بيانات شخصية حساسة.\n4) الخصوصية: لا تطلب أرقام هوية/هاتف/بنوك/كلمات سر. ذكّر الطالب بعدم مشاركتها.\n5) منع التزييف: ارفض انتحال شخصيات حقيقية أو إنتاج تزييف عميق أو محتوى مضلل.\n6) الإفصاح: ذكّر الطالب أن المحتوى مولَّد بالذكاء الاصطناعي عند طلب نشره.\n7) المساءلة: في القرارات الحساسة (رسوب/تخصص/صحة نفسية) أوصِ دائماً بمراجعة المرشد البشري.\n8) لا تخزّن أو تُعيد استخدام بيانات الطالب لأي غرض خارج هذه المحادثة.`;\n\n        const system = `أنت "مرشد Mentora التقني الذكي" — مساعد أكاديمي عربي ذكي ومتعاطف يعمل داخل منصة Mentora.\n\nمهمتك:\n- شرح المقررات الأكاديمية والمهنية بأي طريقة يحتاجها الطالب.\n- تكييف أسلوب الشرح تلقائياً مع أسلوب تعلم الطالب أدناه.\n- اكتشاف التعثر مبكراً وتقديم حلول قبل الرسوب.\n- إذا قال الطالب أن الخطة لا تناسبه، اقترح أسلوب تعلم مختلف بصراحة واشرح لماذا.\n- كن داعماً، محفّزاً، وموجزاً. استخدم العربية المبسطة والإيموجي بحكمة 🌟.${safetyPolicy}${profileBlock}\n\nإذا اقترحت تغيير أسلوب التعلم اكتب في نهاية ردك سطراً منفصلاً بهذا الشكل بالضبط:\n[SWITCH_STYLE: <interactive|summary|mindmap|microtasks|practical|video|smartq|gradual>]`;

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "system", content: system }, ...messages],
            stream: true,
          }),
        });

        if (!upstream.ok) {
          const text = await upstream.text();
          if (upstream.status === 429) return new Response("rate_limited", { status: 429 });
          if (upstream.status === 402) return new Response("credits_exhausted", { status: 402 });
          return new Response(text, { status: upstream.status });
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
