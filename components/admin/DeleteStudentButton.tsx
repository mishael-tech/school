"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteStudentAction } from "@/actions/students";

export function DeleteStudentButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      className="text-sm font-medium text-red-600 hover:text-red-500 disabled:opacity-50 dark:text-red-400"
      onClick={() => {
        if (!confirm("Remove this student? Their scores for all weeks will be deleted."))
          return;
        const fd = new FormData();
        fd.append("id", id);
        start(async () => {
          await deleteStudentAction(fd);
          router.refresh();
        });
      }}
    >
      Delete
    </button>
  );
}
