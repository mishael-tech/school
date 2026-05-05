import type { Metadata } from "next";
import { listGalleryImages } from "@/services/gallery.service";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo gallery",
};

function imageSrc(item: { _id: string; imageUrl: string }) {
  return item.imageUrl.trim().length > 0 ? item.imageUrl : `/api/gallery/${item._id}`;
}

export default async function PublicGalleryPage() {
  const items = await listGalleryImages();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Gallery
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Photos shared by your teachers.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No photos in the gallery yet.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc(item)}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-slate-900 dark:text-white">{item.title}</h2>
                {item.caption ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.caption}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
