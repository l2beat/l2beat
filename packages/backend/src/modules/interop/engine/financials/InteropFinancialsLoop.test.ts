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
        getUnprocessed: mockFn().resolvesTo([]),
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
      expect(interopTransfer.getUnprocessed).not.toHaveBeenCalled()
    })

    it('skips when unprocessed length === 0', async () => {
      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
      })
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
        1000,
      )

      await service.run()

      expect(interopRecentPrices.hasAnyPrices).toHaveBeenCalledTimes(1)
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
          srcEventId: 'evt1-src',
          dstEventId: 'evt1-dst',
          srcChain: 'ethereum',
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken1)),
          srcRawAmount: BigInt('1000000000000000000'),
          dstChain: 'arbitrum',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken1)),
          dstRawAmount: BigInt('2000000000000000000'),
        },
        {
          transferId: 'msg2',
          srcEventId: 'evt2-src',
          dstEventId: 'evt2-dst',
          srcChain: 'ethereum',
          srcTokenAddress: 'native',
          srcRawAmount: BigInt('500000000000000000'),
          dstChain: 'base',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken2)),
          dstRawAmount: undefined,
        },
        {
          transferId: 'msg3',
          srcEventId: 'evt3-src',
          dstEventId: 'evt3-dst',
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
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPrices: mockFn().resolvesTo(pricesMap),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const interopEvent = mockObject<Database['interopEvent']>({
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn: any) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        interopEvent,
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
          abstractToken: { id: '123456:ethereum:ETH', coingeckoId: 'ethereum' },
        },
        {
          deployedToken: {
            chain: 'arbitrum',
            address: DeployedTokenId.address(dstToken1),
            symbol: 'ARB',
            decimals: 18,
          },
          abstractToken: { id: 'abcdef:arbitrum:ARB', coingeckoId: 'arbitrum' },
        },
        {
          deployedToken: {
            chain: 'ethereum',
            address: 'native',
            symbol: 'ETH',
            decimals: 18,
          },
          abstractToken: { id: 'ethereum+native', coingeckoId: 'ethereum' },
        },
        {
          deployedToken: {
            chain: 'base',
            address: DeployedTokenId.address(dstToken2),
            symbol: 'BASE',
            decimals: 18,
          },
          abstractToken: { id: 'fedcba:base:BASE', coingeckoId: 'base' },
        },
        {
          deployedToken: {
            chain: 'ethereum',
            address: DeployedTokenId.address(dstToken3),
            symbol: 'TOKEN',
            decimals: 6,
          },
          abstractToken: { id: '222222:ethereum:TOKEN', coingeckoId: 'token' },
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
        1000,
      )

      await service.run()

      expect(interopRecentPrices.hasAnyPrices).toHaveBeenCalledTimes(1)
      expect(interopTransfer.getUnprocessed).toHaveBeenCalledTimes(1)

      expect(mockQuery).toHaveBeenCalledWith([
        { chain: 'ethereum', address: DeployedTokenId.address(srcToken1) },
        { chain: 'arbitrum', address: DeployedTokenId.address(dstToken1) },
        { chain: 'ethereum', address: 'native' },
        { chain: 'base', address: DeployedTokenId.address(dstToken2) },
        { chain: 'ethereum', address: DeployedTokenId.address(dstToken3) },
      ])

      expect(interopRecentPrices.getClosestPrices).toHaveBeenNthCalledWith(
        1,
        ['ethereum', 'arbitrum', 'base', 'token'],
        expect.anything(),
        UnixTime.DAY,
      )

      expect(interopTransfer.updateFinancials).toHaveBeenCalledTimes(3)
      expect(interopEvent.updateFinancials).toHaveBeenCalledTimes(6)

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
      expect(interopEvent.updateFinancials).toHaveBeenCalledWith(
        'evt1-src',
        {
          abstractTokenId: '123456:ethereum:ETH',
          symbol: 'ETH',
          price: 3000,
          amount: 1,
          valueUsd: 3000,
        },
      )
      expect(interopEvent.updateFinancials).toHaveBeenCalledWith(
        'evt1-dst',
        {
          abstractTokenId: 'abcdef:arbitrum:ARB',
          symbol: 'ARB',
          price: 1.5,
          amount: 2,
          valueUsd: 3,
        },
      )

      const secondUpdate: InteropTransferUpdate = {
        srcAbstractTokenId: 'ethereum+native',
        srcSymbol: 'ETH',
        srcPrice: 3000,
        srcAmount: 0.5,
        srcValueUsd: 1500,
      }
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith(
        'msg2',
        secondUpdate,
      )
      expect(interopEvent.updateFinancials).toHaveBeenCalledWith(
        'evt2-src',
        {
          abstractTokenId: 'ethereum+native',
          symbol: 'ETH',
          price: 3000,
          amount: 0.5,
          valueUsd: 1500,
        },
      )
      expect(interopEvent.updateFinancials).toHaveBeenCalledWith('evt2-dst', {})

      const thirdUpdate: InteropTransferUpdate = {
        dstSymbol: 'TOKEN',
        dstAbstractTokenId: '222222:ethereum:TOKEN',
        dstAmount: 200000000000,
        dstPrice: 50,
        dstValueUsd: 10000000000000,
      }
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith(
        'msg3',
        thirdUpdate,
      )
      expect(interopEvent.updateFinancials).toHaveBeenCalledWith('evt3-src', {})
      expect(interopEvent.updateFinancials).toHaveBeenCalledWith(
        'evt3-dst',
        {
          abstractTokenId: '222222:ethereum:TOKEN',
          symbol: 'TOKEN',
          price: 50,
          amount: 200000000000,
          valueUsd: 10000000000000,
        },
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
          srcEventId: 'evt1-src',
          dstEventId: 'evt1-dst',
          srcChain: 'ethereum',
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken1)),
          srcRawAmount: '1000000000000000000',
          dstChain: 'arbitrum',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken1)),
          dstRawAmount: '2000000000000000000',
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPrices: mockFn().resolvesTo(new Map()),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getUnprocessed: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const interopEvent = mockObject<Database['interopEvent']>({
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const transaction = mockFn(async (fn: any) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        interopEvent,
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
        1000,
      )

      await service.run()

      // Should still update with empty financials
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg1', {})
      expect(interopEvent.updateFinancials).toHaveBeenCalledWith(
        'evt1-src',
        {},
      )
      expect(interopEvent.updateFinancials).toHaveBeenCalledWith(
        'evt1-dst',
        {},
      )
    })
  })
})
