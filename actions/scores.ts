"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { applyScoreGrid } from "@/services/admin-score-grid.service";
import {
  deleteScore,
  upsertScore,
  updateScoreById,
} from "@/services/score.service";
import {
  scoreGridBatchSchema,
  scoreUpdateSchema,
  scoreUpsertSchema,
} from "@/utils/validators";

export type ActionResult = { ok?: true; error?: string };

/** Legacy form actions redirect here (new scores UI is session-based). */
function adminScoresRedirectPath(err?: string, ok?: boolean) {
  const base = "/admin/scores";
  const params = new URLSearchParams();
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
      adminScoresRedirectPath(
        parsed.error.flatten().formErrors.join(" ") || "Invalid input",
      ),
    );
  }
  try {
    await upsertScore(parsed.data);
  } catch {
    redirect(adminScoresRedirectPath("Could not save score."));
  }
  revalidatePath("/standings");
  revalidatePath("/admin/scores");
  redirect(adminScoresRedirectPath(undefined, true));
}

export async function updateScoreNumericAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const raw = {
    score: Number(formData.get("score")),
  };
  const parsed = scoreUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      adminScoresRedirectPath(
        parsed.error.flatten().formErrors.join(" ") || "Invalid score",
      ),
    );
  }
  if (!id) {
    redirect(adminScoresRedirectPath("Missing score id."));
  }
  const updated = await updateScoreById(id, parsed.data);
  if (!updated) {
    redirect(adminScoresRedirectPath("Score row not found."));
  }
  revalidatePath("/standings");
  revalidatePath("/admin/scores");
  redirect(adminScoresRedirectPath(undefined, true));
}

export async function deleteScoreFormAction(
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing id." };
  const ok = await deleteScore(id);
  if (!ok) return { error: "Not found." };
  revalidatePath("/standings");
  revalidatePath("/admin/scores");
  return { ok: true };
}

export type SaveScoresGridResult = { ok?: true; error?: string };

export async function saveScoresGridAction(
  input: unknown,
): Promise<SaveScoresGridResult> {
  const parsed = scoreGridBatchSchema.safeParse(input);
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors.join(" ") ||
      parsed.error.issues[0]?.message ||
      "Invalid data.";
    return { error: msg };
  }
  try {
    await applyScoreGrid(parsed.data.sessionId, parsed.data.cells);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Could not save scores.";
    return { error: msg };
  }
  revalidatePath("/standings");
  revalidatePath("/admin/scores");
  return { ok: true };
}
