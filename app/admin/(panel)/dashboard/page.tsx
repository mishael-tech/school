import Link from "next/link";
import { getDashboardCounts } from "@/services/stats.service";

const cards = (
  stats: Awaited<ReturnType<typeof getDashboardCounts>>,
) =>
  [
    { label: "Students", value: stats.students, href: "/admin/students" },
    { label: "Academic sessions", value: stats.sessions, href: "/admin/sessions" },
    { label: "Weeks", value: stats.weeks, href: "/admin/weeks" },
    { label: "Stored score rows", value: stats.scores, href: "/admin/scores" },
  ] as const;

export default async function AdminDashboardPage() {
  const stats = await getDashboardCounts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Overview of roster, structure, and weekly points in the database.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards(stats).map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-900"
          >
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {c.label}
            </div>
            <div className="mt-2 text-3xl font-semibold tabular-nums text-slate-900 dark:text-white">
              {c.value}
            </div>
            <span className="mt-3 inline-flex text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Manage →
            </span>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Getting started
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Create an academic session (for example 2025/2026).</li>
          <li>Add weeks under that session for each quiz week.</li>
          <li>Register students once with their school ID and class label.</li>
          <li>Record points per student per week — only one row per pair.</li>
        </ol>
      </section>
    </div>
  );
}
