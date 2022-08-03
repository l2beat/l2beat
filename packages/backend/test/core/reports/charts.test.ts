import { UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { addMissingDailyTimestamps } from '../../../src/core/reports/charts'

const now = UnixTime.now()

describe(addMissingDailyTimestamps.name, () => {
  it('returns empty for empty input', () => {
    expect(addMissingDailyTimestamps([])).toEqual([])
  })

  it('adds missing timestamps', () => {
    expect(
      addMissingDailyTimestamps([
        [now, 1, 1],
        [now.add(2, 'days'), 2, 2],
        [now.add(5, 'days'), 5, 5],
      ]),
    ).toEqual([
      [now, 1, 1],
      [now.add(1, 'days'), 1, 1],
      [now.add(2, 'days'), 2, 2],
      [now.add(3, 'days'), 2, 2],
      [now.add(4, 'days'), 2, 2],
      [now.add(5, 'days'), 5, 5],
    ])
  })
})
