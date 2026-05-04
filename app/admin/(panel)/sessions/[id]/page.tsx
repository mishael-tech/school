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

export default async function EditSessionPage({
  params,
  searchParams,
}: Props) {
  const [{ id }, sp] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({} as { error?: string }),
  ]);
  const flashError = typeof sp.error === "string" ? sp.error : undefined;
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  const sess = await getSessionById(id);
  if (!sess) notFound();

  const sid = sess._id.toString();
  const announcementTitle = sess.announcementTitle ?? "";
  const announcementBody = sess.announcementBody ?? "";
  const groupPhotoUrl = sess.groupPhotoUrl ?? "";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Name, plus what students see at the top of the public standings page.
        </p>
      </div>

      <FormFlash error={flashError} />

      <form
        action={updateSessionFormAction}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <input type="hidden" name="rowId" value={sid} />

        <div>
          <label className="mb-1 block text-sm font-medium">Session name</label>
          <input
            name="name"
            required
            defaultValue={sess.name}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        <div>
          <label className="mb-1 block text-sm font-medium">
            Announcement title
          </label>
          <input
            name="announcementTitle"
            defaultValue={announcementTitle}
            maxLength={200}
            placeholder="e.g., Well done on mid-term revision"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Announcement message
          </label>
          <textarea
            name="announcementBody"
            rows={5}
            maxLength={8000}
            defaultValue={announcementBody}
            placeholder="Shown on the public standings page above the league table."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Group photo URL
          </label>
          <input
            name="groupPhotoUrl"
            type="url"
            defaultValue={groupPhotoUrl}
            placeholder="https://… (host the image on Drive, OneDrive, etc. and paste a link)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm dark:border-slate-600 dark:bg-slate-950"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Use a direct HTTPS link to an image file. Students will see it next
            to the announcement.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Save session &amp; public content
        </button>
      </form>
    </div>
  );
}
