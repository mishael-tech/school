"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { countAdmins, createAdmin, verifyCredentials } from "@/services/admin.service";
import {
  clearAdminSessionCookie,
  setAdminSessionCookie,
  signAdminJwt,
} from "@/utils/auth";
import { bootstrapAdminSchema, loginSchema } from "@/utils/validators";

export type ActionResult = { ok?: true; error?: string };

export async function loginAction(prev: ActionResult, formData: FormData): Promise<ActionResult> {
  void prev;
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Invalid email or password." };
  let token: string;
  try {
    token = await signAdminJwt({ sub: user.id, email: user.email });
  } catch {
    return {
      error:
        "Server configuration error (missing JWT_SECRET). Contact your administrator.",
    };
  }
  await setAdminSessionCookie(token);
  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}

export async function bootstrapAdminAction(
  prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  void prev;
  const n = await countAdmins();
  if (n > 0) return { error: "An administrator account already exists." };
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const parsed = bootstrapAdminSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().formErrors.join(" ") };
  }
  await createAdmin(parsed.data.email, parsed.data.password);
  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Could not sign in after bootstrap." };
  let token: string;
  try {
    token = await signAdminJwt({ sub: user.id, email: user.email });
  } catch {
    return {
      error:
        "Server configuration error (missing JWT_SECRET). Set it and try again.",
    };
  }
  await setAdminSessionCookie(token);
  redirect("/admin/dashboard");
}

/** Accepts optional FormData from <form action> (React progressive enhancement). */
export async function logoutAction(_formData?: FormData) {
  void _formData;
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
