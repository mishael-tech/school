import { SubjectSettingsForm } from "@/components/admin/SubjectSettingsForm";
import { getPublicDisplaySettings } from "@/services/display-settings.service";

export default async function AdminSubjectSettingsPage() {
  const { subjectLabel } = await getPublicDisplaySettings();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Subject &amp; branding
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          What students see on the public homepage, leaderboard header, browser
          tab, and navigation. Data (scores, roster) stays the same — only labels
          change.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <SubjectSettingsForm initialSubject={subjectLabel} />
      </section>
    </div>
  );
}
