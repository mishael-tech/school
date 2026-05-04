import Link from "next/link";
import mongoose from "mongoose";
import { AdminScoresMatrix } from "@/components/admin/AdminScoresMatrix";
import { FormFlash } from "@/components/admin/FormFlash";
import {
  adminScoreGridStateKey,
  getAdminScoreGrid,
} from "@/services/admin-score-grid.service";
import { listSessions } from "@/services/session.service";

type Props = {
  searchParams: Promise<{ sessionId?: string; error?: string; ok?: string }>;
};

export default async function AdminScoresPage(props: Props) {
  const searchParams = await props.searchParams;
  const sessions = await listSessions();

  const firstId = sessions[0]?._id.toString() ?? null;
  const requested =
    typeof searchParams.sessionId === "string" &&
    mongoose.Types.ObjectId.isValid(searchParams.sessionId)
      ? searchParams.sessionId
      : null;
  const activeSessionId = requested ?? firstId;

  const grid = activeSessionId ? await getAdminScoreGrid(activeSessionId) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Scores
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Enter scores in the grid: each row is a student, each column is a week
          from this academic session (same weeks as on the{" "}
          <Link
            href="/admin/weeks"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Weeks
          </Link>{" "}
          page). Changes apply to the public standings after you save.
        </p>
      </div>

      <FormFlash
        error={searchParams.error}
        success={
          searchParams.ok === "1" ? "Operation completed successfully." : undefined
        }
      />

      {sessions.length === 0 ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          Create an{" "}
          <Link href="/admin/sessions" className="font-medium underline">
            academic session
          </Link>{" "}
          first, then add weeks and students.
        </p>
      ) : (
        <>
          <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Academic session:
              </span>
              {sessions.map((sess) => {
                const id = sess._id.toString();
                const active = id === activeSessionId;
                return (
                  <Link
                    key={id}
                    href={`/admin/scores?sessionId=${encodeURIComponent(id)}`}
                    className={
                      active
                        ? "rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white"
                        : "rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:border-indigo-300 dark:border-slate-600 dark:text-slate-200"
                    }
                  >
                    {sess.name}
                  </Link>
                );
              })}
            </div>
            {grid ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {grid.sessionName}
                </span>
                {" · "}
                {grid.weeks.length} week{grid.weeks.length === 1 ? "" : "s"},{" "}
                {grid.students.length} student
                {grid.students.length === 1 ? "" : "s"}
              </p>
            ) : null}
          </section>

          {grid ? (
            <AdminScoresMatrix key={adminScoreGridStateKey(grid)} grid={grid} />
          ) : (
            <p className="text-sm text-slate-500">Could not load this session.</p>
          )}
        </>
      )}
    </div>
  );
}
