import { Logger } from '@l2beat/backend-tools'
import type { Database, InteropTransferUpdate } from '@l2beat/database'
import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { expect, mockFn, mockObject } from 'earl'
import { DeployedTokenId } from './DeployedTokenId'
import { InteropFinancialsLoop } from './InteropFinancialsLoop'

describe(InteropFinancialsLoop.name, () => {
  describe(InteropFinancialsLoop.prototype.run.name, () => {
    it('skips when hasAnyPrices === false', async () => {
      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(false),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithMissingFinancials: mockFn().resolvesTo([]),
      })
      const db = mockObject<Database>({ interopRecentPrices, interopTransfer })
      const tokenDb = mockObject<TokenDbClient>({} as any)
      const service = new InteropFinancialsLoop(
        [],
        db,
        tokenDb,
        Logger.SILENT,
        1000,
      )

      await service.run()

      expect(interopRecentPrices.hasAnyPrices).toHaveBeenCalledTimes(1)
      expect(interopTransfer.getWithMissingFinancials).not.toHaveBeenCalled()
    })

    it('skips when there are no transfers with missing financials', async () => {
      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithMissingFinancials: mockFn().resolvesTo([]),
      })
      const db = mockObject<Database>({ interopRecentPrices, interopTransfer })
      const tokenDb = mockObject<TokenDbClient>({} as any)
      const service = new InteropFinancialsLoop(
        [],
        db,
        tokenDb,
        Logger.SILENT,
        1000,
      )

      await service.run()

      expect(interopRecentPrices.hasAnyPrices).toHaveBeenCalledTimes(1)
      expect(interopTransfer.getWithMissingFinancials).toHaveBeenCalledTimes(1)
    })

    it('processes a single transfer and uses src/dst timestamps for price lookups', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
      )
      const dstToken = DeployedTokenId.from(
        'arbitrum',
        EthereumAddress.random(),
      )
      const srcTime = UnixTime(1_000)
      const dstTime = UnixTime(2_000)

      const mockTransfers = [
        {
          transferId: 'msg1',
          srcChain: 'ethereum',
          srcTime,
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: BigInt('1000000000000000000'),
          dstChain: 'arbitrum',
          dstTime,
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
          dstRawAmount: BigInt('2000000000000000000'),
        },
      ]

      const prices = new Map<string, number>([
        ['ethereum', 3000],
        ['arbitrum', 1.5],
      ])

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPrice: mockFn((coingeckoId: string) =>
          Promise.resolve(prices.get(coingeckoId)),
        ),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithMissingFinancials: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn: any) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })

      const mockTokens = [
        {
          deployedToken: {
            chain: 'ethereum',
            address: DeployedTokenId.address(srcToken).toLowerCase(),
            symbol: 'ETH',
            decimals: 18,
          },
          abstractToken: { id: '123456:ethereum:ETH', coingeckoId: 'ethereum' },
        },
        {
          deployedToken: {
            chain: 'arbitrum',
            address: DeployedTokenId.address(dstToken),
            symbol: 'ARB',
            decimals: 18,
          },
          abstractToken: { id: 'abcdef:arbitrum:ARB', coingeckoId: 'arbitrum' },
        },
      ]
      const mockQuery = mockFn().resolvesTo(mockTokens)
      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: { getByChainAndAddress: { query: mockQuery } },
      } as any)

      const service = new InteropFinancialsLoop(
        [
          { id: 'ethereum', type: 'evm' as const },
          { id: 'arbitrum', type: 'evm' as const },
        ],
        db,
        tokenDb,
        Logger.SILENT,
        1000,
      )

      await service.run()

      expect(interopTransfer.getWithMissingFinancials).toHaveBeenCalledTimes(1)
      expect(mockQuery).toHaveBeenCalledWith([
        { chain: 'ethereum', address: DeployedTokenId.address(srcToken) },
        { chain: 'arbitrum', address: DeployedTokenId.address(dstToken) },
      ])
      expect(interopRecentPrices.getClosestPrice).toHaveBeenNthCalledWith(
        1,
        'ethereum',
        srcTime,
        UnixTime.DAY,
      )
      expect(interopRecentPrices.getClosestPrice).toHaveBeenNthCalledWith(
        2,
        'arbitrum',
        dstTime,
        UnixTime.DAY,
      )

      const update: InteropTransferUpdate = {
        srcAbstractTokenId: '123456:ethereum:ETH',
        srcSymbol: 'ETH',
        srcPrice: 3000,
        srcAmount: 1,
        srcValueUsd: 3000,
        dstAbstractTokenId: 'abcdef:arbitrum:ARB',
        dstSymbol: 'ARB',
        dstPrice: 1.5,
        dstAmount: 2,
        dstValueUsd: 3,
      }
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith(
        'msg1',
        update,
      )
      expect(interopTransfer.updateFinancials).toHaveBeenCalledTimes(1)
    })

    it('skips update when no financial fields can be produced', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )
      const dstToken = DeployedTokenId.from(
        'arbitrum',
        EthereumAddress.random(),
      )

      const mockTransfers = [
        {
          transferId: 'msg1',
          srcChain: 'ethereum',
          srcTime: UnixTime(1_000),
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: BigInt('1000000000000000000'),
          dstChain: 'arbitrum',
          dstTime: UnixTime(2_000),
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
          dstRawAmount: BigInt('2000000000000000000'),
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPrice: mockFn().resolvesTo(undefined),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithMissingFinancials: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn: any) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })
      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: { query: mockFn().resolvesTo([]) },
        },
      } as any)

      const service = new InteropFinancialsLoop(
        [
          { id: 'ethereum', type: 'evm' as const },
          { id: 'arbitrum', type: 'evm' as const },
        ],
        db,
        tokenDb,
        Logger.SILENT,
        1000,
      )

      await service.run()

      expect(interopTransfer.updateFinancials).not.toHaveBeenCalled()
    })

    it('continues processing other transfers when updating one transfer fails', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
      )
      const dstToken = DeployedTokenId.from(
        'arbitrum',
        EthereumAddress.random(),
      )

      const mockTransfers = [
        {
          transferId: 'msg1',
          srcChain: 'ethereum',
          srcTime: UnixTime(1_000),
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: BigInt('1000000000000000000'),
          dstChain: 'arbitrum',
          dstTime: UnixTime(2_000),
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
          dstRawAmount: BigInt('2000000000000000000'),
        },
        {
          transferId: 'msg2',
          srcChain: 'ethereum',
          srcTime: UnixTime(1_100),
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: BigInt('1000000000000000000'),
          dstChain: 'arbitrum',
          dstTime: UnixTime(2_100),
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
          dstRawAmount: BigInt('2000000000000000000'),
        },
      ]

      const prices = new Map<string, number>([
        ['ethereum', 3000],
        ['arbitrum', 1.5],
      ])

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPrice: mockFn((coingeckoId: string) =>
          Promise.resolve(prices.get(coingeckoId)),
        ),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithMissingFinancials: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().executes(async (transferId: string) => {
          if (transferId === 'msg1') {
            throw new Error('db failure')
          }
        }),
      })
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
      })

      const mockTokens = [
        {
          deployedToken: {
            chain: 'ethereum',
            address: DeployedTokenId.address(srcToken).toLowerCase(),
            symbol: 'ETH',
            decimals: 18,
          },
          abstractToken: { id: '123456:ethereum:ETH', coingeckoId: 'ethereum' },
        },
        {
          deployedToken: {
            chain: 'arbitrum',
            address: DeployedTokenId.address(dstToken),
            symbol: 'ARB',
            decimals: 18,
          },
          abstractToken: { id: 'abcdef:arbitrum:ARB', coingeckoId: 'arbitrum' },
        },
      ]
      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: { query: mockFn().resolvesTo(mockTokens) },
        },
      } as any)

      const service = new InteropFinancialsLoop(
        [
          { id: 'ethereum', type: 'evm' as const },
          { id: 'arbitrum', type: 'evm' as const },
        ],
        db,
        tokenDb,
        Logger.SILENT,
        1000,
      )

      await expect(service.run()).not.toBeRejected()

      expect(interopTransfer.updateFinancials).toHaveBeenCalledTimes(2)
      expect(interopTransfer.updateFinancials).toHaveBeenNthCalledWith(
        1,
        'msg1',
        expect.anything(),
      )
      expect(interopTransfer.updateFinancials).toHaveBeenNthCalledWith(
        2,
        'msg2',
        expect.anything(),
      )
    })
  })
})
