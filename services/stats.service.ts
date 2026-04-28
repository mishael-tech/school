import { connectDB } from "@/lib/db";
import { Score } from "@/models/Score";
import { Student } from "@/models/Student";
import { SessionModel } from "@/models/Session";
import { Week } from "@/models/Week";

export async function getDashboardCounts() {
  await connectDB();
  const [students, sessions, weeks, scores] = await Promise.all([
    Student.countDocuments().exec(),
    SessionModel.countDocuments().exec(),
    Week.countDocuments().exec(),
    Score.countDocuments().exec(),
  ]);
  return { students, sessions, weeks, scores };
}
