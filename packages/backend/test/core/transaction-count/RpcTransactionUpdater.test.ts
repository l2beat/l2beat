import { Block } from '@ethersproject/abstract-provider'
import { Logger, mock } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect, mockFn } from 'earljs'
import { BigNumber } from 'ethers'
import waitForExpect from 'wait-for-expect'

import { Clock } from '../../../src/core/Clock'
import { RpcTransactionUpdater } from '../../../src/core/transaction-count/RpcTransactionUpdater'
import { RpcTransactionCountRepository } from '../../../src/peripherals/database/RpcTransactionCountRepository'
import { EthereumClient } from '../../../src/peripherals/ethereum/EthereumClient'

describe(RpcTransactionUpdater.name, () => {
  describe(RpcTransactionUpdater.prototype.start.name, () => {
    it('skips known blocks', async () => {
      const ethereumClient = mock<EthereumClient>({
        getBlock: async () => fakeBlock(),
        getBlockNumber: async () => 5n,
      })
      const txCountRepository = mock<RpcTransactionCountRepository>({
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
      const blockTxCountUpdater = new RpcTransactionUpdater(
        ethereumClient,
        txCountRepository,
        clock,
        Logger.SILENT,
        ProjectId('fake-project'),
      )
      blockTxCountUpdater.start()

      await waitForExpect(() => {
        expect(ethereumClient.getBlock).toHaveBeenCalledExactlyWith([[2], [5]])
      })
    })
  })

  describe(RpcTransactionUpdater.prototype.update.name, () => {
    it('does not query the same blocks multiple times', async () => {
      const ethereumClient = mock<EthereumClient>({
        getBlock: async () => fakeBlock(),
        getBlockNumber: async () => 5n,
      })
      const txCountRepository = mock<RpcTransactionCountRepository>({
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
      const blockTxCountUpdater = new RpcTransactionUpdater(
        ethereumClient,
        txCountRepository,
        clock,
        Logger.SILENT,
        ProjectId('fake-project'),
      )
      await blockTxCountUpdater.update()
      await blockTxCountUpdater.update()

      await waitForExpect(() => {
        expect(ethereumClient.getBlock).toHaveBeenCalledExactlyWith([[2], [5]])
      })
    })
  })

  describe(RpcTransactionUpdater.prototype.updateBlock.name, () => {
    it('downloads and saves a block to DB', async () => {
      const TIME_0 = UnixTime.now().add(-1, 'days').toStartOf('day')
      const TIME_1 = TIME_0.add(1, 'hours')
      const ethereumClient = mock<EthereumClient>({
        getBlock: mockFn()
          .resolvesToOnce(
            fakeBlock({
              number: 1,
              timestamp: TIME_0.toNumber(),
              transactions: ['t0', 't1'],
            }),
          )
          .resolvesToOnce(
            fakeBlock({
              number: 2,
              timestamp: TIME_1.toNumber(),
              transactions: ['t0', 't1', 't2'],
            }),
          ),
        getBlockNumber: async () => 5n,
      })
      const txCountRepository = mock<RpcTransactionCountRepository>({
        add: async () => '',
      })
      const clock = mock<Clock>({
        getLastHour: () => UnixTime.now(),
      })
      const blockTxCountUpdater = new RpcTransactionUpdater(
        ethereumClient,
        txCountRepository,
        clock,
        Logger.SILENT,
        ProjectId('fake-project'),
      )

      await blockTxCountUpdater.updateBlock(1)
      await blockTxCountUpdater.updateBlock(2)

      expect(txCountRepository.add).toHaveBeenCalledExactlyWith([
        [
          {
            timestamp: TIME_0,
            blockNumber: 1,
            projectId: ProjectId('fake-project'),
            count: 2,
          },
        ],
        [
          {
            timestamp: TIME_1,
            blockNumber: 2,
            projectId: ProjectId('fake-project'),
            count: 3,
          },
        ],
      ])
    })

    it('allows assessing count', async () => {
      const TIME_0 = new UnixTime(0)
      const ethereumClient = mock<EthereumClient>({
        getBlock: async (blockNumber) =>
          fakeBlock({
            number: blockNumber,
            timestamp: TIME_0.toNumber(),
            transactions: ['t0', 't1'],
          }),
      })
      const txCountRepository = mock<RpcTransactionCountRepository>({
        add: async () => '',
      })
      const clock = mock<Clock>({
        getLastHour: () => UnixTime.now(),
      })

      const rpcTransactionUpdater = new RpcTransactionUpdater(
        ethereumClient,
        txCountRepository,
        clock,
        Logger.SILENT,
        ProjectId('fake-project'),
        { assessCount: (count) => count - 1 },
      )

      await rpcTransactionUpdater.updateBlock(1)

      expect(txCountRepository.add).toHaveBeenCalledExactlyWith([
        [
          {
            timestamp: TIME_0,
            blockNumber: 1,
            projectId: ProjectId('fake-project'),
            count: 1,
          },
        ],
      ])
    })
  })
})

function fakeBlock(block?: Partial<Block>): Block {
  return {
    timestamp: 0,
    number: 0,
    hash: '',
    parentHash: '',
    transactions: [],
    nonce: '',
    difficulty: 0,
    _difficulty: BigNumber.from(0),
    gasLimit: BigNumber.from(0),
    gasUsed: BigNumber.from(0),
    miner: '',
    extraData: '',
    ...block,
  }
}
