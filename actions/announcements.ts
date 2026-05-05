"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAnnouncement, deleteAnnouncement } from "@/services/announcement.service";
import { announcementCreateSchema } from "@/utils/validators";

export type AnnouncementActionResult = { ok?: true; error?: string };

function path(err?: string, ok?: boolean) {
  const params = new URLSearchParams();
  if (err) params.set("error", err);
  if (ok) params.set("ok", "1");
  const qs = params.toString();
  return qs ? `/admin/announcements?${qs}` : "/admin/announcements";
}

export async function createAnnouncementAction(formData: FormData): Promise<void> {
  const raw = {
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
  };
  const parsed = announcementCreateSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      path(
        parsed.error.flatten().formErrors.join(" ") ||
          parsed.error.issues[0]?.message ||
          "Invalid input",
      ),
    );
  }
  try {
    await createAnnouncement(parsed.data);
  } catch {
    redirect(path("Could not save announcement."));
  }
  revalidatePath("/announcements");
  redirect(path(undefined, true));
}

export async function deleteAnnouncementAction(
  formData: FormData,
): Promise<AnnouncementActionResult> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing id." };
  const ok = await deleteAnnouncement(id);
  if (!ok) return { error: "Not found." };
  revalidatePath("/announcements");
  return { ok: true };
}
