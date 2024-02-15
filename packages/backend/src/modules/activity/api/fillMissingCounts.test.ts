import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { fillMissingCounts } from './fillMissingCounts'

describe(fillMissingCounts.name, () => {
  it('handles empty counts', () => {
    const filled = fillMissingCounts([])
    expect(filled).toEqual([])
  })

  it('handles one count', () => {
    const counts = [{ count: 1, timestamp: UnixTime.now() }]
    const filled = fillMissingCounts(counts)
    expect(filled).toEqual(counts)
  })

  it('fills missing days', () => {
    const start = UnixTime.now()
    const counts = [
      { count: 1, timestamp: start },
      { count: 2, timestamp: start.add(2, 'days') },
      { count: 5, timestamp: start.add(5, 'days') },
      { count: 5, timestamp: start.add(6, 'days') },
      { count: 5, timestamp: start.add(9, 'days') },
    ]

    const result = fillMissingCounts(counts)
    expect(result).toEqual([
      { count: 1, timestamp: start },
      { count: 0, timestamp: start.add(1, 'days') },
      { count: 2, timestamp: start.add(2, 'days') },
      { count: 0, timestamp: start.add(3, 'days') },
      { count: 0, timestamp: start.add(4, 'days') },
      { count: 5, timestamp: start.add(5, 'days') },
      { count: 5, timestamp: start.add(6, 'days') },
      { count: 0, timestamp: start.add(7, 'days') },
      { count: 0, timestamp: start.add(8, 'days') },
      { count: 5, timestamp: start.add(9, 'days') },
    ])
  })
})
