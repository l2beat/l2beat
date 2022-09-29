import { Logger, mock } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import waitForExpect from 'wait-for-expect'

import { Clock } from '../../../src/core/Clock'
import { LoopringTransactionUpdater } from '../../../src/core/transaction-count/LoopringTransactionUpdater'
import { BlockTransactionRepository } from '../../../src/peripherals/database/BlockTransactionRepository'
import { LoopringClient } from '../../../src/peripherals/loopring/LoopringClient'

describe(LoopringTransactionUpdater.name, () => {
  const TIME_0 = new UnixTime(0)

  describe(LoopringTransactionUpdater.prototype.update.name, () => {
    it('does not query the same blocks multiple times', async () => {
      const loopringClient = mock<LoopringClient>({
        getBlock: async (number) => ({
          blockId: number,
          createdAt: TIME_0,
          transactions: 13,
        }),
        getFinalizedBlockNumber: async () => 5,
      })
      const blockTransactionRepository = mock<BlockTransactionRepository>({
        getMissingRangesByProject: async () => [
          [-Infinity, -1],
          [2, 3],
          [5, Infinity],
        ],
        add: async () => '',
      })
      const clock = mock<Clock>({
        onNewHour: (callback) => {
          callback(UnixTime.now())
          return () => {}
        },
        getLastHour: () => UnixTime.now(),
      })
      const blockTxCountUpdater = new LoopringTransactionUpdater(
        loopringClient,
        blockTransactionRepository,
        clock,
        Logger.SILENT,
        ProjectId('fake-project'),
      )
      await blockTxCountUpdater.update()
      await blockTxCountUpdater.update()

      await waitForExpect(() => {
        expect(loopringClient.getBlock).toHaveBeenCalledExactlyWith([[2], [5]])
      })
    })
  })

  describe(LoopringTransactionUpdater.prototype.updateBlock.name, () => {
    it('downloads and saves a block to DB', async () => {
      const LoopringClient = mock<LoopringClient>({
        getBlock: async (blockNumber) => ({
          blockId: blockNumber,
          createdAt: TIME_0,
          transactions: 13,
        }),
      })
      const blockTransactionRepository = mock<BlockTransactionRepository>({
        add: async () => '',
      })
      const clock = mock<Clock>({
        getLastHour: () => UnixTime.now(),
      })
      const blockTxCountUpdater = new LoopringTransactionUpdater(
        LoopringClient,
        blockTransactionRepository,
        clock,
        Logger.SILENT,
        ProjectId('fake-project'),
      )

      await blockTxCountUpdater.updateBlock(1)
      await blockTxCountUpdater.updateBlock(2)

      expect(blockTransactionRepository.add).toHaveBeenCalledExactlyWith([
        [
          {
            timestamp: TIME_0,
            blockNumber: 1,
            projectId: ProjectId('fake-project'),
            count: 13,
          },
        ],
        [
          {
            timestamp: TIME_0,
            blockNumber: 2,
            projectId: ProjectId('fake-project'),
            count: 13,
          },
        ],
      ])
    })
    it('skips too new blocks', async () => {
      const TIME_1 = TIME_0.add(2, 'hours')
      const block1 = {
        blockId: 1,
        createdAt: TIME_0,
        transactions: 13,
      }
      const LoopringClient = mock<LoopringClient>({
        getBlock: mockFn().resolvesToOnce(block1).resolvesToOnce({
          blockId: 2,
          createdAt: TIME_1,
          transactions: 11,
        }),
      })
      const blockTransactionRepository = mock<BlockTransactionRepository>({
        add: async () => '',
      })
      const clock = mock<Clock>({
        getLastHour: () => TIME_0.add(1, 'hours'),
      })
      const blockTxCountUpdater = new LoopringTransactionUpdater(
        LoopringClient,
        blockTransactionRepository,
        clock,
        Logger.SILENT,
        ProjectId('fake-project'),
      )

      await blockTxCountUpdater.updateBlock(1)
      await blockTxCountUpdater.updateBlock(2)

      expect(blockTransactionRepository.add).toHaveBeenCalledExactlyWith([
        [
          {
            projectId: ProjectId('fake-project'),
            count: block1.transactions,
            timestamp: block1.createdAt,
            blockNumber: block1.blockId,
          },
        ],
      ])
    })
  })
})
