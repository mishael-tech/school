import { Suspense } from "react";
import Link from "next/link";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import mongoose from "mongoose";
import type { LeaderboardEntry } from "@/services/ranking.service";
import { getLeaderboardForWeek } from "@/services/ranking.service";
import { getSessionById } from "@/services/session.service";
import { getWeekById } from "@/services/week.service";

type Props = {
  searchParams: Promise<{ weekId?: string; q?: string }>;
};

async function leaderboardWithContext(weekId: string, q?: string | null) {
  const trimmed = q?.trim() || undefined;
  const rows: LeaderboardEntry[] = trimmed
    ? await getLeaderboardForWeek(weekId, trimmed)
    : await getLeaderboardForWeek(weekId);

  let sessionName: string | null = null;
  let weekLabel: string | null = null;

  const weekDoc = await getWeekById(weekId);
  if (weekDoc) {
    weekLabel = `Week ${weekDoc.weekNumber}`;
    const sid = weekDoc.sessionId?.toString();
    const sess = sid ? await getSessionById(sid) : null;
    if (sess) sessionName = sess.name;
  }

  return { rows, sessionName, weekLabel };
}

export default async function LeaderboardPage(props: Props) {
  const sp = await props.searchParams;
  const weekIdRaw = typeof sp.weekId === "string" ? sp.weekId : undefined;
  const q = typeof sp.q === "string" ? sp.q : undefined;

  const ok = weekIdRaw && mongoose.Types.ObjectId.isValid(weekIdRaw);
  let tableRows = [] as LeaderboardEntry[];
  let sessionName: string | null = null;
  let weekLabel: string | null = null;
  let loadError: string | null = null;
  let activeWeekId: string | null = weekIdRaw && ok ? weekIdRaw! : null;

  if (!weekIdRaw) {
    /* Prompt user to choose a session/week on home. */
  } else if (!ok) {
    loadError =
      "That week link is invalid. Choose a session on the home page.";
    activeWeekId = null;
  } else {
    try {
      const res = await leaderboardWithContext(weekIdRaw!, q ?? null);
      tableRows = res.rows;
      sessionName = res.sessionName;
      weekLabel = res.weekLabel;
    } catch {
      loadError =
        "Unable to load scores. Check MongoDB connectivity or missing data.";
      activeWeekId = null;
    }
  }

  const heading =
    activeWeekId && sessionName && weekLabel
      ? `${sessionName} — ${weekLabel}`
      : "Leaderboard";

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <Link
          href="/"
          className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          ← Back to home
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          {heading}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Highest scores listed first — ties are broken alphabetically by
          student name. The top three places are highlighted across the entire
          class for that week.
        </p>
      </section>

      <Suspense
        fallback={
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 animate-pulse dark:border-slate-800 dark:bg-slate-900/40">
            Loading filters…
          </div>
        }
      >
        <LeaderboardTable
          key={`${activeWeekId ?? "none"}|${q ?? ""}|${loadError ?? "ok"}`}
          rows={tableRows}
          activeWeekId={activeWeekId}
          blockedMessage={loadError}
          appliedSearch={typeof q === "string" ? q : ""}
        />
      </Suspense>
    </div>
  );
}
