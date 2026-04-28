import type { Types } from "mongoose";
import { listScoresByWeek } from "@/services/score.service";

export type LeaderboardEntry = {
  rank: number;
  studentName: string;
  studentMongoId: string;
  score: number;
};

type PopulatedStudent = {
  _id: Types.ObjectId;
  name: string;
  studentId: string;
  class: string;
};

type ScoreLeanWithStudent = {
  _id: Types.ObjectId;
  score: number;
  studentId: PopulatedStudent;
};

/**
 * Rankings are computed at read time — never persisted.
 * Sorted descending by score; dense ranking by sorted index (+1).
 */
export async function getLeaderboardForWeek(
  weekId: string,
  nameFilter?: string,
): Promise<LeaderboardEntry[]> {
  const rows = await listScoresByWeek(weekId);

  const entries = (rows as unknown as ScoreLeanWithStudent[]).map((r) => ({
    score: r.score,
    studentName: r.studentId?.name ?? "Unknown",
    studentMongoId: String(r.studentId?._id ?? ""),
    sortKey: (r.studentId?.name ?? "").toLowerCase(),
  }));

  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.sortKey.localeCompare(b.sortKey);
  });

  /** Global rank (stored nowhere at rest; computed once per sort). */
  const ranked = entries.map((e, index) => ({
    rank: index + 1,
    studentName: e.studentName,
    studentMongoId: e.studentMongoId,
    score: e.score,
  }));

  const filter = nameFilter?.trim().toLowerCase();
  if (!filter) return ranked;

  return ranked.filter((r) =>
    r.studentName.toLowerCase().includes(filter),
  );
}
