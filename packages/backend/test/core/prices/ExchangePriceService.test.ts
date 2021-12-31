import { expect } from 'earljs'

import {
  ExchangePriceService,
  UNISWAP_V1_RELEASE_BLOCK,
  UNISWAP_V2_RELEASE_BLOCK,
  UNISWAP_V3_RELEASE_BLOCK,
} from '../../../src/core/prices/ExchangePriceService'
import { AssetId, EthereumAddress, Exchange, Token } from '../../../src/model'
import { ExchangePriceRepository } from '../../../src/peripherals/database/ExchangePriceRepository'
import { ExchangeQueryService } from '../../../src/peripherals/exchanges/ExchangeQueryService'
import {
  DAI,
  USDC,
  USDT,
  WETH,
} from '../../../src/peripherals/exchanges/queries/constants'
import { Logger } from '../../../src/tools/Logger'
import { mock } from '../../mock'

describe('ExchangePriceService', () => {
  describe('updateQueries', () => {
    const BLOCK_NUMBER = 1234n
    const TOKENS = [
      EthereumAddress('0x' + 'a'.repeat(40)),
      EthereumAddress('0x' + 'b'.repeat(40)),
      EthereumAddress('0x' + 'c'.repeat(40)),
      EthereumAddress('0x' + 'd'.repeat(40)),
    ]
    const QUERIES = [
      {
        assetId: AssetId('token-a'),
        token: TOKENS[0],
        exchange: Exchange.uniswapV2('dai'),
      },
      {
        assetId: AssetId('token-b'),
        token: TOKENS[1],
        exchange: Exchange.uniswapV1(),
      },
      {
        assetId: AssetId('token-c'),
        token: TOKENS[2],
        exchange: Exchange.uniswapV2('weth'),
      },
      {
        assetId: AssetId('token-d'),
        token: TOKENS[3],
        exchange: Exchange.uniswapV3('usdc', 500),
      },
    ]
    const RECORDS = [
      {
        assetId: AssetId('token-a'),
        blockNumber: BLOCK_NUMBER,
        exchange: Exchange.uniswapV2('dai'),
        liquidity: 100n,
        price: 1111n,
      },
      {
        assetId: AssetId('token-b'),
        blockNumber: BLOCK_NUMBER,
        exchange: Exchange.uniswapV1(),
        liquidity: 200n,
        price: 2222n,
      },
      {
        assetId: AssetId('token-c'),
        blockNumber: BLOCK_NUMBER,
        exchange: Exchange.uniswapV2('weth'),
        liquidity: 300n,
        price: 3333n,
      },
      {
        assetId: AssetId('token-d'),
        blockNumber: BLOCK_NUMBER,
        exchange: Exchange.uniswapV3('usdc', 500),
        liquidity: 400n,
        price: 4444n,
      },
    ]

    it('fetches all new data', async () => {
      const exchangePriceRepository = mock<ExchangePriceRepository>({
        async getAllByBlockNumber(blockNumber) {
          expect(blockNumber).toEqual(BLOCK_NUMBER)
          return []
        },
        async add(records) {
          expect(records).toEqual([RECORDS[0], RECORDS[1]])
        },
      })
      const exchangeQueryService = mock<ExchangeQueryService>({
        async getPrices(queries, blockNumber) {
          expect(queries).toEqual([QUERIES[0], QUERIES[1]])
          expect(blockNumber).toEqual(BLOCK_NUMBER)
          return [
            { liquidity: RECORDS[0].liquidity, price: RECORDS[0].price },
            { liquidity: RECORDS[1].liquidity, price: RECORDS[1].price },
          ]
        },
      })

      const exchangePriceService = new ExchangePriceService(
        exchangePriceRepository,
        exchangeQueryService,
        Logger.SILENT
      )

      const result = await exchangePriceService.updateQueries(
        [QUERIES[0], QUERIES[1]],
        BLOCK_NUMBER
      )
      expect(result).toEqual([RECORDS[0], RECORDS[1]])
    })

    it('fetches only unknown data', async () => {
      const exchangePriceRepository = mock<ExchangePriceRepository>({
        async getAllByBlockNumber(blockNumber) {
          expect(blockNumber).toEqual(BLOCK_NUMBER)
          return [RECORDS[0], RECORDS[2]]
        },
        async add(records) {
          expect(records).toEqual([RECORDS[1], RECORDS[3]])
        },
      })
      const exchangeQueryService = mock<ExchangeQueryService>({
        async getPrices(queries, blockNumber) {
          expect(queries).toEqual([QUERIES[1], QUERIES[3]])
          expect(blockNumber).toEqual(BLOCK_NUMBER)
          return [
            { liquidity: RECORDS[1].liquidity, price: RECORDS[1].price },
            { liquidity: RECORDS[3].liquidity, price: RECORDS[3].price },
          ]
        },
      })

      const exchangePriceService = new ExchangePriceService(
        exchangePriceRepository,
        exchangeQueryService,
        Logger.SILENT
      )

      const result = await exchangePriceService.updateQueries(
        QUERIES,
        BLOCK_NUMBER
      )
      expect(result).toEqual(RECORDS)
    })

    it('fetches nothing when all data is known', async () => {
      const exchangePriceRepository = mock<ExchangePriceRepository>({
        async getAllByBlockNumber(blockNumber) {
          expect(blockNumber).toEqual(BLOCK_NUMBER)
          return RECORDS
        },
      })
      const exchangeQueryService = mock<ExchangeQueryService>()
      const exchangePriceService = new ExchangePriceService(
        exchangePriceRepository,
        exchangeQueryService,
        Logger.SILENT
      )

      const result = await exchangePriceService.updateQueries(
        QUERIES,
        BLOCK_NUMBER
      )
      expect(result).toEqual(RECORDS)
    })
  })

  describe('queries', () => {
    function createTestUpdater() {
      const exchangePriceRepository = mock<ExchangePriceRepository>()
      const exchangeQueryService = mock<ExchangeQueryService>()
      const exchangePriceService = new ExchangePriceService(
        exchangePriceRepository,
        exchangeQueryService,
        Logger.SILENT
      )
      return exchangePriceService
    }

    describe('getEtherPriceQueries', () => {
      it('returns no queries before uniswap V1', () => {
        const exchangePriceService = createTestUpdater()
        const queries = exchangePriceService.getEtherPriceQueries(123n)
        expect(queries).toEqual([])
      })

      it('returns uniswap V1 queries', () => {
        const exchangePriceService = createTestUpdater()
        const queries = exchangePriceService.getEtherPriceQueries(
          UNISWAP_V1_RELEASE_BLOCK + 123n
        )
        expect(queries).toBeAnArrayWith(
          {
            assetId: AssetId.DAI,
            token: DAI,
            exchange: Exchange.uniswapV1(),
          },
          {
            assetId: AssetId.USDC,
            token: USDC,
            exchange: Exchange.uniswapV1(),
          },
          {
            assetId: AssetId.USDT,
            token: USDT,
            exchange: Exchange.uniswapV1(),
          }
        )
      })

      it('returns uniswap V2 queries', () => {
        const exchangePriceService = createTestUpdater()
        const queries = exchangePriceService.getEtherPriceQueries(
          UNISWAP_V2_RELEASE_BLOCK + 123n
        )
        const weth = { assetId: AssetId.WETH, token: WETH }
        expect(queries).toBeAnArrayWith(
          { ...weth, exchange: Exchange.uniswapV2('dai') },
          { ...weth, exchange: Exchange.uniswapV2('usdc') },
          { ...weth, exchange: Exchange.uniswapV2('usdt') }
        )
      })

      it('returns uniswap V3 queries', () => {
        const exchangePriceService = createTestUpdater()
        const queries = exchangePriceService.getEtherPriceQueries(
          UNISWAP_V3_RELEASE_BLOCK + 123n
        )
        const weth = { assetId: AssetId.WETH, token: WETH }
        expect(queries).toBeAnArrayWith(
          { ...weth, exchange: Exchange.uniswapV3('dai', 500) },
          { ...weth, exchange: Exchange.uniswapV3('usdc', 500) },
          { ...weth, exchange: Exchange.uniswapV3('usdt', 500) },
          { ...weth, exchange: Exchange.uniswapV3('dai', 3000) },
          { ...weth, exchange: Exchange.uniswapV3('usdc', 3000) },
          { ...weth, exchange: Exchange.uniswapV3('usdt', 3000) },
          { ...weth, exchange: Exchange.uniswapV3('dai', 10000) },
          { ...weth, exchange: Exchange.uniswapV3('usdc', 10000) },
          { ...weth, exchange: Exchange.uniswapV3('usdt', 10000) }
        )
      })
    })

    describe('getTokenPriceQueries', () => {
      const token: Token = {
        id: AssetId('mock-token'),
        address: EthereumAddress('0x' + '1234'.repeat(10)),
        symbol: 'MCK',
        decimals: 4,
        priceStrategy: { type: 'market' },
      }
      const tokenAsset = { assetId: token.id, token: token.address }

      it('returns no queries before uniswap V1', () => {
        const exchangePriceService = createTestUpdater()
        const queries = exchangePriceService.getTokenPriceQueries(token, 123n)
        expect(queries).toEqual([])
      })

      it('returns no queries for non-market tokens', () => {
        const exchangePriceService = createTestUpdater()
        const other: Token = {
          ...token,
          priceStrategy: { type: 'constant', value: 123n },
        }
        const queries = exchangePriceService.getTokenPriceQueries(
          other,
          UNISWAP_V3_RELEASE_BLOCK + 123n
        )
        expect(queries).toEqual([])
      })

      it('returns uniswap V1 queries', () => {
        const exchangePriceService = createTestUpdater()
        const queries = exchangePriceService.getTokenPriceQueries(
          token,
          UNISWAP_V1_RELEASE_BLOCK + 123n
        )
        expect(queries).toBeAnArrayWith({
          ...tokenAsset,
          exchange: Exchange.uniswapV1(),
        })
      })

      it('returns uniswap V2 queries', () => {
        const exchangePriceService = createTestUpdater()
        const queries = exchangePriceService.getTokenPriceQueries(
          token,
          UNISWAP_V2_RELEASE_BLOCK + 123n
        )
        expect(queries).toBeAnArrayWith(
          { ...tokenAsset, exchange: Exchange.uniswapV2('dai') },
          { ...tokenAsset, exchange: Exchange.uniswapV2('usdc') },
          { ...tokenAsset, exchange: Exchange.uniswapV2('usdt') },
          { ...tokenAsset, exchange: Exchange.uniswapV2('weth') }
        )
      })

      it('returns uniswap V3 queries', () => {
        const exchangePriceService = createTestUpdater()
        const queries = exchangePriceService.getTokenPriceQueries(
          token,
          UNISWAP_V3_RELEASE_BLOCK + 123n
        )
        expect(queries).toBeAnArrayWith(
          { ...tokenAsset, exchange: Exchange.uniswapV3('dai', 500) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('usdc', 500) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('usdt', 500) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('weth', 500) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('dai', 3000) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('usdc', 3000) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('usdt', 3000) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('weth', 3000) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('dai', 10000) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('usdc', 10000) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('usdt', 10000) },
          { ...tokenAsset, exchange: Exchange.uniswapV3('weth', 10000) }
        )
      })
    })

    describe('getQueries', () => {
      const tokenA: Token = {
        id: AssetId('mock-token-a'),
        address: EthereumAddress('0x' + 'aaaa'.repeat(10)),
        symbol: 'AAA',
        decimals: 6,
        priceStrategy: { type: 'market' },
      }
      const tokenB: Token = {
        id: AssetId('mock-token-b'),
        address: EthereumAddress('0x' + 'bbbb'.repeat(10)),
        symbol: 'BBB',
        decimals: 9,
        priceStrategy: { type: 'market' },
      }

      it('returns all the queries for tokens and ether', () => {
        const exchangePriceService = createTestUpdater()
        const block = UNISWAP_V3_RELEASE_BLOCK + 123n
        const queries = exchangePriceService.getQueries([tokenA, tokenB], block)
        expect(queries).toEqual([
          ...exchangePriceService.getEtherPriceQueries(block),
          ...exchangePriceService.getTokenPriceQueries(tokenA, block),
          ...exchangePriceService.getTokenPriceQueries(tokenB, block),
        ])
      })
    })
  })
})
