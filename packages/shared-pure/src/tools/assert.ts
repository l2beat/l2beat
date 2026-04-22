export function assert(
  condition: unknown,
  message?: string,
  cause?: unknown,
): asserts condition {
  if (!condition) {
    throw new Error(
      message ? `Assertion Error: ${message}` : 'Assertion Error',
      {
        cause,
      },
    )
  }
}

export function assertUnreachable(unhandled: never): never {
  throw new Error(
    `There are more values to handle.\n${JSON.stringify(unhandled)}`,
  )
}
