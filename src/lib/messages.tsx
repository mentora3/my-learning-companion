import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ChatMessage = {
  id: string;
  from: "student" | "mentor";
  text: string;
  at: number;
  kind?: "text" | "meeting";
  meeting?: MeetingInfo;
};

export type MeetingInfo = {
  topic: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: "in-platform" | "google-meet";
  link: string;
  status: "pending" | "accepted" | "declined";
};

export type Conversation = {
  studentEmail: string;
  studentName: string;
  studentAvatar: string;
  messages: ChatMessage[];
};

const KEY = "mentora_messages_v1";

export const STUDENTS = [
  { name: "أحمد محمد", email: "ahmed@mentora.edu", avatar: "أ" },
  { name: "نورة القحطاني", email: "noura@mentora.edu", avatar: "ن" },
  { name: "سارة الحربي", email: "sara@mentora.edu", avatar: "س" },
  { name: "محمد العمري", email: "moh@mentora.edu", avatar: "م" },
  { name: "ريم السبيعي", email: "reem@mentora.edu", avatar: "ر" },
  { name: "فهد المطيري", email: "fahad@mentora.edu", avatar: "ف" },
  { name: "ليان الشهري", email: "lyan@mentora.edu", avatar: "ل" },
];

const seed = (): Conversation[] =>
  STUDENTS.map((s, i) => ({
    studentEmail: s.email,
    studentName: s.name,
    studentAvatar: s.avatar,
    messages:
      i < 2
        ? [
            {
              id: `seed-${i}-1`,
              from: "mentor" as const,
              text: "مرحبًا، لاحظت تقدمك الجيد هذا الأسبوع 👏 هل تحتاج مساعدة في أي وحدة؟",
              at: Date.now() - 1000 * 60 * 60 * (i + 2),
            },
          ]
        : [],
  }));

type Ctx = {
  conversations: Conversation[];
  getConversation: (email: string) => Conversation | undefined;
  sendMessage: (email: string, from: "student" | "mentor", text: string) => void;
  requestMeeting: (email: string, from: "student" | "mentor", info: Omit<MeetingInfo, "status" | "link"> & { link?: string }) => void;
  respondMeeting: (email: string, msgId: string, status: "accepted" | "declined") => void;
};

const C = createContext<Ctx | null>(null);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setConversations(raw ? JSON.parse(raw) : seed());
    } catch {
      setConversations(seed());
    }
  }, []);

  useEffect(() => {
    if (conversations.length) localStorage.setItem(KEY, JSON.stringify(conversations));
  }, [conversations]);

  const getConversation = useCallback(
    (email: string) => conversations.find((c) => c.studentEmail === email),
    [conversations]
  );

  const ensure = (email: string, list: Conversation[]): Conversation[] => {
    if (list.some((c) => c.studentEmail === email)) return list;
    const s = STUDENTS.find((s) => s.email === email);
    return [
      ...list,
      {
        studentEmail: email,
        studentName: s?.name || email,
        studentAvatar: s?.avatar || email[0]?.toUpperCase() || "?",
        messages: [],
      },
    ];
  };

  const sendMessage: Ctx["sendMessage"] = (email, from, text) => {
    setConversations((prev) => {
      const next = ensure(email, prev);
      return next.map((c) =>
        c.studentEmail === email
          ? { ...c, messages: [...c.messages, { id: crypto.randomUUID(), from, text, at: Date.now() }] }
          : c
      );
    });
  };

  const requestMeeting: Ctx["requestMeeting"] = (email, from, info) => {
    const link =
      info.link ||
      (info.type === "google-meet"
        ? `https://meet.google.com/${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 5)}`
        : `/meet/${crypto.randomUUID().slice(0, 8)}`);
    const meeting: MeetingInfo = { ...info, link, status: "pending" };
    setConversations((prev) => {
      const next = ensure(email, prev);
      return next.map((c) =>
        c.studentEmail === email
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: crypto.randomUUID(),
                  from,
                  text: `طلب اجتماع: ${info.topic}`,
                  at: Date.now(),
                  kind: "meeting",
                  meeting,
                },
              ],
            }
          : c
      );
    });
  };

  const respondMeeting: Ctx["respondMeeting"] = (email, msgId, status) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.studentEmail === email
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === msgId && m.meeting ? { ...m, meeting: { ...m.meeting, status } } : m
              ),
            }
          : c
      )
    );
  };

  const value = useMemo(
    () => ({ conversations, getConversation, sendMessage, requestMeeting, respondMeeting }),
    [conversations, getConversation]
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useMessages() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useMessages must be used inside MessagesProvider");
  return ctx;
}
