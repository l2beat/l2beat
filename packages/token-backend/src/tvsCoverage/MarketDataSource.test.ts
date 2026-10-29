import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import type { CoinMarketData } from '../chains/clients/coingecko/types'
import { MarketDataSource } from './MarketDataSource'

describe(MarketDataSource.name, () => {
  it('prefers the interop price and takes circulating supply from CoinGecko', async () => {
    const source = new MarketDataSource(
      database(new Map([[0, 2]])),
      { getCoinsMarketData: mockFn().resolvesTo([market('a', 3, 100)]) },
      Logger.SILENT,
    )

    expect(await source.getMarketData(['a'], [])).toEqual(
      new Map([
        [
          'a',
          {
            priceUsd: 2,
            circulatingSupply: 100,
            circulatingSupplyUnknown: false,
          },
        ],
      ]),
    )
  })

  it('treats a zero circulating supply as unknown', async () => {
    const source = new MarketDataSource(
      database(new Map()),
      { getCoinsMarketData: mockFn().resolvesTo([market('a', 3, 0)]) },
      Logger.SILENT,
    )

    expect(await source.getMarketData(['a'], [])).toEqual(
      new Map([
        [
          'a',
          {
            priceUsd: 3,
            circulatingSupply: undefined,
            circulatingSupplyUnknown: true,
          },
        ],
      ]),
    )
  })

  it('prices from CoinGecko when the interop price query fails', async () => {
    const source = new MarketDataSource(
      mockObject<Database>({
        interopRecentPrices: mockObject<Database['interopRecentPrices']>({
          getClosestPricesAtOrBefore: mockFn().rejectsWith(
            new Error('timeout'),
          ),
        }),
      }),
      { getCoinsMarketData: mockFn().resolvesTo([market('a', 3, 100)]) },
      Logger.SILENT,
    )
    const warnings: string[] = []

    expect(await source.getMarketData(['a'], warnings)).toEqual(
      new Map([
        [
          'a',
          {
            priceUsd: 3,
            circulatingSupply: 100,
            circulatingSupplyUnknown: false,
          },
        ],
      ]),
    )
    expect(warnings).toEqual(['Reading interop prices failed: timeout'])
  })

  it('retries a failed batch once', async () => {
    const getCoinsMarketData = mockFn<[string[]], Promise<CoinMarketData[]>>()
      .rejectsWithOnce(new Error('fetch failed'))
      .resolvesToOnce([market('a', 3, 100)])
    const source = new MarketDataSource(
      database(new Map()),
      { getCoinsMarketData },
      Logger.SILENT,
    )
    const warnings: string[] = []

    expect(await source.getMarketData(['a'], warnings)).toEqual(
      new Map([
        [
          'a',
          {
            priceUsd: 3,
            circulatingSupply: 100,
            circulatingSupplyUnknown: false,
          },
        ],
      ]),
    )
    expect(warnings).toEqual([])
  })

  it('treats a coin missing from the CoinGecko response as unknown supply', async () => {
    const source = new MarketDataSource(
      database(new Map([[0, 2]])),
      { getCoinsMarketData: mockFn().resolvesTo([]) },
      Logger.SILENT,
    )

    expect(await source.getMarketData(['a'], [])).toEqual(
      new Map([
        [
          'a',
          {
            priceUsd: 2,
            circulatingSupply: undefined,
            circulatingSupplyUnknown: true,
          },
        ],
      ]),
    )
  })

  it('falls back to CoinGecko prices and reports a failed batch', async () => {
    const ids = Array.from({ length: 101 }, (_, i) => `id-${i}`)
    const getCoinsMarketData = mockFn<[string[]], Promise<CoinMarketData[]>>()
      .resolvesToOnce([market('id-0', 5, undefined)])
      .rejectsWithOnce(new Error('429'))
      .rejectsWithOnce(new Error('429'))
    const source = new MarketDataSource(
      database(new Map()),
      { getCoinsMarketData },
      Logger.SILENT,
    )

    const warnings: string[] = []
    const result = await source.getMarketData(ids, warnings)

    expect(getCoinsMarketData).toHaveBeenCalledTimes(3)
    expect(result.get('id-0')).toEqual({
      priceUsd: 5,
      circulatingSupply: undefined,
      circulatingSupplyUnknown: true,
    })
    expect(result.get('id-100')).toEqual({
      priceUsd: undefined,
      circulatingSupply: undefined,
      circulatingSupplyUnknown: true,
    })
    expect(warnings).toEqual([
      'Reading CoinGecko markets for 1 ids failed: 429',
    ])
  })
})

function database(prices: Map<number, number>) {
  return mockObject<Database>({
    interopRecentPrices: mockObject<Database['interopRecentPrices']>({
      getClosestPricesAtOrBefore: mockFn().resolvesTo(prices),
    }),
  })
}

function market(
  id: string,
  price: number,
  circulatingSupply: number | undefined,
): CoinMarketData {
  return {
    id,
    current_price: price,
    circulating_supply: circulatingSupply ?? null,
  }
}
