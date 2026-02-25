/**
 * Shape matching: checks if actual object matches the expected shape
 *
 * This performs a deep partial comparison where:
 * - All keys in expected must exist in actual
 * - Values must match (deep comparison for objects)
 * - Additional keys in actual are allowed (partial match)
 * - BigInt values are compared by converting both to strings
 *
 * @example
 * const actual = {
 *   type: "ccip.Message",
 *   app: "CCIP Transfer",
 *   src: { ctx: { chain: "ethereum" } }
 * }
 *
 * shapeMatches(actual, { type: "ccip.Message" }) // true
 * shapeMatches(actual, { src: { ctx: { chain: "ethereum" } } }) // true
 * shapeMatches(actual, { src: { ctx: { chain: "base" } } }) // false
 * shapeMatches(actual, { nonexistent: "key" }) // false
 */
export function shapeMatches(
  actual: unknown,
  expected: unknown,
  path = '',
): boolean {
  // Handle null/undefined
  if (expected === null || expected === undefined) {
    return actual === expected
  }

  // Handle bigint - must come before primitive check
  // Convert bigint to string for comparison with string expected values
  if (typeof actual === 'bigint' && typeof expected === 'string') {
    return actual.toString() === expected
  }
  if (typeof actual === 'bigint' && typeof expected === 'bigint') {
    return actual === expected
  }

  // Handle primitives (string, number, boolean)
  if (typeof expected !== 'object') {
    return actual === expected
  }

  // Expected is an object, actual must also be an object
  if (typeof actual !== 'object' || actual === null) {
    return false
  }

  // For each key in expected, check if it exists in actual and matches
  for (const key of Object.keys(expected as Record<string, unknown>)) {
    const expectedValue = (expected as Record<string, unknown>)[key]
    const actualValue = (actual as Record<string, unknown>)[key]

    // Key doesn't exist in actual
    if (!(key in (actual as Record<string, unknown>))) {
      return false
    }

    // Recursively check nested values
    if (!shapeMatches(actualValue, expectedValue, `${path}.${key}`)) {
      return false
    }
  }

  return true
}
