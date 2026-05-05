import { DeleteGalleryImageButton } from "@/components/admin/DeleteGalleryImageButton";
import { GalleryAddForm } from "@/components/admin/GalleryAddForm";
import { FormFlash } from "@/components/admin/FormFlash";
import { GALLERY_MAX_UPLOAD_BYTES, listGalleryImages } from "@/services/gallery.service";

type Props = { searchParams?: Promise<{ error?: string; ok?: string }> };

function galleryImageSrc(item: { _id: string; imageUrl: string }) {
  return item.imageUrl.trim().length > 0 ? item.imageUrl : `/api/gallery/${item._id}`;
}

export default async function AdminGalleryPage(props: Props) {
  const sp = props.searchParams ? await props.searchParams : {};
  const items = await listGalleryImages();
  const maxMb = GALLERY_MAX_UPLOAD_BYTES / (1024 * 1024);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gallery</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Upload pictures or paste a direct image URL. Students see them on the{" "}
          <a
            href="/gallery"
            className="font-medium text-indigo-600 underline hover:text-indigo-500 dark:text-indigo-400"
          >
            public gallery
          </a>
          .
        </p>
      </div>

      <FormFlash
        error={sp.error}
        success={sp.ok === "1" ? "Gallery image saved." : undefined}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Add image
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Use either a file upload <span className="font-medium">or</span> an image URL — not
          both. While uploading, the form stays disabled so you can’t send twice.
        </p>
        <GalleryAddForm maxMb={maxMb} />
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="border-b border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
          Published images ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-slate-500">
            No images yet — add one above.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start"
              >
                <div className="shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element -- dynamic admin & external URLs */}
                  <img
                    src={galleryImageSrc(item)}
                    alt=""
                    className="h-28 w-40 object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  {item.caption ? (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {item.caption}
                    </p>
                  ) : null}
                  <p className="mt-2 font-mono text-xs text-slate-500 break-all">
                    {item.imageUrl.trim() ? item.imageUrl : `Stored upload · ${item._id}`}
                  </p>
                </div>
                <div className="shrink-0">
                  <DeleteGalleryImageButton id={item._id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
