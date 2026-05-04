import Link from "next/link";
import { createSessionAction } from "@/actions/sessions";
import { FormFlash } from "@/components/admin/FormFlash";
import { DeleteSessionButton } from "@/components/admin/DeleteSessionButton";
import { listSessions } from "@/services/session.service";

type Props = { searchParams?: Promise<{ error?: string; ok?: string }> };

export default async function AdminSessionsPage(props: Props) {
  const sp = props.searchParams ? await props.searchParams : {};
  const sessions = await listSessions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Academic sessions
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Group weeks by academic year label (such as{" "}
          <span className="font-mono">2025/2026</span>).
        </p>
      </div>

      <FormFlash
        error={sp.error}
        success={sp.ok === "1" ? "Session saved successfully." : undefined}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          New session
        </h2>
        <form
          action={createSessionAction}
          className="mt-4 flex flex-wrap items-end gap-4"
        >
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
              placeholder="2025/2026"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Add session
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium">Session name</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={2}>
                  No sessions yet.
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr
                  key={s._id.toString()}
                  className="border-t border-slate-100 dark:border-slate-800"
                >
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/sessions/${s._id.toString()}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Edit
                      </Link>
                      <DeleteSessionButton id={s._id.toString()} />
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
