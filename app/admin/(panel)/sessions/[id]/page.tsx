import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { updateSessionFormAction } from "@/actions/sessions";
import { FormFlash } from "@/components/admin/FormFlash";
import { getSessionById } from "@/services/session.service";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function EditSessionPage(props: Props) {
  const { id } = await props.params;
  const flash = props.searchParams ? await props.searchParams : {};
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

      <FormFlash error={flash.error} />

      <form
        action={updateSessionFormAction}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <input type="hidden" name="rowId" value={sid} />
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
