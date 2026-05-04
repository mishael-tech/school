import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Score } from "@/models/Score";
import { SessionModel as SessionDoc } from "@/models/Session";
import { Student } from "@/models/Student";
import { Week } from "@/models/Week";

/** Matches a typical term; extra weeks stay in DB but do not appear on the student table */
export const MAX_STANDINGS_WEEKS = 15;

export type StandingsWeekCol = { id: string; weekNumber: number };

export type StandingsRow = {
  rank: number;
  studentMongoId: string;
  name: string;
  schoolStudentId: string;
  class: string;
  /** One entry per standings week column (`null` = no score that week). */
  weekScores: (number | null)[];
  /** Sum across displayed weeks; missing weeks count as 0. */
  total: number;
};

export type SessionStandingsResult = {
  sessionName: string;
  announcementTitle: string;
  announcementBody: string;
  groupPhotoUrl: string;
  weeks: StandingsWeekCol[];
  rows: StandingsRow[];
};

/**
 * Premier League-style table: ranks by cumulative points across displayed weeks.
 * Weeks are sorted by week number; positions are computed at read time.
 */
export async function getSessionStandings(
  sessionId: string,
): Promise<SessionStandingsResult | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(sessionId)) return null;

  const session = await SessionDoc.findById(sessionId).lean().exec();
  if (!session || !("_id" in session)) return null;

  const sid = sessionId;
  const oid = new mongoose.Types.ObjectId(sid);

  const weeksAll = await Week.find({ sessionId: oid })
    .sort({ weekNumber: 1 })
    .lean()
    .exec();

  const weeks = weeksAll.slice(0, MAX_STANDINGS_WEEKS);
  const weekIds = weeks.map((w) => w._id);

  const scores =
    weekIds.length > 0
      ? await Score.find({
          weekId: { $in: weekIds },
        })
          .lean()
          .exec()
      : [];

  const weekIdToIdx = new Map(
    weekIds.map((wid, index) => [wid.toString(), index]),
  );

  type ScoreLean = {
    studentId: mongoose.Types.ObjectId;
    weekId: mongoose.Types.ObjectId;
    score: number;
  };

  const scoreMap = new Map<string, Map<number, number>>();
  for (const s of scores as ScoreLean[]) {
    const idx = weekIdToIdx.get(String(s.weekId));
    if (idx === undefined) continue;
    const studentKey = String(s.studentId);
    if (!scoreMap.has(studentKey)) scoreMap.set(studentKey, new Map());
    scoreMap.get(studentKey)!.set(idx, s.score);
  }

  const studentDocs = await Student.find().sort({ name: 1 }).lean().exec();

  type StLean = { _id: mongoose.Types.ObjectId; name: string; studentId: string; class: string };

  type RowDraft = Omit<StandingsRow, "rank">;
  const rowDrafts: RowDraft[] = (studentDocs as StLean[]).map((st) => {
    const studentKey = String(st._id);
    const pmap = scoreMap.get(studentKey);
    const weekScores = weeks.map((_, index) =>
      pmap?.has(index) ? pmap.get(index)! : null,
    );
    const total = weekScores.reduce<number>(
      (sum, val) => sum + (val ?? 0),
      0,
    );

    return {
      studentMongoId: studentKey,
      name: st.name,
      schoolStudentId: st.studentId,
      class: st.class,
      weekScores,
      total,
    };
  });

  rowDrafts.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  const rows: StandingsRow[] = rowDrafts.map((r, index) => ({
    ...r,
    rank: index + 1,
  }));

  const sess = session as {
    name: string;
    announcementTitle?: string;
    announcementBody?: string;
    groupPhotoUrl?: string;
  };

  return {
    sessionName: sess.name,
    announcementTitle: (sess.announcementTitle ?? "").trim(),
    announcementBody: (sess.announcementBody ?? "").trim(),
    groupPhotoUrl: (sess.groupPhotoUrl ?? "").trim(),
    weeks: weeks.map((w) => ({
      id: w._id.toString(),
      weekNumber: w.weekNumber,
    })),
    rows,
  };
}
