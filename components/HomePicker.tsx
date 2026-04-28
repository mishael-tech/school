"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type SessionOption = { id: string; name: string };
export type WeekOption = { id: string; weekNumber: number };

type Props = {
  sessions: SessionOption[];
  weeksBySession: Record<string, WeekOption[]>;
};

export function HomePicker({ sessions, weeksBySession }: Props) {
  const router = useRouter();
  const firstSession = sessions[0]?.id ?? "";
  const [sessionId, setSessionId] = useState(firstSession);

  const weeks = useMemo(
    () => weeksBySession[sessionId] ?? [],
    [weeksBySession, sessionId],
  );
  const [weekId, setWeekId] = useState(weeks[0]?.id ?? "");

  function onSessionChange(id: string) {
    setSessionId(id);
    const next = weeksBySession[id] ?? [];
    setWeekId(next[0]?.id ?? "");
  }

  if (sessions.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-400">
        No academic sessions yet. Ask your teacher to add data in the admin
        panel.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Academic session
        </label>
        <select
          value={sessionId}
          onChange={(e) => onSessionChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        >
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Week
        </label>
        <select
          value={weekId}
          onChange={(e) => setWeekId(e.target.value)}
          disabled={weeks.length === 0}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        >
          {weeks.length === 0 ? (
            <option value="">No weeks for this session</option>
          ) : (
            weeks.map((w) => (
              <option key={w.id} value={w.id}>
                Week {w.weekNumber}
              </option>
            ))
          )}
        </select>
      </div>
      <button
        type="button"
        disabled={!weekId}
        onClick={() => router.push(`/leaderboard?weekId=${encodeURIComponent(weekId)}`)}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        View leaderboard
      </button>
    </div>
  );
}
