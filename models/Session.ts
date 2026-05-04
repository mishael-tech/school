import mongoose, { Schema, Types, type InferSchemaType, type Model } from "mongoose";

const sessionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    /** Shown to students above the standings table */
    announcementTitle: { type: String, trim: true, default: "" },
    announcementBody: { type: String, trim: true, default: "", maxlength: 8000 },
    /** Public URL for class/group photo (e.g. hosted on Drive or school site) */
    groupPhotoUrl: { type: String, trim: true, default: "", maxlength: 2048 },
  },
  { timestamps: true },
);

export type SessionDocument = InferSchemaType<typeof sessionSchema> & {
  _id: Types.ObjectId;
};

export const SessionModel: Model<SessionDocument> =
  mongoose.models.Session ??
  mongoose.model<SessionDocument>("Session", sessionSchema);
