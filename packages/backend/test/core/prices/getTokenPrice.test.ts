import { expect } from 'earljs'

import { getTokenPrice } from '../../../src/core/prices/getTokenPrice'
import { AssetId, EthereumAddress, Exchange, Token } from '../../../src/model'
import { ExchangePriceRecord } from '../../../src/peripherals/database/ExchangePriceRepository'

describe(getTokenPrice.name, () => {
  describe('for market tokens', () => {
    describe('single record', () => {
      const expectedPrice = 200n * 10n ** 18n
      const etherPrice = 4_000n * 10n ** 18n
      const token: Token = {
        id: AssetId('aaa-token'),
        symbol: 'AAA',
        decimals: 18,
        address: EthereumAddress('0x' + 'a'.repeat(40)),
        priceStrategy: { type: 'market' },
      }
      const testCases: ExchangePriceRecord[] = [
        {
          blockNumber: 123n,
          assetId: AssetId('aaa-token'),
          exchange: Exchange.uniswapV1(),
          liquidity: 100n * 10n ** 18n,
          price: 10n ** 18n / 20n,
        },
        {
          blockNumber: 123n,
          assetId: AssetId('aaa-token'),
          exchange: Exchange.uniswapV2('dai'),
          liquidity: 100n * 10n ** 18n,
          price: 200n * 10n ** 18n,
        },
        {
          blockNumber: 123n,
          assetId: AssetId('aaa-token'),
          exchange: Exchange.uniswapV2('usdc'),
          liquidity: 100n * 10n ** 18n,
          price: 200n * 10n ** 6n,
        },
        {
          blockNumber: 123n,
          assetId: AssetId('aaa-token'),
          exchange: Exchange.uniswapV2('usdt'),
          liquidity: 100n * 10n ** 18n,
          price: 200n * 10n ** 6n,
        },
        {
          blockNumber: 123n,
          assetId: AssetId('aaa-token'),
          exchange: Exchange.uniswapV2('weth'),
          liquidity: 100n * 10n ** 18n,
          price: 10n ** 18n / 20n,
        },
        {
          blockNumber: 123n,
          assetId: AssetId('aaa-token'),
          exchange: Exchange.uniswapV3('weth', 3000),
          liquidity: 100n * 10n ** 18n,
          price: 10n ** 18n / 20n,
        },
      ]

      for (const record of testCases) {
        it(`${record.exchange.name} - ${record.assetId}`, () => {
          const price = getTokenPrice(token, [record], etherPrice)
          expect(price).toEqual(expectedPrice)
        })
      }
    })

    it('chooses the most liquid record', () => {
      const token: Token = {
        id: AssetId('aaa-token'),
        symbol: 'AAA',
        decimals: 18,
        address: EthereumAddress('0x' + 'a'.repeat(40)),
        priceStrategy: { type: 'market' },
      }
      const records: ExchangePriceRecord[] = [
        {
          blockNumber: 123n,
          assetId: AssetId('aaa-token'),
          exchange: Exchange.uniswapV2('dai'),
          liquidity: 100n * 10n ** 18n,
          price: 201n * 10n ** 18n,
        },
        {
          blockNumber: 123n,
          assetId: AssetId('aaa-token'),
          exchange: Exchange.uniswapV2('usdc'),
          liquidity: 300n * 10n ** 18n,
          price: 202n * 10n ** 6n,
        },
        {
          blockNumber: 123n,
          assetId: AssetId('aaa-token'),
          exchange: Exchange.uniswapV2('usdt'),
          liquidity: 200n * 10n ** 18n,
          price: 203n * 10n ** 6n,
        },
      ]

      const price = getTokenPrice(token, records, 0n)
      expect(price).toEqual(202n * 10n ** 18n)
    })
  })

  it('works for constant price tokens', () => {
    const token: Token = {
      id: AssetId('aaa-token'),
      symbol: 'AAA',
      decimals: 18,
      address: EthereumAddress('0x' + 'a'.repeat(40)),
      priceStrategy: { type: 'constant', value: 1234n },
    }
    const price = getTokenPrice(token, [], 0n)
    expect(price).toEqual(1234n)
  })

  it('works for ether price tokens', () => {
    const token: Token = {
      id: AssetId('aaa-token'),
      symbol: 'AAA',
      decimals: 18,
      address: EthereumAddress('0x' + 'a'.repeat(40)),
      priceStrategy: { type: 'ether' },
    }
    const price = getTokenPrice(token, [], 5678n)
    expect(price).toEqual(5678n)
  })
})
