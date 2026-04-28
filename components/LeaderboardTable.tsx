"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

export type Row = {
  rank: number;
  studentName: string;
  studentMongoId: string;
  score: number;
};

type Props = {
  rows: Row[];
  /** When set, table is active; when null, prompt to pick a week on the home page. */
  activeWeekId: string | null;
  /** Server-side load error (invalid id, DB failure, etc.). */
  blockedMessage?: string | null;
  /** Search text applied server-side — remount resets local draft (`key` on parent updates). */
  appliedSearch?: string;
};

export function LeaderboardTable({
  rows: initial,
  activeWeekId,
  blockedMessage,
  appliedSearch = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = appliedSearch;
  const weekId = searchParams.get("weekId") ?? "";
  const active = activeWeekId ?? weekId;

  const [query, setQuery] = useState(q);
  const [isPending, startTransition] = useTransition();

  const pushFilter = useCallback(
    (nextQ: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const t = nextQ.trim();
      if (t) params.set("q", t);
      else params.delete("q");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md flex-1">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Filter by student name
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                pushFilter(query);
              }
            }}
            placeholder="Search…"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Showing global ranks — search only hides non-matching rows.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => pushFilter(query)}
            disabled={isPending}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
          >
            Apply
          </button>
          {q ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                pushFilter("");
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {blockedMessage ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {blockedMessage}
        </p>
      ) : !active ? (
        <p className="text-center text-slate-600 dark:text-slate-400">
          Pick a week from the{" "}
          <Link className="text-indigo-600 underline hover:text-indigo-500" href="/">
            home page
          </Link>{" "}
          to load scores.
        </p>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Position</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {initial.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No scores for this selection
                      {q ? " (try clearing the search filter)" : ""}.
                    </td>
                  </tr>
                ) : (
                  initial.map((r) => {
                    const top = r.rank <= 3;
                    return (
                      <tr
                        key={r.studentMongoId}
                        className={
                          top
                            ? "bg-amber-50/90 font-medium dark:bg-amber-950/30"
                            : "odd:bg-white even:bg-slate-50/80 dark:odd:bg-slate-900 dark:even:bg-slate-900/60"
                        }
                      >
                        <td className="px-4 py-3">
                          <span
                            className={
                              top
                                ? "inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-amber-200 text-amber-950 dark:bg-amber-700 dark:text-amber-50"
                                : ""
                            }
                          >
                            {r.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
                          {r.studentName}
                        </td>
                        <td className="px-4 py-3 tabular-nums">{r.score}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Top three overall places are highlighted. Rankings are computed when
            you load the page — they are never stored as rank values in the
            database.
          </p>
        </>
      )}
    </div>
  );
}
