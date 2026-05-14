import { useEffect, useRef, useState } from "react";
import { Send, Video, Calendar, Link2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useMessages, type ChatMessage } from "../lib/messages";

type Props = {
  studentEmail: string;
  studentName: string;
  studentAvatar: string;
  viewerRole: "student" | "mentor";
  mentorName?: string;
};

function formatTime(at: number) {
  const d = new Date(at);
  return d.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
}

export function ChatThread({ studentEmail, studentName, studentAvatar, viewerRole, mentorName }: Props) {
  const { getConversation, sendMessage, requestMeeting, respondMeeting } = useMessages();
  const conv = getConversation(studentEmail);
  const messages = conv?.messages ?? [];
  const [input, setInput] = useState("");
  const [meetingOpen, setMeetingOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    sendMessage(studentEmail, viewerRole, t);
    setInput("");
  };

  const otherName = viewerRole === "student" ? mentorName || "المرشد الأكاديمي" : studentName;
  const otherAvatar = viewerRole === "student" ? "م" : studentAvatar;

  return (
    <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] overflow-hidden flex flex-col h-[70vh] min-h-[480px]">
      {/* Header */}
      <div className="bg-[image:var(--gradient-hero)] text-nav-foreground px-4 py-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center font-black">
          {otherAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold truncate">{otherName}</div>
          <div className="text-[11px] flex items-center gap-1 text-nav-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> متصل الآن
          </div>
        </div>
        <button
          onClick={() => setMeetingOpen(true)}
          className="text-xs font-bold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full flex items-center gap-1"
        >
          <Video className="h-3.5 w-3.5" /> طلب اجتماع
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-12">
            ابدأ المحادثة الآن — كل التواصل يتم داخل المنصة 💬
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            m={m}
            viewerRole={viewerRole}
            onRespond={(status) => {
              respondMeeting(studentEmail, m.id, status);
              toast.success(status === "accepted" ? "تم قبول الاجتماع ✅" : "تم رفض الاجتماع");
            }}
          />
        ))}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-border flex gap-2 bg-card">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="اكتب رسالتك…"
          className="flex-1 bg-muted rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary"
        />
        <button
          onClick={() => setMeetingOpen(true)}
          className="h-10 w-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted"
          aria-label="جدولة اجتماع"
        >
          <Calendar className="h-4 w-4 text-foreground" />
        </button>
        <button
          onClick={send}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-1.5 hover:bg-primary/90"
        >
          <Send className="h-4 w-4" /> إرسال
        </button>
      </div>

      {meetingOpen && (
        <MeetingDialog
          onClose={() => setMeetingOpen(false)}
          onSubmit={(info) => {
            requestMeeting(studentEmail, viewerRole, info);
            toast.success(
              info.type === "in-platform"
                ? "تم إنشاء غرفة اجتماع داخل المنصة 🎥"
                : "تم إنشاء رابط Google Meet 🔗"
            );
            setMeetingOpen(false);
          }}
        />
      )}
    </div>
  );
}

function MessageBubble({
  m,
  viewerRole,
  onRespond,
}: {
  m: ChatMessage;
  viewerRole: "student" | "mentor";
  onRespond: (s: "accepted" | "declined") => void;
}) {
  const mine = m.from === viewerRole;
  const isMeeting = m.kind === "meeting" && m.meeting;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
          mine
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card text-foreground border border-border rounded-bl-sm"
        }`}
      >
        {!isMeeting && <div className="whitespace-pre-wrap break-words">{m.text}</div>}

        {isMeeting && (
          <div className="space-y-2 min-w-[220px]">
            <div className="flex items-center gap-1.5 font-bold">
              <Video className="h-4 w-4" />
              {m.meeting!.type === "google-meet" ? "اجتماع Google Meet" : "اجتماع داخل المنصة"}
            </div>
            <div className={`text-xs ${mine ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
              📌 {m.meeting!.topic}
            </div>
            <div className={`text-xs ${mine ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
              📅 {m.meeting!.date} — {m.meeting!.time}
            </div>
            <a
              href={m.meeting!.link}
              target="_blank"
              rel="noreferrer"
              className={`text-xs flex items-center gap-1 underline ${
                mine ? "text-primary-foreground" : "text-primary"
              }`}
            >
              <Link2 className="h-3 w-3" /> رابط الانضمام
            </a>
            <div className="flex items-center gap-2 pt-1">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  m.meeting!.status === "accepted"
                    ? "bg-success/20 text-success"
                    : m.meeting!.status === "declined"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-warning/20 text-warning-foreground"
                }`}
              >
                {m.meeting!.status === "accepted"
                  ? "مقبول"
                  : m.meeting!.status === "declined"
                  ? "مرفوض"
                  : "قيد الانتظار"}
              </span>
              {!mine && m.meeting!.status === "pending" && (
                <div className="flex gap-1">
                  <button
                    onClick={() => onRespond("accepted")}
                    className="h-6 px-2 rounded-md bg-success text-white text-[10px] font-bold flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" /> قبول
                  </button>
                  <button
                    onClick={() => onRespond("declined")}
                    className="h-6 px-2 rounded-md bg-destructive text-white text-[10px] font-bold flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> رفض
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={`text-[10px] mt-1 ${
            mine ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {formatTime(m.at)}
        </div>
      </div>
    </div>
  );
}

function MeetingDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (info: { topic: string; date: string; time: string; type: "in-platform" | "google-meet" }) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [topic, setTopic] = useState("متابعة الأداء الأكاديمي");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("14:00");
  const [type, setType] = useState<"in-platform" | "google-meet">("in-platform");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl p-5 w-full max-w-md shadow-[var(--shadow-elegant)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-black mb-1">جدولة اجتماع جديد</h3>
        <p className="text-xs text-muted-foreground mb-4">
          التواصل الافتراضي يتم داخل المنصة. يمكنك أيضًا إنشاء رابط Google Meet.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-muted-foreground">موضوع الاجتماع</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full mt-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground">التاريخ</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground">الوقت</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full mt-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground">منصة الاجتماع</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => setType("in-platform")}
                className={`p-3 rounded-xl border text-xs font-bold text-right transition ${
                  type === "in-platform"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Video className="h-3.5 w-3.5" /> داخل المنصة
                </div>
                <div className="font-normal text-[10px] text-muted-foreground">
                  افتراضي
                </div>
              </button>
              <button
                onClick={() => setType("google-meet")}
                className={`p-3 rounded-xl border text-xs font-bold text-right transition ${
                  type === "google-meet"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Link2 className="h-3.5 w-3.5" /> Google Meet
                </div>
                <div className="font-normal text-[10px] text-muted-foreground">
                  رابط Meet خارجي
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border font-bold text-sm hover:bg-muted"
          >
            إلغاء
          </button>
          <button
            onClick={() => onSubmit({ topic, date, time, type })}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90"
          >
            إرسال الطلب
          </button>
        </div>
      </div>
    </div>
  );
}
