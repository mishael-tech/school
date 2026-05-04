import Link from "next/link";
import { createStudentAction } from "@/actions/students";
import { FormFlash } from "@/components/admin/FormFlash";
import { DeleteStudentButton } from "@/components/admin/DeleteStudentButton";
import { listStudents } from "@/services/student.service";

type Props = { searchParams?: Promise<{ error?: string; ok?: string }> };

export default async function AdminStudentsPage(props: Props) {
  const sp = props.searchParams ? await props.searchParams : {};
  const students = await listStudents();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Students
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Students are listed on the public leaderboard by name; school IDs stay
          internal.
        </p>
      </div>

      <FormFlash
        error={sp.error}
        success={sp.ok === "1" ? "Student saved successfully." : undefined}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Add student
        </h2>
        <form
          action={createStudentAction}
          className="mt-4 grid gap-4 sm:grid-cols-3"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">School ID</label>
            <input
              name="studentId"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 font-mono text-sm"
              placeholder="e.g., 2024001"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Class</label>
            <input
              name="class"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
              placeholder="e.g., Algebra A"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Save student
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">School ID</th>
              <th className="px-4 py-3 font-medium">Class</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-slate-500"
                  colSpan={4}
                >
                  No students yet.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr
                  key={s._id.toString()}
                  className="border-t border-slate-100 dark:border-slate-800"
                >
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.studentId}</td>
                  <td className="px-4 py-3">{s.class}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/students/${s._id.toString()}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Edit
                      </Link>
                      <DeleteStudentButton id={s._id.toString()} />
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
