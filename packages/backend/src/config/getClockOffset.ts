import type { Env } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

const MIN_OFFSET_SECONDS = 60
const MAX_OFFSET_SECONDS = UnixTime.DAY

/**
 * How long after an hour ends the clock moves to it. Block targets and
 * CoinGecko prices check that their data exists and wait if it does not, so
 * the offset can be lowered by env to about Ethereum finality (~13 minutes).
 */
export function getClockOffset(env: Env): {
  offsetSeconds: number
  source: 'env' | 'default'
} {
  const value = env.optionalString('CLOCK_SAFE_TIME_OFFSET_SECONDS')
  if (value === undefined) {
    return { offsetSeconds: UnixTime.HOUR, source: 'default' }
  }

  const offsetSeconds = Number(value)
  if (
    !Number.isInteger(offsetSeconds) ||
    offsetSeconds < MIN_OFFSET_SECONDS ||
    offsetSeconds > MAX_OFFSET_SECONDS
  ) {
    throw new Error('Invalid CLOCK_SAFE_TIME_OFFSET_SECONDS', {
      cause: { value, min: MIN_OFFSET_SECONDS, max: MAX_OFFSET_SECONDS },
    })
  }
  return { offsetSeconds, source: 'env' }
}
