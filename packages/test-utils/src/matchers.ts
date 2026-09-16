import type { MatcherState, SyncMatcherResult } from 'vitest'

/**
 * Matchers that have no vitest equivalent, kept so that assertions migrated
 * from earl keep asserting the same thing instead of being weakened.
 *
 * Register them with `expect.extend(earlMatchers)` - `@l2beat/test-utils/setup`
 * does that and is meant to be listed in a package's `setupFiles`.
 */
export const earlMatchers = {
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
     * earl's `toThrow(ErrorClass, message)` in one assertion: the thrown error
     * must be an instance of `errorClass` and its message must contain
     * `message` (or match it, for a RegExp).
     *
     * Also works behind the `rejects` modifier.
     */
    toThrowWithMessage(errorClass: ErrorClass, message: string | RegExp): R
    /** earl's `toEqualUnsorted`: same items, any order, deep equality. */
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
