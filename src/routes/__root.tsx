import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import logoUrl from "../assets/mentora-logo.png?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة التي تبحث عنها غير متاحة.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">حدث خطأ ما</h1>
        <p className="mt-2 text-sm text-muted-foreground">يرجى المحاولة مرة أخرى.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mentora — منصة ليان التعليمية الذكية" },
      { name: "description", content: "منصة Mentora التعليمية الذكية لمتابعة الأداء، الخطط الدراسية والتقارير." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NavBar() {
  const linkClass =
    "px-4 py-2 rounded-lg text-sm font-medium text-nav-foreground/80 hover:bg-primary hover:text-primary-foreground transition-colors";
  const activeClass = "bg-primary text-primary-foreground";
  return (
    <header className="sticky top-0 z-50 bg-nav text-nav-foreground shadow-[var(--shadow-elegant)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoUrl} alt="Mentora" className="h-9 w-9 object-contain bg-white rounded-lg p-1" />
          <span className="text-2xl font-black bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Mentora</span>
        </Link>
        <nav className="flex items-center gap-1 flex-wrap">
          <Link to="/" className={linkClass} activeOptions={{ exact: true }} activeProps={{ className: `${linkClass} ${activeClass}` }}>الرئيسية</Link>
          <Link to="/plan" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>خطتي</Link>
          <Link to="/career" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>المسار المهني</Link>
          <Link to="/reports" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>تقاريري</Link>
        </nav>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="max-w-5xl mx-auto px-5 py-8">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
}
