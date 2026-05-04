import mongoose, { Schema, Types, type InferSchemaType, type Model } from "mongoose";

/** Single row keyed for public-facing copy (subject name, branding). */
const siteDisplaySchema = new Schema(
  {
    settingsKey: { type: String, required: true, unique: true, default: "default" },
    subjectLabel: { type: String, required: true, trim: true, default: "Math" },
  },
  { timestamps: true },
);

export type SiteDisplaySettingsDocument = InferSchemaType<
  typeof siteDisplaySchema
> & {
  _id: Types.ObjectId;
};

export const SiteDisplaySettings: Model<SiteDisplaySettingsDocument> =
  mongoose.models.SiteDisplaySettings ??
  mongoose.model<SiteDisplaySettingsDocument>(
    "SiteDisplaySettings",
    siteDisplaySchema,
  );
