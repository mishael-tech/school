import Link from "next/link";
import { getPublicDisplaySettings } from "@/services/display-settings.service";

export async function PublicHeader() {
  const { subjectLabel } = await getPublicDisplaySettings();
  const brand = `${subjectLabel} Scoreboard`;

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
          {brand}
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link className="hover:text-indigo-600 dark:hover:text-indigo-400" href="/standings">
            Standings
          </Link>
          <Link
            className="rounded-md border border-slate-200 px-3 py-1.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
            href="/admin/login"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
