import { useEffect, useRef, useState } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../lib/auth";

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 transition-colors">
        <div className="h-9 w-9 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center font-black text-primary-foreground text-sm">
          {user.avatar}
        </div>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-card text-foreground rounded-xl shadow-[var(--shadow-elegant)] border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-border">
            <div className="font-bold text-sm">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            <div className="mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
              {user.role === "mentor" ? "مرشد أكاديمي" : "طالب"}
            </div>
          </div>
          <button className="w-full text-right px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2">
            <UserIcon className="h-4 w-4" /> الملف الشخصي
          </button>
          <button onClick={logout} className="w-full text-right px-4 py-2.5 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2 border-t border-border">
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}
