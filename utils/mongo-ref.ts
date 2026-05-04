/**
 * Normalize mongoose refs (ObjectId or populated `{ _id }`) to hex id string.
 */
export function mongoRefToIdString(ref: unknown): string {
  if (ref == null || ref === "") return "";
  if (typeof ref === "string") return ref;
  if (typeof ref === "object") {
    const o = ref as Record<string, unknown>;
    if (typeof o._id === "object" && o._id != null && "toString" in o._id) {
      return String((o._id as { toString(): string }).toString());
    }
    if ("toString" in o && typeof o.toString === "function") {
      return String(o.toString());
    }
  }
  return String(ref);
}
