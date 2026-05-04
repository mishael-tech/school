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

function q(msg: string) {
  return encodeURIComponent(msg);
}

export async function createSessionAction(formData: FormData): Promise<void> {
  const raw = { name: String(formData.get("name") ?? "") };
  const parsed = sessionCreateSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/sessions?error=${q(parsed.error.flatten().formErrors.join(" ") || "Invalid input")}`,
    );
  }
  try {
    await createSession(parsed.data);
  } catch {
    redirect(
      `/admin/sessions?error=${q("Could not save session — name may already exist.")}`,
    );
  }
  revalidatePath("/admin/sessions");
  revalidatePath("/");
  redirect("/admin/sessions?ok=1");
}

export async function updateSessionFormAction(formData: FormData): Promise<void> {
  const id = String(formData.get("rowId") ?? "");
  if (!id) redirect(`/admin/sessions?error=${q("Missing session id.")}`);

  const raw = {
    name: formData.get("name") != null ? String(formData.get("name")) : undefined,
  };
  const parsed = sessionUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/admin/sessions/${id}?error=${q(parsed.error.flatten().formErrors.join(" ") || "Invalid input")}`,
    );
  }
  try {
    const updated = await updateSession(id, parsed.data);
    if (!updated) {
      redirect(`/admin/sessions/${id}?error=${q("Session not found.")}`);
    }
  } catch {
    redirect(`/admin/sessions/${id}?error=${q("Could not update session.")}`);
  }
  revalidatePath("/admin/sessions");
  revalidatePath("/");
  redirect("/admin/sessions?ok=1");
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
