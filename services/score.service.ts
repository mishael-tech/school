import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import type { ScoreDocument } from "@/models/Score";
import { Score } from "@/models/Score";

/** Set numeric score or clear the cell (removes the score document when null). */
export async function setScoreCell(payload: {
  studentId: string;
  weekId: string;
  score: number | null;
}): Promise<void> {
  if (payload.score !== null) {
    await upsertScore({
      studentId: payload.studentId,
      weekId: payload.weekId,
      score: payload.score,
    });
    return;
  }
  await connectDB();
  if (
    !mongoose.Types.ObjectId.isValid(payload.studentId) ||
    !mongoose.Types.ObjectId.isValid(payload.weekId)
  ) {
    throw new Error("Invalid student or week ID");
  }
  await Score.deleteOne({
    studentId: new mongoose.Types.ObjectId(payload.studentId),
    weekId: new mongoose.Types.ObjectId(payload.weekId),
  }).exec();
}

export async function upsertScore(payload: {
  studentId: string;
  weekId: string;
  score: number;
}): Promise<ScoreDocument> {
  await connectDB();
  if (
    !mongoose.Types.ObjectId.isValid(payload.studentId) ||
    !mongoose.Types.ObjectId.isValid(payload.weekId)
  ) {
    throw new Error("Invalid student or week ID");
  }
  return Score.findOneAndUpdate(
    {
      studentId: new mongoose.Types.ObjectId(payload.studentId),
      weekId: new mongoose.Types.ObjectId(payload.weekId),
    },
    {
      score: payload.score,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  ).exec() as Promise<ScoreDocument>;
}

export async function updateScoreById(
  id: string,
  payload: { score: number },
): Promise<ScoreDocument | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Score.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).exec();
}

export async function deleteScore(id: string): Promise<boolean> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const res = await Score.findByIdAndDelete(id).exec();
  return !!res;
}

export async function listScoresByWeek(weekId: string) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(weekId)) return [];
  return Score.find({
    weekId: new mongoose.Types.ObjectId(weekId),
  })
    .populate("studentId")
    .lean()
    .exec();
}
