"use client";

import { useActionState } from "react";
import type { SubjectSettingsState } from "@/actions/display-settings";
import { subjectSettingsAction } from "@/actions/display-settings";

const empty: SubjectSettingsState = {};

type Props = { initialSubject: string };

export function SubjectSettingsForm({ initialSubject }: Props) {
  const [state, formAction] = useActionState(subjectSettingsAction, empty);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="subjectLabel"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Subject shown to students
        </label>
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
          Updates the scoreboard title, navigation label, homepage heading, and
          browser tab for public pages — for example Mathematics, Chemistry, or
          Physics.
        </p>
        <input
          id="subjectLabel"
          name="subjectLabel"
          type="text"
          required
          maxLength={80}
          defaultValue={initialSubject}
          className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
        />
      </div>
      {state?.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          Saved. Public pages will show the new subject on the next visit.
        </p>
      ) : null}
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Save subject
      </button>
    </form>
  );
}
