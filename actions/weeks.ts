"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createWeek, deleteWeek, updateWeek } from "@/services/week.service";
import { weekCreateSchema, weekUpdateSchema } from "@/utils/validators";

export type ActionResult = { ok?: true; error?: string };

export async function createWeekAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    weekNumber: Number(formData.get("weekNumber")),
    sessionId: String(formData.get("sessionId") ?? ""),
  };
  const parsed = weekCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  try {
    await createWeek(parsed.data);
  } catch {
    return {
      error:
        "Could not save week — it may already exist for this academic session.",
    };
  }
  revalidatePath("/admin/weeks");
  revalidatePath("/");
  return { ok: true };
}

export async function updateWeekAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const weekNumRaw = formData.get("weekNumber");
  const sessRaw = formData.get("sessionId");
  const raw: { weekNumber?: number; sessionId?: string } = {};
  if (weekNumRaw != null && String(weekNumRaw) !== "") {
    raw.weekNumber = Number(weekNumRaw);
  }
  if (sessRaw != null && String(sessRaw) !== "") {
    raw.sessionId = String(sessRaw);
  }
  const parsed = weekUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  try {
    const updated = await updateWeek(id, parsed.data);
    if (!updated) return { error: "Week not found." };
  } catch {
    return { error: "Could not update week." };
  }
  revalidatePath("/admin/weeks");
  revalidatePath("/");
  redirect("/admin/weeks");
}

export async function deleteWeekAction(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing week id." };
  const ok = await deleteWeek(id);
  if (!ok) return { error: "Not found." };
  revalidatePath("/admin/weeks");
  revalidatePath("/admin/scores");
  revalidatePath("/");
  return { ok: true };
}
