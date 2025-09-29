import { Logger } from '@l2beat/backend-tools'
import { type Block, type Transaction, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { StarknetClient } from './StarknetClient'
import type {
  StarknetCallParameters,
  StarknetErrorResponse,
  StarknetGetBlockResponse,
  StarknetGetBlockWithTxsResponse,
} from './types'

describe(StarknetClient.name, () => {
  describe(StarknetClient.prototype.getBlockWithTransactions.name, () => {
    it('fetches block from api and parses response', async () => {
      const mockStarknetBlock: Block = {
        hash: '0xabcdef',
        logsBloom: 'UNSUPPORTED',
        number: 100,
        timestamp: UnixTime.now(),
        transactions: [
          {
            type: 'INVOKE',
            data: ['0x1234'],
            hash: '0x1234',
            from: '0x1234',
          },
        ],
      }

      const http = mockObject<HttpClient>({
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
      const http = mockObject<HttpClient>({
        fetch: async () => mockStarknetGetBlockResponse(100),
      })
      const client = mockClient({ http })

      const result = await client.getLatestBlockNumber()

      expect(result).toEqual(100)
    })
  })

  describe(StarknetClient.prototype.call.name, () => {
    it('sends call request and parses response', async () => {
      const params: StarknetCallParameters = {
        contract_address: '0x1234',
        entry_point_selector: '0x5678',
        calldata: [],
      }

      const rpcResult = ['0x1234', '0x5678']
      const http = mockObject<HttpClient>()

      const client = mockClient({ http })

      const mockQuery = mockFn().returns({
        jsonrpc: '2.0',
        id: 1,
        result: rpcResult,
      })
      client.query = mockQuery

      const result = await client.call(params, 100)

      expect(mockQuery).toHaveBeenCalledWith('starknet_call', [
        params,
        { block_number: 100 },
      ])

      expect(result).toEqual(rpcResult)
    })
  })

  describe(StarknetClient.prototype.query.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient>({
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
  http?: HttpClient
  url?: string
  generateId?: () => string
}) {
  return new StarknetClient({
    url: deps.url ?? 'API_URL',
    generateId: deps.generateId,
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    sourceName: 'test',
  })
}

const mockStarknetGetBlockResponse = (
  blockNumber: number,
): StarknetGetBlockResponse => ({
  jsonrpc: '2.0',
  id: 1,
  result: {
    block_number: blockNumber,
    timestamp: UnixTime.now(),
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
