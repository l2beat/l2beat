import type { Env } from '@l2beat/backend-tools'

export function getRpcStepDownOnThrottle(env: Env): number | undefined {
  const value = env.optionalString('RPC_STEP_DOWN_ON_THROTTLE')
  if (value === undefined) {
    return undefined
  }
  const share = Number(value)
  // A share of 1 or more would take the rate straight to its floor
  if (value.trim() === '' || !(share >= 0 && share < 1)) {
    throw new Error(
      'RPC_STEP_DOWN_ON_THROTTLE must be a number from 0 to below 1',
      { cause: { value } },
    )
  }
  return share
}
