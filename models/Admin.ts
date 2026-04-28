import mongoose, { Schema, Types, type InferSchemaType, type Model } from "mongoose";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export type AdminDocument = InferSchemaType<typeof adminSchema> & {
  _id: Types.ObjectId;
};

export const Admin: Model<AdminDocument> =
  mongoose.models.Admin ?? mongoose.model<AdminDocument>("Admin", adminSchema);
