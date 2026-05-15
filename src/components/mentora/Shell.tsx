import { useState, useRef, useEffect } from "react";
import { Bell, MessageCircle, LogOut, Menu, X, Send, Bot, Check } from "lucide-react";
import logo from "@/assets/mentora-logo.png";
import { actions, useStore } from "./store";
import { FF, NAVY, TEAL, PURPLE, BORDER, MUTED, BG, DANGER, WARN, SUCCESS } from "./shared";

export type NavItem = { key: string; label: string; icon: React.ReactNode };

export function Shell({
  themeColor, navItems, current, onNav, children, title,
}: {
  themeColor: string;
  navItems: NavItem[];
  current: string;
  onNav: (k: string) => void;
  children: React.ReactNode;
  title: string;
}) {
  const session = useStore((s) => s.session);
  const notifs = useStore((s) => s.notifications);
  const unread = notifs.filter((n) => !n.read).length;

  const [openSidebar, setOpenSidebar] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const isMentor = themeColor === NAVY;

  return (
    <div dir="rtl" style={{ fontFamily: FF, background: BG, minHeight: "100vh", color: NAVY }}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet" />

      {/* Top header */}
      <header style={{
        background: "#fff", borderBottom: `1px solid ${BORDER}`,
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <button onClick={() => setOpenSidebar(true)} style={iconBtn} aria-label="القائمة">
          <Menu size={20} />
        </button>
        <img src={logo} alt="Mentora" style={{ height: 36 }} />
        <div style={{ flex: 1 }} />
        <div style={{ position: "relative" }}>
          <button onClick={() => { setOpenNotif((v) => !v); }} style={iconBtn} aria-label="الإشعارات">
            <Bell size={20} />
            {unread > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 2, background: DANGER, color: "#fff",
                borderRadius: "50%", minWidth: 16, height: 16, fontSize: 10, padding: "0 4px",
                display: "grid", placeItems: "center", fontWeight: 700,
              }}>{unread}</span>
            )}
          </button>
          {openNotif && <NotifPanel onClose={() => setOpenNotif(false)} />}
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: themeColor + "22",
          color: themeColor, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14,
        }}>{session?.name?.charAt(0)}</div>
      </header>

      <div style={{ display: "flex" }}>
        {/* Sidebar - mobile drawer + desktop fixed */}
        {openSidebar && (
          <div onClick={() => setOpenSidebar(false)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 60,
          }} />
        )}
        <aside style={{
          position: "fixed", top: 0, right: openSidebar ? 0 : "-300px",
          width: 280, height: "100vh", background: themeColor, color: "#fff",
          padding: 20, transition: "right .3s", zIndex: 70, overflowY: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{session?.name}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{isMentor ? "مرشد أكاديمي" : "طالب"}</div>
            </div>
            <button onClick={() => setOpenSidebar(false)} style={{ ...iconBtn, color: "#fff" }}>
              <X size={20} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((n) => {
              const active = n.key === current;
              return (
                <button key={n.key} onClick={() => { onNav(n.key); setOpenSidebar(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                    background: active ? "rgba(255,255,255,.15)" : "transparent",
                    border: "none", borderRadius: 10, color: "#fff", cursor: "pointer",
                    fontFamily: FF, fontSize: 14, textAlign: "right",
                    borderRight: active ? "3px solid #fff" : "3px solid transparent",
                  }}>
                  {n.icon}
                  <span>{n.label}</span>
                </button>
              );
            })}
          </nav>

          <button onClick={() => actions.logout()} style={{
            marginTop: 24, width: "100%", padding: "10px", background: "rgba(255,255,255,.1)",
            border: "none", color: "#fff", borderRadius: 10, cursor: "pointer", fontFamily: FF,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <LogOut size={16} /> تسجيل الخروج
          </button>
        </aside>

        <main style={{ flex: 1, padding: "16px", maxWidth: 1100, margin: "0 auto", width: "100%", paddingBottom: 100 }}>
          <h1 style={{ margin: "0 0 16px", fontSize: 22, color: NAVY }}>{title}</h1>
          {children}
        </main>
      </div>

      {/* AI Chat */}
      <button onClick={() => setOpenChat((v) => !v)} style={{
        position: "fixed", bottom: 24, left: 24, width: 56, height: 56, borderRadius: "50%",
        background: PURPLE, color: "#fff", border: "none", cursor: "pointer",
        boxShadow: "0 8px 20px rgba(139,92,246,.4)", zIndex: 50,
        display: "grid", placeItems: "center",
      }}>
        {openChat ? <X size={22} /> : <Bot size={24} />}
      </button>
      {openChat && <AIChat onClose={() => setOpenChat(false)} />}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  background: "transparent", border: "none", cursor: "pointer", padding: 8,
  borderRadius: 8, color: NAVY, position: "relative", display: "grid", placeItems: "center",
};

function NotifPanel({ onClose }: { onClose: () => void }) {
  const notifs = useStore((s) => s.notifications);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50 }} />
      <div style={{
        position: "absolute", top: 44, left: 0, width: 320, maxWidth: "92vw",
        background: "#fff", borderRadius: 14, boxShadow: "0 12px 32px rgba(0,0,0,.15)",
        border: `1px solid ${BORDER}`, zIndex: 60, overflow: "hidden",
      }}>
        <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${BORDER}` }}>
          <strong style={{ color: NAVY, fontSize: 14 }}>الإشعارات</strong>
          <button onClick={() => actions.markAllRead()} style={{
            background: "transparent", border: "none", color: TEAL, cursor: "pointer",
            fontFamily: FF, fontSize: 12, fontWeight: 600,
          }}>تحديد الكل كمقروء</button>
        </div>
        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {notifs.length === 0 && (
            <div style={{ padding: 20, textAlign: "center", color: MUTED, fontSize: 13 }}>لا توجد إشعارات</div>
          )}
          {notifs.map((n) => {
            const c = n.type === "warn" ? WARN : n.type === "success" ? SUCCESS : TEAL;
            return (
              <div key={n.id} onClick={() => actions.markRead(n.id)} style={{
                padding: 12, borderBottom: `1px solid ${BORDER}`, cursor: "pointer",
                background: n.read ? "#fff" : c + "0d", display: "flex", gap: 10,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{n.body}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{n.time}</div>
                </div>
                {n.read && <Check size={14} color={MUTED} />}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AIChat({ onClose }: { onClose: () => void }) {
  const chat = useStore((s) => s.chat);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo({ top: 9999, behavior: "smooth" }); }, [chat.length]);

  const send = () => {
    if (!input.trim()) return;
    actions.sendChat(input.trim());
    setInput("");
  };

  return (
    <div style={{
      position: "fixed", bottom: 90, left: 24, width: 340, maxWidth: "92vw", height: 460,
      maxHeight: "70vh", background: "#fff", borderRadius: 18, zIndex: 50,
      boxShadow: "0 20px 50px rgba(0,0,0,.2)", display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{ background: PURPLE, color: "#fff", padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <Bot size={18} />
        <strong style={{ flex: 1 }}>مرشدك الذكي</strong>
        <button onClick={onClose} style={{ ...iconBtn, color: "#fff", padding: 4 }}><X size={18} /></button>
      </div>
      <div ref={ref} style={{ flex: 1, padding: 12, overflowY: "auto", background: "#faf9ff" }}>
        {chat.map((m) => (
          <div key={m.id} style={{
            display: "flex", justifyContent: m.from === "user" ? "flex-start" : "flex-end", marginBottom: 8,
          }}>
            <div style={{
              maxWidth: "80%", padding: "8px 12px", borderRadius: 14,
              background: m.from === "user" ? "#fff" : PURPLE, color: m.from === "user" ? NAVY : "#fff",
              fontSize: 13, lineHeight: 1.6, border: m.from === "user" ? `1px solid ${BORDER}` : "none",
            }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 10, borderTop: `1px solid ${BORDER}`, display: "flex", gap: 6 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="اكتب سؤالك..." style={{
            flex: 1, padding: "8px 12px", borderRadius: 10, border: `1px solid ${BORDER}`,
            fontFamily: FF, fontSize: 13, outline: "none",
          }} />
        <button onClick={send} style={{
          background: PURPLE, color: "#fff", border: "none", borderRadius: 10, padding: "0 12px",
          cursor: "pointer", display: "grid", placeItems: "center",
        }}><Send size={16} /></button>
      </div>
    </div>
  );
}
