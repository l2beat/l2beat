import { UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type { ChartResolution } from '~/utils/range/range'

interface Options {
  addTarget?: boolean
}

export function generateTimestamps(
  [from, to]: [UnixTime, UnixTime],
  resolution: ChartResolution,
  opts?: Options,
) {
  const adjustedFrom = UnixTime.toEndOf(from, resolution)
  const step = UnixTime.periodToSeconds(resolution)

  const generated = range(Math.floor((to - adjustedFrom) / step) + 1).map((i) =>
    UnixTime(adjustedFrom + i * step),
  )

  const isLastGeneratedTarget = generated.at(-1) === to
  if (
    opts?.addTarget &&
    !isLastGeneratedTarget &&
    UnixTime.isFull(to, 'hour')
  ) {
    generated.push(to)
  }

  return generated
}
