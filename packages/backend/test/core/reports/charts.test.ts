import { UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  addMissingDailyTimestamps,
  getDailyTimestamps,
} from '../../../src/core/reports/charts'

const now = UnixTime.now()
const yesterday = now.add(-1, 'days')
const tomorrow = now.add(1, 'days')

describe(getDailyTimestamps.name, () => {
  const cases = [
    { name: 'only min', min: now, max: now.add(1, 'hours'), result: [now] },
    {
      name: 'just min and max',
      min: now,
      max: tomorrow,
      result: [now, tomorrow],
    },
    { name: 'min after max', min: tomorrow, max: now, result: [] },
    {
      name: 'missing',
      min: yesterday.add(-1, 'days'),
      max: tomorrow.add(2, 'hours'),
      result: [yesterday.add(-1, 'days'), yesterday, now, tomorrow],
    },
  ]
  cases.forEach(({ name, min, max, result }) => {
    it(`returns daily timestamps - ${name}`, () => {
      expect(getDailyTimestamps(min, max)).toEqual(result)
    })
  })
})

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
