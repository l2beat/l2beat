// eslint-disable-next-line
export function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ? `Assertion Error: ${message}` : 'Assertion Error')
  }
}
