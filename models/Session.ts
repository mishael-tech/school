import mongoose, { Schema, Types, type InferSchemaType, type Model } from "mongoose";

const sessionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true },
);

export type SessionDocument = InferSchemaType<typeof sessionSchema> & {
  _id: Types.ObjectId;
};

export const SessionModel: Model<SessionDocument> =
  mongoose.models.Session ??
  mongoose.model<SessionDocument>("Session", sessionSchema);
