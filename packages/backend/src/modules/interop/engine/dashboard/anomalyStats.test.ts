import { expect } from 'earl'
import { calculateAnomalyStats } from './anomalyStats'

describe(calculateAnomalyStats.name, () => {
  it('increases z-score for larger deviations', () => {
    const stats = calculateAnomalyStats([
      {
        timestamp: 1,
        id: 'id-1',
        transferCount: 12,
        prevDayCount: 10,
        prev7dCount: 10,
        mean7d: 10,
        std7d: 2,
      },
      {
        timestamp: 2,
        id: 'id-2',
        transferCount: 18,
        prevDayCount: 10,
        prev7dCount: 10,
        mean7d: 10,
        std7d: 2,
      },
    ])

    expect(stats[0]?.zScore7d).toEqual(1)
    expect(stats[1]?.zScore7d).toEqual(4)
  })

  it('returns null z-score when std is zero or missing', () => {
    const stats = calculateAnomalyStats([
      {
        timestamp: 1,
        id: 'id-1',
        transferCount: 12,
        prevDayCount: 10,
        prev7dCount: 10,
        mean7d: 10,
        std7d: 0,
      },
      {
        timestamp: 2,
        id: 'id-2',
        transferCount: 12,
        prevDayCount: 10,
        prev7dCount: 10,
        mean7d: null,
        std7d: null,
      },
    ])

    expect(stats[0]?.zScore7d).toEqual(null)
    expect(stats[1]?.zScore7d).toEqual(null)
  })
})
