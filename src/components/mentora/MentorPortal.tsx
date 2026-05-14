import { useState } from "react";
import { Home, Users, ClipboardList, BarChart3, Plus, Trash2, MessageSquare, Send, Video } from "lucide-react";
import { Shell, type NavItem } from "./Shell";
import { actions, useStore } from "./store";
import {
  TEAL, NAVY, PURPLE, DANGER, WARN, SUCCESS, MUTED, BORDER, FF,
  card, Donut, Bar, Chip, StatCard, SectionTitle, Btn,
} from "./shared";
import { MeetingCard, MeetingForm } from "./StudentPortal";

const nav: NavItem[] = [
  { key: "home", label: "نظرة عامة", icon: <Home size={18} /> },
  { key: "students", label: "الطلاب", icon: <Users size={18} /> },
  { key: "messages", label: "محادثات الطلاب", icon: <MessageSquare size={18} /> },
  { key: "planning", label: "إنشاء خطة", icon: <ClipboardList size={18} /> },
  { key: "insights", label: "تحليلات المجموعة", icon: <BarChart3 size={18} /> },
];

const STUDENTS = [
  { id: "s1", name: "أحمد محمد", gpa: 3.65, progress: 78, risk: "low" },
  { id: "s2", name: "نورة عبدالله", gpa: 2.85, progress: 45, risk: "high" },
  { id: "s3", name: "خالد سعد", gpa: 3.20, progress: 62, risk: "medium" },
  { id: "s4", name: "ريم فهد", gpa: 4.10, progress: 92, risk: "low" },
  { id: "s5", name: "فيصل عمر", gpa: 2.50, progress: 30, risk: "high" },
  { id: "s6", name: "سارة ناصر", gpa: 3.80, progress: 85, risk: "low" },
];

export function MentorPortal() {
  const [page, setPage] = useState("home");
  const titles: Record<string, string> = {
    home: "لوحة المرشد", students: "إدارة الطلاب", messages: "محادثات الطلاب",
    planning: "إنشاء خطة دراسية", insights: "تحليلات المجموعة",
  };
  return (
    <Shell themeColor={NAVY} navItems={nav} current={page} onNav={setPage} title={titles[page]}>
      {page === "home" && <MentorHome />}
      {page === "students" && <Students />}
      {page === "messages" && <Messages />}
      {page === "planning" && <Planning />}
      {page === "insights" && <Insights />}
    </Shell>
  );
}

function Messages() {
  const msgs = useStore((s) => s.mentorChat);
  const [input, setInput] = useState("");
  const [showMeet, setShowMeet] = useState(false);
  const send = () => {
    if (!input.trim()) return;
    actions.sendMentorChat(input.trim(), "mentor");
    setInput("");
  };
  return (
    <div style={{ ...card, padding: 0, overflow: "hidden" }}>
      <div style={{ background: NAVY, color: "#fff", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", color: NAVY, display: "grid", placeItems: "center", fontWeight: 700 }}>أ</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700 }}>أحمد محمد</div>
          <div style={{ fontSize: 11, opacity: .8 }}>طالب • متصل</div>
        </div>
        <button onClick={() => setShowMeet(true)} style={{
          background: "rgba(255,255,255,.2)", border: "none", color: "#fff", borderRadius: 10,
          padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: FF, fontSize: 12,
        }}>
          <Video size={14} /> اجتماع
        </button>
      </div>
      <div style={{ padding: 12, height: 380, overflowY: "auto", background: "#f9fafb" }}>
        {msgs.map((m) => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.from === "mentor" ? "flex-start" : "flex-end", marginBottom: 8 }}>
            {m.meeting ? <MeetingCard msg={m} role="mentor" /> : <div style={{
              maxWidth: "75%", padding: "8px 12px", borderRadius: 14,
              background: m.from === "mentor" ? "#fff" : NAVY, color: m.from === "mentor" ? NAVY : "#fff",
              fontSize: 13, border: m.from === "mentor" ? `1px solid ${BORDER}` : "none",
            }}>{m.text}</div>}
          </div>
        ))}
      </div>
      <div style={{ padding: 10, borderTop: `1px solid ${BORDER}`, display: "flex", gap: 6 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="اكتب رسالة للطالب..." style={{
            flex: 1, padding: "10px 12px", borderRadius: 10, border: `1px solid ${BORDER}`,
            fontFamily: FF, fontSize: 13, outline: "none",
          }} />
        <button onClick={send} style={{
          background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "0 14px",
          cursor: "pointer", display: "grid", placeItems: "center",
        }}><Send size={16} /></button>
      </div>
      {showMeet && <MeetingForm role="mentor" onClose={() => setShowMeet(false)} />}
    </div>
  );
}

function MentorHome() {
  const total = STUDENTS.length;
  const atRisk = STUDENTS.filter((s) => s.risk === "high").length;
  const avgGpa = (STUDENTS.reduce((a, s) => a + s.gpa, 0) / total).toFixed(2);
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        <StatCard icon={<Users size={18} />} title="إجمالي الطلاب" value={String(total)} accent={NAVY} />
        <StatCard icon="⚠️" title="بحاجة لتدخل" value={String(atRisk)} sub="حالة خطر" accent={DANGER} />
        <StatCard icon="⭐" title="متوسط المعدل" value={avgGpa} accent={WARN} />
        <StatCard icon="📈" title="متوسط التقدم" value="65%" accent={SUCCESS} />
      </div>

      <div style={card}>
        <SectionTitle>الطلاب الذين يحتاجون تدخل عاجل</SectionTitle>
        {STUDENTS.filter((s) => s.risk === "high").map((s) => (
          <StudentRow key={s.id} s={s} />
        ))}
      </div>

      <div style={card}>
        <SectionTitle>أداء طلابك</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Donut value={65} color={NAVY} />
          <div style={{ flex: 1, fontSize: 13, color: NAVY, lineHeight: 1.8 }}>
            متوسط التقدم 65% — مجموعتك تتقدم بشكل جيد لكن هناك {atRisk} طلاب يحتاجون متابعة فورية.
          </div>
        </div>
      </div>
    </div>
  );
}

function Students() {
  return (
    <div style={card}>
      <SectionTitle>قائمة الطلاب الكاملة</SectionTitle>
      {STUDENTS.map((s) => <StudentRow key={s.id} s={s} />)}
    </div>
  );
}

function StudentRow({ s }: { s: typeof STUDENTS[number] }) {
  const riskColor = s.risk === "high" ? DANGER : s.risk === "medium" ? WARN : SUCCESS;
  const riskLabel = s.risk === "high" ? "بحاجة لتدخل" : s.risk === "medium" ? "متوسط" : "مستقر";
  return (
    <div style={{ padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: NAVY + "15", color: NAVY,
          display: "grid", placeItems: "center", fontWeight: 700,
        }}>{s.name.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>{s.name}</div>
          <div style={{ color: MUTED, fontSize: 12 }}>المعدل: {s.gpa}</div>
        </div>
        <Chip label={riskLabel} color={riskColor} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Bar value={s.progress} color={riskColor} />
        <span style={{ fontSize: 12, color: MUTED, minWidth: 36 }}>{s.progress}%</span>
      </div>
    </div>
  );
}

function Planning() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [assignee, setAssignee] = useState(STUDENTS[0].name);
  const tasks = useStore((s) => s.tasks);

  const submit = () => {
    if (!title.trim()) return;
    actions.addTask({ title: title.trim(), priority, assignee, due: "خلال أسبوع" });
    actions.addNotif({ title: "خطة جديدة", body: `تم إسناد "${title.trim()}" للطالب ${assignee}`, type: "info" });
    setTitle("");
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <SectionTitle>إنشاء مهمة جديدة</SectionTitle>
        <label style={lbl}>عنوان المهمة</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="مثال: مراجعة مفاهيم الإحصاء" style={inp} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          <div>
            <label style={lbl}>الأولوية</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as any)} style={inp}>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>
          </div>
          <div>
            <label style={lbl}>الطالب</label>
            <select value={assignee} onChange={(e) => setAssignee(e.target.value)} style={inp}>
              {STUDENTS.map((s) => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Btn color={NAVY} onClick={submit}><Plus size={14} style={{ verticalAlign: "middle" }} /> إنشاء وإسناد</Btn>
        </div>
      </div>

      <div style={card}>
        <SectionTitle>المهام المنشأة</SectionTitle>
        {tasks.map((t) => (
          <div key={t.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${BORDER}`, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: NAVY, fontWeight: 600, fontSize: 14 }}>{t.title}</div>
              <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                {t.assignee && <Chip label={t.assignee} color={NAVY} />}
                <Chip label={t.priority === "high" ? "عالية" : t.priority === "medium" ? "متوسطة" : "منخفضة"}
                  color={t.priority === "high" ? DANGER : t.priority === "medium" ? WARN : MUTED} />
              </div>
            </div>
            <button onClick={() => actions.removeTask(t.id)} style={{
              background: "transparent", border: "none", cursor: "pointer", color: DANGER,
            }}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Insights() {
  const data = [
    { n: "ممتاز", v: 35, c: SUCCESS },
    { n: "جيد جداً", v: 28, c: TEAL },
    { n: "جيد", v: 22, c: WARN },
    { n: "ضعيف", v: 15, c: DANGER },
  ];
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={card}>
        <SectionTitle>توزيع مستويات الطلاب</SectionTitle>
        <div style={{ display: "flex", alignItems: "flex-end", height: 180, gap: 14, padding: "0 10px" }}>
          {data.map((d) => (
            <div key={d.n} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{d.v}%</div>
              <div style={{ background: d.c, height: d.v * 3, borderRadius: 6, transition: "height .5s" }} />
              <div style={{ fontSize: 11, color: NAVY, marginTop: 6 }}>{d.n}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        <StatCard icon="🎯" title="نسبة النجاح" value="85%" accent={SUCCESS} />
        <StatCard icon="📚" title="مهام مكتملة" value="142" accent={TEAL} />
        <StatCard icon="⏱️" title="متوسط التفاعل" value="2.3س/يوم" accent={PURPLE} />
        <StatCard icon="🚨" title="تنبيهات نشطة" value="3" accent={DANGER} />
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 13, color: NAVY, marginTop: 4, marginBottom: 4, fontWeight: 600 };
const inp: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${BORDER}`,
  fontFamily: FF, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff",
};
