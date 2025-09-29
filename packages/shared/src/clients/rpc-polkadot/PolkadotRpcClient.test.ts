import { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { PolkadotRpcClient } from './PolkadotRpcClient'

describe(PolkadotRpcClient.name, () => {
  describe(PolkadotRpcClient.prototype.getLatestBlockNumber.name, () => {
    it('returns the latest block number', async () => {
      const mockBlockNumber = '0x12345'
      const mockResponse = mockBlockResponse({
        header: { number: mockBlockNumber },
      })

      const http = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({ result: '0x00001' })
          .resolvesToOnce(mockResponse),
      })

      const rpc = mockClient({ http, generateId: () => 'unique-id' })
      const result = await rpc.getLatestBlockNumber()

      expect(result).toEqual(Number(mockBlockNumber))
    })
  })

  describe(PolkadotRpcClient.prototype.getBlockWithTransactions.name, () => {
    it('returns block with transactions for a specific block number', async () => {
      const mockBlockNumber = '0x12345'
      const mockResponse = mockBlockResponse({
        header: { number: mockBlockNumber },
      })
      const mockBlockHash = '0x00001'

      const http = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({ result: mockBlockHash })
          .resolvesToOnce(mockResponse),
      })

      const rpc = mockClient({ http, generateId: () => 'unique-id' })
      const result = await rpc.getBlockWithTransactions(+mockBlockNumber)

      const expectedTimestamp = PolkadotRpcClient.calculateAvailTimestamp(
        +mockBlockNumber,
      )

      expect(result).toEqual({
        number: +mockBlockNumber,
        hash: 'UNSUPPORTED',
        logsBloom: 'UNSUPPORTED',
        timestamp: expectedTimestamp,
        transactions: [],
      })
    })

    it('returns block with transactions for the latest block', async () => {
      const mockBlockNumber = '0x12345'
      const mockResponse = mockBlockResponse({
        header: { number: mockBlockNumber },
      })
      const mockBlockHash = '0x00001'

      const http = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({ result: mockBlockHash })
          .resolvesToOnce(mockResponse),
      })

      const rpc = mockClient({ http, generateId: () => 'unique-id' })
      const result = await rpc.getBlockWithTransactions('latest')

      const expectedTimestamp = PolkadotRpcClient.calculateAvailTimestamp(
        +mockBlockNumber,
      )

      expect(result).toEqual({
        number: +mockBlockNumber,
        hash: 'UNSUPPORTED',
        logsBloom: 'UNSUPPORTED',
        timestamp: expectedTimestamp,
        transactions: [],
      })
    })
  })

  describe(PolkadotRpcClient.prototype.getBlock.name, () => {
    it('get latest block', async () => {
      const mockBlockHash = '0xhash'
      const mockResponse = mockBlockResponse()

      const http = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            result: mockBlockHash,
          })
          .resolvesToOnce(mockResponse),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.getBlock()

      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'chain_getBlockHash',
          params: [],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )

      expect(http.fetch.calls[1].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'chain_getBlock',
          params: [mockBlockHash],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )

      expect(result).toEqual(mockResponse.result.block)
    })

    it('get specific block', async () => {
      const mockBlockHash = '0xhash'
      const mockBlockNumber = 123
      const mockResponse = mockBlockResponse()

      const http = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            result: mockBlockHash,
          })
          .resolvesToOnce(mockResponse),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.getBlock(mockBlockNumber)

      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'chain_getBlockHash',
          params: [mockBlockNumber],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )

      expect(http.fetch.calls[1].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'chain_getBlock',
          params: [mockBlockHash],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )

      expect(result).toEqual(mockResponse.result.block)
    })
  })

  describe(PolkadotRpcClient.prototype.query.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => 'data-returned-from-api',
      })

      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.query('rpc_method', ['a', 1, true])

      expect(result).toEqual('data-returned-from-api')
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL', {
        body: JSON.stringify({
          method: 'rpc_method',
          params: ['a', 1, true],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        timeout: 5000,
      })
    })
  })

  describe(PolkadotRpcClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', async () => {
      const rpc = mockClient({})
      const validationInfo = rpc.validateResponse({
        error: {
          code: -32601,
          message: 'message',
          data: 'data',
        },
      })

      expect(validationInfo.success).toEqual(false)
    })

    it('returns true otherwise', async () => {
      const rpc = mockClient({})
      const validationInfo = rpc.validateResponse({
        result: 'success',
      })

      expect(validationInfo.success).toEqual(true)
    })
  })
})

function mockClient(deps: {
  http?: HttpClient
  url?: string
  generateId?: () => string
}) {
  return new PolkadotRpcClient({
    sourceName: 'chain',
    url: deps.url ?? 'API_URL',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    generateId: deps.generateId,
  })
}

function mockBlockResponse(overrides?: Partial<any>) {
  const defaultResponse = {
    result: {
      block: {
        header: {
          parentHash: '0x123',
          number: '0x12345',
          stateRoot: '0x123',
          extrinsicsRoot: '0x123',
          extension: {
            V3: {
              appLookup: {
                size: 123,
                index: [
                  {
                    appId: 1,
                    start: 2,
                  },
                ],
              },
              commitment: {
                rows: 1,
                cols: 1,
                commitment: [],
                dataRoot: '0x123',
              },
            },
          },
        },
        extrinsics: ['0x123', '0x456'],
      },
    },
  }

  return { ...defaultResponse, ...overrides }
}
