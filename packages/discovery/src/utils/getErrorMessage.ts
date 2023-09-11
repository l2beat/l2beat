export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  if (error instanceof Error) {
    return error.message
  }
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return `${error}`
}
