import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getTip } from '../../../../src/api/controllers/activity/getTip'

describe(getTip.name, () => {
  it('returns now if no data', () => {
    const now = UnixTime.now()
    expect(getTip([[], []], now)).toEqual(now)
  })

  it('returns smallest of provided', () => {
    const start = UnixTime.now().add(-15, 'days')
    const countsA = []
    for (let i = 1; i <= 10; i++) {
      countsA.push({ timestamp: start.add(i, 'days'), count: i })
    }
    const countsB = []
    for (let i = 1; i <= 5; i++) {
      countsB.push({ timestamp: start.add(i, 'days'), count: i })
    }

    const tip = getTip([countsA, countsB])

    expect(tip).toEqual(start.add(5, 'days'))
  })
})
