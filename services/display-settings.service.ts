import { cache } from "react";
import { connectDB } from "@/lib/db";
import { SiteDisplaySettings } from "@/models/SiteDisplaySettings";

const KEY = "default";

export type PublicDisplay = {
  subjectLabel: string;
};

async function fetchDisplay(): Promise<PublicDisplay> {
  await connectDB();
  const doc = await SiteDisplaySettings.findOne({
    settingsKey: KEY,
  })
    .lean()
    .exec();

  const label = doc?.subjectLabel?.trim() || "Math";
  return { subjectLabel: label.length > 0 ? label : "Math" };
}

/**
 * Deduped per request across headers, metadata, and public pages (React cache).
 */
export const getPublicDisplaySettings = cache(fetchDisplay);

export async function upsertSubjectLabel(subjectLabel: string): Promise<void> {
  await connectDB();
  const trimmed = subjectLabel.trim();
  if (!trimmed) {
    throw new Error("Subject label cannot be empty.");
  }
  await SiteDisplaySettings.findOneAndUpdate(
    { settingsKey: KEY },
    { $set: { subjectLabel: trimmed } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).exec();
}
