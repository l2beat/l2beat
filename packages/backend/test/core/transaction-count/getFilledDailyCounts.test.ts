import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getFilledDailyCounts } from '../../../src/core/transaction-count/getFilledDailyCounts'

const now = UnixTime.now().toStartOf('day').add(1, 'hours')

describe(getFilledDailyCounts.name, () => {
  it('handles empty counts', () => {
    const filled = getFilledDailyCounts(UnixTime.now(), [], UnixTime.now())
    expect(filled).toEqual([])
  })

  it('handles one count before yesterday without tip', () => {
    const timestamp = now.toStartOf('day').add(-2, 'days')
    const counts = [{ count: 1, timestamp }]
    const filled = getFilledDailyCounts(now, counts, timestamp)
    expect(filled).toEqual(counts)
  })

  it('handles one count equal to yesterday without tip', () => {
    const latest = now.add(-1, 'days')
    const counts = [{ count: 1, timestamp: latest.toStartOf('day') }]
    const filled = getFilledDailyCounts(now, counts, latest)
    expect(filled).toEqual(counts)
  })

  it('handles one count after yesterday without tip', () => {
    const latest = now
    const counts = [{ count: 1, timestamp: latest.toStartOf('day') }]
    const filled = getFilledDailyCounts(now, counts, latest)
    expect(filled).toEqual([])
  })

  it('filters out today without tip', () => {
    const latest = now
    const beforeTodayCounts = [
      { count: 2, timestamp: now.toStartOf('day').add(-2, 'days') },
      { count: 1, timestamp: now.toStartOf('day').add(-1, 'days') },
    ]
    const todayCount = { count: 2, timestamp: latest }
    const filled = getFilledDailyCounts(
      now,
      beforeTodayCounts.concat([todayCount]),
      latest,
    )
    expect(filled).toEqual(beforeTodayCounts)
  })

  it('filters out today if not synced', () => {
    const latest = now
    const beforeTodayCounts = [
      { count: 2, timestamp: now.toStartOf('day').add(-2, 'days') },
      { count: 1, timestamp: now.toStartOf('day').add(-1, 'days') },
    ]
    const todayCount = { count: 2, timestamp: latest }
    const filled = getFilledDailyCounts(
      now,
      beforeTodayCounts.concat([todayCount]),
      latest,
      latest.add(-1, 'hours'),
    )
    expect(filled).toEqual(beforeTodayCounts)
  })

  it('does not filter out today if synced', () => {
    const latest = now
    const beforeTodayCounts = [
      { count: 2, timestamp: now.toStartOf('day').add(-2, 'days') },
      { count: 1, timestamp: now.toStartOf('day').add(-1, 'days') },
    ]
    const todayCount = { count: 2, timestamp: latest.toStartOf('day') }
    const allCounts = beforeTodayCounts.concat([todayCount])
    const filled = getFilledDailyCounts(now, allCounts, latest, latest)
    expect(filled).toEqual(allCounts)
  })

  it('fills missing days without tip', () => {
    const start = now.toStartOf('day')
    const counts = [
      { count: 7, timestamp: start.add(-7, 'days') },
      { count: 5, timestamp: start.add(-5, 'days') },
      { count: 4, timestamp: start.add(-4, 'days') },
    ]

    const result = getFilledDailyCounts(now, counts, start.add(-1, 'days'))

    expect(result).toEqual([
      { count: 7, timestamp: start.add(-7, 'days') },
      { count: 0, timestamp: start.add(-6, 'days') },
      { count: 5, timestamp: start.add(-5, 'days') },
      { count: 4, timestamp: start.add(-4, 'days') },
    ])
  })

  it('fills missing days if not synced and latest before yesterday', () => {
    const start = now.toStartOf('day')
    const latest = start.add(-4, 'days')
    const counts = [
      { count: 8, timestamp: start.add(-8, 'days') },
      { count: 6, timestamp: start.add(-6, 'days') },
      { count: 4, timestamp: latest },
    ]

    const result = getFilledDailyCounts(
      now,
      counts,
      start.add(-2, 'days'),
      latest.add(2, 'hours'),
    )

    expect(result).toEqual([
      { count: 8, timestamp: start.add(-8, 'days') },
      { count: 0, timestamp: start.add(-7, 'days') },
      { count: 6, timestamp: start.add(-6, 'days') },
      { count: 0, timestamp: start.add(-5, 'days') },
      { count: 4, timestamp: start.add(-4, 'days') },
    ])
  })

  it('fills missing days if synced', () => {
    const start = now.toStartOf('day')
    const counts = [
      { count: 7, timestamp: start.add(-7, 'days') },
      { count: 5, timestamp: start.add(-5, 'days') },
      { count: 4, timestamp: start.add(-4, 'days') },
    ]

    const result = getFilledDailyCounts(
      now,
      counts,
      start.add(-1, 'days'),
      start.add(-1, 'days'),
    )

    expect(result).toEqual([
      { count: 7, timestamp: start.add(-7, 'days') },
      { count: 0, timestamp: start.add(-6, 'days') },
      { count: 5, timestamp: start.add(-5, 'days') },
      { count: 4, timestamp: start.add(-4, 'days') },
    ])
  })

  it('adds leading zeroes if fully synced', () => {
    const start = now.toStartOf('day').add(-7, 'days')
    const counts = [
      { count: 1, timestamp: start },
      { count: 2, timestamp: start.add(3, 'days') },
      { count: 5, timestamp: start.add(4, 'days') },
    ]
    const latest = counts[counts.length - 1].timestamp.add(3, 'hours')

    const result = getFilledDailyCounts(now, counts, latest, latest)

    expect(result).toEqual([
      { count: 1, timestamp: start },
      { count: 0, timestamp: start.add(1, 'days') },
      { count: 0, timestamp: start.add(2, 'days') },
      { count: 2, timestamp: start.add(3, 'days') },
      { count: 5, timestamp: start.add(4, 'days') },
      { count: 0, timestamp: start.add(5, 'days') },
      { count: 0, timestamp: start.add(6, 'days') },
    ])
  })
})
