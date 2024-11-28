import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { Block, Transaction, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { RetryHandler } from '../../tools/RetryHandler'
import { HttpClient2 } from '../http/HttpClient2'
import { StarknetClient } from './StarknetClient'
import {
  StarknetErrorResponse,
  StarknetGetBlockResponse,
  StarknetGetBlockWithTxsResponse,
} from './types'

describe(StarknetClient.name, () => {
  describe(StarknetClient.prototype.getBlockWithTransactions.name, () => {
    it('fetches block from api and parsers response', async () => {
      const mockStarknetBlock: Block = {
        hash: '0xabcdef',
        number: 100,
        timestamp: UnixTime.now().toNumber(),
        transactions: [
          {
            type: 'INVOKE',
            data: ['0x1234'],
            hash: '0x1234',
            from: '0x1234',
          },
        ],
      }

      const http = mockObject<HttpClient2>({
        fetch: async () =>
          mockStarknetGetBlockWithTxsResponse(mockStarknetBlock),
      })

      const client = mockClient({ http })

      const result = await client.getBlockWithTransactions(100)

      expect(result).toEqual(mockStarknetBlock)
    })
  })

  describe(StarknetClient.prototype.getLatestBlockNumber.name, () => {
    it('returns number of the block', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockStarknetGetBlockResponse(100),
      })
      const client = mockClient({ http })

      const result = await client.getLatestBlockNumber()

      expect(result).toEqual(100)
    })
  })

  describe(StarknetClient.prototype.query.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => 'data-returned-from-api',
      })

      const client = mockClient({ http, generateId: () => '1' })

      const method = 'starknet_getBlockWithTxHashes'
      const params = [{ block_number: 100 }]

      const result = await client.query(method, params)

      expect(result).toEqual('data-returned-from-api')
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL', {
        method: 'POST',
        headers: {
          ['Content-Type']: 'application/json',
        },
        timeout: 30_000,
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: '1',
        }),
      })
    })
  })

  describe(StarknetClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', async () => {
      const client = mockClient({})
      const isValid = client.validateResponse({
        jsonrpc: '2.0',
        error: {
          code: 1,
          message: 'error',
        },
      } as StarknetErrorResponse)

      expect(isValid).toEqual({ success: false })
    })

    it('returns true otherwise', async () => {
      const client = mockClient({})
      const isValid = client.validateResponse(mockStarknetGetBlockResponse(100))

      expect(isValid).toEqual({ success: true })
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
  return new StarknetClient({
    url: deps.url ?? 'API_URL',
    generateId: deps.generateId,
    http: deps.http ?? mockObject<HttpClient2>({}),
    rateLimiter:
      deps.rateLimiter ?? new RateLimiter({ callsPerMinute: 100_000 }),
    retryHandler: deps.retryHandler ?? RetryHandler.TEST,
    logger: Logger.SILENT,
  })
}

const mockStarknetGetBlockResponse = (
  blockNumber: number,
): StarknetGetBlockResponse => ({
  jsonrpc: '2.0',
  id: 1,
  result: {
    block_number: blockNumber,
    timestamp: UnixTime.now().toNumber(),
    transactions: [],
  },
})

const mockStarknetGetBlockWithTxsResponse = (
  block: Block,
): StarknetGetBlockWithTxsResponse => ({
  jsonrpc: '2.0',
  id: 1,
  result: {
    block_number: block.number,
    timestamp: block.timestamp,
    block_hash: block.hash,
    transactions: block.transactions.map((tx: Transaction) => ({
      type: tx.type ?? '',
      calldata: tx.data ? (tx.data as string[]) : [],
      transaction_hash: tx.hash ?? '',
      sender_address: tx.from ?? '',
    })),
  },
})
