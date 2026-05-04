import type {
  SessionStandingsResult,
  StandingsRow,
} from "@/services/standings.service";
import { MAX_STANDINGS_WEEKS } from "@/services/standings.service";

type Props = { data: SessionStandingsResult };

export function StandingsBoard({ data }: Props) {
  const { weeks, rows, announcementTitle, announcementBody, groupPhotoUrl } =
    data;

  const hasExtras =
    Boolean(announcementTitle) ||
    Boolean(announcementBody) ||
    Boolean(groupPhotoUrl);

  return (
    <div className="space-y-8">
      {hasExtras ? (
        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[1fr_minmax(0,280px)]">
          <div className="min-w-0 space-y-3">
            {announcementTitle ? (
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {announcementTitle}
              </h2>
            ) : null}
            {announcementBody ? (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {announcementBody}
              </div>
            ) : null}
          </div>
          {groupPhotoUrl ? (
            <div className="flex flex-col items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin pastes arbitrary HTTPS URLs */}
              <img
                src={groupPhotoUrl}
                alt="Class or group"
                className="max-h-64 w-full max-w-sm rounded-xl border border-slate-200 object-cover shadow-sm dark:border-slate-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Group photo
              </span>
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-900 text-white dark:border-slate-700 dark:bg-slate-950">
              <th className="sticky left-0 z-20 bg-slate-900 px-3 py-3 pl-4 text-xs font-semibold uppercase tracking-wide dark:bg-slate-950">
                Pos
              </th>
              <th className="sticky left-[3rem] z-20 bg-slate-900 px-3 py-3 text-xs font-semibold uppercase tracking-wide dark:bg-slate-950">
                Student
              </th>
              <th className="sticky left-[12rem] z-20 whitespace-nowrap bg-slate-900 px-3 py-3 text-xs font-semibold uppercase tracking-wide dark:bg-slate-950 md:left-[13rem]">
                Class
              </th>
              {weeks.map((w) => (
                <th
                  key={w.id}
                  className="min-w-[3.25rem] px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide"
                  title={`Week ${w.weekNumber}`}
                >
                  W{w.weekNumber}
                </th>
              ))}
              <th className="min-w-[4rem] border-l border-slate-600 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + Math.max(weeks.length, 1) + 1}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  No students recorded yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <StandingsRowCells key={r.studentMongoId} row={r} weeks={weeks} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Up to {MAX_STANDINGS_WEEKS} week columns · empty cells ({`"`}—{`"`}) mean no
        score yet (counts as 0 toward Pts); ranks use total Pts only.
      </p>
    </div>
  );
}

function StandingsRowCells({
  row,
  weeks,
}: {
  row: StandingsRow;
  weeks: { id: string }[];
}) {
  const topThree = row.rank <= 3;
  const stickyBg = topThree
    ? "bg-amber-50 dark:bg-amber-950/30"
    : "bg-white odd:bg-white even:bg-slate-50/90 dark:bg-slate-900 dark:odd:bg-slate-900 dark:even:bg-slate-950/80";

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      <td
        className={`sticky left-0 z-10 border-r border-slate-100 px-3 py-2.5 pl-4 tabular-nums dark:border-slate-800 ${stickyBg}`}
      >
        <span
          className={
            topThree
              ? "inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-amber-200 text-sm text-amber-950 dark:bg-amber-700 dark:text-amber-50"
              : ""
          }
        >
          {row.rank}
        </span>
      </td>
      <td
        className={`sticky left-[3rem] z-10 max-w-[11rem] truncate border-r border-slate-100 px-3 py-2.5 font-medium text-slate-900 dark:border-slate-800 dark:text-slate-100 md:max-w-[14rem] ${stickyBg}`}
      >
        {row.name}
      </td>
      <td
        className={`sticky left-[12rem] z-10 whitespace-nowrap border-r border-slate-200 px-3 py-2.5 text-slate-700 dark:border-slate-700 dark:text-slate-300 md:left-[13rem] ${stickyBg}`}
      >
        {row.class}
      </td>
      {weeks.map((w, i) => {
        const v = row.weekScores[i];
        return (
          <td
            key={w.id}
            className="px-1 py-2.5 text-center tabular-nums text-slate-800 dark:text-slate-200"
          >
            {v === null ? (
              <span className="text-slate-400 dark:text-slate-600">—</span>
            ) : (
              v
            )}
          </td>
        );
      })}
      <td className="border-l border-slate-200 bg-slate-100 px-3 py-2.5 text-center text-base font-bold tabular-nums text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
        {row.total}
      </td>
    </tr>
  );
}
