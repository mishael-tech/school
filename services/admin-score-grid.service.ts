import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Score } from "@/models/Score";
import { SessionModel as SessionDoc } from "@/models/Session";
import { MAX_STANDINGS_WEEKS } from "@/services/standings.service";
import { listStudents } from "@/services/student.service";
import { listWeeksBySession } from "@/services/week.service";
import { setScoreCell } from "@/services/score.service";

export type AdminScoreGridWeek = { id: string; weekNumber: number };
export type AdminScoreGridStudent = {
  id: string;
  name: string;
  schoolId: string;
  classLabel: string;
};

export type AdminScoreGrid = {
  sessionId: string;
  sessionName: string;
  weeks: AdminScoreGridWeek[];
  students: AdminScoreGridStudent[];
  /** `${studentMongoId}:${weekMongoId}` → score */
  scoreByCell: Record<string, number>;
};

/** Remount client matrix when roster, weeks, or scores change after refresh */
export function adminScoreGridStateKey(g: AdminScoreGrid): string {
  const scorePart = Object.entries(g.scoreByCell)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join(";");
  return [
    g.sessionId,
    g.students.map((s) => s.id).join(","),
    g.weeks.map((w) => w.id).join(","),
    scorePart,
  ].join("|");
}

export async function getAdminScoreGrid(
  sessionId: string,
): Promise<AdminScoreGrid | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(sessionId)) return null;

  const session = await SessionDoc.findById(sessionId).lean().exec();
  if (!session || !("_id" in session)) return null;

  const weeksAll = await listWeeksBySession(sessionId);
  const weeks = weeksAll.slice(0, MAX_STANDINGS_WEEKS).map((w) => ({
    id: w._id.toString(),
    weekNumber: w.weekNumber,
  }));

  const weekOids = weeks.map((w) => new mongoose.Types.ObjectId(w.id));

  const studentDocs = await listStudents();
  const students = studentDocs.map((s) => ({
    id: s._id.toString(),
    name: s.name,
    schoolId: s.studentId,
    classLabel: s.class,
  }));

  const scoreByCell: Record<string, number> = {};
  if (weekOids.length > 0) {
    const rows = await Score.find({ weekId: { $in: weekOids } })
      .lean()
      .exec();
    for (const row of rows) {
      const r = row as {
        studentId: mongoose.Types.ObjectId;
        weekId: mongoose.Types.ObjectId;
        score: number;
      };
      scoreByCell[`${String(r.studentId)}:${String(r.weekId)}`] = r.score;
    }
  }

  const sess = session as { name: string };
  return {
    sessionId,
    sessionName: sess.name,
    weeks,
    students,
    scoreByCell,
  };
}

export type ScoreGridCellInput = {
  studentId: string;
  weekId: string;
  score: number | null;
};

/**
 * Applies a full matrix from the admin UI: empty cells are null (delete score row).
 * Validates every week belongs to the session and every student exists.
 */
export async function applyScoreGrid(
  sessionId: string,
  cells: ScoreGridCellInput[],
): Promise<void> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session.");
  }

  const session = await SessionDoc.findById(sessionId).lean().exec();
  if (!session) throw new Error("Session not found.");

  const weeks = await listWeeksBySession(sessionId);
  const allowedWeeks = new Set(
    weeks.slice(0, MAX_STANDINGS_WEEKS).map((w) => w._id.toString()),
  );

  const studentDocs = await listStudents();
  const allowedStudents = new Set(studentDocs.map((s) => s._id.toString()));

  for (const c of cells) {
    if (!allowedWeeks.has(c.weekId)) {
      throw new Error("One or more weeks are not part of this session.");
    }
    if (!allowedStudents.has(c.studentId)) {
      throw new Error("One or more students are invalid.");
    }
  }

  for (const c of cells) {
    await setScoreCell({
      studentId: c.studentId,
      weekId: c.weekId,
      score: c.score,
    });
  }
}
