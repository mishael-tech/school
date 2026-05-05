import { connectDB } from "@/lib/db";
import { Announcement } from "@/models/Announcement";
import { GalleryImage } from "@/models/GalleryImage";
import { Score } from "@/models/Score";
import { Student } from "@/models/Student";
import { SessionModel } from "@/models/Session";
import { Week } from "@/models/Week";

export async function getDashboardCounts() {
  await connectDB();
  const [students, sessions, weeks, scores, galleryImages, announcements] =
    await Promise.all([
      Student.countDocuments().exec(),
      SessionModel.countDocuments().exec(),
      Week.countDocuments().exec(),
      Score.countDocuments().exec(),
      GalleryImage.countDocuments().exec(),
      Announcement.countDocuments().exec(),
    ]);
  return {
    students,
    sessions,
    weeks,
    scores,
    galleryImages,
    announcements,
  };
}
