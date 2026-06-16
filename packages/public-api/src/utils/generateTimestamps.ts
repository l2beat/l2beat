import { UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type { Resolution } from './types'

export function generateTimestamps(
  [from, to]: [UnixTime, UnixTime],
  resolution: Resolution,
) {
  const adjustedFrom = UnixTime.toEndOf(from, resolution)
  const step = UnixTime.periodToSeconds(resolution)

  const generated = range(Math.floor((to - from) / step) + 1).map((i) =>
    UnixTime(adjustedFrom + i * step),
  )
  const isLastGeneratedTarget = generated.at(-1) === to
  if (!isLastGeneratedTarget) {
    generated.push(to)
  }

  return generated
}
