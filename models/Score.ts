import mongoose, { Schema, Types, type InferSchemaType, type Model } from "mongoose";

const scoreSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    weekId: {
      type: Schema.Types.ObjectId,
      ref: "Week",
      required: true,
      index: true,
    },
    score: { type: Number, required: true },
  },
  { timestamps: true },
);

scoreSchema.index({ studentId: 1, weekId: 1 }, { unique: true });

export type ScoreDocument = InferSchemaType<typeof scoreSchema> & {
  _id: Types.ObjectId;
};

export const Score: Model<ScoreDocument> =
  mongoose.models.Score ?? mongoose.model<ScoreDocument>("Score", scoreSchema);
