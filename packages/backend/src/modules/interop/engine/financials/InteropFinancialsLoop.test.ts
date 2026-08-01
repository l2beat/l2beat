import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropRecentPriceRequest,
  InteropTransferUpdate,
} from '@l2beat/database'
import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { expect, mockFn, mockObject } from 'earl'
import type { InteropTransferAnalyzer } from '../InteropTransferAnalyzer'
import type { InteropNotifier } from '../notifications/InteropNotifier'
import { DeployedTokenId } from './DeployedTokenId'
import { InteropFinancialsLoop } from './InteropFinancialsLoop'

describe(InteropFinancialsLoop.name, () => {
  describe(InteropFinancialsLoop.prototype.run.name, () => {
    it('processes transfers with empty financials when no prices are found', async () => {
      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        getClosestPricesAtOrBefore: mockPrices(new Map()),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo([
          {
            transferId: 'msg1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
          },
        ]),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn) => await fn())
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
        [],
        db,
        tokenDb,
        Logger.SILENT,
        { intervalMs: 1000 },
      )

      await service.run()

      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg1', {
        srcAbstractTokenId: null,
        srcSymbol: null,
        srcPrice: null,
        srcAmount: null,
        srcValueUsd: null,
        dstAbstractTokenId: null,
        dstSymbol: null,
        dstPrice: null,
        dstAmount: null,
        dstValueUsd: null,
      })
    })

    it('skips when unprocessed length === 0', async () => {
      const interopRecentPrices = mockObject<Database['interopRecentPrices']>(
        {},
      )
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo([]),
      })
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
      })

      const tokenDb = mockObject<TokenDbClient>({} as any)

      const service = new InteropFinancialsLoop(
        [],
        db,
        tokenDb,
        Logger.SILENT,
        { intervalMs: 1000 },
      )

      await service.run()

      expect(interopTransfer.getUnprocessed).toHaveBeenCalledTimes(1)
    })

    it('calculates financials and updates transfers records', async () => {
      const srcToken1 = DeployedTokenId.from(
        'ethereum',
        '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
      )
      const dstToken1 = DeployedTokenId.from(
        'arbitrum',
        EthereumAddress.random(),
      )
      const dstToken2 = DeployedTokenId.from('base', EthereumAddress.random())
      const dstToken3 = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )

      const mockTransfers = [
        {
          transferId: 'msg1',
          timestamp: UnixTime(100),
          srcTime: UnixTime(99),
          srcChain: 'ethereum',
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken1)),
          srcRawAmount: BigInt('1000000000000000000'),
          dstChain: 'arbitrum',
          dstTime: UnixTime(100),
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken1)),
          dstRawAmount: BigInt('2000000000000000000'),
        },
        {
          transferId: 'msg2',
          timestamp: UnixTime(101),
          srcChain: 'ethereum',
          srcTokenAddress: 'native',
          srcRawAmount: BigInt('500000000000000000'),
          dstChain: 'base',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken2)),
          dstRawAmount: undefined,
        },
        {
          transferId: 'msg3',
          timestamp: UnixTime(102),
          srcChain: 'unsupported',
          dstChain: 'ethereum',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken3)),
          dstRawAmount: BigInt('200000000000000000'),
        },
      ]

      const pricesMap = new Map([
        ['ethereum', 3000],
        ['arbitrum', 1.5],
        ['base', 2.0],
        ['token', 50],
      ])

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        getClosestPricesAtOrBefore: mockPrices(pricesMap),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })

      const mockTokens = [
        {
          deployedToken: {
            chain: 'ethereum',
            address: DeployedTokenId.address(srcToken1).toLowerCase(), // addresses in TokenDB are lowercase
            symbol: 'ETH',
            decimals: 18,
          },
          abstractToken: {
            id: '123456:ethereum:ETH',
            coingeckoId: 'ethereum',
            isPriceUnreliable: false,
          },
        },
        {
          deployedToken: {
            chain: 'arbitrum',
            address: DeployedTokenId.address(dstToken1),
            symbol: 'ARB',
            decimals: 18,
          },
          abstractToken: {
            id: 'abcdef:arbitrum:ARB',
            coingeckoId: 'arbitrum',
            isPriceUnreliable: false,
          },
        },
        {
          deployedToken: {
            chain: 'ethereum',
            address: 'native',
            symbol: 'ETH',
            decimals: 18,
          },
          abstractToken: {
            id: 'ethereum+native',
            coingeckoId: 'ethereum',
            isPriceUnreliable: false,
          },
        },
        {
          deployedToken: {
            chain: 'base',
            address: DeployedTokenId.address(dstToken2),
            symbol: 'BASE',
            decimals: 18,
          },
          abstractToken: {
            id: 'fedcba:base:BASE',
            coingeckoId: 'base',
            isPriceUnreliable: false,
          },
        },
        {
          deployedToken: {
            chain: 'ethereum',
            address: DeployedTokenId.address(dstToken3),
            symbol: 'TOKEN',
            decimals: 6,
          },
          abstractToken: {
            id: '222222:ethereum:TOKEN',
            coingeckoId: 'token',
            isPriceUnreliable: false,
          },
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
          { id: 'base', type: 'evm' as const },
        ],
        db,
        tokenDb,
        Logger.SILENT,
        {
          intervalMs: 1000,
          maxTransferValueUsd: 1_000_000_000,
        },
      )

      await service.run()

      expect(interopTransfer.getUnprocessed).toHaveBeenCalledTimes(1)

      expect(mockQuery).toHaveBeenCalledWith([
        { chain: 'ethereum', address: DeployedTokenId.address(srcToken1) },
        { chain: 'arbitrum', address: DeployedTokenId.address(dstToken1) },
        { chain: 'ethereum', address: 'native' },
        { chain: 'base', address: DeployedTokenId.address(dstToken2) },
        { chain: 'ethereum', address: DeployedTokenId.address(dstToken3) },
      ])

      expect(
        interopRecentPrices.getClosestPricesAtOrBefore,
      ).toHaveBeenNthCalledWith(
        1,
        [
          { requestId: 0, coingeckoId: 'ethereum', timestamp: UnixTime(99) },
          { requestId: 1, coingeckoId: 'arbitrum', timestamp: UnixTime(100) },
          { requestId: 2, coingeckoId: 'ethereum', timestamp: UnixTime(101) },
          { requestId: 3, coingeckoId: 'base', timestamp: UnixTime(101) },
          { requestId: 4, coingeckoId: 'token', timestamp: UnixTime(102) },
        ],
        UnixTime.DAY,
      )

      expect(interopTransfer.updateFinancials).toHaveBeenCalledTimes(3)

      const firstUpdate: InteropTransferUpdate = {
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
        firstUpdate,
      )

      const secondUpdate: InteropTransferUpdate = {
        srcAbstractTokenId: 'ethereum+native',
        srcSymbol: 'ETH',
        srcPrice: 3000,
        srcAmount: 0.5,
        srcValueUsd: 1500,
        dstAbstractTokenId: null,
        dstSymbol: null,
        dstPrice: null,
        dstAmount: null,
        dstValueUsd: null,
      }
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith(
        'msg2',
        secondUpdate,
      )

      const thirdUpdate: InteropTransferUpdate = {
        srcAbstractTokenId: null,
        srcSymbol: null,
        srcPrice: null,
        srcAmount: null,
        srcValueUsd: null,
        dstSymbol: 'TOKEN',
        dstAbstractTokenId: '222222:ethereum:TOKEN',
        dstAmount: 200000000000,
        dstPrice: 50,
        dstValueUsd: null,
      }
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith(
        'msg3',
        thirdUpdate,
      )

      expect(transaction).toHaveBeenCalledTimes(1)
    })

    it('handles missing price info and logs warnings', async () => {
      const srcToken1 = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )
      const dstToken1 = DeployedTokenId.from(
        'arbitrum',
        EthereumAddress.random(),
      )

      const mockTransfers = [
        {
          plugin: 'plugin',
          transferId: 'msg1',
          srcChain: 'ethereum',
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken1)),
          srcRawAmount: '1000000000000000000',
          dstChain: 'arbitrum',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken1)),
          dstRawAmount: '2000000000000000000',
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        getClosestPricesAtOrBefore: mockPrices(new Map()),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn) => await fn())
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

      const forLogger = mockObject<Logger>({
        info: mockFn().returns(undefined),
        warn: mockFn().returns(undefined),
      })
      const logger = mockObject<Logger>({
        for: mockFn().returns(forLogger),
      })

      const service = new InteropFinancialsLoop(
        [
          { id: 'ethereum', type: 'evm' as const },
          { id: 'arbitrum', type: 'evm' as const },
        ],
        db,
        tokenDb,
        logger,
        { intervalMs: 1000 },
      )

      await service.run()

      // Should still update, explicitly clearing stale financial values
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg1', {
        srcAbstractTokenId: null,
        srcSymbol: null,
        srcPrice: null,
        srcAmount: null,
        srcValueUsd: null,
        dstAbstractTokenId: null,
        dstSymbol: null,
        dstPrice: null,
        dstAmount: null,
        dstValueUsd: null,
      })
    })

    it('keeps token identity and amount while skipping valuation for unreliable prices', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )
      const dstToken = DeployedTokenId.from(
        'arbitrum',
        EthereumAddress.random(),
      )

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        getClosestPricesAtOrBefore: mockPrices(
          new Map([
            ['unreliable-token', 3000],
            ['reliable-token', 2],
          ]),
        ),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo([
          {
            transferId: 'msg1',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
            srcRawAmount: BigInt('1000000000000000000'),
            dstChain: 'arbitrum',
            dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
            dstRawAmount: BigInt('2000000000000000000'),
          },
        ]),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'ethereum',
                  address: DeployedTokenId.address(srcToken),
                  symbol: 'BAD',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'src-abstract-id',
                  coingeckoId: 'unreliable-token',
                  isPriceUnreliable: true,
                },
              },
              {
                deployedToken: {
                  chain: 'arbitrum',
                  address: DeployedTokenId.address(dstToken),
                  symbol: 'GOOD',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'dst-abstract-id',
                  coingeckoId: 'reliable-token',
                  isPriceUnreliable: false,
                },
              },
            ]),
          },
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
        { intervalMs: 1000 },
      )

      await service.run()

      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg1', {
        srcAbstractTokenId: 'src-abstract-id',
        srcSymbol: 'BAD',
        srcPrice: null,
        srcAmount: 1,
        srcValueUsd: null,
        dstAbstractTokenId: 'dst-abstract-id',
        dstSymbol: 'GOOD',
        dstPrice: 2,
        dstAmount: 2,
        dstValueUsd: 4,
      })
    })

    it('skips valuation and notifies when price exceeds the configured threshold', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        getClosestPricesAtOrBefore: mockPrices(
          new Map([['mega-token', 1_500_000]]),
        ),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo([
          {
            plugin: 'stargate',
            transferId: 'msg1',
            type: 'deposit',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
            srcRawAmount: BigInt('1000000000000000000'),
            dstChain: 'arbitrum',
          },
        ]),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'ethereum',
                  address: DeployedTokenId.address(srcToken),
                  symbol: 'MEGA',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'src-abstract-id',
                  coingeckoId: 'mega-token',
                  isPriceUnreliable: false,
                },
              },
            ]),
          },
        },
      } as any)
      const notifier = mockObject<InteropNotifier>({
        notifySkippedTransferValuations: mockFn().returns(undefined),
      })

      const service = new InteropFinancialsLoop(
        [
          { id: 'ethereum', type: 'evm' as const },
          { id: 'arbitrum', type: 'evm' as const },
        ],
        db,
        tokenDb,
        Logger.SILENT,
        {
          notifier,
          intervalMs: 1000,
          maxTokenPriceUsd: 1_000_000,
        },
      )

      await service.run()

      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg1', {
        srcAbstractTokenId: 'src-abstract-id',
        srcSymbol: 'MEGA',
        srcPrice: 1_500_000,
        srcAmount: 1,
        srcValueUsd: null,
        dstAbstractTokenId: null,
        dstSymbol: null,
        dstPrice: null,
        dstAmount: null,
        dstValueUsd: null,
      })
      expect(notifier.notifySkippedTransferValuations).toHaveBeenCalledTimes(1)
      expect(notifier.notifySkippedTransferValuations).toHaveBeenCalledWith(
        expect.anything(),
        [
          {
            plugin: 'stargate',
            type: 'deposit',
            transferId: 'msg1',
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            side: 'src',
            symbol: 'MEGA',
            coingeckoId: 'mega-token',
            priceUsd: 1_500_000,
            amount: 1,
            valueUsd: undefined,
            reason: 'priceAboveThreshold',
            thresholdUsd: 1_000_000,
          },
        ],
      )
    })

    it('skips valuation and notifies when transfer value exceeds the configured threshold', async () => {
      const dstToken = DeployedTokenId.from(
        'arbitrum',
        EthereumAddress.random(),
      )

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        getClosestPricesAtOrBefore: mockPrices(
          new Map([['whale-token', 20_000]]),
        ),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo([
          {
            plugin: 'stargate',
            transferId: 'msg2',
            type: 'deposit',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
            dstRawAmount: BigInt('100000000000000000000000'),
          },
        ]),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'arbitrum',
                  address: DeployedTokenId.address(dstToken),
                  symbol: 'WHALE',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'dst-abstract-id',
                  coingeckoId: 'whale-token',
                  isPriceUnreliable: false,
                },
              },
            ]),
          },
        },
      } as any)
      const notifier = mockObject<InteropNotifier>({
        notifySkippedTransferValuations: mockFn().returns(undefined),
      })

      const service = new InteropFinancialsLoop(
        [
          { id: 'ethereum', type: 'evm' as const },
          { id: 'arbitrum', type: 'evm' as const },
        ],
        db,
        tokenDb,
        Logger.SILENT,
        {
          notifier,
          intervalMs: 1000,
          maxTransferValueUsd: 1_000_000_000,
        },
      )

      await service.run()

      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg2', {
        srcAbstractTokenId: null,
        srcSymbol: null,
        srcPrice: null,
        srcAmount: null,
        srcValueUsd: null,
        dstAbstractTokenId: 'dst-abstract-id',
        dstSymbol: 'WHALE',
        dstPrice: 20_000,
        dstAmount: 100_000,
        dstValueUsd: null,
      })
      expect(notifier.notifySkippedTransferValuations).toHaveBeenCalledTimes(1)
      expect(notifier.notifySkippedTransferValuations).toHaveBeenCalledWith(
        expect.anything(),
        [
          {
            plugin: 'stargate',
            type: 'deposit',
            transferId: 'msg2',
            srcChain: 'ethereum',
            dstChain: 'arbitrum',
            side: 'dst',
            symbol: 'WHALE',
            coingeckoId: 'whale-token',
            priceUsd: 20_000,
            amount: 100_000,
            valueUsd: 2_000_000_000,
            reason: 'valueAboveThreshold',
            thresholdUsd: 1_000_000_000,
          },
        ],
      )
    })

    it('passes processed transfers to the analyzer after assigning financials', async () => {
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
          plugin: 'plugin-1',
          transferId: 'msg1',
          type: 'deposit',
          timestamp: UnixTime(100),
          srcChain: 'ethereum',
          srcTxHash:
            '0x1111111111111111111111111111111111111111111111111111111111111111',
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: BigInt('600000000000000000000'),
          dstChain: 'arbitrum',
          dstTxHash:
            '0x2222222222222222222222222222222222222222222222222222222222222222',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
          dstRawAmount: BigInt('100000000000000000000'),
        },
        {
          plugin: 'plugin-2',
          transferId: 'msg2',
          type: 'deposit',
          timestamp: UnixTime(101),
          srcChain: 'ethereum',
          srcTxHash:
            '0x3333333333333333333333333333333333333333333333333333333333333333',
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: BigInt('200000000000000000000'),
          dstChain: 'arbitrum',
          dstTxHash:
            '0x4444444444444444444444444444444444444444444444444444444444444444',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
          dstRawAmount: BigInt('100000000000000000000'),
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        getClosestPricesAtOrBefore: mockPrices(new Map([['token', 1]])),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'ethereum',
                  address: DeployedTokenId.address(srcToken),
                  symbol: 'USDC',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'src-abstract-id',
                  coingeckoId: 'token',
                  isPriceUnreliable: false,
                },
              },
              {
                deployedToken: {
                  chain: 'arbitrum',
                  address: DeployedTokenId.address(dstToken),
                  symbol: 'USDC',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'dst-abstract-id',
                  coingeckoId: 'token',
                  isPriceUnreliable: false,
                },
              },
            ]),
          },
        },
      } as any)
      const analyzer = mockObject<InteropTransferAnalyzer>({
        handleProcessedTransfers: mockFn().returns(undefined),
      } as any)

      const service = new InteropFinancialsLoop(
        [
          { id: 'ethereum', type: 'evm' as const },
          { id: 'arbitrum', type: 'evm' as const },
        ],
        db,
        tokenDb,
        Logger.SILENT,
        {
          analyzer,
          intervalMs: 1000,
        },
      )

      await service.run()

      expect(analyzer.handleProcessedTransfers).toHaveBeenCalledTimes(1)
      const processedTransfers =
        analyzer.handleProcessedTransfers.calls[0]?.args[0]

      expect(processedTransfers).toHaveLength(2)
      expect(processedTransfers?.[0]?.transferId).toEqual('msg1')
      expect(processedTransfers?.[0]?.srcValueUsd).toEqual(600)
      expect(processedTransfers?.[0]?.dstValueUsd).toEqual(100)
      expect(processedTransfers?.[1]?.transferId).toEqual('msg2')
      expect(
        interopRecentPrices.getClosestPricesAtOrBefore,
      ).toHaveBeenCalledWith(
        [
          { requestId: 0, coingeckoId: 'token', timestamp: UnixTime(100) },
          { requestId: 1, coingeckoId: 'token', timestamp: UnixTime(101) },
        ],
        UnixTime.DAY,
      )
    })

    it('propagates analyzer errors after financials are updated', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )
      const dstToken = DeployedTokenId.from(
        'arbitrum',
        EthereumAddress.random(),
      )

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        getClosestPricesAtOrBefore: mockPrices(new Map([['token', 1]])),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo([
          {
            plugin: 'plugin-1',
            transferId: 'msg1',
            type: 'deposit',
            timestamp: UnixTime(100),
            srcChain: 'ethereum',
            srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
            srcRawAmount: BigInt('600000000000000000000'),
            dstChain: 'arbitrum',
            dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
            dstRawAmount: BigInt('100000000000000000000'),
          },
        ]),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'ethereum',
                  address: DeployedTokenId.address(srcToken),
                  symbol: 'USDC',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'src-abstract-id',
                  coingeckoId: 'token',
                  isPriceUnreliable: false,
                },
              },
              {
                deployedToken: {
                  chain: 'arbitrum',
                  address: DeployedTokenId.address(dstToken),
                  symbol: 'USDC',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'dst-abstract-id',
                  coingeckoId: 'token',
                  isPriceUnreliable: false,
                },
              },
            ]),
          },
        },
      } as any)
      const analyzer = mockObject<InteropTransferAnalyzer>({
        handleProcessedTransfers: mockFn(() => {
          throw new Error('boom')
        }),
      } as any)

      const service = new InteropFinancialsLoop(
        [
          { id: 'ethereum', type: 'evm' as const },
          { id: 'arbitrum', type: 'evm' as const },
        ],
        db,
        tokenDb,
        Logger.SILENT,
        {
          analyzer,
          intervalMs: 1000,
        },
      )

      await expect(service.run()).toBeRejected()
      expect(interopTransfer.updateFinancials).toHaveBeenCalledTimes(1)
    })
  })
})

function mockPrices(pricesByCoin: Map<string, number>) {
  return mockFn((requests: InteropRecentPriceRequest[]) =>
    Promise.resolve(
      new Map(
        requests.map((request) => [
          request.requestId,
          pricesByCoin.get(request.coingeckoId),
        ]),
      ),
    ),
  )
}
