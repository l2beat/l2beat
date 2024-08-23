export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message ? `Assertion Error: ${message}` : 'Assertion Error')
  }
}

export function assertUnreachable(unhandled: never): never {
  throw new Error(
    `There are more values to handle.\n${JSON.stringify(unhandled)}`,
  )
}
