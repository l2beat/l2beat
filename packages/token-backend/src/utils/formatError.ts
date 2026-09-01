export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
