import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { updateSessionAction } from "@/actions/sessions";
import { sealFormAction } from "@/lib/seal-form-action";
import { getSessionById } from "@/services/session.service";

type Props = { params: Promise<{ id: string }> };

export default async function EditSessionPage(props: Props) {
  const { id } = await props.params;
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  const sess = await getSessionById(id);
  if (!sess) notFound();

  const sid = sess._id.toString();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/admin/sessions"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        ← Sessions
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Edit academic session
        </h1>
      </div>

      <form
        action={sealFormAction(updateSessionAction.bind(null, sid))}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            name="name"
            required
            defaultValue={sess.name}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
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
