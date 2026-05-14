// Mentora AI Safety, Privacy & Accountability layer
// - يمنع تسرب البيانات الحساسة قبل إرسالها للنموذج
// - يضع سياسات الموثوقية والعدالة وحماية القاصرين
// - يوفر إفصاح أن المحتوى مولّد بالذكاء الاصطناعي
// - يسجل حوادث الإبلاغ للمساءلة (تخزين محلي فقط، بدون بيانات شخصية)

export const AI_DISCLOSURE_AR =
  "هذا المحتوى مولَّد بالذكاء الاصطناعي. قد يحتوي على أخطاء — يُرجى التحقق قبل الاعتماد عليه في قرارات أكاديمية أو طبية أو قانونية.";

export const AI_PRIVACY_NOTICE_AR =
  "خصوصيتك أولوية: لا تُستخدم محادثاتك لتدريب النماذج، ولا نخزّن بياناتك الحساسة. يتم إخفاء أرقام الهوية والهواتف والإيميلات تلقائياً قبل الإرسال.";

export type SafetyResult = {
  safe: boolean;
  reason?: string;
  cleaned: string;
  redactions: string[];
};

// أنماط البيانات الحساسة (PII)
const PII_PATTERNS: { name: string; re: RegExp; mask: string }[] = [
  { name: "email", re: /[\w.+-]+@[\w-]+\.[\w.-]+/g, mask: "[بريد محذوف]" },
  { name: "phone_intl", re: /\+?\d[\d\s().-]{8,}\d/g, mask: "[رقم محذوف]" },
  { name: "saudi_id", re: /\b[12]\d{9}\b/g, mask: "[هوية محذوفة]" },
  { name: "iban", re: /\bSA\d{22}\b/gi, mask: "[آيبان محذوف]" },
  { name: "credit_card", re: /\b(?:\d[ -]*?){13,19}\b/g, mask: "[بطاقة محذوفة]" },
  { name: "password_phrase", re: /(كلمة\s*السر|password|passwd)\s*[:=]\s*\S+/gi, mask: "$1: [محذوفة]" },
];

// أنماط محتوى مرفوض (تزييف/انتحال/أذى)
const BLOCKED_PATTERNS: { reason: string; re: RegExp }[] = [
  { reason: "محاولة انتحال شخصية", re: /(انتحل|تظاهر\s*بأنك)\s+(شخصية|أستاذ|الدكتور|الطالب)\s+\S+/i },
  { reason: "إنشاء تزييف عميق", re: /\b(deepfake|تزييف\s*عميق|صوت\s*مزيف|فيديو\s*مزيف)\b/i },
  { reason: "محتوى يستهدف إيذاء قاصر", re: /(أذى|استغلال|تحرش).{0,20}(طفل|قاصر|أطفال)/i },
];

export function applySafety(input: string): SafetyResult {
  const trimmed = input.trim();

  for (const b of BLOCKED_PATTERNS) {
    if (b.re.test(trimmed)) {
      return { safe: false, reason: b.reason, cleaned: "", redactions: [] };
    }
  }

  let cleaned = trimmed;
  const redactions: string[] = [];
  for (const p of PII_PATTERNS) {
    if (p.re.test(cleaned)) {
      redactions.push(p.name);
      cleaned = cleaned.replace(p.re, p.mask);
    }
  }
  return { safe: true, cleaned, redactions };
}

// سياسة السلامة المضافة لرسالة النظام في الخادم (نسخة العميل للمرجعية)
export const SAFETY_POLICY_AR = `
سياسة Mentora للسلامة والمسؤولية (التزم بها حرفياً):
1) الموثوقية: قدّم معلومات دقيقة، واذكر صراحة عند عدم اليقين، ولا تختلق مصادر أو أرقاماً.
2) العدالة والحياد: تجنّب التحيّز الجنسي/العرقي/الديني، وتعامل مع جميع الطلاب بإنصاف.
3) حماية القاصرين: لا تُنتج محتوى غير لائق، ولا تطلب بيانات شخصية حساسة من الطالب.
4) الخصوصية: لا تطلب أرقام هوية/هاتف/بنوك/كلمات سر، وذكّر الطالب بعدم مشاركتها.
5) منع التزييف: ارفض انتحال شخصيات حقيقية، وارفض إنتاج تزييف عميق أو محتوى مضلل.
6) الإفصاح: إذا طلب الطالب محتوى يُنشر، ذكّره بالإفصاح أن المحتوى أُنتج بمساعدة الذكاء الاصطناعي.
7) المساءلة: عند تقديم نصيحة أكاديمية حساسة (رسوب، تخصص، صحة نفسية)، أوصِ بمراجعة المرشد البشري.
`.trim();

// سجل بلاغات للمساءلة (محلي)
export type AIReport = {
  id: string;
  time: string;
  reason: string;
  excerpt: string;
};

const REPORTS_KEY = "mentora_ai_reports";

export function reportAIResponse(reason: string, excerpt: string) {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    const list: AIReport[] = raw ? JSON.parse(raw) : [];
    list.unshift({
      id: crypto.randomUUID(),
      time: new Date().toISOString(),
      reason,
      excerpt: excerpt.slice(0, 240),
    });
    localStorage.setItem(REPORTS_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    // ignore
  }
}

export function listAIReports(): AIReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
