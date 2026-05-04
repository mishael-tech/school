"use client";

import Link from "next/link";
import { useState } from "react";

export type SessionOpt = { id: string; name: string };

type Props = { sessions: SessionOpt[] };

/** Home: pick session and jump to standings (no weekly selection). */
export function HomeSessionJump({ sessions }: Props) {
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");

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
          onChange={(e) => setSessionId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        >
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <Link
        href={`/standings?sessionId=${encodeURIComponent(sessionId)}`}
        className="inline-flex justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-500"
      >
        View standings table
      </Link>
    </div>
  );
}
