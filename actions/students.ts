"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createStudent,
  deleteStudent,
  updateStudent,
} from "@/services/student.service";
import { studentCreateSchema, studentUpdateSchema } from "@/utils/validators";

export type ActionResult = { ok?: true; error?: string };

export async function createStudentAction(
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    studentId: String(formData.get("studentId") ?? ""),
    class: String(formData.get("class") ?? ""),
  };
  const parsed = studentCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  try {
    await createStudent(parsed.data);
  } catch (e: unknown) {
    const msg =
      e && typeof e === "object" && "code" in e && (e as { code?: number }).code === 11000
        ? "A student with that ID already exists."
        : "Could not save student.";
    return { error: msg };
  }
  revalidatePath("/admin/students");
  return { ok: true };
}

export async function updateStudentAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const raw = {
    name:
      formData.get("name") != null ? String(formData.get("name")) : undefined,
    studentId:
      formData.get("studentId") != null
        ? String(formData.get("studentId"))
        : undefined,
    class:
      formData.get("class") != null ? String(formData.get("class")) : undefined,
  };
  const parsed = studentUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  try {
    const updated = await updateStudent(id, parsed.data);
    if (!updated) return { error: "Student not found." };
  } catch (e: unknown) {
    const msg =
      e && typeof e === "object" && "code" in e && (e as { code?: number }).code === 11000
        ? "A student with that ID already exists."
        : "Could not update student.";
    return { error: msg };
  }
  revalidatePath("/admin/students");
  redirect("/admin/students");
}

export async function deleteStudentAction(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing student id." };
  const ok = await deleteStudent(id);
  if (!ok) return { error: "Not found." };
  revalidatePath("/admin/students");
  return { ok: true };
}
