"use client";

import { useRouter } from "next/navigation";

export type SessionOpt = { id: string; name: string };

type Props = {
  sessions: SessionOpt[];
  currentSessionId: string;
};

/** Switch academic session while staying on `/standings`. */
export function StandingsSessionSelect({ sessions, currentSessionId }: Props) {
  const router = useRouter();

  if (sessions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xs flex-1">
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Academic session
        </label>
        <select
          value={currentSessionId}
          onChange={(e) => {
            const id = e.target.value;
            router.push(`/standings?sessionId=${encodeURIComponent(id)}`);
          }}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        >
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <p className="max-w-xl text-xs text-slate-500 dark:text-slate-400">
        One table per session: a column per week added (max 15), plus total
        points. Empty cells are shown as dashes and count as 0 toward the total.
      </p>
    </div>
  );
}
