import type { HttpClient } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { DefiLlamaClient } from './DefiLlamaClient'

describe(DefiLlamaClient.name, () => {
  it('fetches and validates a protocol response', async () => {
    const response = {
      currentChainTvls: { Ethereum: 123 },
      chainTvls: {
        Ethereum: {
          tvl: [{ date: 1_700_000_000, totalLiquidityUSD: 120 }],
        },
      },
    }
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesTo(response),
    })
    const client = new DefiLlamaClient(httpClient, 'https://api.llama.fi/')

    const result = await client.getProtocol('uniswap-v3')

    expect(result).toEqual(response)
    expect(httpClient.fetch).toHaveBeenCalledWith(
      'https://api.llama.fi/protocol/uniswap-v3',
      {
        headers: { 'user-agent': 'L2BEAT DeFi TVL indexer' },
        timeout: 30_000,
      },
    )
  })

  it('rejects an invalid payload', async () => {
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesTo({ currentChainTvls: {} }),
    })
    const client = new DefiLlamaClient(httpClient, 'https://api.llama.fi')

    await expect(client.getProtocol('uniswap-v3')).toBeRejected()
  })
})
