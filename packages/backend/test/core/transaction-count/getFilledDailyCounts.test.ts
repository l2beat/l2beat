import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getFilledDailyCounts } from '../../../src/core/transaction-count/getFilledDailyCounts'

describe(getFilledDailyCounts.name, () => {
  it('handles empty counts', () => {
    const filled = getFilledDailyCounts([])
    expect(filled).toEqual([])
  })

  it('handles one count', () => {
    const counts = [{ count: 1, timestamp: UnixTime.now().add(1, 'days') }]
    const filled = getFilledDailyCounts(counts)
    expect(filled).toEqual(counts)
  })

  it('fills missing days before tip if not fully synced', () => {
    const start = UnixTime.now()
    const counts = [
      { count: 1, timestamp: start },
      { count: 2, timestamp: start.add(3, 'days') },
      { count: 5, timestamp: start.add(4, 'days') },
    ]

    const result = getFilledDailyCounts(counts, start.add(5, 'days'))

    expect(result).toEqual([
      { count: 1, timestamp: start },
      { count: 0, timestamp: start.add(1, 'days') },
      { count: 0, timestamp: start.add(2, 'days') },
      { count: 2, timestamp: start.add(3, 'days') },
      { count: 5, timestamp: start.add(4, 'days') },
    ])
  })

  it('adds leading zeroes if fully synced', () => {
    const start = UnixTime.now().toStartOf('day').add(-7, 'days')
    const counts = [
      { count: 1, timestamp: start },
      { count: 2, timestamp: start.add(3, 'days') },
      { count: 5, timestamp: start.add(4, 'days') },
    ]

    const result = getFilledDailyCounts(counts, start.add(4, 'days'))

    expect(result).toEqual([
      { count: 1, timestamp: start },
      { count: 0, timestamp: start.add(1, 'days') },
      { count: 0, timestamp: start.add(2, 'days') },
      { count: 2, timestamp: start.add(3, 'days') },
      { count: 5, timestamp: start.add(4, 'days') },
      { count: 0, timestamp: start.add(5, 'days') },
      { count: 0, timestamp: start.add(6, 'days') },
      { count: 0, timestamp: start.add(7, 'days') },
    ])
  })
})
