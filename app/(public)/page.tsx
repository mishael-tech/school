import Link from "next/link";
import { HomeSessionJump } from "@/components/HomeSessionJump";
import { getPublicDisplaySettings } from "@/services/display-settings.service";
import { listSessions } from "@/services/session.service";

export default async function HomePage() {
  const [{ subjectLabel }, sessionsRaw] = await Promise.all([
    getPublicDisplaySettings(),
    listSessions(),
  ]);

  const sessions = sessionsRaw.map((s) => ({
    id: s._id.toString(),
    name: s.name,
  }));

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Classroom standings · {subjectLabel}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Season scoreboard
        </h1>
        <p className="max-w-prose text-lg text-slate-600 dark:text-slate-300">
          Browse the entire term at once — student name, class, every week&apos;s score,
          and cumulative points ({`"`}Pts{`"`}) ranked like a league table. Announcements
          and class photos appear on the standings page when your teacher adds them.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Open standings
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Pick an academic session — no weekly filter; the full table loads for the
          whole term (up to 15 week slots).
        </p>
        <div className="mt-6">
          <HomeSessionJump sessions={sessions} />
        </div>
      </section>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Need to manage roster, sessions, announcements, scores, or class photo?{" "}
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
