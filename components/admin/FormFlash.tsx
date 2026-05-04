type Props = {
  error?: string;
  success?: string;
};

/** Server-rendered feedback for form actions that redirect with ?error= or ?ok=. */
export function FormFlash({ error, success }: Props) {
  if (error) {
    return (
      <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
        {success}
      </p>
    );
  }
  return null;
}
