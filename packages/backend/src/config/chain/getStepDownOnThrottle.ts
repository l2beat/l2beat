import type { Env } from '@l2beat/backend-tools'

/** Reads `key` as the share of its rate a client gives up per step */
export function getStepDownOnThrottle(
  env: Env,
  key: string,
): number | undefined {
  const value = env.optionalString(key)
  if (value === undefined) {
    return undefined
  }
  const share = Number(value)
  // A share of 1 or more would take the rate straight to its floor
  if (value.trim() === '' || !(share >= 0 && share < 1)) {
    throw new Error(
      'Step down on throttle must be a number from 0 to below 1',
      {
        cause: { key, value },
      },
    )
  }
  return share
}
