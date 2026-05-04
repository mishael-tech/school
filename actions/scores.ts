"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteScore,
  upsertScore,
  updateScoreById,
} from "@/services/score.service";
import { scoreUpdateSchema, scoreUpsertSchema } from "@/utils/validators";

export type ActionResult = { ok?: true; error?: string };

function scoresPath(weekId: string | undefined, err?: string, ok?: boolean) {
  const base = "/admin/scores";
  const params = new URLSearchParams();
  if (weekId) params.set("weekId", weekId);
  if (err) params.set("error", err);
  if (ok) params.set("ok", "1");
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function upsertScoreAction(formData: FormData): Promise<void> {
  const weekId = String(formData.get("weekId") ?? "");
  const raw = {
    studentId: String(formData.get("studentId") ?? ""),
    weekId,
    score: Number(formData.get("score")),
  };
  const parsed = scoreUpsertSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      scoresPath(
        weekId || undefined,
        parsed.error.flatten().formErrors.join(" ") || "Invalid input",
      ),
    );
  }
  try {
    await upsertScore(parsed.data);
  } catch {
    redirect(scoresPath(weekId || undefined, "Could not save score."));
  }
  revalidatePath("/leaderboard");
  revalidatePath("/admin/scores");
  redirect(scoresPath(weekId || undefined, undefined, true));
}

export async function updateScoreNumericAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const weekId = String(formData.get("contextWeekId") ?? "");
  const raw = {
    score: Number(formData.get("score")),
  };
  const parsed = scoreUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      scoresPath(
        weekId || undefined,
        parsed.error.flatten().formErrors.join(" ") || "Invalid score",
      ),
    );
  }
  if (!id) {
    redirect(scoresPath(weekId || undefined, "Missing score id."));
  }
  const updated = await updateScoreById(id, parsed.data);
  if (!updated) {
    redirect(scoresPath(weekId || undefined, "Score row not found."));
  }
  revalidatePath("/leaderboard");
  revalidatePath("/admin/scores");
  redirect(scoresPath(weekId || undefined, undefined, true));
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
