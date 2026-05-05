import type { Metadata } from "next";
import type { GalleryGridItem } from "@/components/GalleryGrid";
import { GalleryGrid } from "@/components/GalleryGrid";
import { listGalleryImages } from "@/services/gallery.service";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo gallery",
};

function imageSrc(item: { _id: string; imageUrl: string }) {
  return item.imageUrl.trim().length > 0 ? item.imageUrl : `/api/gallery/${item._id}`;
}

export default async function PublicGalleryPage() {
  const rows = await listGalleryImages();

  const items: GalleryGridItem[] = rows.map((item) => ({
    id: item._id,
    src: imageSrc(item),
    title: item.title,
    caption: item.caption,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Gallery
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Photos shared by your teachers. Tap a photo to view it fullscreen.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No photos in the gallery yet.
        </p>
      ) : (
        <GalleryGrid items={items} />
      )}
    </div>
  );
}
