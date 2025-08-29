import { Logger } from '@l2beat/backend-tools'
import type { SvmBlockProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { activityRecord } from '../../utils/aggregatePerDay.test'
import { SlotTxsCountService } from './SlotTxsCountService'

describe(SlotTxsCountService.name, () => {
  describe(SlotTxsCountService.prototype.getTxsCount.name, () => {
    it('should return txs count', async () => {
      const START = UnixTime.now()
      const mockProvider = mockObject<SvmBlockProvider>({
        getBlockWithTransactions: mockFn()
          .resolvesToOnce(undefined)
          .resolvesToOnce({
            timestamp: START,
            transactionsCount: 1,
            number: 1,
          })
          .resolvesToOnce({
            timestamp: UnixTime.toStartOf(START, 'day'),
            transactionsCount: 4,
            number: 2,
          })
          .resolvesToOnce({
            timestamp: UnixTime.toStartOf(START + 2 * UnixTime.DAY, 'day'),
            transactionsCount: 2,
            number: 3,
          }),
      })

      const service = new SlotTxsCountService({
        projectId: ProjectId('a'),
        provider: mockProvider,
        logger: Logger.SILENT,
      })

      const result = await service.getTxsCount(1, 4)
      expect(result).toEqual({
        records: [
          activityRecord('a', UnixTime.toStartOf(START, 'day'), 5, 5, 1, 2),
          activityRecord(
            'a',
            UnixTime.toStartOf(START + 2 * UnixTime.DAY, 'day'),
            2,
            2,
            3,
            3,
          ),
        ],
        latestTimestamp: UnixTime.toStartOf(START + 2 * UnixTime.DAY, 'day'),
      })

      expect(mockProvider.getBlockWithTransactions).toHaveBeenCalledTimes(4)
    })
  })
})
