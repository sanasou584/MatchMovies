/** Safely extracts a human-readable message from a thrown value. */
export const getErrorMessage = (err: unknown, fallback?: string): string => {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback ?? "";
};
