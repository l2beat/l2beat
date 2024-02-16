import { notUndefined } from './notUndefined'
import { pluralize } from './pluralize'

const units = ['d', 'h', 'm', 's']
const fullUnits = ['day', 'hour', 'minute', 'second']

export function formatSeconds(
  seconds: number,
  opts?: { preventRoundingUp?: boolean; fullUnit?: boolean },
): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60)
  const secs = Math.floor(((seconds % 86400) % 3600) % 60)

  const values = [days, hours, minutes, secs]
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
