import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { InteropHistoryPoint } from '~/server/features/layer2s/interop/history/types'
import { getShiftedWindow } from './getShiftedWindow'

const DAY = UnixTime.DAY
const HOUR = UnixTime.HOUR

describe(getShiftedWindow.name, () => {
  it('finds the hours no point covers and the hours two points cover', () => {
    // 25 May 00:00, 26 May 13:00, 27 May 00:00
    const points = [
      point(0, 0),
      point(DAY, DAY + 13 * HOUR),
      point(2 * DAY, 2 * DAY),
    ]

    expect(getShiftedWindow(points, 1)).toEqual({
      snapshot: DAY + 13 * HOUR,
      covers: [13 * HOUR, DAY + 13 * HOUR],
      uncovered: [0, 13 * HOUR],
      doubled: [DAY, DAY + 13 * HOUR],
    })
  })

  it('leaves the uncovered hours to the gap when the day before has no snapshot', () => {
    const points = [point(0, null), point(DAY, DAY + 13 * HOUR)]

    expect(getShiftedWindow(points, 1)?.uncovered).toEqual(undefined)
  })

  it('is undefined for a midnight snapshot', () => {
    expect(getShiftedWindow([point(0, 0)], 0)).toEqual(undefined)
  })
})

function point(
  timestamp: number,
  snapshot: number | null,
): InteropHistoryPoint {
  return {
    timestamp,
    snapshot,
    isBlocked: false,
    carriedLanes: 0,
    partialLanes: 0,
  }
}
