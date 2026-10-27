import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DayProvider } from '../../../../providers/day/DayProviders'
import { DayTxsCountService } from './DayTxsCountService'

describe(DayTxsCountService.prototype.getTxsCount.name, () => {
  it('should return txs count without uops', async () => {
    const provider = mockProvider({
      txs: { [5 * UnixTime.DAY]: 2000 },
      uops: {},
    })

    const txsCountProvider = new DayTxsCountService({
      provider,
      projectId: ProjectId('a'),
    })

    const start = 5
    const end = 6

    const result = await txsCountProvider.getTxsCount(start, end)

    expect(result).toEqual({
      records: [
        activityRecord(
          'a',
          start * UnixTime.DAY,
          2000,
          null,
          start * UnixTime.DAY,
          start * UnixTime.DAY + 1 * UnixTime.DAY - 1,
        ),
      ],
      latestTimestamp: start * UnixTime.DAY,
    })
    expect(provider.getDailyTxsCount).toHaveBeenOnlyCalledWith(start, end)
    expect(provider.getDailyUopsCount).toHaveBeenOnlyCalledWith(start, end)
  })

  it('should return txs count with uops', async () => {
    const provider = mockProvider({
      txs: { [5 * UnixTime.DAY]: 2000 },
      uops: { [5 * UnixTime.DAY]: 1500 },
    })

    const txsCountProvider = new DayTxsCountService({
      provider,
      projectId: ProjectId('a'),
    })

    const start = 5
    const end = 6

    const result = await txsCountProvider.getTxsCount(start, end)

    expect(result).toEqual({
      records: [
        activityRecord(
          'a',
          start * UnixTime.DAY,
          2000,
          1500,
          start * UnixTime.DAY,
          start * UnixTime.DAY + 1 * UnixTime.DAY - 1,
        ),
      ],
      latestTimestamp: start * UnixTime.DAY,
    })
  })

  it('should handle partial uops data', async () => {
    const provider = mockProvider({
      txs: { [5 * UnixTime.DAY]: 2000, [6 * UnixTime.DAY]: 3000 },
      uops: { [5 * UnixTime.DAY]: 4000 },
    })

    const txsCountProvider = new DayTxsCountService({
      provider,
      projectId: ProjectId('a'),
    })

    const start = 5
    const end = 7

    const result = await txsCountProvider.getTxsCount(start, end)

    expect(result).toEqual({
      records: [
        activityRecord(
          'a',
          start * UnixTime.DAY,
          2000,
          4000,
          start * UnixTime.DAY,
          start * UnixTime.DAY + 1 * UnixTime.DAY - 1,
        ),
        activityRecord(
          'a',
          (start + 1) * UnixTime.DAY,
          3000,
          null,
          (start + 1) * UnixTime.DAY,
          (start + 1) * UnixTime.DAY + 1 * UnixTime.DAY - 1,
        ),
      ],
      latestTimestamp: (start + 1) * UnixTime.DAY,
    })
  })

  it('should handle multiple days in range', async () => {
    const provider = mockProvider({
      txs: {
        [5 * UnixTime.DAY]: 2000,
        [6 * UnixTime.DAY]: 3000,
        [7 * UnixTime.DAY]: 4000,
      },
      uops: {
        [5 * UnixTime.DAY]: 1500,
        [6 * UnixTime.DAY]: 2500,
        [7 * UnixTime.DAY]: 3500,
      },
    })

    const txsCountProvider = new DayTxsCountService({
      provider,
      projectId: ProjectId('a'),
    })

    const start = 5
    const end = 8

    const result = await txsCountProvider.getTxsCount(start, end)

    expect(result).toEqual({
      records: [
        activityRecord(
          'a',
          5 * UnixTime.DAY,
          2000,
          1500,
          5 * UnixTime.DAY,
          5 * UnixTime.DAY + 1 * UnixTime.DAY - 1,
        ),
        activityRecord(
          'a',
          6 * UnixTime.DAY,
          3000,
          2500,
          6 * UnixTime.DAY,
          6 * UnixTime.DAY + 1 * UnixTime.DAY - 1,
        ),
        activityRecord(
          'a',
          7 * UnixTime.DAY,
          4000,
          3500,
          7 * UnixTime.DAY,
          7 * UnixTime.DAY + 1 * UnixTime.DAY - 1,
        ),
      ],
      latestTimestamp: 7 * UnixTime.DAY,
    })
  })

  it('returns the hours, and the busiest hour of each day, when the provider has them', async () => {
    const day = 5 * UnixTime.DAY
    const getHourlyCounts = mockFn().resolvesTo([
      { timestamp: day, count: 2, uopsCount: 50 },
      { timestamp: day + UnixTime.HOUR, count: 7, uopsCount: 40 },
      { timestamp: day + UnixTime.DAY, count: 1, uopsCount: 10 },
    ])
    const provider = mockObject<DayProvider>({
      getDailyTxsCount: mockFn().resolvesTo({
        [day]: 9,
        [day + UnixTime.DAY]: 1,
      }),
      getDailyUopsCount: mockFn().resolvesTo({
        [day]: 90,
        [day + UnixTime.DAY]: 10,
      }),
      getHourlyCounts,
    })

    const txsCountProvider = new DayTxsCountService({
      provider,
      projectId: ProjectId('a'),
    })

    const result = await txsCountProvider.getTxsCount(5, 7)

    expect(result).toEqual({
      records: [
        {
          ...activityRecord('a', day, 9, 90, day, day + UnixTime.DAY - 1),
          peakHourCount: 7,
          peakHourUopsCount: 50,
        },
        {
          ...activityRecord(
            'a',
            day + UnixTime.DAY,
            1,
            10,
            day + UnixTime.DAY,
            day + 2 * UnixTime.DAY - 1,
          ),
          peakHourCount: 1,
          peakHourUopsCount: 10,
        },
      ],
      hours: [
        { projectId: ProjectId('a'), timestamp: day, count: 2, uopsCount: 50 },
        {
          projectId: ProjectId('a'),
          timestamp: day + UnixTime.HOUR,
          count: 7,
          uopsCount: 40,
        },
        {
          projectId: ProjectId('a'),
          timestamp: day + UnixTime.DAY,
          count: 1,
          uopsCount: 10,
        },
      ],
      latestTimestamp: day + UnixTime.DAY,
    })
    expect(getHourlyCounts).toHaveBeenOnlyCalledWith(5, 7)
  })
})

function mockProvider(data: {
  txs: Record<number, number>
  uops: Record<number, number>
}) {
  return mockObject<DayProvider>({
    getDailyTxsCount: mockFn().resolvesTo(data.txs),
    getDailyUopsCount: mockFn().resolvesTo(data.uops),
    getHourlyCounts: undefined,
  })
}

function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
  start = 0,
  end = 10,
) {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    uopsCount,
    start,
    end,
  }
}
