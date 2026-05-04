import Link from "next/link";
import { logoutAction } from "@/actions/auth";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/settings", label: "Subject & branding" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/weeks", label: "Weeks" },
  { href: "/admin/scores", label: "Scores" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 md:flex-row">
      <aside className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:w-56 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex h-14 items-center border-b border-slate-200 px-4 dark:border-slate-800">
          <Link
            href="/admin/dashboard"
            className="text-sm font-semibold text-slate-900 dark:text-white"
          >
            Admin
          </Link>
        </div>
        <nav className="flex flex-wrap gap-1 p-2 md:flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-2 dark:border-slate-800">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
