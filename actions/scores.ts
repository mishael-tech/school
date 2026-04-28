"use server";

import { revalidatePath } from "next/cache";
import {
  deleteScore,
  upsertScore,
  updateScoreById,
} from "@/services/score.service";
import { scoreUpdateSchema, scoreUpsertSchema } from "@/utils/validators";

export type ActionResult = { ok?: true; error?: string };

export async function upsertScoreAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    studentId: String(formData.get("studentId") ?? ""),
    weekId: String(formData.get("weekId") ?? ""),
    score: Number(formData.get("score")),
  };
  const parsed = scoreUpsertSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  try {
    await upsertScore(parsed.data);
  } catch {
    return { error: "Could not save score." };
  }
  revalidatePath("/leaderboard");
  revalidatePath("/admin/scores");
  return { ok: true };
}

export async function updateScoreNumericAction(
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  const raw = {
    score: Number(formData.get("score")),
  };
  const parsed = scoreUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  if (!id) return { error: "Missing score id." };
  const updated = await updateScoreById(id, parsed.data);
  if (!updated) return { error: "Score row not found." };
  revalidatePath("/leaderboard");
  revalidatePath("/admin/scores");
  return { ok: true };
}

export async function deleteScoreFormAction(
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing id." };
  const ok = await deleteScore(id);
  if (!ok) return { error: "Not found." };
  revalidatePath("/leaderboard");
  revalidatePath("/admin/scores");
  return { ok: true };
}
