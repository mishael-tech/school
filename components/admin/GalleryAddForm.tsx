"use client";

import { useFormStatus } from "react-dom";
import { createGalleryImageAction } from "@/actions/gallery";

function GalleryFormFields({ maxMb }: { maxMb: number }) {
  const { pending } = useFormStatus();

  return (
    <fieldset
      disabled={pending}
      className="mt-4 min-w-0 border-0 p-0 grid gap-4 sm:grid-cols-2"
      aria-busy={pending}
    >
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          name="title"
          required
          maxLength={160}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950"
          placeholder="e.g., Sports day 2026"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Caption (optional)</label>
        <input
          name="caption"
          maxLength={600}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950"
          placeholder="Short description"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Upload file</label>
        <input
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-60 dark:text-slate-400 dark:file:bg-indigo-950 dark:file:text-indigo-200"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Or image URL</label>
        <input
          name="imageUrl"
          type="url"
          placeholder="https://…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950"
        />
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-w-[10rem] items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <span
                className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden
              />
              Uploading…
            </>
          ) : (
            "Add to gallery"
          )}
        </button>
        {pending ? (
          <span className="text-sm text-slate-600 dark:text-slate-400">Please wait…</span>
        ) : null}
      </div>
      <p className="sm:col-span-2 text-xs text-slate-500 dark:text-slate-400">
        Use either a file upload <span className="font-medium">or</span> an image URL — not both.
        Max {maxMb} MB · JPG, PNG, GIF, WebP.
      </p>
    </fieldset>
  );
}

export function GalleryAddForm({ maxMb }: { maxMb: number }) {
  return (
    <form action={createGalleryImageAction} encType="multipart/form-data">
      <GalleryFormFields maxMb={maxMb} />
    </form>
  );
}
