import { Logger, mock } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'

import { Clock } from '../../../src/core/Clock'
import { AztecTransactionUpdater } from '../../../src/core/transaction-count/AztecTransactionUpdater'
import { AztecClient } from '../../../src/peripherals/aztec'
import { BlockTransactionCountRepository } from '../../../src/peripherals/database/BlockTransactionCountRepository'

describe(AztecTransactionUpdater.name, () => {
  const TIME_0 = new UnixTime(0)

  describe(AztecTransactionUpdater.prototype.updateBlock.name, () => {
    it('downloads and saves a block to DB', async () => {
      const aztecClient = mock<AztecClient>({
        getBlock: async (blockNumber) => ({
          number: blockNumber,
          timestamp: TIME_0,
          transactionCount: 13,
        }),
      })
      const blockCountTransactionRepository =
        mock<BlockTransactionCountRepository>({
          add: async () => '',
        })
      const clock = mock<Clock>({
        getLastHour: () => UnixTime.now(),
      })
      const blockTxCountUpdater = new AztecTransactionUpdater(
        aztecClient,
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
        number: 1,
        timestamp: TIME_0,
        transactionCount: 13,
      }
      const aztecClient = mock<AztecClient>({
        getBlock: mockFn().resolvesToOnce(block1).resolvesToOnce({
          number: 2,
          timestamp: TIME_1,
          transactionCount: 11,
        }),
      })
      const blockCountTransactionRepository =
        mock<BlockTransactionCountRepository>({
          add: async () => '',
        })
      const clock = mock<Clock>({
        getLastHour: () => TIME_0.add(1, 'hours'),
      })
      const blockTxCountUpdater = new AztecTransactionUpdater(
        aztecClient,
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
            count: block1.transactionCount,
            timestamp: block1.timestamp,
            blockNumber: block1.number,
          },
        ],
      ])
    })
  })
})
