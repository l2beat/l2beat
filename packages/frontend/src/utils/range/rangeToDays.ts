import { UnixTime } from '@l2beat/shared-pure'

export function rangeToDays(range: [number | null, number]): number | null {
  if (range[0] === null) return null
  return Math.round((range[1] - range[0]) / UnixTime.DAY)
}
