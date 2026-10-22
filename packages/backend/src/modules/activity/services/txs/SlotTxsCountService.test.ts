import { Logger } from '@l2beat/backend-tools'
import type { SvmBlockProvider } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { SlotTxsCountService } from './SlotTxsCountService'

describe(SlotTxsCountService.name, () => {
  describe(SlotTxsCountService.prototype.getBlocks.name, () => {
    it('returns the txs count of each block, leaving out empty slots', async () => {
      const START = UnixTime.now()
      const mockProvider = mockObject<SvmBlockProvider>({
        chain: 'ethereum',
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

      const service = new SlotTxsCountService(
        {
          projectId: ProjectId('a'),
          provider: mockProvider,
        },
        Logger.SILENT,
      )

      const result = await service.getBlocks(1, 4)
      expect(result).toEqual([
        { timestamp: START, txsCount: 1, uopsCount: 1, number: 1 },
        {
          timestamp: UnixTime.toStartOf(START, 'day'),
          txsCount: 4,
          uopsCount: 4,
          number: 2,
        },
        {
          timestamp: UnixTime.toStartOf(START + 2 * UnixTime.DAY, 'day'),
          txsCount: 2,
          uopsCount: 2,
          number: 3,
        },
      ])

      expect(mockProvider.getBlockWithTransactions).toHaveBeenCalledTimes(4)
    })
  })
})
