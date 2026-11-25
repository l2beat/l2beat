/**
 * The relative change from `then` to `now` (0.5 is +50%). Returns 0 when the
 * change is meaningless: no previous value, or a current value below a cent.
 */
export function calculatePercentageChange(now: number, then: number) {
  if (now === then || then === 0 || now < 0.01) {
    return 0
  }
  const change = now / then - 1
  if (
    change === Number.POSITIVE_INFINITY ||
    change === null ||
    Number.isNaN(change)
  ) {
    return 0
  }
  return change
}
