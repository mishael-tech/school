"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/actions/auth";
import { bootstrapAdminAction, loginAction } from "@/actions/auth";

const empty: ActionResult = {};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, empty);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          minLength={8}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        />
      </div>
      {state?.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Sign in
      </button>
    </form>
  );
}

export function BootstrapForm() {
  const [state, formAction] = useActionState(bootstrapAdminAction, empty);

  return (
    <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50/90 p-5 dark:border-amber-900/70 dark:bg-amber-950/40">
      <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
        Create first administrator
      </h2>
      <p className="mt-2 text-sm text-amber-800/90 dark:text-amber-200/90">
        No admin account exists yet. Set the initial email and a strong password
        (minimum 10 characters). This form is only available until the first
        account is created.
      </p>
      <form action={formAction} className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={10}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
          />
        </div>
        {state?.error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-lg bg-amber-700 py-2.5 text-sm font-medium text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
        >
          Create admin account
        </button>
      </form>
    </div>
  );
}
