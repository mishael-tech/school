import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { mongoRefToIdString } from "@/utils/mongo-ref";
import { listSessions } from "@/services/session.service";
import { getWeekById } from "@/services/week.service";

type Props = {
  searchParams: Promise<{ weekId?: string }>;
};

/** Legacy week URLs → season standings for that week’s session */
export default async function LeaderboardRedirectPage(props: Props) {
  const sp = await props.searchParams;
  const weekId = typeof sp.weekId === "string" ? sp.weekId : undefined;

  if (weekId && mongoose.Types.ObjectId.isValid(weekId)) {
    const w = await getWeekById(weekId);
    if (w) {
      const sid = mongoRefToIdString(w.sessionId as unknown).trim();
      if (sid && mongoose.Types.ObjectId.isValid(sid)) {
        redirect(`/standings?sessionId=${encodeURIComponent(sid)}`);
      }
    }
  }

  const sessions = await listSessions();
  const first = sessions[0]?._id.toString();
  if (first) redirect(`/standings?sessionId=${encodeURIComponent(first)}`);
  redirect("/standings");
}
