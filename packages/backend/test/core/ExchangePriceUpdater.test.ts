import { expect } from 'chai'

import {
  ExchangePriceUpdater,
  UNISWAP_V1_RELEASE_BLOCK,
  UNISWAP_V2_RELEASE_BLOCK,
  UNISWAP_V3_RELEASE_BLOCK,
} from '../../src/core/ExchangePriceUpdater'
import { EthereumAddress, Token } from '../../src/model'
import { ExchangePriceRepository } from '../../src/peripherals/database/ExchangePriceRepository'
import { ExchangePriceChecker } from '../../src/peripherals/exchanges/ExchangePriceChecker'
import {
  DAI,
  USDC,
  USDT,
  WETH,
} from '../../src/peripherals/exchanges/queries/constants'
import { Logger } from '../../src/tools/Logger'
import { mock } from '../mock'

describe('ExchangePriceUpdater', () => {
  describe('updateQueries', () => {
    const BLOCK_NUMBER = 1234n
    const TOKENS = [
      new EthereumAddress('0x' + 'a'.repeat(40)),
      new EthereumAddress('0x' + 'b'.repeat(40)),
      new EthereumAddress('0x' + 'c'.repeat(40)),
      new EthereumAddress('0x' + 'd'.repeat(40)),
    ]
    const QUERIES = [
      { assetId: 'token-a', token: TOKENS[0], exchange: 'uniswap-v2-dai' },
      { assetId: 'token-b', token: TOKENS[1], exchange: 'uniswap-v1' },
      { assetId: 'token-c', token: TOKENS[2], exchange: 'uniswap-v2-weth' },
      { assetId: 'token-d', token: TOKENS[3], exchange: 'uniswap-v3-usdc-500' },
    ]
    const RECORDS = [
      {
        assetId: 'token-a',
        blockNumber: BLOCK_NUMBER,
        exchange: 'uniswap-v2-dai',
        liquidity: 100n,
        price: 1111n,
      },
      {
        assetId: 'token-b',
        blockNumber: BLOCK_NUMBER,
        exchange: 'uniswap-v1',
        liquidity: 200n,
        price: 2222n,
      },
      {
        assetId: 'token-c',
        blockNumber: BLOCK_NUMBER,
        exchange: 'uniswap-v2-weth',
        liquidity: 300n,
        price: 3333n,
      },
      {
        assetId: 'token-d',
        blockNumber: BLOCK_NUMBER,
        exchange: 'uniswap-v3-usdc-500',
        liquidity: 400n,
        price: 4444n,
      },
    ]

    it('fetches all new data', async () => {
      const exchangePriceRepository = mock<ExchangePriceRepository>({
        async getAllByBlockNumber(blockNumber) {
          expect(blockNumber).to.equal(BLOCK_NUMBER)
          return []
        },
        async add(records) {
          expect(records).to.deep.equal([RECORDS[0], RECORDS[1]])
        },
      })
      const exchangePriceChecker = mock<ExchangePriceChecker>({
        async getPrices(queries, blockNumber) {
          expect(queries).to.deep.equal([QUERIES[0], QUERIES[1]])
          expect(blockNumber).to.equal(BLOCK_NUMBER)
          return [
            { liquidity: RECORDS[0].liquidity, price: RECORDS[0].price },
            { liquidity: RECORDS[1].liquidity, price: RECORDS[1].price },
          ]
        },
      })

      const exchangePriceUpdater = new ExchangePriceUpdater(
        exchangePriceRepository,
        exchangePriceChecker,
        Logger.SILENT
      )

      const result = await exchangePriceUpdater.updateQueries(
        [QUERIES[0], QUERIES[1]],
        BLOCK_NUMBER
      )
      expect(result).to.deep.equal([RECORDS[0], RECORDS[1]])
    })

    it('fetches only unknown data', async () => {
      const exchangePriceRepository = mock<ExchangePriceRepository>({
        async getAllByBlockNumber(blockNumber) {
          expect(blockNumber).to.equal(BLOCK_NUMBER)
          return [RECORDS[0], RECORDS[2]]
        },
        async add(records) {
          expect(records).to.deep.equal([RECORDS[1], RECORDS[3]])
        },
      })
      const exchangePriceChecker = mock<ExchangePriceChecker>({
        async getPrices(queries, blockNumber) {
          expect(queries).to.deep.equal([QUERIES[1], QUERIES[3]])
          expect(blockNumber).to.equal(BLOCK_NUMBER)
          return [
            { liquidity: RECORDS[1].liquidity, price: RECORDS[1].price },
            { liquidity: RECORDS[3].liquidity, price: RECORDS[3].price },
          ]
        },
      })

      const exchangePriceUpdater = new ExchangePriceUpdater(
        exchangePriceRepository,
        exchangePriceChecker,
        Logger.SILENT
      )

      const result = await exchangePriceUpdater.updateQueries(
        QUERIES,
        BLOCK_NUMBER
      )
      expect(result).to.deep.equal(RECORDS)
    })

    it('fetches nothing when all data is known', async () => {
      const exchangePriceRepository = mock<ExchangePriceRepository>({
        async getAllByBlockNumber(blockNumber) {
          expect(blockNumber).to.equal(BLOCK_NUMBER)
          return RECORDS
        },
      })
      const exchangePriceChecker = mock<ExchangePriceChecker>()
      const exchangePriceUpdater = new ExchangePriceUpdater(
        exchangePriceRepository,
        exchangePriceChecker,
        Logger.SILENT
      )

      const result = await exchangePriceUpdater.updateQueries(
        QUERIES,
        BLOCK_NUMBER
      )
      expect(result).to.deep.equal(RECORDS)
    })
  })

  describe('queries', () => {
    function createTestUpdater() {
      const exchangePriceRepository = mock<ExchangePriceRepository>()
      const exchangePriceChecker = mock<ExchangePriceChecker>()
      const exchangePriceUpdater = new ExchangePriceUpdater(
        exchangePriceRepository,
        exchangePriceChecker,
        Logger.SILENT
      )
      return exchangePriceUpdater
    }

    describe('getEtherPriceQueries', () => {
      it('returns no queries before uniswap V1', () => {
        const exchangePriceUpdater = createTestUpdater()
        const queries = exchangePriceUpdater.getEtherPriceQueries(123n)
        expect(queries).to.deep.equal([])
      })

      it('returns uniswap V1 queries', () => {
        const exchangePriceUpdater = createTestUpdater()
        const queries = exchangePriceUpdater.getEtherPriceQueries(
          UNISWAP_V1_RELEASE_BLOCK + 123n
        )
        expect(queries).to.contain.deep.members([
          { assetId: 'dai-stablecoin', token: DAI, exchange: 'uniswap-v1' },
          { assetId: 'usd-coin', token: USDC, exchange: 'uniswap-v1' },
          { assetId: 'tether-usd', token: USDT, exchange: 'uniswap-v1' },
        ])
      })

      it('returns uniswap V2 queries', () => {
        const exchangePriceUpdater = createTestUpdater()
        const queries = exchangePriceUpdater.getEtherPriceQueries(
          UNISWAP_V2_RELEASE_BLOCK + 123n
        )
        const weth = { assetId: 'wrapped-ether', token: WETH }
        expect(queries).to.contain.deep.members([
          { ...weth, exchange: 'uniswap-v2-dai' },
          { ...weth, exchange: 'uniswap-v2-usdc' },
          { ...weth, exchange: 'uniswap-v2-usdt' },
        ])
      })

      it('returns uniswap V3 queries', () => {
        const exchangePriceUpdater = createTestUpdater()
        const queries = exchangePriceUpdater.getEtherPriceQueries(
          UNISWAP_V3_RELEASE_BLOCK + 123n
        )
        const weth = { assetId: 'wrapped-ether', token: WETH }
        expect(queries).to.contain.deep.members([
          { ...weth, exchange: 'uniswap-v3-dai-500' },
          { ...weth, exchange: 'uniswap-v3-usdc-500' },
          { ...weth, exchange: 'uniswap-v3-usdt-500' },
          { ...weth, exchange: 'uniswap-v3-dai-3000' },
          { ...weth, exchange: 'uniswap-v3-usdc-3000' },
          { ...weth, exchange: 'uniswap-v3-usdt-3000' },
          { ...weth, exchange: 'uniswap-v3-dai-10000' },
          { ...weth, exchange: 'uniswap-v3-usdc-10000' },
          { ...weth, exchange: 'uniswap-v3-usdt-10000' },
        ])
      })
    })

    describe('getTokenPriceQueries', () => {
      const token: Token = {
        id: 'mock-token',
        address: new EthereumAddress('0x' + '1234'.repeat(10)),
        symbol: 'MCK',
        decimals: 4,
        priceStrategy: { type: 'market' },
      }
      const tokenAsset = { assetId: token.id, token: token.address }

      it('returns no queries before uniswap V1', () => {
        const exchangePriceUpdater = createTestUpdater()
        const queries = exchangePriceUpdater.getTokenPriceQueries(token, 123n)
        expect(queries).to.deep.equal([])
      })

      it('returns no queries for non-market tokens', () => {
        const exchangePriceUpdater = createTestUpdater()
        const other: Token = {
          ...token,
          priceStrategy: { type: 'constant', value: 123n },
        }
        const queries = exchangePriceUpdater.getTokenPriceQueries(
          other,
          UNISWAP_V3_RELEASE_BLOCK + 123n
        )
        expect(queries).to.deep.equal([])
      })

      it('returns uniswap V1 queries', () => {
        const exchangePriceUpdater = createTestUpdater()
        const queries = exchangePriceUpdater.getTokenPriceQueries(
          token,
          UNISWAP_V1_RELEASE_BLOCK + 123n
        )
        expect(queries).to.contain.deep.members([
          { ...tokenAsset, exchange: 'uniswap-v1' },
        ])
      })

      it('returns uniswap V2 queries', () => {
        const exchangePriceUpdater = createTestUpdater()
        const queries = exchangePriceUpdater.getTokenPriceQueries(
          token,
          UNISWAP_V2_RELEASE_BLOCK + 123n
        )
        expect(queries).to.contain.deep.members([
          { ...tokenAsset, exchange: 'uniswap-v2-dai' },
          { ...tokenAsset, exchange: 'uniswap-v2-usdc' },
          { ...tokenAsset, exchange: 'uniswap-v2-usdt' },
          { ...tokenAsset, exchange: 'uniswap-v2-weth' },
        ])
      })

      it('returns uniswap V3 queries', () => {
        const exchangePriceUpdater = createTestUpdater()
        const queries = exchangePriceUpdater.getTokenPriceQueries(
          token,
          UNISWAP_V3_RELEASE_BLOCK + 123n
        )
        expect(queries).to.contain.deep.members([
          { ...tokenAsset, exchange: 'uniswap-v3-dai-500' },
          { ...tokenAsset, exchange: 'uniswap-v3-usdc-500' },
          { ...tokenAsset, exchange: 'uniswap-v3-usdt-500' },
          { ...tokenAsset, exchange: 'uniswap-v3-weth-500' },
          { ...tokenAsset, exchange: 'uniswap-v3-dai-3000' },
          { ...tokenAsset, exchange: 'uniswap-v3-usdc-3000' },
          { ...tokenAsset, exchange: 'uniswap-v3-usdt-3000' },
          { ...tokenAsset, exchange: 'uniswap-v3-weth-3000' },
          { ...tokenAsset, exchange: 'uniswap-v3-dai-10000' },
          { ...tokenAsset, exchange: 'uniswap-v3-usdc-10000' },
          { ...tokenAsset, exchange: 'uniswap-v3-usdt-10000' },
          { ...tokenAsset, exchange: 'uniswap-v3-weth-10000' },
        ])
      })
    })

    describe('getQueries', () => {
      const tokenA: Token = {
        id: 'mock-token-a',
        address: new EthereumAddress('0x' + 'aaaa'.repeat(10)),
        symbol: 'AAA',
        decimals: 6,
        priceStrategy: { type: 'market' },
      }
      const tokenB: Token = {
        id: 'mock-token-b',
        address: new EthereumAddress('0x' + 'bbbb'.repeat(10)),
        symbol: 'BBB',
        decimals: 9,
        priceStrategy: { type: 'market' },
      }

      it('returns all the queries for tokens and ether', () => {
        const exchangePriceUpdater = createTestUpdater()
        const block = UNISWAP_V3_RELEASE_BLOCK + 123n
        const queries = exchangePriceUpdater.getQueries([tokenA, tokenB], block)
        expect(queries).to.deep.equal([
          ...exchangePriceUpdater.getEtherPriceQueries(block),
          ...exchangePriceUpdater.getTokenPriceQueries(tokenA, block),
          ...exchangePriceUpdater.getTokenPriceQueries(tokenB, block),
        ])
      })
    })
  })
})
