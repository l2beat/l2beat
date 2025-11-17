import { UnixTime } from '@l2beat/shared-pure'

export function rangeToDays({ from, to }: { from: number | null; to: number }) {
  if (from === null) return null
  return Math.round((to - from) / UnixTime.DAY)
}
