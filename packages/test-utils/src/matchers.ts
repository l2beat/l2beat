import type { MatcherState, SyncMatcherResult } from 'vitest'

/**
 * Assertions this repo makes often enough to be worth a matcher, and that
 * vitest has no equivalent for. Spelling them out at each call site would
 * either duplicate the subject expression or quietly weaken the assertion.
 *
 * Register them with `expect.extend(customMatchers)` -
 * `@l2beat/test-utils/setup` does that and is meant to be listed in a
 * package's `setupFiles`.
 */
export const customMatchers = {
  toThrowWithMessage,
  toEqualUnsorted,
}

// biome-ignore lint/suspicious/noExplicitAny: matches the shape of an error constructor
type ErrorClass = new (...args: any[]) => Error

declare module 'vitest' {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown,
  > {
    /**
     * Class and message in one assertion: the thrown error must be an instance
     * of `errorClass` and its message must contain `message` (or match it, for
     * a RegExp). Splitting it in two would duplicate the subject expression,
     * which here is often a multi-line arrow function.
     *
     * Also works behind the `rejects` modifier.
     */
    toThrowWithMessage(errorClass: ErrorClass, message: string | RegExp): R
    /** Same items, any order, deep equality. */
    toEqualUnsorted(expected: T): R
  }
}

function toThrowWithMessage(
  this: MatcherState,
  received: unknown,
  errorClass: ErrorClass,
  message: string | RegExp,
): SyncMatcherResult {
  const thrown = capture(received)
  if (!thrown.didThrow) {
    return {
      pass: false,
      message: () =>
        `expected the call to throw ${errorClass.name}, but it did not throw`,
    }
  }
  const { error } = thrown
  const isRightClass = error instanceof errorClass
  const actualMessage = error instanceof Error ? error.message : String(error)
  const hasRightMessage =
    typeof message === 'string'
      ? actualMessage.includes(message)
      : message.test(actualMessage)

  return {
    pass: isRightClass && hasRightMessage,
    message: () =>
      `expected ${this.utils.printReceived(error)} to ${this.isNot ? 'not ' : ''}be a ${errorClass.name} with message ${this.utils.printExpected(message)}`,
    actual: actualMessage,
    expected: message,
  }
}

/** The `rejects` modifier hands us the rejection reason; a plain `expect` hands
 * us the function that is supposed to throw. */
function capture(received: unknown): { didThrow: boolean; error: unknown } {
  if (typeof received !== 'function') {
    return { didThrow: true, error: received }
  }
  try {
    received()
    return { didThrow: false, error: undefined }
  } catch (error) {
    return { didThrow: true, error }
  }
}

function toEqualUnsorted(
  this: MatcherState,
  received: unknown,
  expected: unknown,
): SyncMatcherResult {
  if (!Array.isArray(received) || !Array.isArray(expected)) {
    return {
      pass: false,
      message: () =>
        `toEqualUnsorted compares two arrays, got ${this.utils.printReceived(received)}`,
    }
  }
  const deepEquals = (a: unknown, b: unknown) =>
    this.equals(
      a,
      b,
      [...this.customTesters, this.utils.iterableEquality],
      true,
    )

  return {
    pass: hasSameItems(received, expected, deepEquals),
    message: () =>
      `expected ${this.utils.printReceived(received)} to ${this.isNot ? 'not ' : ''}contain exactly the items of ${this.utils.printExpected(expected)} in any order`,
    actual: received,
    expected,
  }
}

function hasSameItems(
  received: unknown[],
  expected: unknown[],
  equals: (a: unknown, b: unknown) => boolean,
): boolean {
  if (received.length !== expected.length) {
    return false
  }
  const unmatched = [...expected]
  for (const item of received) {
    const index = unmatched.findIndex((candidate) => equals(item, candidate))
    if (index === -1) {
      return false
    }
    unmatched.splice(index, 1)
  }
  return true
}
