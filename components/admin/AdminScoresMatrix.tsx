"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveScoresGridAction } from "@/actions/scores";
import type { AdminScoreGrid } from "@/services/admin-score-grid.service";

function cellKey(studentId: string, weekId: string) {
  return `${studentId}:${weekId}`;
}

function buildInitialValues(grid: AdminScoreGrid): Record<string, string> {
  const out: Record<string, string> = {};
  for (const s of grid.students) {
    for (const w of grid.weeks) {
      const k = cellKey(s.id, w.id);
      const v = grid.scoreByCell[k];
      out[k] = v !== undefined ? String(v) : "";
    }
  }
  return out;
}

type Props = { grid: AdminScoreGrid };

export function AdminScoresMatrix({ grid }: Props) {
  const router = useRouter();
  const [values, setValues] = useState(() => buildInitialValues(grid));
  const [message, setMessage] = useState<{ ok?: string; error?: string }>({});
  const [pending, startTransition] = useTransition();

  const hasWeeks = grid.weeks.length > 0;
  const hasStudents = grid.students.length > 0;

  const save = () => {
    if (!hasWeeks || !hasStudents) return;
    setMessage({});
    const cells: { studentId: string; weekId: string; score: number | null }[] =
      [];
    for (const s of grid.students) {
      for (const w of grid.weeks) {
        const k = cellKey(s.id, w.id);
        const raw = (values[k] ?? "").trim();
        if (raw === "") {
          cells.push({ studentId: s.id, weekId: w.id, score: null });
        } else {
          const n = Number(raw);
          if (!Number.isFinite(n)) {
            setMessage({
              error: `Invalid score for ${s.name} (W${w.weekNumber}). Use a number or leave the cell blank.`,
            });
            return;
          }
          cells.push({ studentId: s.id, weekId: w.id, score: n });
        }
      }
    }
    startTransition(async () => {
      const res = await saveScoresGridAction({
        sessionId: grid.sessionId,
        cells,
      });
      if (res.error) setMessage({ error: res.error });
      else {
        setMessage({ ok: "Scores saved." });
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {message.error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {message.error}
        </p>
      ) : null}
      {message.ok ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
          {message.ok}
        </p>
      ) : null}

      {!hasStudents ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Add students first, then enter scores below.
        </p>
      ) : null}

      {!hasWeeks ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No weeks for this session yet.{" "}
          <a
            href="/admin/weeks"
            className="font-medium text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400"
          >
            Add weeks on the Weeks page
          </a>{" "}
          — columns appear here automatically.
        </p>
      ) : null}

      {hasWeeks && hasStudents ? (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  <th className="whitespace-nowrap px-3 py-3 pl-4 font-semibold">
                    Student
                  </th>
                  <th className="whitespace-nowrap px-3 py-3 font-semibold">
                    School ID
                  </th>
                  <th className="whitespace-nowrap border-r border-slate-200 px-3 py-3 font-semibold dark:border-slate-600">
                    Class
                  </th>
                  {grid.weeks.map((w) => (
                    <th
                      key={w.id}
                      className="min-w-[4.5rem] px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide"
                      title={`Week ${w.weekNumber}`}
                    >
                      W{w.weekNumber}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.students.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-100 odd:bg-white even:bg-slate-50/80 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-slate-950/60"
                  >
                    <td className="whitespace-nowrap px-3 py-2 pl-4 font-medium text-slate-900 dark:text-slate-100">
                      {s.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {s.schoolId}
                    </td>
                    <td className="whitespace-nowrap border-r border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                      {s.classLabel}
                    </td>
                    {grid.weeks.map((w) => {
                      const k = cellKey(s.id, w.id);
                      return (
                        <td key={w.id} className="px-1 py-1.5">
                          <label className="sr-only">
                            {s.name} week {w.weekNumber} score
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            value={values[k] ?? ""}
                            onChange={(e) =>
                              setValues((prev) => ({
                                ...prev,
                                [k]: e.target.value,
                              }))
                            }
                            disabled={pending}
                            className="w-full min-w-[3.5rem] rounded-md border border-slate-300 bg-white px-1.5 py-1.5 text-center text-sm tabular-nums text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Blank cells remove stored scores for that week. Click save when
              finished editing.
            </p>
            <button
              type="button"
              disabled={pending}
              onClick={save}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save all scores"}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
