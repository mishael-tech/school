"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createWeek, deleteWeek, updateWeek } from "@/services/week.service";
import { weekCreateSchema, weekUpdateSchema } from "@/utils/validators";

export type ActionResult = { ok?: true; error?: string };

function q(msg: string) {
  return encodeURIComponent(msg);
}

export async function createWeekAction(formData: FormData): Promise<void> {
  const raw = {
    weekNumber: Number(formData.get("weekNumber")),
    sessionId: String(formData.get("sessionId") ?? ""),
  };
  const parsed = weekCreateSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/weeks?error=${q(parsed.error.flatten().formErrors.join(" ") || "Invalid input")}`,
    );
  }
  try {
    await createWeek(parsed.data);
  } catch {
    redirect(
      `/admin/weeks?error=${q("Could not save week — it may already exist for this academic session.")}`,
    );
  }
  revalidatePath("/admin/weeks");
  revalidatePath("/");
  redirect("/admin/weeks?ok=1");
}

export async function updateWeekFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("rowId") ?? "");
  if (!id) redirect(`/admin/weeks?error=${q("Missing week id.")}`);

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
    const msg =
      parsed.error.flatten().formErrors.join(" ") ||
      parsed.error.issues[0]?.message ||
      "Invalid input";
    redirect(`/admin/weeks/${id}?error=${q(msg)}`);
  }
  try {
    const updated = await updateWeek(id, parsed.data);
    if (!updated) {
      redirect(`/admin/weeks/${id}?error=${q("Week not found.")}`);
    }
  } catch {
    redirect(`/admin/weeks/${id}?error=${q("Could not update week.")}`);
  }
  revalidatePath("/admin/weeks");
  revalidatePath("/");
  redirect("/admin/weeks?ok=1");
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
