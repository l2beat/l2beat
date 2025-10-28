import { Logger } from '@l2beat/backend-tools'
import type { Database, InteropTransferUpdate } from '@l2beat/database'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Address32 } from '../../plugins/types'
import { InteropFinancialsLoop } from './InteropFinancialsLoop'
import { AbstractTokenId, DeployedTokenId, type ITokenDb } from './TokenDb'

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
      const tokenDb = mockObject<ITokenDb>({ getPriceInfo: mockFn() })
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
      expect(tokenDb.getPriceInfo).not.toHaveBeenCalled()
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

      const tokenDb = mockObject<ITokenDb>({
        getPriceInfo: mockFn(),
      })

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
      expect(tokenDb.getPriceInfo).not.toHaveBeenCalled()
    })

    it('calculates financials and updates transfers records', async () => {
      const srcToken1 = DeployedTokenId.from(
        'ethereum',
        EthereumAddress.random(),
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
          messageId: 'msg1',
          srcChain: 'ethereum',
          srcTokenAddress: Address32.from(DeployedTokenId.address(srcToken1)),
          srcRawAmount: BigInt('1000000000000000000'),
          dstChain: 'arbitrum',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken1)),
          dstRawAmount: BigInt('2000000000000000000'),
        },
        {
          messageId: 'msg2',
          srcChain: 'ethereum',
          srcTokenAddress: 'native',
          srcRawAmount: BigInt('500000000000000000'),
          dstChain: 'base',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken2)),
          dstRawAmount: undefined,
        },
        {
          messageId: 'msg3',
          srcChain: 'unsupported',
          dstChain: 'ethereum',
          dstTokenAddress: Address32.from(DeployedTokenId.address(dstToken3)),
          dstRawAmount: BigInt('200000000000000000'),
        },
      ]

      const priceInfoMap = new Map([
        [
          srcToken1,
          {
            abstractId: AbstractTokenId('123456:ethereum:ETH'),
            decimals: 18,
            coingeckoId: 'ethereum',
          },
        ],
        [
          dstToken1,
          {
            abstractId: AbstractTokenId('abcdef:arbitrum:ARB'),
            decimals: 18,
            coingeckoId: 'arbitrum',
          },
        ],
        [
          dstToken2,
          {
            abstractId: AbstractTokenId('fedcba:base:BASE'),
            decimals: 18,
            coingeckoId: undefined,
          },
        ],
        [
          dstToken3,
          {
            abstractId: AbstractTokenId('222222:ethereum:TOKEN'),
            decimals: 6,
            coingeckoId: 'token',
          },
        ],
      ])

      const pricesMap = new Map([
        ['ethereum', 3000],
        ['arbitrum', 1.5],
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
      const transaction = mockFn(async (fn: any) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })

      const tokenDb = mockObject<ITokenDb>({
        getPriceInfo: mockFn().resolvesTo(priceInfoMap),
      })

      const service = new InteropFinancialsLoop(
        [
          { name: 'ethereum', type: 'evm' as const },
          { name: 'arbitrum', type: 'evm' as const },
          { name: 'base', type: 'evm' as const },
        ],
        db,
        tokenDb,
        Logger.SILENT,
        1000,
      )

      await service.run()

      expect(interopRecentPrices.hasAnyPrices).toHaveBeenCalledTimes(1)
      expect(interopTransfer.getUnprocessed).toHaveBeenCalledTimes(1)

      expect(tokenDb.getPriceInfo).toHaveBeenCalledWith([
        srcToken1,
        dstToken1,
        DeployedTokenId('ethereum+native'),
        dstToken2,
        dstToken3,
      ])

      expect(interopRecentPrices.getClosestPrices).toHaveBeenNthCalledWith(
        1,
        ['ethereum', 'arbitrum', 'token'],
        expect.anything(),
        UnixTime.DAY,
      )

      expect(interopTransfer.updateFinancials).toHaveBeenCalledTimes(3)

      const firstUpdate: InteropTransferUpdate = {
        srcAbstractTokenId: AbstractTokenId('123456:ethereum:ETH'),
        srcAmount: 1,
        srcPrice: 3000,
        srcValueUsd: 3000,
        dstAbstractTokenId: AbstractTokenId('abcdef:arbitrum:ARB'),
        dstAmount: 2,
        dstPrice: 1.5,
        dstValueUsd: 3,
      }
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith(
        'msg1',
        firstUpdate,
      )

      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg2', {})

      const thirdUpdate: InteropTransferUpdate = {
        dstAbstractTokenId: AbstractTokenId('222222:ethereum:TOKEN'),
        dstAmount: 200000000000,
        dstPrice: 50,
        dstValueUsd: 10000000000000,
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
          messageId: 'msg1',
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
      const transaction = mockFn(async (fn: any) => await fn())
      const db = mockObject<Database>({
        interopRecentPrices,
        interopTransfer,
        transaction,
      })

      const tokenDb = mockObject<ITokenDb>({
        // Empty price info map to trigger warnings
        getPriceInfo: mockFn().resolvesTo(new Map()),
      })

      const logger = mockObject<Logger>({
        info: mockFn().returns(undefined),
        warn: mockFn().returns(undefined),
      })
      //@ts-ignore
      logger.for = () => logger

      const service = new InteropFinancialsLoop(
        [
          { name: 'ethereum', type: 'evm' as const },
          { name: 'arbitrum', type: 'evm' as const },
        ],
        db,
        tokenDb,
        logger,
        1000,
      )

      await service.run()

      expect(logger.warn).toHaveBeenCalledWith('Missing price info', {
        plugin: 'plugin',
        id: srcToken1,
        chain: DeployedTokenId.chain(srcToken1),
        token: DeployedTokenId.address(srcToken1),
      })
      expect(logger.warn).toHaveBeenCalledWith('Missing price info', {
        plugin: 'plugin',
        id: dstToken1,
        chain: DeployedTokenId.chain(dstToken1),
        token: DeployedTokenId.address(dstToken1),
      })

      // Should still update with empty financials
      expect(interopTransfer.updateFinancials).toHaveBeenCalledWith('msg1', {})
    })
  })
})
