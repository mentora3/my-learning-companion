import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/mentor/planning")({
  head: () => ({ meta: [{ title: "Mentora — أداة التخطيط" }] }),
  component: PlanningPage,
});

type Task = { id: string; title: string; priority: "high" | "medium" | "low"; due: string; assigned: string[] };

const initial: Task[] = [
  { id: "1", title: "مراجعة فصل الإحصاء الوصفي", priority: "high", due: "25 مايو", assigned: ["أحمد", "سارة"] },
  { id: "2", title: "حل تمارين Pandas العملية", priority: "medium", due: "28 مايو", assigned: ["نورة"] },
];

const allStudents = ["أحمد", "سارة", "نورة", "محمد", "ريم", "فهد", "ليان"];

const priorityMap: Record<string, { label: string; class: string }> = {
  high: { label: "عالية", class: "bg-destructive/15 text-destructive" },
  medium: { label: "متوسطة", class: "bg-warning/20 text-warning-foreground" },
  low: { label: "منخفضة", class: "bg-primary/15 text-primary" },
};

function PlanningPage() {
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [due, setDue] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const create = () => {
    if (!title.trim()) return toast.error("يرجى إدخال عنوان المهمة");
    if (selected.length === 0) return toast.error("اختر طالبًا واحدًا على الأقل");
    setTasks((t) => [
      { id: Date.now().toString(), title, priority, due: due || "بدون موعد", assigned: selected },
      ...t,
    ]);
    setTitle(""); setPriority("medium"); setDue(""); setSelected([]); setShowForm(false);
    toast.success(`تم إرسال المهمة إلى ${selected.length} طالب ✅`);
  };

  const remove = (id: string) => {
    setTasks((t) => t.filter((x) => x.id !== id));
    toast("تم حذف المهمة");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl">أداة التخطيط 📝</h1>
          <p className="text-muted-foreground mt-1">أنشئ مهامًا وادفعها إلى مخططات طلابك</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center gap-1.5 hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> مهمة جديدة
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-card p-5 shadow-[var(--shadow-elegant)] border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="font-bold text-foreground mb-4">إنشاء مهمة</h3>
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان المهمة"
              className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="bg-muted rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary"
              >
                <option value="high">أولوية عالية</option>
                <option value="medium">أولوية متوسطة</option>
                <option value="low">أولوية منخفضة</option>
              </select>
              <input
                value={due}
                onChange={(e) => setDue(e.target.value)}
                placeholder="الموعد النهائي (مثال: 30 مايو)"
                className="bg-muted rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground mb-2">إرسال إلى:</div>
              <div className="flex flex-wrap gap-2">
                {allStudents.map((s) => {
                  const on = selected.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => setSelected((v) => (on ? v.filter((x) => x !== s) : [...v, s]))}
                      className={`text-xs px-3 py-1.5 rounded-full border-2 transition-all ${
                        on ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={create}
              className="w-full py-2.5 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-bold flex items-center justify-center gap-1.5"
            >
              <Send className="h-4 w-4" /> إرسال المهمة
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground">المهام المنشورة ({tasks.length})</h3>
        {tasks.map((t) => (
          <div key={t.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border border-border/50">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="font-bold text-foreground flex-1">{t.title}</h4>
              <button onClick={() => remove(t.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded-lg">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${priorityMap[t.priority].class}`}>
                {priorityMap[t.priority].label}
              </span>
              <span className="text-[10px] text-muted-foreground">📅 {t.due}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {t.assigned.map((a) => (
                <span key={a} className="text-[10px] px-2 py-1 rounded-full bg-muted text-foreground">{a}</span>
              ))}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm rounded-2xl bg-card border border-border/50">
            لا توجد مهام بعد — أنشئ أول مهمة
          </div>
        )}
      </div>
    </div>
  );
}
