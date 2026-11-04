import { Logger } from '@l2beat/backend-tools'
import type { Block } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { FuelClient } from './FuelClient'
import { tai64ToUnix } from './tai64ToUnix'
import type {
  FuelBlockHeaderResponse,
  FuelBlockResponse,
  FuelError,
  FuelLatestBlockHeaderResponse,
} from './types'

const TAI64_TIME = '4611686020155261080'

describe(FuelClient.name, () => {
  describe(FuelClient.prototype.getBlockWithTransactions.name, () => {
    it('fetches block from api and parses response', async () => {
      const mockTia64time = '4611686020155261080'

      const mockFuelBlock: Block = {
        hash: '0xabcdef',
        number: 100,
        logsBloom: 'UNSUPPORTED',
        timestamp: tai64ToUnix(mockTia64time),
        transactions: [
          {
            hash: '0x123',
          },
        ],
      }

      const http = mockObject<HttpClient>({
        fetch: async () => mockFuelBlockResponse(mockFuelBlock, mockTia64time),
      })

      const client = mockClient({ http })

      const result = await client.getBlockWithTransactions(100)

      expect(result).toEqual(mockFuelBlock)
    })
  })

  describe(FuelClient.prototype.getLatestBlockNumber.name, () => {
    it('returns number of the block', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => mockFuelLatestBlockHeaderResponse([100]),
      })
      const client = mockClient({ http })

      const result = await client.getLatestBlockNumber()

      expect(result).toEqual(100)
    })
  })

  describe(FuelClient.prototype.getBlockHeader.name, () => {
    it('reads only the height and time of a block', async () => {
      const client = mockClient({})
      const query = mockFn().resolvesTo(mockFuelBlockHeaderResponse(100))
      client.query = query

      const result = await client.getBlockHeader(100)

      expect(query).toHaveBeenOnlyCalledWith(
        expect.includes('block(height: $height)'),
        { height: '100' },
      )
      expect(query.calls[0]?.args[0]).not.toInclude('transactionIds')
      expect(result).toEqual({
        number: 100,
        timestamp: tai64ToUnix(TAI64_TIME),
      })
    })

    it('reads the latest block', async () => {
      const client = mockClient({})
      const query = mockFn().resolvesTo(
        mockFuelLatestBlockHeaderResponse([100]),
      )
      client.query = query

      const result = await client.getBlockHeader('latest')

      expect(query).toHaveBeenOnlyCalledWith(expect.includes('blocks(last: 1)'))
      expect(result).toEqual({
        number: 100,
        timestamp: tai64ToUnix(TAI64_TIME),
      })
    })

    it('throws when there is no latest block', async () => {
      const client = mockClient({})
      client.query = mockFn().resolvesTo(mockFuelLatestBlockHeaderResponse([]))

      await expect(client.getBlockHeader('latest')).toBeRejectedWith(
        'Latest block header: Error during parsing',
      )
    })

    it('throws on a malformed response', async () => {
      const client = mockClient({})
      client.query = mockFn().resolvesTo({ data: { block: null } })

      await expect(client.getBlockHeader(100)).toBeRejectedWith(
        'Block header: Error during parsing',
      )
    })
  })

  describe(FuelClient.prototype.query.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient>({
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

      expect(isValid).toEqual({ success: false })
    })

    it('returns true otherwise', async () => {
      const rpc = mockClient({})
      const isValid = rpc.validateResponse({
        data: 'success',
      })

      expect(isValid).toEqual({ success: true })
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  url?: string
  generateId?: () => string
}) {
  return new FuelClient({
    url: deps.url ?? 'API_URL',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    sourceName: 'test',
  })
}

const mockFuelBlockResponse = (
  block: Block,
  time: string,
): FuelBlockResponse => ({
  data: {
    block: {
      id: block.hash,
      height: block.number.toString(),
      header: {
        time,
      },
      transactionIds: block.transactions.map((t) => t.hash!),
    },
  },
})

const mockFuelBlockHeaderResponse = (
  height: number,
): FuelBlockHeaderResponse => ({
  data: {
    block: { height: height.toString(), header: { time: TAI64_TIME } },
  },
})

const mockFuelLatestBlockHeaderResponse = (
  heights: number[],
): FuelLatestBlockHeaderResponse => ({
  data: {
    blocks: {
      nodes: heights.map((height) => ({
        height: height.toString(),
        header: { time: TAI64_TIME },
      })),
    },
  },
})
