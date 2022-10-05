import { Logger, mock } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'

import { Clock } from '../../../src/core/Clock'
import { LoopringTransactionUpdater } from '../../../src/core/transaction-count/LoopringTransactionUpdater'
import { BlockTransactionCountRepository } from '../../../src/peripherals/database/BlockTransactionCountRepository'
import { LoopringClient } from '../../../src/peripherals/loopring/LoopringClient'

describe(LoopringTransactionUpdater.name, () => {
  const TIME_0 = new UnixTime(0)

  describe(LoopringTransactionUpdater.prototype.updateBlock.name, () => {
    it('downloads and saves a block to DB', async () => {
      const LoopringClient = mock<LoopringClient>({
        getBlock: async (blockNumber) => ({
          blockId: blockNumber,
          createdAt: TIME_0,
          transactions: 13,
        }),
      })
      const blockCountTransactionRepository =
        mock<BlockTransactionCountRepository>({
          add: async () => '',
        })
      const clock = mock<Clock>({
        getLastHour: () => UnixTime.now(),
      })
      const blockTxCountUpdater = new LoopringTransactionUpdater(
        LoopringClient,
        blockCountTransactionRepository,
        clock,
        Logger.SILENT,
        ProjectId('fake-project'),
      )

      await blockTxCountUpdater.updateBlock(1)
      await blockTxCountUpdater.updateBlock(2)

      expect(blockCountTransactionRepository.add).toHaveBeenCalledExactlyWith([
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
      const blockCountTransactionRepository =
        mock<BlockTransactionCountRepository>({
          add: async () => '',
        })
      const clock = mock<Clock>({
        getLastHour: () => TIME_0.add(1, 'hours'),
      })
      const blockTxCountUpdater = new LoopringTransactionUpdater(
        LoopringClient,
        blockCountTransactionRepository,
        clock,
        Logger.SILENT,
        ProjectId('fake-project'),
      )

      await blockTxCountUpdater.updateBlock(1)
      await blockTxCountUpdater.updateBlock(2)

      expect(blockCountTransactionRepository.add).toHaveBeenCalledExactlyWith([
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
