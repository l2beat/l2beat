import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import { RetryHandler } from '../../tools/RetryHandler'
import { HttpClient2 } from '../http/HttpClient2'
import { FuelClient } from './FuelClient'
import { tai64ToUnix } from './tai64ToUnix'
import {
  FuelBlock,
  FuelBlockResponse,
  FuelError,
  FuelLatestBlockNumberResponse,
} from './types'

describe(FuelClient.name, () => {
  describe(FuelClient.prototype.getBlock.name, () => {
    it('fetches block from api and parsers response', async () => {
      const mockTia64time = '4611686020155261080'

      const mockFuelBlock: FuelBlock = {
        id: '0xabcdef',
        height: 100,
        transactionsCount: 2,
        timestamp: tai64ToUnix(mockTia64time),
      }

      const http = mockObject<HttpClient2>({
        fetch: async () => mockFuelBlockResponse(mockFuelBlock, mockTia64time),
      })

      const client = mockClient({ http })

      const result = await client.getBlock(100)

      expect(result).toEqual(mockFuelBlock)
    })
  })

  describe(FuelClient.prototype.getLatestBlockNumber.name, () => {
    it('returns number of the block', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockFuelLatestBlockNumberResponse(100),
      })
      const client = mockClient({ http })

      const result = await client.getLatestBlockNumber()

      expect(result).toEqual(100)
    })
  })

  describe(FuelClient.prototype.query.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => 'data-returned-from-api',
      })

      const client = mockClient({ http })

      const query = 'gql_query'
      const variables = { a: 'a', b: 1, c: true }

      const result = await client.query(query, variables)

      expect(result).toEqual('data-returned-from-api')
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        redirect: 'follow',
        timeout: 10_000,
      })
    })
  })

  describe(FuelClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', async () => {
      const client = mockClient({})
      const isValid = client.validateResponse({
        errors: [
          {
            message: 'Error',
          },
        ],
      } as FuelError)

      expect(isValid).toEqual(false)
    })

    it('returns true otherwise', async () => {
      const rpc = mockClient({})
      const isValid = rpc.validateResponse({
        data: 'success',
      })

      expect(isValid).toEqual(true)
    })
  })
})

function mockClient(deps: {
  http?: HttpClient2
  url?: string
  rateLimiter?: RateLimiter
  retryHandler?: RetryHandler
  generateId?: () => string
}) {
  return new FuelClient({
    url: deps.url ?? 'API_URL',
    http: deps.http ?? mockObject<HttpClient2>({}),
    rateLimiter:
      deps.rateLimiter ?? new RateLimiter({ callsPerMinute: 100_000 }),
    retryHandler: deps.retryHandler ?? RetryHandler.TEST,
    logger: Logger.SILENT,
  })
}

const mockFuelBlockResponse = (
  block: FuelBlock,
  time: string,
): FuelBlockResponse => ({
  data: {
    block: {
      id: block.id,
      height: block.height.toString(),
      header: {
        transactionsCount: block.transactionsCount.toString(),
        time,
      },
    },
  },
})

const mockFuelLatestBlockNumberResponse = (
  height: number,
): FuelLatestBlockNumberResponse => ({
  data: {
    blocks: {
      nodes: [
        {
          height: height.toString(),
        },
      ],
    },
  },
})
