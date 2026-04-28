"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  deleteSession,
  updateSession,
} from "@/services/session.service";
import { sessionCreateSchema, sessionUpdateSchema } from "@/utils/validators";

export type ActionResult = { ok?: true; error?: string };

export async function createSessionAction(
  formData: FormData,
): Promise<ActionResult> {
  const raw = { name: String(formData.get("name") ?? "") };
  const parsed = sessionCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  try {
    await createSession(parsed.data);
  } catch {
    return { error: "Could not save session — name may already exist." };
  }
  revalidatePath("/admin/sessions");
  revalidatePath("/");
  return { ok: true };
}

export async function updateSessionAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") != null ? String(formData.get("name")) : undefined,
  };
  const parsed = sessionUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  try {
    const updated = await updateSession(id, parsed.data);
    if (!updated) return { error: "Session not found." };
  } catch {
    return { error: "Could not update session." };
  }
  revalidatePath("/admin/sessions");
  revalidatePath("/");
  redirect("/admin/sessions");
}

export async function deleteSessionAction(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing session id." };
  const ok = await deleteSession(id);
  if (!ok) return { error: "Not found." };
  revalidatePath("/admin/sessions");
  revalidatePath("/admin/weeks");
  revalidatePath("/admin/scores");
  revalidatePath("/");
  return { ok: true };
}
