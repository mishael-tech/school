import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Score } from "@/models/Score";
import type { WeekDocument } from "@/models/Week";
import { Week } from "@/models/Week";

export async function createWeek(payload: {
  weekNumber: number;
  sessionId: string;
}): Promise<WeekDocument> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(payload.sessionId)) {
    throw new Error("Invalid session ID");
  }
  return Week.create({
    weekNumber: payload.weekNumber,
    sessionId: new mongoose.Types.ObjectId(payload.sessionId),
  });
}

export async function updateWeek(
  id: string,
  payload: { weekNumber?: number; sessionId?: string },
): Promise<WeekDocument | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const raw: Record<string, unknown> = {};
  if (payload.weekNumber !== undefined) raw.weekNumber = payload.weekNumber;
  if (payload.sessionId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(payload.sessionId)) return null;
    raw.sessionId = new mongoose.Types.ObjectId(payload.sessionId);
  }
  return Week.findByIdAndUpdate(id, raw, {
    new: true,
    runValidators: true,
  }).exec();
}

export async function deleteWeek(id: string): Promise<boolean> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const oid = new mongoose.Types.ObjectId(id);
  await Score.deleteMany({ weekId: oid }).exec();
  const res = await Week.findByIdAndDelete(oid).exec();
  return !!res;
}

export async function getWeekById(id: string): Promise<WeekDocument | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Week.findById(id).exec();
}

export async function listWeeksBySession(
  sessionId: string,
): Promise<WeekDocument[]> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(sessionId)) return [];
  return Week.find({
    sessionId: new mongoose.Types.ObjectId(sessionId),
  })
    .sort({ weekNumber: 1 })
    .lean()
    .exec() as unknown as WeekDocument[];
}

export async function listWeeks(): Promise<WeekDocument[]> {
  await connectDB();
  return Week.find()
    .sort({ sessionId: 1, weekNumber: 1 })
    .populate("sessionId")
    .lean()
    .exec() as unknown as WeekDocument[];
}
