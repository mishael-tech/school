import { countAdmins } from "@/services/admin.service";
import { LoginForm, BootstrapForm } from "@/components/auth/LoginForms";

export default async function AdminLoginPage() {
  const admins = await countAdmins();
  const bootstrap = admins === 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
          {bootstrap ? "Administrator setup" : "Admin sign in"}
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          This area is only for teachers and staff.
        </p>
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
