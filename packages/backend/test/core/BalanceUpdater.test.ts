import {
  AssetId,
  Bytes,
  CoingeckoId,
  EthereumAddress,
  Logger,
  mock,
  ProjectId,
} from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { expect, mockFn } from 'earljs'

import { BalanceUpdater } from '../../src/core/BalanceUpdater'
import { ProjectInfo } from '../../src/model/ProjectInfo'
import { BalanceRepository } from '../../src/peripherals/database/BalanceRepository'
import { BlockNumberRepository } from '../../src/peripherals/database/BlockNumberRepository'
import { BalanceCall } from '../../src/peripherals/ethereum/calls/BalanceCall'
import { MulticallClient } from '../../src/peripherals/ethereum/MulticallClient'
import { fakeUnixTime } from '../fakes'

describe(BalanceUpdater.name, () => {
  const HOLDER_A = EthereumAddress.random()
  const HOLDER_B = EthereumAddress.random()
  const HOLDER_C = EthereumAddress.random()

  const ASSET_A = AssetId('eth-ether')
  const ASSET_B = AssetId('usdc-usd-coin')
  const ASSET_C = AssetId('usdt-tether-usd')
  const ASSET_D = AssetId('zrx-0x-protocol-token')

  const START = fakeUnixTime()
  const START_BLOCK_NUMBER = 10000n

  const mockToken = (id: AssetId, sinceBlock: number): TokenInfo => {
    return {
      id,
      name: 'fake',
      symbol: 'FK',
      decimals: 18,
      coingeckoId: CoingeckoId('fake'),
      sinceBlock,
      category: 'other',
    }
  }

  const PROJECTS: ProjectInfo[] = [
    {
      name: 'Arbitrum',
      projectId: ProjectId('arbitrum'),
      bridges: [
        {
          address: HOLDER_A.toString(),
          sinceBlock: Number(START_BLOCK_NUMBER - 100n),
          tokens: [
            mockToken(ASSET_A, 0),
            mockToken(ASSET_B, 800),
            mockToken(ASSET_C, 800),
          ],
        },
      ],
    },
    {
      name: 'ZKswap',
      projectId: ProjectId('zk-swap'),
      bridges: [
        {
          address: HOLDER_B.toString(),
          sinceBlock: Number(START_BLOCK_NUMBER - 100n),
          tokens: [
            mockToken(ASSET_B, 0),
            mockToken(ASSET_C, 800),
            mockToken(ASSET_D, 800),
          ],
        },
      ],
    },
  ]

  const fakeFindByBlockNumber = async (blockNumber: bigint) => {
    return blockNumber === START_BLOCK_NUMBER
      ? {
          timestamp: START,
          blockNumber: START_BLOCK_NUMBER,
        }
      : {
          timestamp: START.add(1, 'hours'),
          blockNumber: START_BLOCK_NUMBER + 1000n,
        }
  }

  const balanceRepository = mock<BalanceRepository>({
    getByBlock: mockFn().returns([]),
    addOrUpdateMany: mockFn().returns([]),
  })

  const multicall = mock<MulticallClient>({
    multicall: mockFn().returns([]),
  })

  const blockNumberRepository = mock<BlockNumberRepository>()

  const balanceUpdater = new BalanceUpdater(
    multicall,
    balanceRepository,
    blockNumberRepository,
    [],
    Logger.SILENT,
  )

  describe(BalanceUpdater.prototype.update.name, () => {
    it('integration test', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getByBlock: mockFn()
          .returnsOnce([
            {
              timestamp: START,
              holderAddress: HOLDER_A,
              assetId: ASSET_A,
              balance: 100n,
            },
            {
              timestamp: START,
              holderAddress: HOLDER_A,
              assetId: ASSET_B,
              balance: 100n,
            },
            {
              timestamp: START,
              holderAddress: HOLDER_B,
              assetId: ASSET_B,
              balance: 100n,
            },
            {
              timestamp: START,
              holderAddress: HOLDER_B,
              assetId: ASSET_C,
              balance: 100n,
            },
          ])
          .returnsOnce([]),
        addOrUpdateMany: mockFn().returns([]),
      })

      const multicall = mock<MulticallClient>({
        multicall: mockFn()
          .returnsOnce([MULTICALL_RESPONSE_FAKE, MULTICALL_RESPONSE_FAKE])
          .returnsOnce([
            MULTICALL_RESPONSE_FAKE,
            MULTICALL_RESPONSE_FAKE,
            MULTICALL_RESPONSE_FAKE,
            MULTICALL_RESPONSE_FAKE,
            MULTICALL_RESPONSE_FAKE,
            MULTICALL_RESPONSE_FAKE,
          ]),
      })

      const blockNumberRepository = mock<BlockNumberRepository>({
        findByBlockNumber: fakeFindByBlockNumber,
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        PROJECTS,
        Logger.SILENT,
      )

      const blocks = [START_BLOCK_NUMBER, START_BLOCK_NUMBER + 1000n]

      await balanceUpdater.update(blocks)

      expect(multicall.multicall).toHaveBeenCalledExactlyWith([
        [
          [
            BalanceCall.encode(HOLDER_A, ASSET_C),
            BalanceCall.encode(HOLDER_B, ASSET_D),
          ],
          START_BLOCK_NUMBER,
        ],
        [
          [
            BalanceCall.encode(HOLDER_A, ASSET_A),
            BalanceCall.encode(HOLDER_A, ASSET_B),
            BalanceCall.encode(HOLDER_A, ASSET_C),
            BalanceCall.encode(HOLDER_B, ASSET_B),
            BalanceCall.encode(HOLDER_B, ASSET_C),
            BalanceCall.encode(HOLDER_B, ASSET_D),
          ],
          START_BLOCK_NUMBER + 1000n,
        ],
      ])

      expect(balanceRepository.addOrUpdateMany).toHaveBeenCalledExactlyWith([
        [
          [
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_C,
              timestamp: START,
              balance: 100n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_D,
              timestamp: START,
              balance: 100n,
            },
          ],
        ],
        [
          [
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_A,
              timestamp: START.add(1, 'hours'),
              balance: 100n,
            },
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_B,
              timestamp: START.add(1, 'hours'),
              balance: 100n,
            },
            {
              holderAddress: HOLDER_A,
              assetId: ASSET_C,
              timestamp: START.add(1, 'hours'),
              balance: 100n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_B,
              timestamp: START.add(1, 'hours'),
              balance: 100n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_C,
              timestamp: START.add(1, 'hours'),
              balance: 100n,
            },
            {
              holderAddress: HOLDER_B,
              assetId: ASSET_D,
              timestamp: START.add(1, 'hours'),
              balance: 100n,
            },
          ],
        ],
      ])
    })

    it('skip processed blocks', async () => {
      const blocks = [START_BLOCK_NUMBER, START_BLOCK_NUMBER + 1000n]

      await balanceUpdater.update(blocks)
      await balanceUpdater.update(blocks)

      expect(multicall.multicall.calls.length).toEqual(0)

      expect(balanceRepository.addOrUpdateMany.calls.length).toEqual(0)
    })
  })

  describe(BalanceUpdater.prototype.getMissingDataByBlock.name, () => {
    it('no data in DB', async () => {
      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        PROJECTS,
        Logger.SILENT,
      )

      const result = await balanceUpdater.getMissingDataByBlock(
        START_BLOCK_NUMBER,
      )

      expect(result).toEqual([
        {
          holder: HOLDER_A,
          assetId: ASSET_A,
        },
        {
          holder: HOLDER_A,
          assetId: ASSET_B,
        },
        {
          holder: HOLDER_A,
          assetId: ASSET_C,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_B,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_C,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_D,
        },
      ])
    })

    it('finds missing data', async () => {
      const balanceRepository = mock<BalanceRepository>({
        getByBlock: mockFn().returns([
          {
            blockNumber: START_BLOCK_NUMBER,
            holderAddress: HOLDER_A,
            assetId: ASSET_A,
            balance: 100n,
          },
          {
            blockNumber: START_BLOCK_NUMBER,
            holderAddress: HOLDER_B,
            assetId: ASSET_B,
            balance: 100n,
          },
        ]),
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        PROJECTS,
        Logger.SILENT,
      )

      const result = await balanceUpdater.getMissingDataByBlock(
        START_BLOCK_NUMBER,
      )

      expect(result).toBeAnArrayWith(
        {
          holder: HOLDER_A,
          assetId: ASSET_B,
        },
        {
          holder: HOLDER_A,
          assetId: ASSET_C,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_C,
        },
        {
          holder: HOLDER_B,
          assetId: ASSET_D,
        },
      )
      expect(result).toBeAnArrayOfLength(4)
    })

    it('blocks before bridge', async () => {
      const projects: ProjectInfo[] = [
        {
          name: 'Arbitrum',
          projectId: ProjectId('arbitrum'),
          bridges: [
            {
              address: HOLDER_A.toString(),
              sinceBlock: Number(START_BLOCK_NUMBER + 1000n),
              tokens: [mockToken(ASSET_A, 0), mockToken(ASSET_B, 800)],
            },
          ],
        },
      ]

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        projects,
        Logger.SILENT,
      )

      const result = await balanceUpdater.getMissingDataByBlock(
        START_BLOCK_NUMBER,
      )

      expect(result).toEqual([])
    })

    it('blocks before token', async () => {
      const projects: ProjectInfo[] = [
        {
          name: 'Arbitrum',
          projectId: ProjectId('arbitrum'),
          bridges: [
            {
              address: HOLDER_A.toString(),
              sinceBlock: 999,
              tokens: [
                mockToken(ASSET_A, 0),
                mockToken(ASSET_B, Number(START_BLOCK_NUMBER + 1000n)),
              ],
            },
          ],
        },
      ]

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        projects,
        Logger.SILENT,
      )

      const result = await balanceUpdater.getMissingDataByBlock(
        START_BLOCK_NUMBER,
      )

      expect(result).toEqual([
        {
          holder: HOLDER_A,
          assetId: ASSET_A,
        },
      ])
    })
  })

  describe(BalanceUpdater.prototype.fetchBalances.name, () => {
    it('queries and parses data from multicall', async () => {
      const multicall = mock<MulticallClient>({
        multicall: mockFn().returnsOnce([
          {
            success: true,
            data: Bytes.fromHex(
              '0x0000000000000000000000000000000000000000000000000000000000000064',
            ),
          },
          {
            success: true,
            data: Bytes.fromHex(
              '0x0000000000000000000000000000000000000000000000000000000000000064',
            ),
          },
          {
            success: true,
            data: Bytes.fromHex(
              '0x0000000000000000000000000000000000000000000000000000000000000064',
            ),
          },
        ]),
      })

      const blockNumberRepository = mock<BlockNumberRepository>({
        findByBlockNumber: fakeFindByBlockNumber,
      })

      const balanceUpdater = new BalanceUpdater(
        multicall,
        balanceRepository,
        blockNumberRepository,
        [],
        Logger.SILENT,
      )

      const metadata = [
        { holder: HOLDER_A, assetId: ASSET_A },
        { holder: HOLDER_B, assetId: ASSET_B },
        { holder: HOLDER_C, assetId: ASSET_C },
      ]

      const result = await balanceUpdater.fetchBalances(
        metadata,
        START_BLOCK_NUMBER,
      )

      expect(result).toEqual([
        {
          timestamp: START,
          holderAddress: HOLDER_A,
          assetId: ASSET_A,
          balance: BigInt(100),
        },
        {
          timestamp: START,
          holderAddress: HOLDER_B,
          assetId: ASSET_B,
          balance: BigInt(100),
        },
        {
          timestamp: START,
          holderAddress: HOLDER_C,
          assetId: ASSET_C,
          balance: BigInt(100),
        },
      ])
    })
  })
})

const MULTICALL_RESPONSE_FAKE = {
  success: true,
  data: Bytes.fromHex(
    '0x0000000000000000000000000000000000000000000000000000000000000064',
  ),
}
