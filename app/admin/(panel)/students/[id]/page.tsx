import Link from "next/link";
import { notFound } from "next/navigation";
import { updateStudentAction } from "@/actions/students";
import { sealFormAction } from "@/lib/seal-form-action";
import mongoose from "mongoose";
import { getStudentById } from "@/services/student.service";

type Props = { params: Promise<{ id: string }> };

export default async function EditStudentPage(props: Props) {
  const { id } = await props.params;
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  const student = await getStudentById(id);
  if (!student) notFound();

  const sid = student._id.toString();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href="/admin/students"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        ← Students
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Edit student
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{student.name}</p>
      </div>

      <form
        action={sealFormAction(updateStudentAction.bind(null, sid))}
        className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input
            name="name"
            required
            defaultValue={student.name}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">School ID</label>
          <input
            name="studentId"
            required
            defaultValue={student.studentId}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950 font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Class</label>
          <input
            name="class"
            required
            defaultValue={student.class}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
