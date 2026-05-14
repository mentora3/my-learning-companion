import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { ChatThread } from "../components/ChatThread";
import { useMessages, STUDENTS } from "../lib/messages";

export const Route = createFileRoute("/mentor/messages")({
  head: () => ({ meta: [{ title: "Mentora — محادثات الطلاب" }] }),
  component: MentorMessagesPage,
});

function MentorMessagesPage() {
  const { conversations } = useMessages();
  const [active, setActive] = useState<string>(STUDENTS[0].email);
  const [q, setQ] = useState("");

  const list = STUDENTS.filter((s) => s.name.includes(q) || s.email.includes(q));
  const current = STUDENTS.find((s) => s.email === active) || STUDENTS[0];

  const lastOf = (email: string) => {
    const c = conversations.find((c) => c.studentEmail === email);
    return c?.messages[c.messages.length - 1];
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">محادثات الطلاب 💬</h1>
        <p className="text-muted-foreground mt-1">
          تواصل مع طلابك مباشرة وأرسل دعوات اجتماع بشكل افتراضي داخل المنصة.
        </p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-4">
        {/* List */}
        <div className="rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] overflow-hidden flex flex-col max-h-[70vh] min-h-[480px]">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث عن طالب…"
                className="w-full bg-muted rounded-lg pr-10 pl-3 py-2 text-sm outline-none focus:ring-2 ring-primary"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {list.map((s) => {
              const last = lastOf(s.email);
              const isActive = active === s.email;
              return (
                <button
                  key={s.email}
                  onClick={() => setActive(s.email)}
                  className={`w-full flex items-center gap-3 p-3 border-b border-border/50 text-right transition ${
                    isActive ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground flex items-center justify-center font-black shrink-0">
                    {s.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-foreground truncate">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                      {last ? (
                        <>
                          <MessageCircle className="h-3 w-3 shrink-0" />
                          {last.kind === "meeting" ? "📅 طلب اجتماع" : last.text}
                        </>
                      ) : (
                        "لا توجد رسائل بعد"
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
            {list.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-8">لا نتائج</div>
            )}
          </div>
        </div>

        {/* Thread */}
        <ChatThread
          studentEmail={current.email}
          studentName={current.name}
          studentAvatar={current.avatar}
          viewerRole="mentor"
        />
      </div>
    </div>
  );
}
