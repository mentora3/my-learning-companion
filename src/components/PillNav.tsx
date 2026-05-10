import { Link } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";

const studentLinks = [
  { to: "/", label: "الرئيسية", exact: true },
  { to: "/plan", label: "خطتي" },
  { to: "/skills", label: "المهارات" },
  { to: "/remedial", label: "الخطة العلاجية" },
  { to: "/career", label: "المسار المهني" },
  { to: "/reports", label: "تقاريري" },
] as const;

const mentorLinks = [
  { to: "/mentor", label: "لوحتي", exact: true },
  { to: "/mentor/students", label: "الطلاب" },
  { to: "/mentor/planning", label: "التخطيط" },
] as const;

export function PillNav() {
  const { user } = useAuth();
  const links = user?.role === "mentor" ? mentorLinks : studentLinks;

  const base =
    "shrink-0 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all duration-200";
  const inactive =
    "bg-card text-nav border-border/60 hover:bg-primary hover:!text-white hover:border-primary";
  const active =
    "bg-primary !text-white border-primary shadow-[var(--shadow-glow)] scale-[1.02]";

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="-mx-4 px-4 overflow-x-auto scrollbar-none"
    >
      <div className="flex items-center gap-2 py-1">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`${base} ${inactive}`}
            activeOptions={"exact" in l && l.exact ? { exact: true } : undefined}
            activeProps={{ className: `${base} ${active}` }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
