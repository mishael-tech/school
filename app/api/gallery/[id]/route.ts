import { NextResponse } from "next/server";
import { getGalleryImageBinary } from "@/services/gallery.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, props: Props) {
  const { id } = await props.params;
  const blob = await getGalleryImageBinary(id);
  if (!blob) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(Buffer.from(blob.data), {
    status: 200,
    headers: {
      "Content-Type": blob.mimeType,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
