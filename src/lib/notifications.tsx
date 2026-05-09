import { createContext, useContext, useState, type ReactNode } from "react";

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: "info" | "warning" | "success";
  read: boolean;
};

const studentSeed: Notification[] = [
  { id: "n1", title: "تنبيه أكاديمي", body: "أداؤك في تحليل البيانات يحتاج مراجعة هذا الأسبوع.", time: "قبل 5 د", tone: "warning", read: false },
  { id: "n2", title: "مهمة جديدة 📝", body: "تم إضافة واجب: مشروع قواعد البيانات (مستحق خلال يومين).", time: "قبل ساعة", tone: "info", read: false },
  { id: "n3", title: "أحسنت! 🎉", body: "أتممت 60% من خطتك الحالية.", time: "أمس", tone: "success", read: false },
];

const mentorSeed: Notification[] = [
  { id: "m1", title: "طالب يحتاج تدخّل", body: "سارة الحربي — انخفاض حاد في الأداء.", time: "قبل 10 د", tone: "warning", read: false },
  { id: "m2", title: "تسليم جديد", body: "أحمد محمد سلّم مشروع تطوير الويب.", time: "قبل ساعتين", tone: "info", read: false },
  { id: "m3", title: "مجموعتك في تقدّم", body: "متوسط الأداء ارتفع +5% هذا الأسبوع.", time: "أمس", tone: "success", read: true },
];

type NCtx = {
  notifications: Notification[];
  unread: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  push: (n: Omit<Notification, "id" | "read" | "time">) => void;
};

const Ctx = createContext<NCtx>({} as NCtx);

export function NotificationsProvider({ children, role }: { children: ReactNode; role: "student" | "mentor" }) {
  const [list, setList] = useState<Notification[]>(role === "mentor" ? mentorSeed : studentSeed);

  const value: NCtx = {
    notifications: list,
    unread: list.filter((n) => !n.read).length,
    markAllRead: () => setList((l) => l.map((n) => ({ ...n, read: true }))),
    markRead: (id) => setList((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
    push: (n) =>
      setList((l) => [{ id: Date.now().toString(), read: false, time: "الآن", ...n }, ...l]),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useNotifications = () => useContext(Ctx);
