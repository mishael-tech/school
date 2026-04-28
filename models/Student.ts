import mongoose, { Schema, Types, type InferSchemaType, type Model } from "mongoose";

const studentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true, trim: true },
    class: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export type StudentDocument = InferSchemaType<typeof studentSchema> & {
  _id: Types.ObjectId;
};

export const Student: Model<StudentDocument> =
  mongoose.models.Student ??
  mongoose.model<StudentDocument>("Student", studentSchema);
