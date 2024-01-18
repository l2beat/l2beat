import { notUndefined } from '@l2beat/shared-pure'

const units = ['d', 'h', 'm', 's']

export function formatSeconds(
  seconds: number,
  opts?: { preventRoundingUp?: boolean },
): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60)
  const secs = Math.floor(((seconds % 86400) % 3600) % 60)

  const values = [days, hours, minutes, secs]
  if (opts?.preventRoundingUp) {
    return values
      .map((v, i) => (v > 0 ? `${v}${units[i]}` : undefined))
      .filter(notUndefined)
      .join(' ')
  }

  const firstNonZeroIndex = values.findIndex((v) => v > 0)
  if (firstNonZeroIndex === -1) {
    return '0s'
  }

  return values
    .slice(firstNonZeroIndex, firstNonZeroIndex + 2)
    .map((v, i) =>
      v > 0
        ? `${v}${units.slice(firstNonZeroIndex, firstNonZeroIndex + 2)[i]}`
        : undefined,
    )
    .filter(notUndefined)
    .join(' ')
}
