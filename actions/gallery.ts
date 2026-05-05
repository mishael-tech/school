"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createGalleryImage,
  deleteGalleryImage,
  GALLERY_MAX_UPLOAD_BYTES,
} from "@/services/gallery.service";
import { galleryCreateFormSchema } from "@/utils/validators";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export type GalleryActionResult = { ok?: true; error?: string };

function galleryPath(err?: string, ok?: boolean) {
  const params = new URLSearchParams();
  if (err) params.set("error", err);
  if (ok) params.set("ok", "1");
  const qs = params.toString();
  return qs ? `/admin/gallery?${qs}` : "/admin/gallery";
}

export async function createGalleryImageAction(formData: FormData): Promise<void> {
  const raw = {
    title: String(formData.get("title") ?? ""),
    caption: String(formData.get("caption") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
  };
  const parsed = galleryCreateFormSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      galleryPath(
        parsed.error.flatten().formErrors.join(" ") ||
          parsed.error.issues[0]?.message ||
          "Invalid input",
      ),
    );
  }

  const fileEntry = formData.get("file");
  let buffer: Buffer | undefined;
  let mimeType = "";

  if (fileEntry instanceof File && fileEntry.size > 0) {
    if (fileEntry.size > GALLERY_MAX_UPLOAD_BYTES) {
      redirect(galleryPath(`Image must be ${GALLERY_MAX_UPLOAD_BYTES / (1024 * 1024)} MB or smaller.`));
    }
    const type = fileEntry.type || "";
    if (!ALLOWED_IMAGE_TYPES.has(type)) {
      redirect(galleryPath("Unsupported file type. Use JPG, PNG, GIF, or WebP."));
    }
    const bytes = await fileEntry.arrayBuffer();
    buffer = Buffer.from(bytes);
    mimeType = type;
  }

  try {
    await createGalleryImage({
      title: parsed.data.title,
      caption: parsed.data.caption,
      imageUrl: buffer ? "" : parsed.data.imageUrl,
      mimeType,
      imageData: buffer,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Could not save gallery image.";
    redirect(galleryPath(msg));
  }

  revalidatePath("/gallery");
  redirect(galleryPath(undefined, true));
}

export async function deleteGalleryImageAction(formData: FormData): Promise<GalleryActionResult> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing id." };

  const ok = await deleteGalleryImage(id);
  if (!ok) return { error: "Not found." };

  revalidatePath("/gallery");
  return { ok: true };
}
