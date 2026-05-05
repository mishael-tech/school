import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import type { AnnouncementDocument } from "@/models/Announcement";
import { Announcement } from "@/models/Announcement";

export type AnnouncementListEntry = {
  _id: string;
  title: string;
  body: string;
  createdAt: Date;
};

function mapLeanRow(r: Record<string, unknown>): AnnouncementListEntry {
  const created = r.createdAt;
  return {
    _id: String(r._id),
    title: String(r.title ?? ""),
    body: String(r.body ?? ""),
    createdAt:
      created instanceof Date ? created : new Date(String(created ?? 0)),
  };
}

export async function listAnnouncements(): Promise<AnnouncementListEntry[]> {
  await connectDB();
  const rows = await Announcement.find()
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return (rows as Record<string, unknown>[]).map(mapLeanRow);
}

export async function createAnnouncement(payload: {
  title: string;
  body: string;
}): Promise<AnnouncementDocument> {
  await connectDB();
  return Announcement.create(payload);
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const res = await Announcement.findByIdAndDelete(id).exec();
  return !!res;
}
