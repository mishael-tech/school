/**
 * Narrow server-action return types so they satisfy React's <form action> typings.
 */
export function sealFormAction(
  fn: (formData: FormData) => Promise<unknown>,
): (formData: FormData) => Promise<void> {
  return async (formData) => {
    await fn(formData);
  };
}
