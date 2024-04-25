import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { findMinLast } from './findMinLast'

describe(findMinLast.name, () => {
  it('returns undefined if no data', () => {
    expect(findMinLast([[], []])).toEqual(undefined)
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
    const minLast = findMinLast([countsA, countsB])
    expect(minLast).toEqual(start.add(5, 'days'))
  })
})
