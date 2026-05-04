import { z } from "zod";

/** 24-character hex MongoDB ObjectId string (validated without importing mongoose in Edge-bound code). */
const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid id");

export const loginSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(256),
});

export const bootstrapAdminSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(10).max(256),
});

export const siteDisplaySubjectSchema = z.object({
  subjectLabel: z.string().min(1).max(80).trim(),
});

export const studentCreateSchema = z.object({
  name: z.string().min(1).max(120).trim(),
  studentId: z.string().min(1).max(80).trim(),
  class: z.string().min(1).max(80).trim(),
});

export const studentUpdateSchema = studentCreateSchema.partial();

export const sessionCreateSchema = z.object({
  name: z.string().min(1).max(80).trim(),
});

export const sessionUpdateSchema = sessionCreateSchema.partial();

const optionalUrlOrEmpty = z.union([
  z.literal(""),
  z.string().url().max(2048),
]);

/** Admin edit form includes name plus public standings content */
export const sessionAdminUpdateSchema = z.object({
  name: z.string().min(1).max(80).trim(),
  announcementTitle: z.string().max(200).trim(),
  announcementBody: z.string().max(8000).trim(),
  groupPhotoUrl: optionalUrlOrEmpty,
});

export const weekCreateSchema = z.object({
  weekNumber: z.coerce.number().int().min(1),
  sessionId: objectId,
});

export const weekUpdateSchema = z
  .object({
    weekNumber: z.coerce.number().int().min(1).optional(),
    sessionId: objectId.optional(),
  })
  .refine(
    (d) =>
      d.weekNumber !== undefined || d.sessionId !== undefined,
    "Nothing to update",
  );

export const scoreUpsertSchema = z.object({
  studentId: objectId,
  weekId: objectId,
  score: z.coerce.number().finite(),
});

export const scoreUpdateSchema = z.object({
  score: z.coerce.number().finite(),
});

export const scoreGridCellSchema = z.object({
  studentId: objectId,
  weekId: objectId,
  score: z.union([z.number().finite(), z.null()]),
});

export const scoreGridBatchSchema = z.object({
  sessionId: objectId,
  cells: z.array(scoreGridCellSchema).max(5000),
});

export type StudentCreateInput = z.infer<typeof studentCreateSchema>;
export type ScoreUpsertInput = z.infer<typeof scoreUpsertSchema>;

export { objectId };
