import type { Metadata } from "next";
import { listAnnouncements } from "@/services/announcement.service";

export const metadata: Metadata = {
  title: "Announcements",
  description: "School announcements",
};

function formatDate(d: Date) {
  return d.toLocaleString(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default async function PublicAnnouncementsPage() {
  const items = await listAnnouncements();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Announcements
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Updates and notices from your teachers. Newest first.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No announcements yet.
        </p>
      ) : (
        <ol className="space-y-6">
          {items.map((a) => (
            <li
              key={a._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {a.title}
              </h2>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {formatDate(a.createdAt)}
              </p>
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {a.body}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
