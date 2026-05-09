import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import logoUrl from "../assets/mentora-logo.png?url";
import { AuthProvider, useAuth } from "../lib/auth";
import { NotificationsProvider } from "../lib/notifications";
import { NotificationsMenu } from "../components/NotificationsMenu";
import { ProfileMenu } from "../components/ProfileMenu";
import { AiChat } from "../components/AiChat";
import { Login } from "../components/Login";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
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
      { title: "Mentora — نوجّهك اليوم.. لنجاحك غداً." },
      { name: "description", content: "Mentora: منصة تعليمية ذكية لمتابعة الأداء والمسار المهني للطلاب والمرشدين." },
      { property: "og:title", content: "Mentora — نوجّهك اليوم.. لنجاحك غداً." },
      { name: "twitter:title", content: "Mentora — نوجّهك اليوم.. لنجاحك غداً." },
      { property: "og:description", content: "Mentora: منصة تعليمية ذكية لمتابعة الأداء والمسار المهني للطلاب والمرشدين." },
      { name: "twitter:description", content: "Mentora: منصة تعليمية ذكية لمتابعة الأداء والمسار المهني للطلاب والمرشدين." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2c900714-2691-4291-ad87-faefd75e62e0/id-preview-70dcb13c--7d298a39-49ba-4123-8f22-41319d0bbde3.lovable.app-1778337109179.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2c900714-2691-4291-ad87-faefd75e62e0/id-preview-70dcb13c--7d298a39-49ba-4123-8f22-41319d0bbde3.lovable.app-1778337109179.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
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
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-nav text-nav-foreground shadow-[var(--shadow-elegant)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link to={user?.role === "mentor" ? "/mentor" : "/"} className="flex items-center gap-2 shrink-0">
          <img src={logoUrl} alt="Mentora" className="h-9 w-9 object-contain bg-white rounded-lg p-1" />
          <span className="text-xl font-black bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Mentora</span>
        </Link>
        <div className="flex items-center gap-1 shrink-0">
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

function AppShell() {
  return (
    <NotificationsProvider role={useAuth().user!.role}>
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 py-6 pb-28">
          <Outlet />
        </main>
        <AiChat />
      </div>
    </NotificationsProvider>
  );
}

function RoleRedirect() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!user) return;
    const onMentorRoute = pathname.startsWith("/mentor");
    if (user.role === "mentor" && !onMentorRoute) {
      router.navigate({ to: "/mentor" });
    } else if (user.role === "student" && onMentorRoute) {
      router.navigate({ to: "/" });
    }
  }, [user, pathname, router]);

  return null;
}

function Gate() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return <Login />;
  return (
    <>
      <RoleRedirect />
      <AppShell />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Gate />
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}
