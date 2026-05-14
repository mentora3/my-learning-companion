import { createFileRoute } from "@tanstack/react-router";
import { ChatThread } from "../components/ChatThread";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Mentora — المحادثات" }] }),
  component: StudentMessagesPage,
});

function StudentMessagesPage() {
  const { user } = useAuth();
  // Map the student to their record in shared list using email; fallback to first.
  const email = user?.email || "ahmed@mentora.edu";
  const name = user?.name || "أنا";
  const avatar = name[0] || "?";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">محادثاتي 💬</h1>
        <p className="text-muted-foreground mt-1">
          تواصل مباشر مع مرشدك الأكاديمي داخل المنصة.
        </p>
      </div>
      <ChatThread
        studentEmail={email}
        studentName={name}
        studentAvatar={avatar}
        viewerRole="student"
        mentorName="د. خالد الراشد"
      />
    </div>
  );
}
