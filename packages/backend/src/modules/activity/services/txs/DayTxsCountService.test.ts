import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DailyCountsProvider } from '../../../../providers/day/DayProviders'
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
})

function mockProvider(data: {
  txs: Record<number, number>
  uops: Record<number, number>
}) {
  return mockObject<DailyCountsProvider>({
    getDailyTxsCount: mockFn().resolvesTo(data.txs),
    getDailyUopsCount: mockFn().resolvesTo(data.uops),
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
