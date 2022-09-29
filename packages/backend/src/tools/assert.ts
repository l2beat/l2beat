// eslint-disable-next-line
export function assert(condition: any, msg = ''): asserts condition {
  if (!condition) {
    throw new Error('Assertion Error: ' + msg)
  }
}
