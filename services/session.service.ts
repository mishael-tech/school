import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import type { SessionDocument } from "@/models/Session";
import { SessionModel as SessionDoc } from "@/models/Session";
import { Score } from "@/models/Score";
import { Week } from "@/models/Week";

export async function createSession(payload: {
  name: string;
  announcementTitle?: string;
  announcementBody?: string;
  groupPhotoUrl?: string;
}): Promise<SessionDocument> {
  await connectDB();
  return SessionDoc.create(payload);
}

export async function updateSession(
  id: string,
  payload: {
    name?: string;
    announcementTitle?: string;
    announcementBody?: string;
    groupPhotoUrl?: string;
  },
): Promise<SessionDocument | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return SessionDoc.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).exec();
}

export async function deleteSession(id: string): Promise<boolean> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const oid = new mongoose.Types.ObjectId(id);
  const weeks = await Week.find({ sessionId: oid }).select("_id").lean().exec();
  const weekIds = weeks.map((w) => w._id);
  if (weekIds.length > 0) {
    await Score.deleteMany({ weekId: { $in: weekIds } }).exec();
    await Week.deleteMany({ _id: { $in: weekIds } }).exec();
  }
  const res = await SessionDoc.findByIdAndDelete(oid).exec();
  return !!res;
}

export async function getSessionById(
  id: string,
): Promise<SessionDocument | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return SessionDoc.findById(id).exec();
}

export async function listSessions(): Promise<SessionDocument[]> {
  await connectDB();
  return SessionDoc.find()
    .sort({ name: -1 })
    .lean()
    .exec() as unknown as SessionDocument[];
}
