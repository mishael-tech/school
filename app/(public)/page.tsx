import Link from "next/link";
import { HomePicker } from "@/components/HomePicker";
import { getPublicDisplaySettings } from "@/services/display-settings.service";
import { listSessions } from "@/services/session.service";
import { listWeeksBySession } from "@/services/week.service";

export default async function HomePage() {
  const [{ subjectLabel }, sessionsRaw] = await Promise.all([
    getPublicDisplaySettings(),
    listSessions(),
  ]);

  const sessions = sessionsRaw.map((s) => ({
    id: s._id.toString(),
    name: s.name,
  }));

  const weeksBySession: Record<
    string,
    { id: string; weekNumber: number }[]
  > = {};
  await Promise.all(
    sessionsRaw.map(async (s) => {
      const id = s._id.toString();
      const ws = await listWeeksBySession(id);
      weeksBySession[id] = ws.map((w) => ({
        id: w._id.toString(),
        weekNumber: w.weekNumber,
      }));
    }),
  );

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Classroom scoreboard · {subjectLabel}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {subjectLabel} weekly results
        </h1>
        <p className="max-w-prose text-lg text-slate-600 dark:text-slate-300">
          Choose an academic session and week to see how the class ranked on
          the latest quiz. Names and scores here are curated by your teacher —
          there is no student login.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Open leaderboard
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Rankings load from live scores — positions are computed on demand and
          are not stored separately.
        </p>
        <div className="mt-6">
          <HomePicker sessions={sessions} weeksBySession={weeksBySession} />
        </div>
      </section>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Need to manage scores?{" "}
        <Link
          href="/admin/login"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Admin sign-in
        </Link>
      </p>
    </div>
  );
}
