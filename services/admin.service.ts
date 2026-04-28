import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function countAdmins(): Promise<number> {
  await connectDB();
  return Admin.countDocuments().exec();
}

export async function findAdminByEmail(email: string) {
  await connectDB();
  return Admin.findOne({ email: email.toLowerCase().trim() }).exec();
}

export async function createAdmin(email: string, plainPassword: string) {
  await connectDB();
  const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return Admin.create({
    email: email.toLowerCase().trim(),
    passwordHash,
  });
}

export async function verifyCredentials(
  email: string,
  plainPassword: string,
): Promise<{ id: string; email: string } | null> {
  const doc = await findAdminByEmail(email);
  if (!doc) return null;
  const ok = await bcrypt.compare(plainPassword, doc.passwordHash);
  if (!ok) return null;
  return { id: doc._id.toString(), email: doc.email };
}
