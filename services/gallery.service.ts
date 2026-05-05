import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import type { GalleryImageDocument } from "@/models/GalleryImage";
import { GalleryImage } from "@/models/GalleryImage";

export const GALLERY_MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** No image bytes — public and admin lists use `imageUrl` or `/api/gallery/[id]` */
export type GalleryImageListEntry = {
  _id: string;
  title: string;
  caption: string;
  imageUrl: string;
  createdAt: Date;
};

function mapLeanRow(r: Record<string, unknown>): GalleryImageListEntry {
  const created = r.createdAt;
  return {
    _id: String(r._id),
    title: String(r.title ?? ""),
    caption: String(r.caption ?? ""),
    imageUrl: String(r.imageUrl ?? "").trim(),
    createdAt:
      created instanceof Date ? created : new Date(String(created ?? 0)),
  };
}

export async function listGalleryImages(): Promise<GalleryImageListEntry[]> {
  await connectDB();
  const rows = await GalleryImage.find()
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return (rows as Record<string, unknown>[]).map(mapLeanRow);
}

export async function createGalleryImage(payload: {
  title: string;
  caption: string;
  imageUrl: string;
  mimeType: string;
  imageData?: Buffer;
}): Promise<GalleryImageDocument> {
  await connectDB();
  const url = payload.imageUrl.trim();
  const data = payload.imageData;
  const hasUrl = url.length > 0;
  const hasData = Boolean(data && data.length > 0);
  if (!hasUrl && !hasData) {
    throw new Error("Provide an image file or a direct image URL.");
  }
  if (hasUrl && hasData) {
    throw new Error("Use either file upload or URL, not both.");
  }
  if (hasData && data!.length > GALLERY_MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image exceeds ${GALLERY_MAX_UPLOAD_BYTES / (1024 * 1024)} MB limit.`,
    );
  }

  return GalleryImage.create({
    title: payload.title,
    caption: payload.caption,
    imageUrl: hasUrl ? url : "",
    mimeType: hasData ? payload.mimeType : "",
    imageData: hasData ? data : undefined,
  });
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const res = await GalleryImage.findByIdAndDelete(id).exec();
  return !!res;
}

export async function getGalleryImageBinary(
  id: string,
): Promise<{ mimeType: string; data: Buffer } | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const doc = await GalleryImage.findById(id).select("+imageData").exec();
  if (!doc?.imageData || !(doc.imageData as Buffer)?.length) return null;
  const mime =
    doc.mimeType && doc.mimeType.length > 0 ? doc.mimeType : "application/octet-stream";
  return { mimeType: mime, data: doc.imageData as Buffer };
}
