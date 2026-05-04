import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { StandingsBoard } from "@/components/StandingsBoard";
import { StandingsSessionSelect } from "@/components/StandingsSessionSelect";
import { getPublicDisplaySettings } from "@/services/display-settings.service";
import { getSessionStandings } from "@/services/standings.service";
import { listSessions } from "@/services/session.service";

type Props = {
  searchParams: Promise<{ sessionId?: string }>;
};

export default async function StandingsPage(props: Props) {
  const sp = await props.searchParams;
  const [{ subjectLabel }, sessionsRaw] = await Promise.all([
    getPublicDisplaySettings(),
    listSessions(),
  ]);

  const sessions = sessionsRaw.map((s) => ({
    id: s._id.toString(),
    name: s.name,
  }));

  const defaultId = sessions[0]?.id;
  const requested = typeof sp.sessionId === "string" ? sp.sessionId : undefined;
  const sessionId =
    requested && mongoose.Types.ObjectId.isValid(requested)
      ? requested
      : defaultId;

  if (!sessionId) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
        <p className="text-slate-600 dark:text-slate-400">
          No academic session available yet.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          ← Back home
        </Link>
      </div>
    );
  }

  const data = await getSessionStandings(sessionId);
  if (!data) notFound();

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          ← Home
        </Link>
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {subjectLabel} · Season table
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {data.sessionName}
          </h1>
          <p className="max-w-prose text-slate-600 dark:text-slate-300">
            Full-class standings — one column per quiz week added for this session.
            Points column is each student&apos;s cumulative total; positions rank
            by that total (ties broken alphabetically by name).
          </p>
        </div>
        <StandingsSessionSelect
          sessions={sessions}
          currentSessionId={sessionId}
        />
      </section>

      <StandingsBoard data={data} />
    </div>
  );
}
