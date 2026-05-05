"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export type GalleryGridItem = {
  id: string;
  src: string;
  title: string;
  caption: string;
};

type Props = { items: GalleryGridItem[] };

export function GalleryGrid({ items }: Props) {
  const [active, setActive] = useState<GalleryGridItem | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [active, close]);

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => setActive(item)}
              className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
            >
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:brightness-95 dark:group-hover:brightness-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  decoding="async"
                />
                <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
              </div>
              <div className="p-4">
                <span className="block font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </span>
                {item.caption ? (
                  <span className="mt-2 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.caption}
                  </span>
                ) : null}
              </div>
              <span className="sr-only">Open fullscreen: {item.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={active.caption ? descId : undefined}
        >
          <div className="relative flex shrink-0 justify-end px-3 pt-3 md:px-6 md:pt-6">
            <button
              type="button"
              ref={closeBtnRef}
              onClick={close}
              className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Close
            </button>
          </div>

          {/* Tap outside image (padding / letterboxing) to dismiss */}
          <div
            role="presentation"
            className="flex min-h-0 flex-1 items-center justify-center px-4 py-2 md:px-10 md:py-6"
            onClick={close}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt=""
              className="max-h-[min(calc(100dvh-12rem),90dvh)] max-w-full object-contain"
              referrerPolicy="no-referrer"
              decoding="async"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="shrink-0 border-t border-white/10 bg-black/70 px-4 py-5 text-white backdrop-blur-md md:py-6">
            <p id={titleId} className="text-lg font-semibold md:text-xl">
              {active.title}
            </p>
            {active.caption ? (
              <p id={descId} className="mt-2 max-w-3xl text-sm leading-relaxed text-white/85">
                {active.caption}
              </p>
            ) : null}
            <p className="mt-4 text-xs text-white/45">
              Escape to close · tap the dark area around the photo to close
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
