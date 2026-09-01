import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { CoingeckoClient } from './CoingeckoClient'

describe(CoingeckoClient.name, () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('constructs the public coin list request without an API key', async () => {
    const fetch = mockFetch([
      {
        id: 'usd-coin',
        symbol: 'usdc',
        name: 'USD Coin',
        platforms: { ethereum: '0x1234' },
      },
    ])
    const client = new CoingeckoClient({ callsPerMinute: 100_000 })

    const result = await client.getCoinList({ includePlatform: true })

    expect(result).toEqual([
      {
        id: 'usd-coin',
        symbol: 'usdc',
        name: 'USD Coin',
        platforms: { ethereum: '0x1234' },
      },
    ])
    expect(fetch.calls[0]?.args[0]).toEqual(
      'https://api.coingecko.com/api/v3/coins/list?include_platform=true',
    )
    expect(fetch.calls[0]?.args[1]).toEqual({ headers: {} })
  })

  it('constructs the pro coin data request with an API key', async () => {
    const fetch = mockFetch({
      id: 'usd-coin',
      symbol: 'usdc',
      image: { large: 'https://example.com/usdc.png' },
      platforms: {},
    })
    const client = new CoingeckoClient({
      apiKey: 'my-api-key',
      callsPerMinute: 100_000,
    })

    await client.getCoinDataById('usd-coin')

    expect(fetch.calls[0]?.args[0]).toEqual(
      'https://pro-api.coingecko.com/api/v3/coins/usd-coin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false',
    )
    expect(fetch.calls[0]?.args[1]).toEqual({
      headers: { 'x-cg-pro-api-key': 'my-api-key' },
    })
  })

  it('constructs the market chart range request', async () => {
    const fetch = mockFetch({
      prices: [[1592611200000, 228.9]],
      market_caps: [[1592611200000, 25_534_271_650]],
      total_volumes: [],
    })
    const client = new CoingeckoClient({ callsPerMinute: 100_000 })

    const result = await client.getCoinMarketChartRange(
      'ethereum',
      'usd',
      UnixTime(1592577232),
      UnixTime(1622577232),
    )

    expect(fetch.calls[0]?.args[0]).toEqual(
      'https://api.coingecko.com/api/v3/coins/ethereum/market_chart/range?vs_currency=usd&from=2020-06-19&to=2021-06-01',
    )
    expect(result).toEqual({
      prices: [{ date: new Date(1592611200000), value: 228.9 }],
      marketCaps: [{ date: new Date(1592611200000), value: 25_534_271_650 }],
    })
  })

  it('throws on a failed CoinGecko response', async () => {
    mockFetch(
      { error: 'too many requests' },
      { ok: false, status: 429, statusText: 'Too Many Requests' },
    )
    const client = new CoingeckoClient({ callsPerMinute: 100_000 })

    await expect(client.getCoinDataById('usd-coin')).toBeRejectedWith(
      'CoinGecko API error: 429 Too Many Requests',
    )
  })

  it('rejects a non-positive rate limit', () => {
    expect(() => new CoingeckoClient({ callsPerMinute: 0 })).toThrow(
      'CoinGecko callsPerMinute must be a positive integer',
    )
  })
})

function mockFetch(
  data: unknown,
  options?: { ok?: boolean; status?: number; statusText?: string },
) {
  const fetch = mockFn().resolvesTo({
    ok: options?.ok ?? true,
    status: options?.status ?? 200,
    statusText: options?.statusText ?? 'OK',
    json: async () => data,
  })
  globalThis.fetch = fetch as unknown as typeof globalThis.fetch
  return fetch
}
