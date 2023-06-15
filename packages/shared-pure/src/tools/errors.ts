export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  } else if (error instanceof Error) {
    return error.message
  } else {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${error}`
  }
}

export function getErrorStackTrace(error: unknown): string | null {
  if (!(error instanceof Error)) {
    return null
  }

  return error.stack ?? null
}
