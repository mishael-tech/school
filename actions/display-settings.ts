"use server";

import { revalidatePath } from "next/cache";
import { upsertSubjectLabel } from "@/services/display-settings.service";
import { siteDisplaySubjectSchema } from "@/utils/validators";

export type SubjectSettingsState = {
  ok?: boolean;
  error?: string;
};

export async function subjectSettingsAction(
  _prev: SubjectSettingsState,
  formData: FormData,
): Promise<SubjectSettingsState> {
  void _prev;
  const raw = { subjectLabel: String(formData.get("subjectLabel") ?? "") };
  const parsed = siteDisplaySubjectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.flatten().formErrors.join(" ") || "Invalid subject.",
    };
  }
  try {
    await upsertSubjectLabel(parsed.data.subjectLabel);
  } catch {
    return { error: "Could not save settings. Check database connection." };
  }
  revalidatePath("/", "layout");
  revalidatePath("/standings");
  revalidatePath("/leaderboard");
  revalidatePath("/admin/settings");
  return { ok: true, error: undefined };
}
