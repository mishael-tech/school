import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { updateWeekAction } from "@/actions/weeks";
import { sealFormAction } from "@/lib/seal-form-action";
import { listSessions } from "@/services/session.service";
import { getWeekById } from "@/services/week.service";

type Props = { params: Promise<{ id: string }> };

export default async function EditWeekPage(props: Props) {
  const { id } = await props.params;
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  const [weekDoc, sessions] = await Promise.all([
    getWeekById(id),
    listSessions(),
  ]);
  if (!weekDoc) notFound();

  const sid = weekDoc._id.toString();
  const currentSessionId = weekDoc.sessionId.toString();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/admin/weeks"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        ← Weeks
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Edit week
        </h1>
      </div>

      <form
        action={sealFormAction(updateWeekAction.bind(null, sid))}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Session</label>
          <select
            name="sessionId"
            required
            defaultValue={currentSessionId}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          >
            {sessions.map((s) => (
              <option key={s._id.toString()} value={s._id.toString()}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Week number</label>
          <input
            name="weekNumber"
            type="number"
            required
            min={1}
            defaultValue={weekDoc.weekNumber}
            className="w-32 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Save
        </button>
      </form>
    </div>
  );
}
