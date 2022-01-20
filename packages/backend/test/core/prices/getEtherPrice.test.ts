import { AssetId, Exchange } from '@l2beat/common'
import { expect } from 'earljs'

import { getEtherPrice } from '../../../src/core/prices/getEtherPrice'
import { ExchangePriceRecord } from '../../../src/peripherals/database/ExchangePriceRepository'

describe(getEtherPrice.name, () => {
  describe('single record', () => {
    const expectedPrice = 4_000n * 10n ** 18n
    const testCases: ExchangePriceRecord[] = [
      {
        blockNumber: 123n,
        assetId: AssetId.DAI,
        exchange: Exchange.uniswapV1(),
        liquidity: 400_000n * 10n ** 18n,
        price: 10n ** 18n / 4_000n,
      },
      {
        blockNumber: 123n,
        assetId: AssetId.USDC,
        exchange: Exchange.uniswapV1(),
        liquidity: 400_000n * 10n ** 6n,
        price: 10n ** 30n / 4_000n,
      },
      {
        blockNumber: 123n,
        assetId: AssetId.USDT,
        exchange: Exchange.uniswapV1(),
        liquidity: 400_000n * 10n ** 6n,
        price: 10n ** 30n / 4_000n,
      },
      {
        blockNumber: 123n,
        assetId: AssetId.WETH,
        exchange: Exchange.uniswapV2('dai'),
        liquidity: 100n * 10n ** 18n,
        price: 4_000n * 10n ** 18n,
      },
      {
        blockNumber: 123n,
        assetId: AssetId.WETH,
        exchange: Exchange.uniswapV3('usdc', 3000),
        liquidity: 100n * 10n ** 18n,
        price: 4_000n * 10n ** 6n,
      },
      {
        blockNumber: 123n,
        assetId: AssetId.WETH,
        exchange: Exchange.uniswapV2('usdt'),
        liquidity: 100n * 10n ** 18n,
        price: 4_000n * 10n ** 6n,
      },
    ]

    for (const record of testCases) {
      it(`${record.exchange.name} - ${record.assetId}`, () => {
        const price = getEtherPrice([record])
        expect(price).toEqual(expectedPrice)
      })
    }
  })

  describe('multiple records', () => {
    it('selects the best uniswap 2 & 3 record', () => {
      const price = getEtherPrice([
        {
          blockNumber: 123n,
          assetId: AssetId.WETH,
          exchange: Exchange.uniswapV2('dai'),
          liquidity: 100n * 10n ** 18n,
          price: 4_001n * 10n ** 18n,
        },
        {
          blockNumber: 123n,
          assetId: AssetId.WETH,
          exchange: Exchange.uniswapV3('usdc', 3000),
          liquidity: 300n * 10n ** 18n,
          price: 4_002n * 10n ** 6n,
        },
        {
          blockNumber: 123n,
          assetId: AssetId.WETH,
          exchange: Exchange.uniswapV2('usdt'),
          liquidity: 200n * 10n ** 18n,
          price: 4_003n * 10n ** 6n,
        },
      ])
      expect(price).toEqual(4_002n * 10n ** 18n)
    })

    const uniV1Records = [
      {
        blockNumber: 123n,
        assetId: AssetId.DAI,
        exchange: Exchange.uniswapV1(),
        liquidity: 400_000n * 10n ** 18n,
        price: 10n ** 18n / 4_000n,
      },
      {
        blockNumber: 123n,
        assetId: AssetId.USDC,
        exchange: Exchange.uniswapV1(),
        liquidity: 400_000n * 10n ** 6n,
        price: 10n ** (18n + 12n) / 4_000n,
      },
      {
        blockNumber: 123n,
        assetId: AssetId.USDT,
        exchange: Exchange.uniswapV1(),
        liquidity: 400_000n * 10n ** 6n,
        price: 10n ** (18n + 12n) / 4_000n,
      },
    ]

    const baseV2Record = {
      blockNumber: 123n,
      assetId: AssetId.WETH,
      exchange: Exchange.uniswapV2('dai'),
      liquidity: 100n * 10n ** 18n,
      price: 3_000n * 10n ** 18n,
    }

    for (const record of uniV1Records) {
      it(`selects uniswap v1 when ${record.assetId} has more liquidity`, () => {
        const price = getEtherPrice([
          record,
          { ...baseV2Record, liquidity: (baseV2Record.liquidity * 99n) / 100n },
        ])
        expect(price).toEqual(4_000n * 10n ** 18n)
      })

      it(`selects uniswap v2 when ${record.assetId} has less liquidity`, () => {
        const price = getEtherPrice([
          record,
          {
            ...baseV2Record,
            liquidity: (baseV2Record.liquidity * 101n) / 100n,
          },
        ])
        expect(price).toEqual(3_000n * 10n ** 18n)
      })
    }

    it('ignores other assets', () => {
      const otherRecord = {
        blockNumber: 123n,
        assetId: AssetId('some-other-asset'),
        exchange: Exchange.uniswapV2('dai'),
        liquidity: 100000000n * 10n ** 18n,
        price: 4000n * 10n ** 6n,
      }
      const price = getEtherPrice([baseV2Record, otherRecord])
      expect(price).toEqual(3_000n * 10n ** 18n)
      expect(() => getEtherPrice([otherRecord])).toThrow()
    })
  })
})
