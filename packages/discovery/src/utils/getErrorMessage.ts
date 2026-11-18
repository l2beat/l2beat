/**
 * Errors keep their message static and carry the values in a plain-object
 * `cause` (so logs can match the message exactly). This text is read by a
 * person, in discovered.json or a report, so it appends the values the log
 * would have shipped as a structured field.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  if (error instanceof Error) {
    return `${error.message}${describeCause(error.cause)}`
  }
  return `${error}`
}

function describeCause(cause: unknown): string {
  if (typeof cause !== 'object' || cause === null || cause instanceof Error) {
    return ''
  }
  try {
    const json = JSON.stringify(cause, (_key, value: unknown) =>
      value instanceof Error ? value.message : value,
    )
    return `: ${json}`
  } catch {
    return ''
  }
}
