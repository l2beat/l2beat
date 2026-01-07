import { assert } from '../tools/assert.js'
import { notUndefined } from './notUndefined.js'
import { pluralize } from './pluralize.js'

const units = ['y', 'mo', 'd', 'h', 'm', 's']
const fullUnits = ['year', 'month', 'day', 'hour', 'minute', 'second']

export function formatSeconds(
  seconds: number,
  opts?: { preventRoundingUp?: boolean; fullUnit?: boolean },
): string {
  assert(seconds !== undefined, 'seconds is required')

  const SECONDS_IN_YEAR = 365 * 24 * 60 * 60
  const SECONDS_IN_MONTH = 30 * 24 * 60 * 60
  const SECONDS_IN_DAY = 24 * 60 * 60
  const SECONDS_IN_HOUR = 60 * 60
  const SECONDS_IN_MINUTE = 60

  const years = Math.floor(seconds / SECONDS_IN_YEAR)
  const months = Math.floor((seconds % SECONDS_IN_YEAR) / SECONDS_IN_MONTH)
  const days = Math.floor(
    ((seconds % SECONDS_IN_YEAR) % SECONDS_IN_MONTH) / SECONDS_IN_DAY,
  )
  const hours = Math.floor(
    (((seconds % SECONDS_IN_YEAR) % SECONDS_IN_MONTH) % SECONDS_IN_DAY) /
      SECONDS_IN_HOUR,
  )
  const minutes = Math.floor(
    ((((seconds % SECONDS_IN_YEAR) % SECONDS_IN_MONTH) % SECONDS_IN_DAY) %
      SECONDS_IN_HOUR) /
      SECONDS_IN_MINUTE,
  )
  const secs = Math.floor(
    ((((seconds % SECONDS_IN_YEAR) % SECONDS_IN_MONTH) % SECONDS_IN_DAY) %
      SECONDS_IN_HOUR) %
      SECONDS_IN_MINUTE,
  )

  const values = [years, months, days, hours, minutes, secs]
  if (opts?.preventRoundingUp) {
    return values
      .map((v, i) =>
        v > 0
          ? opts.fullUnit
            ? `${v} ${pluralize(v, fullUnits[i])}`
            : `${v}${units[i]}`
          : undefined,
      )
      .filter(notUndefined)
      .join(' ')
  }

  const firstNonZeroIndex = values.findIndex((v) => v > 0)
  if (firstNonZeroIndex === -1) {
    return opts?.fullUnit ? '0 seconds' : '0s'
  }

  return values
    .slice(firstNonZeroIndex, firstNonZeroIndex + 2)
    .map((v, i) =>
      v > 0
        ? opts?.fullUnit
          ? `${v} ${pluralize(
              v,
              fullUnits.slice(firstNonZeroIndex, firstNonZeroIndex + 2)[i],
            )}`
          : `${v}${units.slice(firstNonZeroIndex, firstNonZeroIndex + 2)[i]}`
        : undefined,
    )
    .filter(notUndefined)
    .join(' ')
}
