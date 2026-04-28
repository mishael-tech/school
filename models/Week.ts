import mongoose, { Schema, Types, type InferSchemaType, type Model } from "mongoose";

const weekSchema = new Schema(
  {
    weekNumber: { type: Number, required: true, min: 1 },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

weekSchema.index({ sessionId: 1, weekNumber: 1 }, { unique: true });

export type WeekDocument = InferSchemaType<typeof weekSchema> & {
  _id: Types.ObjectId;
};

export const Week: Model<WeekDocument> =
  mongoose.models.Week ?? mongoose.model<WeekDocument>("Week", weekSchema);
