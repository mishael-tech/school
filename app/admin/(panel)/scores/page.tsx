import Link from "next/link";
import mongoose from "mongoose";
import { upsertScoreAction, updateScoreNumericAction } from "@/actions/scores";
import { FormFlash } from "@/components/admin/FormFlash";
import { DeleteScoreButton } from "@/components/admin/DeleteScoreButton";
import { listScoresByWeek } from "@/services/score.service";
import { listStudents } from "@/services/student.service";
import { listWeeks } from "@/services/week.service";

type Props = {
  searchParams: Promise<{ weekId?: string; error?: string; ok?: string }>;
};

function weekTitle(w: {
  sessionId?: unknown;
  weekNumber: number;
}) {
  const sid = w.sessionId;
  const name =
    sid &&
    typeof sid === "object" &&
    sid !== null &&
    "name" in sid &&
    typeof (sid as { name: unknown }).name === "string"
      ? (sid as { name: string }).name
      : undefined;
  return name ? `${name} · Week ${w.weekNumber}` : `Week ${w.weekNumber}`;
}

export default async function AdminScoresPage(props: Props) {
  const searchParams = await props.searchParams;
  const requested = searchParams.weekId;

  const [weeksRaw, students] = await Promise.all([
    listWeeks(),
    listStudents(),
  ]);

  const weeks = weeksRaw as Array<{
    _id: { toString: () => string };
    weekNumber: number;
    sessionId?: unknown;
  }>;

  const validRequested =
    requested && mongoose.Types.ObjectId.isValid(requested)
      ? requested
      : null;

  const defaultWeekId = weeks[0]?._id.toString() ?? null;
  const activeWeekId = validRequested ?? defaultWeekId;

  const scoreRows = activeWeekId
    ? await listScoresByWeek(activeWeekId)
    : [];

  type PopulatedScore = {
    _id: { toString: () => string };
    score: number;
    studentId?: {
      name?: string;
      studentId?: string;
    };
  };

  const rows = scoreRows as unknown as PopulatedScore[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Scores
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          One score per student per week. Updates here show up immediately on the
          public leaderboard.
        </p>
      </div>

      <FormFlash
        error={searchParams.error}
        success={
          searchParams.ok === "1" ? "Score saved successfully." : undefined
        }
      />

      <section className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Week:
        </span>
        {weeks.length === 0 ? (
          <span className="text-sm text-slate-500">
            Add sessions and weeks first.
          </span>
        ) : (
          weeks.map((w) => {
            const id = w._id.toString();
            const active = id === activeWeekId;
            return (
              <Link
                key={id}
                href={`/admin/scores?weekId=${encodeURIComponent(id)}`}
                className={
                  active
                    ? "rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white"
                    : "rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:border-indigo-300 dark:border-slate-600 dark:text-slate-200"
                }
              >
                {weekTitle(w)}
              </Link>
            );
          })
        )}
      </section>

      {activeWeekId && students.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Add or replace score
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Submitting for the same student and week overwrites the previous
            value.
          </p>
          <form
            action={upsertScoreAction}
            className="mt-4 flex flex-wrap items-end gap-4"
          >
            <input type="hidden" name="weekId" value={activeWeekId} />
            <div>
              <label className="mb-1 block text-sm font-medium">Student</label>
              <select
                name="studentId"
                required
                className="min-w-[220px] rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
              >
                {students.map((s) => (
                  <option key={s._id.toString()} value={s._id.toString()}>
                    {s.name} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Score</label>
              <input
                name="score"
                type="number"
                required
                step="any"
                className="w-32 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Save score
            </button>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!activeWeekId ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={3}>
                  Create a week to begin recording scores.
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={3}>
                  No scores for this week yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const name = r.studentId?.name ?? "Unknown";
                const label = r.studentId?.studentId
                  ? `${name} (${r.studentId.studentId})`
                  : name;
                const id = r._id.toString();
                return (
                  <tr
                    key={id}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-4 py-3">{label}</td>
                    <td className="px-4 py-3">
                      <form
                        action={updateScoreNumericAction}
                        className="flex max-w-xs items-center gap-2"
                      >
                        <input type="hidden" name="id" value={id} />
                        <input
                          type="hidden"
                          name="contextWeekId"
                          value={activeWeekId}
                        />
                        <input
                          name="score"
                          type="number"
                          required
                          step="any"
                          defaultValue={r.score}
                          className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-950"
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
                        >
                          Update
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteScoreButton id={id} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
