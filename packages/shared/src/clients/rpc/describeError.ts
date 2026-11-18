/**
 * Errors keep their dynamic values in `cause`, but the decisions on whether an
 * RPC failure is a revert or a limit hit match on the text the RPC returned,
 * which lives there.
 */
export function describeError(error: {
  message: string
  cause?: unknown
}): string {
  if (error.cause === undefined) {
    return error.message
  }
  try {
    return `${error.message} ${JSON.stringify(error.cause)}`
  } catch {
    return error.message
  }
}
