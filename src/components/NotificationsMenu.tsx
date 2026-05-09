import { useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useNotifications } from "../lib/notifications";

export function NotificationsMenu() {
  const { notifications, unread, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toneIcon: Record<string, string> = { info: "ℹ️", warning: "⚠️", success: "✅" };
  const toneBg: Record<string, string> = {
    info: "bg-primary/10",
    warning: "bg-warning/15",
    success: "bg-success/15",
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="الإشعارات"
      >
        <Bell className="h-5 w-5 text-nav-foreground" />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-80 max-w-[90vw] bg-card text-foreground rounded-2xl shadow-[var(--shadow-elegant)] border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <h3 className="font-bold text-sm">الإشعارات</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                <Check className="h-3.5 w-3.5" /> تعليم الكل كمقروء
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">لا توجد إشعارات</div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-right p-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3 ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-base shrink-0 ${toneBg[n.tone]}`}>
                    {toneIcon[n.tone]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-foreground truncate">{n.title}</span>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{n.time}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
