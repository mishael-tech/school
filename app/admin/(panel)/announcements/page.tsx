import { createAnnouncementAction } from "@/actions/announcements";
import { DeleteAnnouncementButton } from "@/components/admin/DeleteAnnouncementButton";
import { FormFlash } from "@/components/admin/FormFlash";
import { listAnnouncements } from "@/services/announcement.service";

type Props = { searchParams?: Promise<{ error?: string; ok?: string }> };

function formatDate(d: Date) {
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminAnnouncementsPage(props: Props) {
  const sp = props.searchParams ? await props.searchParams : {};
  const items = await listAnnouncements();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Announcements
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Messages for all students appear on the{" "}
          <a
            href="/announcements"
            className="font-medium text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400"
          >
            announcements page
          </a>
          . Newest first.
        </p>
      </div>

      <FormFlash
        error={sp.error}
        success={sp.ok === "1" ? "Announcement published." : undefined}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          New announcement
        </h2>
        <form action={createAnnouncementAction} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              name="title"
              required
              maxLength={200}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
              placeholder="e.g., PTA meeting — Thursday"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea
              name="body"
              required
              rows={8}
              maxLength={12000}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-950"
              placeholder="Full announcement text."
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Publish
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="border-b border-slate-200 px-6 py-3 text-lg font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
          Published ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">
            No announcements yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((a) => (
              <li key={a._id} className="px-6 py-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {a.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(a.createdAt)}
                    </p>
                    <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {a.body}
                    </div>
                  </div>
                  <DeleteAnnouncementButton id={a._id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
