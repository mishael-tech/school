"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteScoreFormAction } from "@/actions/scores";

export function DeleteScoreButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
      onClick={() => {
        if (!confirm("Delete this score entry?")) return;
        const fd = new FormData();
        fd.append("id", id);
        start(async () => {
          await deleteScoreFormAction(fd);
          router.refresh();
        });
      }}
    >
      Delete
    </button>
  );
}
