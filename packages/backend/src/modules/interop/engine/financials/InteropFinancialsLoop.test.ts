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
        getWithEitherRawAmount: mockFn().resolvesTo([]),
      })
      const db = mockObject<Database>({ interopRecentPrices, interopTransfer })
      const tokenDb = mockObject<TokenDbClient>({} as any)
      const service = new InteropFinancialsLoop([], db, tokenDb, Logger.SILENT)

      await service.run()

      expect(interopRecentPrices.hasAnyPrices).toHaveBeenCalledTimes(1)
      expect(interopTransfer.getWithEitherRawAmount).not.toHaveBeenCalled()
    })

    it('clears side financials when token info is missing', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )

      const mockTransfers = [
        {
          transferId: 'msg1',
          srcChain: 'ethereum',
          srcTime: UnixTime(1_000),
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: 1_000_000_000_000_000_000n,
          srcAbstractTokenId: 'old:token:id',
          srcSymbol: 'OLD',
          srcPrice: 123,
          srcAmount: 1,
          srcValueUsd: 123,
          dstChain: 'arbitrum',
          dstTime: UnixTime(2_000),
          dstTokenAddress: '0x',
          dstRawAmount: 2_000_000_000_000_000_000n,
          dstValueUsd: undefined,
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPricesForQueries: mockFn().resolvesTo(new Map()),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithEitherRawAmount: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const db = mockObject<Database>({ interopRecentPrices, interopTransfer })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([]),
          },
        },
      } as any)

      const service = new InteropFinancialsLoop(
        [{ id: 'ethereum', type: 'evm' as const }],
        db,
        tokenDb,
        Logger.SILENT,
      )

      await service.run()

      expect(interopTransfer.updateFinancials).toHaveBeenCalledTimes(1)
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg1', {
        srcAbstractTokenId: null,
        srcSymbol: null,
        srcPrice: null,
        srcAmount: null,
        srcValueUsd: null,
      })
      expect(
        interopRecentPrices.getClosestPricesForQueries,
      ).not.toHaveBeenCalled()
    })

    it('updates side financials when token info differs and price exists', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )

      const mockTransfers = [
        {
          transferId: 'msg1',
          srcChain: 'ethereum',
          srcTime: UnixTime(1_000),
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: 1_000_000_000_000_000_000n,
          srcAbstractTokenId: 'old:id',
          srcSymbol: 'OLD',
          srcPrice: 10,
          srcAmount: 1,
          srcValueUsd: 10,
          dstChain: 'arbitrum',
          dstTime: UnixTime(2_000),
          dstTokenAddress: '0x',
          dstRawAmount: 2_000_000_000_000_000_000n,
          dstValueUsd: undefined,
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPricesForQueries: mockFn().resolvesTo(
          new Map<string, number | undefined>([['msg1:src', 3000]]),
        ),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithEitherRawAmount: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const db = mockObject<Database>({ interopRecentPrices, interopTransfer })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'ethereum',
                  address: DeployedTokenId.address(srcToken),
                  symbol: 'ETH',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'new:id',
                  coingeckoId: 'ethereum',
                },
              },
            ]),
          },
        },
      } as any)

      const service = new InteropFinancialsLoop(
        [{ id: 'ethereum', type: 'evm' as const }],
        db,
        tokenDb,
        Logger.SILENT,
      )

      await service.run()

      expect(interopTransfer.updateFinancials).toHaveBeenCalledTimes(1)
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg1', {
        srcAbstractTokenId: 'new:id',
        srcSymbol: 'ETH',
        srcPrice: 3000,
        srcAmount: 1,
        srcValueUsd: 3000,
      })
    })

    it('queries prices per side and updates both sides when both prices exist', async () => {
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
          srcRawAmount: 1_000_000_000_000_000_000n,
          srcValueUsd: undefined,
          dstChain: 'arbitrum',
          dstTime,
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
          dstRawAmount: 2_000_000_000_000_000_000n,
          dstValueUsd: undefined,
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPricesForQueries: mockFn().resolvesTo(
          new Map<string, number | undefined>([
            ['msg1:src', 3000],
            ['msg1:dst', 1.5],
          ]),
        ),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithEitherRawAmount: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
      })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'ethereum',
                  address: DeployedTokenId.address(srcToken).toLowerCase(),
                  symbol: 'ETH',
                  decimals: 18,
                },
                abstractToken: {
                  id: '123456:ethereum:ETH',
                  coingeckoId: 'ethereum',
                },
              },
              {
                deployedToken: {
                  chain: 'arbitrum',
                  address: DeployedTokenId.address(dstToken),
                  symbol: 'ARB',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'abcdef:arbitrum:ARB',
                  coingeckoId: 'arbitrum',
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
      )

      await service.run()

      expect(
        interopRecentPrices.getClosestPricesForQueries,
      ).toHaveBeenCalledWith(
        [
          {
            key: 'msg1:src',
            coingeckoId: 'ethereum',
            timestamp: srcTime,
          },
          {
            key: 'msg1:dst',
            coingeckoId: 'arbitrum',
            timestamp: dstTime,
          },
        ],
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

    it('updates only sides that have a resolved price', async () => {
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
          srcRawAmount: 1_000_000_000_000_000_000n,
          srcValueUsd: undefined,
          dstChain: 'arbitrum',
          dstTime: UnixTime(2_000),
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken)),
          dstRawAmount: 2_000_000_000_000_000_000n,
          dstValueUsd: undefined,
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPricesForQueries: mockFn().resolvesTo(
          new Map<string, number | undefined>([['msg1:src', 3000]]),
        ),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithEitherRawAmount: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const db = mockObject<Database>({ interopRecentPrices, interopTransfer })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'ethereum',
                  address: DeployedTokenId.address(srcToken),
                  symbol: 'ETH',
                  decimals: 18,
                },
                abstractToken: {
                  id: '123456:ethereum:ETH',
                  coingeckoId: 'ethereum',
                },
              },
              {
                deployedToken: {
                  chain: 'arbitrum',
                  address: DeployedTokenId.address(dstToken),
                  symbol: 'ARB',
                  decimals: 18,
                },
                abstractToken: {
                  id: 'abcdef:arbitrum:ARB',
                  coingeckoId: 'arbitrum',
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
      )

      await service.run()

      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg1', {
        srcAbstractTokenId: '123456:ethereum:ETH',
        srcSymbol: 'ETH',
        srcPrice: 3000,
        srcAmount: 1,
        srcValueUsd: 3000,
      })
      expect(interopTransfer.updateFinancials).toHaveBeenCalledTimes(1)
    })

    it('skips updates when no side has a price', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )

      const mockTransfers = [
        {
          transferId: 'msg1',
          srcChain: 'ethereum',
          srcTime: UnixTime(1_000),
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: 1_000_000_000_000_000_000n,
          srcValueUsd: undefined,
          dstChain: 'arbitrum',
          dstTime: UnixTime(2_000),
          dstTokenAddress: Address32.from(EthereumAddress.random()),
          dstRawAmount: undefined,
          dstValueUsd: undefined,
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPricesForQueries: mockFn().resolvesTo(new Map()),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithEitherRawAmount: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().resolvesTo(undefined),
      })
      const db = mockObject<Database>({ interopRecentPrices, interopTransfer })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'ethereum',
                  address: DeployedTokenId.address(srcToken),
                  symbol: 'ETH',
                  decimals: 18,
                },
                abstractToken: {
                  id: '123456:ethereum:ETH',
                  coingeckoId: 'ethereum',
                },
              },
            ]),
          },
        },
      } as any)

      const service = new InteropFinancialsLoop(
        [{ id: 'ethereum', type: 'evm' as const }],
        db,
        tokenDb,
        Logger.SILENT,
      )

      await service.run()

      expect(interopTransfer.updateFinancials).not.toHaveBeenCalled()
    })

    it('continues processing next transfer when one update fails', async () => {
      const srcToken = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
      )

      const mockTransfers = [
        {
          transferId: 'msg1',
          srcChain: 'ethereum',
          srcTime: UnixTime(1_000),
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: 1_000_000_000_000_000_000n,
          srcValueUsd: undefined,
          dstChain: 'arbitrum',
          dstTime: UnixTime(2_000),
          dstTokenAddress: Address32.from(EthereumAddress.random()),
          dstRawAmount: undefined,
          dstValueUsd: undefined,
        },
        {
          transferId: 'msg2',
          srcChain: 'ethereum',
          srcTime: UnixTime(1_100),
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken)),
          srcRawAmount: 2_000_000_000_000_000_000n,
          srcValueUsd: undefined,
          dstChain: 'arbitrum',
          dstTime: UnixTime(2_100),
          dstTokenAddress: Address32.from(EthereumAddress.random()),
          dstRawAmount: undefined,
          dstValueUsd: undefined,
        },
      ]

      const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
        hasAnyPrices: mockFn().resolvesTo(true),
        getClosestPricesForQueries: mockFn().resolvesTo(
          new Map<string, number | undefined>([
            ['msg1:src', 3000],
            ['msg2:src', 3000],
          ]),
        ),
      })
      const interopTransfer = mockObject<Database['interopTransfer']>({
        getWithEitherRawAmount: mockFn().resolvesTo(mockTransfers),
        updateFinancials: mockFn().executes(async (transferId: string) => {
          if (transferId === 'msg1') {
            throw new Error('db failure')
          }
        }),
      })
      const db = mockObject<Database>({ interopRecentPrices, interopTransfer })

      const tokenDb = mockObject<TokenDbClient>({
        deployedTokens: {
          getByChainAndAddress: {
            query: mockFn().resolvesTo([
              {
                deployedToken: {
                  chain: 'ethereum',
                  address: DeployedTokenId.address(srcToken),
                  symbol: 'ETH',
                  decimals: 18,
                },
                abstractToken: {
                  id: '123456:ethereum:ETH',
                  coingeckoId: 'ethereum',
                },
              },
            ]),
          },
        },
      } as any)

      const service = new InteropFinancialsLoop(
        [{ id: 'ethereum', type: 'evm' as const }],
        db,
        tokenDb,
        Logger.SILENT,
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
