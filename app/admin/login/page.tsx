import { LoginForm, BootstrapForm } from "@/components/auth/LoginForms";
import { countAdmins } from "@/services/admin.service";

type Props = { searchParams?: Promise<{ config?: string }> };

export default async function AdminLoginPage(props: Props) {
  const sp = props.searchParams ? await props.searchParams : {};
  const misconfiguredJwt = sp.config === "missing_jwt";

  let bootstrap = false;
  try {
    const admins = await countAdmins();
    bootstrap = admins === 0;
  } catch {
    /* Mongo unavailable — still show login + connection hint */
    bootstrap = false;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
          {bootstrap ? "Administrator setup" : "Admin sign in"}
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          This area is only for teachers and staff.
        </p>
        {misconfiguredJwt ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            Environment variable{" "}
            <code className="rounded bg-red-100 px-1 py-px font-mono text-xs dark:bg-red-900/60">
              JWT_SECRET
            </code>{" "}
            is not set. Add it in deployment (see <code>.env.example</code>) so
            admin sessions work — otherwise every protected admin URL sends you
            back here.
          </p>
        ) : null}
        <div className="mt-8">
          {bootstrap ? (
            <>
              <BootstrapForm />
              <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                You&apos;ll be signed in right after the account is created.
              </p>
            </>
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
    </div>
  );
}
