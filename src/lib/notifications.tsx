import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

const storeKey = (role: "student" | "mentor") => `mentora_notifications_${role}`;

function readStored(role: "student" | "mentor"): Notification[] {
  try {
    const raw = localStorage.getItem(storeKey(role));
    return raw ? (JSON.parse(raw) as Notification[]) : [];
  } catch {
    return [];
  }
}

function writeStored(role: "student" | "mentor", list: Notification[]) {
  try {
    localStorage.setItem(storeKey(role), JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("mentora:notifications", { detail: { role } }));
  } catch {
    // ignore
  }
}

/** Push a notification to a specific role's inbox (persists across sessions). */
export function pushNotificationFor(role: "student" | "mentor", n: Omit<Notification, "id" | "read" | "time">) {
  const list = readStored(role);
  const next: Notification[] = [
    { id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, read: false, time: "الآن", ...n },
    ...list,
  ];
  writeStored(role, next);
}

type NCtx = {
  notifications: Notification[];
  unread: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  push: (n: Omit<Notification, "id" | "read" | "time">) => void;
};

const Ctx = createContext<NCtx>({} as NCtx);

export function NotificationsProvider({ children, role }: { children: ReactNode; role: "student" | "mentor" }) {
  const [list, setList] = useState<Notification[]>(() => {
    const seed = role === "mentor" ? mentorSeed : studentSeed;
    return [...readStored(role), ...seed];
  });

  // Re-sync when other tabs/components push to this role's inbox.
  useEffect(() => {
    const sync = () => {
      const seed = role === "mentor" ? mentorSeed : studentSeed;
      const stored = readStored(role);
      setList((prev) => {
        // keep read-state of seeds, prepend any new stored items not already in list
        const known = new Set(prev.map((n) => n.id));
        const fresh = stored.filter((n) => !known.has(n.id));
        return fresh.length ? [...fresh, ...prev] : prev;
      });
      // Touch seed reference to silence linter when unused branch
      void seed;
    };
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent).detail as { role?: string } | undefined;
      if (!detail || detail.role === role) sync();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === storeKey(role)) sync();
    };
    window.addEventListener("mentora:notifications", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("mentora:notifications", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [role]);

  const value: NCtx = {
    notifications: list,
    unread: list.filter((n) => !n.read).length,
    markAllRead: () => setList((l) => l.map((n) => ({ ...n, read: true }))),
    markRead: (id) => setList((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
    push: (n) => {
      pushNotificationFor(role, n);
      setList((l) => [{ id: `p-${Date.now()}`, read: false, time: "الآن", ...n }, ...l]);
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useNotifications = () => useContext(Ctx);
