// Error messages are static and carry their details in `cause`. People read
// these strings in the token UI, so the cause has to be part of the text.
export function formatError(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error)
  }
  if (error.cause === undefined) {
    return error.message
  }
  return `${error.message} (${formatCause(error.cause)})`
}

function formatCause(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  try {
    const json = JSON.stringify(cause, (_key, value: unknown) =>
      value instanceof Error ? value.message : value,
    )
    return json ?? String(cause)
  } catch {
    return String(cause)
  }
}
