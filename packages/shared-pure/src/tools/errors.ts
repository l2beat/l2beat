export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  if (error instanceof Error) {
    return error.message
  }
  return `${error}`
}

export function getErrorStackTrace(error: unknown): string | null {
  if (!(error instanceof Error)) {
    return null
  }

  return error.stack ?? null
}
