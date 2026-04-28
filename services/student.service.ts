import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Score } from "@/models/Score";
import type { StudentDocument } from "@/models/Student";
import { Student } from "@/models/Student";

export async function createStudent(payload: {
  name: string;
  studentId: string;
  class: string;
}): Promise<StudentDocument> {
  await connectDB();
  return Student.create(payload);
}

export async function updateStudent(
  id: string,
  payload: { name?: string; studentId?: string; class?: string },
): Promise<StudentDocument | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Student.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).exec();
}

export async function deleteStudent(id: string): Promise<boolean> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const oid = new mongoose.Types.ObjectId(id);
  await Score.deleteMany({ studentId: oid }).exec();
  const res = await Student.findByIdAndDelete(oid).exec();
  return !!res;
}

export async function getStudentById(id: string): Promise<StudentDocument | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Student.findById(id).exec();
}

export async function listStudents(): Promise<StudentDocument[]> {
  await connectDB();
  return Student.find().sort({ name: 1 }).exec();
}
