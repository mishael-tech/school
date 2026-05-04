import Link from "next/link";
import { createWeekAction } from "@/actions/weeks";
import { sealFormAction } from "@/lib/seal-form-action";
import { DeleteWeekButton } from "@/components/admin/DeleteWeekButton";
import { listSessions } from "@/services/session.service";
import { listWeeks } from "@/services/week.service";

type PopulatedWeek = {
  _id: { toString: () => string };
  weekNumber: number;
  sessionId?: unknown;
};

function sessionLabel(raw: PopulatedWeek) {
  const sid = raw.sessionId;
  if (
    sid &&
    typeof sid === "object" &&
    sid !== null &&
    "name" in sid &&
    typeof (sid as { name: unknown }).name === "string"
  ) {
    return (sid as { name: string }).name;
  }
  return "(session)";
}

export default async function AdminWeeksPage() {
  const [sessions, weeks] = await Promise.all([listSessions(), listWeeks()]);

  const weekRows = weeks as PopulatedWeek[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Weeks
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Week numbers must be unique within each academic session.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Add week
        </h2>
        <form
          action={sealFormAction(createWeekAction)}
          className="mt-4 flex flex-wrap items-end gap-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Session</label>
            {sessions.length === 0 ? (
              <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                Create an academic session first (see Sessions in the sidebar).
              </p>
            ) : (
              <select
                name="sessionId"
                required
                defaultValue={sessions[0]._id.toString()}
                className="min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
              >
                {sessions.map((s) => (
                  <option key={s._id.toString()} value={s._id.toString()}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Week number</label>
            <input
              name="weekNumber"
              type="number"
              required
              min={1}
              defaultValue={1}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <button
            type="submit"
            disabled={sessions.length === 0}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            Add week
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium">Session</th>
              <th className="px-4 py-3 font-medium">Week #</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {weekRows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={3}>
                  No weeks yet.
                </td>
              </tr>
            ) : (
              weekRows.map((w) => (
                <tr
                  key={w._id.toString()}
                  className="border-t border-slate-100 dark:border-slate-800"
                >
                  <td className="px-4 py-3">{sessionLabel(w)}</td>
                  <td className="px-4 py-3 tabular-nums">{w.weekNumber}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/weeks/${w._id.toString()}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Edit
                      </Link>
                      <DeleteWeekButton id={w._id.toString()} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
