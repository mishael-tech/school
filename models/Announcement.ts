import mongoose, { Schema, Types, type InferSchemaType, type Model } from "mongoose";

const announcementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 12000 },
  },
  { timestamps: true },
);

export type AnnouncementDocument = InferSchemaType<typeof announcementSchema> & {
  _id: Types.ObjectId;
};

export const Announcement: Model<AnnouncementDocument> =
  mongoose.models.Announcement ??
  mongoose.model<AnnouncementDocument>("Announcement", announcementSchema);
