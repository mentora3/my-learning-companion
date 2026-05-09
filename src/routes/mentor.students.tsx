import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Eye } from "lucide-react";

export const Route = createFileRoute("/mentor/students")({
  head: () => ({ meta: [{ title: "Mentora — إدارة الطلاب" }] }),
  component: StudentsPage,
});

const students = [
  { name: "أحمد محمد", email: "ahmed@mentora.edu", gpa: 3.65, progress: 78, status: "stable", avatar: "أ" },
  { name: "نورة القحطاني", email: "noura@mentora.edu", gpa: 3.92, progress: 88, status: "stable", avatar: "ن" },
  { name: "سارة الحربي", email: "sara@mentora.edu", gpa: 2.45, progress: 38, status: "danger", avatar: "س" },
  { name: "محمد العمري", email: "moh@mentora.edu", gpa: 3.21, progress: 65, status: "warning", avatar: "م" },
  { name: "ريم السبيعي", email: "reem@mentora.edu", gpa: 3.78, progress: 82, status: "stable", avatar: "ر" },
  { name: "فهد المطيري", email: "fahad@mentora.edu", gpa: 2.88, progress: 52, status: "warning", avatar: "ف" },
  { name: "ليان الشهري", email: "lyan@mentora.edu", gpa: 2.11, progress: 28, status: "danger", avatar: "ل" },
];

const statusMap: Record<string, { label: string; class: string }> = {
  stable: { label: "مستقر", class: "bg-success/15 text-success" },
  warning: { label: "بحاجة لمتابعة", class: "bg-warning/20 text-warning-foreground" },
  danger: { label: "تدخّل عاجل", class: "bg-destructive/15 text-destructive" },
};

function StudentsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "stable" | "warning" | "danger">("all");

  const filtered = students
    .filter((s) => (filter === "all" ? true : s.status === filter))
    .filter((s) => s.name.includes(q) || s.email.includes(q));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl">إدارة الطلاب 👥</h1>
        <p className="text-muted-foreground mt-1">تابع أداء طلابك واتخذ الإجراء المناسب</p>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن طالب…"
            className="w-full bg-card border border-border rounded-xl pr-10 pl-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary"
          />
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-xl">
          {[
            { k: "all", l: "الكل" },
            { k: "stable", l: "مستقر" },
            { k: "warning", l: "متابعة" },
            { k: "danger", l: "عاجل" },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f.k ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* Cards / table */}
      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s.email} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] border border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center font-black text-primary-foreground shrink-0">
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground truncate">{s.name}</div>
                <div className="text-xs text-muted-foreground truncate">{s.email}</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusMap[s.status].class}`}>
                {statusMap[s.status].label}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div>
                <div className="text-base font-black text-foreground">{s.gpa}</div>
                <div className="text-[10px] text-muted-foreground">المعدل</div>
              </div>
              <div className="col-span-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">التقدّم</span>
                  <span className="font-bold text-foreground">{s.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.progress >= 70 ? "bg-success" : s.progress >= 50 ? "bg-warning" : "bg-destructive"
                    }`}
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </div>
            </div>
            <button className="mt-3 w-full py-2 rounded-lg border border-border text-foreground text-xs font-bold hover:bg-muted flex items-center justify-center gap-1.5">
              <Eye className="h-3.5 w-3.5" /> عرض الملف الكامل
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">لا يوجد طلاب مطابقون</div>
        )}
      </div>
    </div>
  );
}
