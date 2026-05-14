// Simple localStorage-backed app state with subscribers
import { useEffect, useState } from "react";

export type Role = "student" | "mentor";
export type Session = { role: Role; name: string } | null;

export type Notif = { id: string; title: string; body: string; time: string; read: boolean; type: "info" | "warn" | "success" };
export type Task = { id: string; title: string; priority: "high" | "medium" | "low"; status: "pending" | "in_progress" | "done"; assignee?: string; due?: string };
export type MeetingStatus = "pending" | "accepted" | "declined";
export type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  link: string;
  status: MeetingStatus;
  requestedBy: "student" | "mentor";
};
export type ChatMsg = { id: string; from: "user" | "ai" | "mentor"; text: string; meeting?: Meeting };

type State = {
  session: Session;
  notifications: Notif[];
  tasks: Task[];
  chat: ChatMsg[];
  mentorChat: ChatMsg[];
};

const KEY = "mentora_state_v1";

const defaultState: State = {
  session: null,
  notifications: [
    { id: "n1", title: "تنبيه أكاديمي", body: "تم رصد انخفاض في أداء مادة تحليل البيانات", time: "منذ 5 دقائق", read: false, type: "warn" },
    { id: "n2", title: "خطة جديدة", body: "تم إسناد خطة علاجية لك من المرشد", time: "منذ ساعة", read: false, type: "info" },
    { id: "n3", title: "إنجاز", body: "أكملت 60% من خطة التحليل الإحصائي", time: "أمس", read: true, type: "success" },
  ],
  tasks: [
    { id: "t1", title: "مراجعة درس الاحتمالات (فيديو AI)", priority: "high", status: "pending", due: "خلال يومين" },
    { id: "t2", title: "حل 50 سؤال تدريبي في البرمجة", priority: "medium", status: "pending", due: "خلال 5 أيام" },
    { id: "t3", title: "تدريب على Pandas & NumPy", priority: "high", status: "in_progress", due: "خلال 3 أيام" },
    { id: "t4", title: "اختبار تقييم منتصف المدة", priority: "medium", status: "pending", due: "خلال أسبوع" },
    { id: "t5", title: "تسليم المشروع التطبيقي", priority: "high", status: "pending", due: "خلال 10 أيام" },
  ],
  chat: [
    { id: "c1", from: "ai", text: "مرحباً بك. أنا مرشدك الذكي، لاحظت صعوبة في دوال التحليل. كيف أساعدك اليوم؟" },
  ],
  mentorChat: [
    { id: "m1", from: "mentor", text: "السلام عليكم، كيف تقدمك في الخطة العلاجية؟" },
  ],
};

let state: State = load();
const subs = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {}
  return defaultState;
}

function persist() {
  if (typeof window !== "undefined") {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }
}

export function getState() { return state; }

export function setState(updater: (s: State) => State) {
  state = updater(state);
  persist();
  subs.forEach((s) => s());
}

export function useStore<T>(selector: (s: State) => T): T {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    subs.add(fn);
    return () => { subs.delete(fn); };
  }, []);
  return selector(state);
}

// Actions
export const actions = {
  login(role: Role, name: string) {
    setState((s) => ({ ...s, session: { role, name } }));
  },
  logout() {
    setState((s) => ({ ...s, session: null }));
  },
  markAllRead() {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },
  markRead(id: string) {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) }));
  },
  addNotif(n: Omit<Notif, "id" | "read" | "time">) {
    setState((s) => ({ ...s, notifications: [{ ...n, id: "n" + Date.now(), time: "الآن", read: false }, ...s.notifications] }));
  },
  toggleTask(id: string) {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => {
        if (t.id !== id) return t;
        const next = t.status === "done" ? "pending" : t.status === "pending" ? "in_progress" : "done";
        return { ...t, status: next };
      }),
    }));
  },
  addTask(t: Omit<Task, "id" | "status">) {
    setState((s) => ({ ...s, tasks: [...s.tasks, { ...t, id: "t" + Date.now(), status: "pending" }] }));
  },
  removeTask(id: string) {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  },
  sendChat(text: string) {
    const userMsg: ChatMsg = { id: "c" + Date.now(), from: "user", text };
    setState((s) => ({ ...s, chat: [...s.chat, userMsg] }));
    setTimeout(() => {
      const replies = [
        "ممتاز! دعنا نبدأ بمراجعة المفاهيم الأساسية. هل تريد فيديو شرح أم تمارين تطبيقية؟",
        "بناءً على أدائك، أنصحك بالتركيز على Pandas هذا الأسبوع.",
        "لاحظت أنك تتقدم جيداً، استمر بهذا المعدل!",
        "يمكنني تجهيز خطة مذاكرة مخصصة لك. هل تريد ذلك؟",
      ];
      const ai: ChatMsg = { id: "c" + Date.now() + 1, from: "ai", text: replies[Math.floor(Math.random() * replies.length)] };
      setState((s) => ({ ...s, chat: [...s.chat, ai] }));
    }, 700);
  },
  sendMentorChat(text: string, from: "user" | "mentor" = "user") {
    setState((s) => ({ ...s, mentorChat: [...s.mentorChat, { id: "m" + Date.now(), from, text }] }));
  },
  requestMeeting(payload: { title: string; date: string; time: string; requestedBy: "student" | "mentor" }) {
    const code = Math.random().toString(36).slice(2, 6) + "-" + Math.random().toString(36).slice(2, 6) + "-" + Math.random().toString(36).slice(2, 5);
    const meeting: Meeting = {
      id: "mt" + Date.now(),
      title: payload.title || "اجتماع إرشادي",
      date: payload.date,
      time: payload.time,
      link: `https://meet.google.com/${code}`,
      status: "pending",
      requestedBy: payload.requestedBy,
    };
    const from = payload.requestedBy === "student" ? "user" : "mentor";
    const msg: ChatMsg = {
      id: "m" + Date.now(),
      from,
      text: `📅 طلب اجتماع: ${meeting.title} — ${meeting.date} ${meeting.time}`,
      meeting,
    };
    setState((s) => ({ ...s, mentorChat: [...s.mentorChat, msg] }));
    const who = payload.requestedBy === "student" ? "الطالب" : "المرشد";
    setState((s) => ({
      ...s,
      notifications: [{
        id: "n" + Date.now(),
        title: "طلب اجتماع جديد 📅",
        body: `${who} طلب اجتماع: ${meeting.title} (${meeting.date} ${meeting.time})`,
        time: "الآن", read: false, type: "info",
      }, ...s.notifications],
    }));
    return meeting.id;
  },
  respondMeeting(meetingId: string, accept: boolean) {
    setState((s) => ({
      ...s,
      mentorChat: s.mentorChat.map((m) => m.meeting?.id === meetingId
        ? { ...m, meeting: { ...m.meeting, status: accept ? "accepted" : "declined" } }
        : m),
    }));
    const meeting = state.mentorChat.find((m) => m.meeting?.id === meetingId)?.meeting;
    const sysMsg: ChatMsg = {
      id: "m" + Date.now(),
      from: accept ? "mentor" : "user",
      text: accept
        ? `✅ تم قبول الاجتماع. الرابط: ${meeting?.link}`
        : `❌ تم رفض موعد الاجتماع. اقترح موعداً آخر.`,
    };
    setState((s) => ({ ...s, mentorChat: [...s.mentorChat, sysMsg] }));
    setState((s) => ({
      ...s,
      notifications: [{
        id: "n" + Date.now(),
        title: accept ? "تم قبول الاجتماع ✅" : "تم رفض الاجتماع",
        body: accept ? `الاجتماع مؤكد — ${meeting?.date} ${meeting?.time}` : "يرجى اقتراح موعد بديل",
        time: "الآن", read: false, type: accept ? "success" : "warn",
      }, ...s.notifications],
    }));
  },
};
