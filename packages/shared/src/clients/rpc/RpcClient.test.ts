import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { RpcClient } from './RpcClient'

describe(RpcClient.name, () => {
  describe(RpcClient.prototype.getLatestBlockNumber.name, () => {
    it('returns number of the block', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse(100),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.getLatestBlockNumber()

      expect(result).toEqual(100)
      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )
    })
  })

  describe(RpcClient.prototype.getBlock.name, () => {
    it('include tx bodies', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse(100),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.getBlockWithTransactions(100)

      expect(result).toEqual({
        transactions: [mockTx('0'), mockTx(undefined)],
        timestamp: 100,
        hash: '0xabcdef',
        number: 100,
        //@ts-expect-error type issue
        parentBeaconBlockRoot: '0x123',
      })

      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getBlockByNumber',
          params: ['0x64', true],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )
    })

    it('do not include tx bodies', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse(100),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.getBlock(100, false)

      expect(result).toEqual({
        timestamp: 100,
        hash: '0xabcdef',
        number: 100,
        parentBeaconBlockRoot: '0x123',
      })

      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getBlockByNumber',
          params: ['0x64', false],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )
    })
  })

  describe(RpcClient.prototype.getTransaction.name, () => {
    it('fetches tx from rpc and parsers response', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: mockRawTx('0x1'),
        }),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.getTransaction('0xabcd')

      expect(result).toEqual(mockTx('0x1'))

      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getTransactionByHash',
          params: ['0xabcd'],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )
    })
  })

  describe(RpcClient.prototype.getTransactionReceipt.name, () => {
    it('fetches tx receipt from rpc and parsers response', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: mockReceipt,
        }),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.getTransactionReceipt('0xabcd')

      expect(result).toEqual(mockReceipt)

      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getTransactionReceipt',
          params: ['0xabcd'],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )
    })
  })

  describe(RpcClient.prototype.getBalance.name, () => {
    it('returns balance for given address and block', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ result: '0x7B' }),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const address = EthereumAddress.random()
      const result = await rpc.getBalance(address, 'latest')

      expect(result).toEqual(BigInt(123))
      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )
    })
  })

  describe(RpcClient.prototype.call.name, () => {
    it('calls eth_call with correct parameters', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ result: '0x123abc' }),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.call(
        {
          to: EthereumAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
          data: Bytes.fromHex('0x70a08231'),
        },
        'latest',
      )

      expect(result).toEqual(Bytes.fromHex('0x123abc'))
      expect(http.fetch).toHaveBeenCalledTimes(1)

      expect(http.fetch).toHaveBeenCalledWith('API_URL', {
        body: JSON.stringify({
          method: 'eth_call',
          params: [
            {
              to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
              data: '0x70a08231',
            },
            'latest',
          ],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        timeout: 5000,
      })
    })

    it('handles numeric block numbers', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ result: '0x1' }),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      await rpc.call(
        {
          to: EthereumAddress('0x1234567890123456789012345678901234567890'),
          data: Bytes.fromHex('0x'),
        },
        12345678,
      )

      expect(http.fetch).toHaveBeenCalledWith('API_URL', {
        body: JSON.stringify({
          method: 'eth_call',
          params: [
            {
              to: '0x1234567890123456789012345678901234567890',
              data: '0x',
            },
            '0xbc614e',
          ],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        timeout: 5000,
      })
    })

    it('includes from address if provided', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ result: '0x' }),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      await rpc.call(
        {
          from: EthereumAddress('0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'),
          to: EthereumAddress('0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'),
          data: Bytes.fromHex('0x123456'),
        },
        'latest',
      )

      expect(http.fetch).toHaveBeenCalledWith('API_URL', {
        body: JSON.stringify({
          method: 'eth_call',
          params: [
            {
              to: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              from: '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa',
              data: '0x123456',
            },
            'latest',
          ],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        timeout: 5000,
      })
    })

    it('handles empty response', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ result: '0x' }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.call(
        {
          to: EthereumAddress('0x1234567890123456789012345678901234567890'),
          data: Bytes.fromHex('0x'),
        },
        'latest',
      )

      expect(result).toEqual(Bytes.fromHex('0x'))
    })
  })

  describe(RpcClient.prototype.batchCall.name, () => {
    it('batches multiple calls correctly and returns results in order', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => [
          { id: '0x1', result: '0x123abc' },
          { id: '0x3', result: '0x789abc' },
          { id: '0x2', result: '0x456def' },
        ],
      })

      const rpc = mockClient({
        http,
        generateId: mockFn()
          .returnsOnce('0x1')
          .returnsOnce('0x2')
          .returnsOnce('0x3'),
      })

      const calls = [
        {
          params: {
            to: EthereumAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
            data: Bytes.fromHex('0x70a08231'),
          },
          blockNumber: 'latest' as const,
        },
        {
          params: {
            to: EthereumAddress('0x1234567890123456789012345678901234567890'),
            data: Bytes.fromHex('0x'),
          },
          blockNumber: 12345678,
        },
        {
          params: {
            from: EthereumAddress('0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'),
            to: EthereumAddress('0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'),
            data: Bytes.fromHex('0x123456'),
          },
          blockNumber: 'latest' as const,
        },
      ]

      const result = await rpc.batchCall(calls)

      // Expected results in the order of the input calls
      expect(result).toEqual([
        Bytes.fromHex('0x123abc'),
        Bytes.fromHex('0x456def'),
        Bytes.fromHex('0x789abc'),
      ])

      // Verify that the HTTP fetch was called with the correct batch request
      expect(http.fetch).toHaveBeenCalledWith('API_URL', {
        body: JSON.stringify([
          {
            method: 'eth_call',
            params: [
              {
                to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                data: '0x70a08231',
              },
              'latest',
            ],
            id: '0x1',
            jsonrpc: '2.0',
          },
          {
            method: 'eth_call',
            params: [
              {
                to: '0x1234567890123456789012345678901234567890',
                data: '0x',
              },
              '0xbc614e', // Encoded block number 12345678
            ],
            id: '0x2',
            jsonrpc: '2.0',
          },
          {
            method: 'eth_call',
            params: [
              {
                to: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                from: '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa',
                data: '0x123456',
              },
              'latest',
            ],
            id: '0x3',
            jsonrpc: '2.0',
          },
        ]),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        timeout: 5000,
      })
    })
  })

  describe(RpcClient.prototype.query.name, () => {
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

  describe(RpcClient.prototype.batchQuery.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const queries = [
        ['a', 1, true],
        ['b', 2, true],
        ['c', 3, false],
      ]

      // Response from RPC can have different order of results
      const mockResponse = [
        { id: '0x2', result: 'two' },
        { id: '0x3', result: 'three' },
        { id: '0x1', result: 'one' },
      ]

      const http = mockObject<HttpClient>({
        fetch: async () => mockResponse,
      })

      const rpc = mockClient({
        http,
        generateId: mockFn()
          .returnsOnce('0x1')
          .returnsOnce('0x2')
          .returnsOnce('0x3'),
      })

      const result = await rpc.batchQuery('rpc_method', queries)

      const expectedResult = [
        { id: '0x1', result: 'one' },
        { id: '0x2', result: 'two' },
        { id: '0x3', result: 'three' },
      ]

      const expectedPayload = queries.map((params, index) => ({
        method: 'rpc_method',
        params,
        id: `0x${index + 1}`,
        jsonrpc: '2.0',
      }))

      expect(result).toEqual(expectedResult)
      expect(http.fetch).toHaveBeenOnlyCalledWith('API_URL', {
        body: JSON.stringify(expectedPayload),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        timeout: 5000,
      })
    })
  })

  describe(RpcClient.prototype.validateResponse.name, () => {
    it('returns false when response includes errors', async () => {
      const rpc = mockClient({})
      const validationInfo = rpc.validateResponse({
        error: {
          code: -32601,
          message:
            'the method eth_randomMethod does not exist/is not available',
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
  return new RpcClient({
    sourceName: 'chain',
    url: deps.url ?? 'API_URL',
    http: deps.http ?? mockObject<HttpClient>({}),
    callsPerMinute: 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    generateId: deps.generateId,
  })
}

const mockResponse = (blockNumber: number) => ({
  result: {
    transactions: [mockRawTx('0'), mockRawTx(undefined)],
    timestamp: `0x${blockNumber.toString(16)}`,
    hash: '0xabcdef',
    number: `0x${blockNumber.toString(16)}`,
    parentBeaconBlockRoot: '0x123',
  },
})

const mockRawTx = (to: string | undefined) => ({
  hash: `0x1`,
  from: '0xf',
  to,
  input: `0x1`,
  type: '0x2',
  blockNumber: '0x64',
  blobVersionedHashes: ['0x1', '0x2'],
})

const mockTx = (to: string | undefined) => ({
  hash: `0x1`,
  from: '0xf',
  to,
  data: `0x1`,
  type: '2',
  blockNumber: 100,
  blobVersionedHashes: ['0x1', '0x2'],
})

const mockReceipt = {
  logs: [{ topics: ['0xabcd', '0xdcba'], data: '0x1234' }],
}
