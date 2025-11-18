import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { HttpClient } from '../http/HttpClient'
import { MulticallV3Client } from './multicall/MulticallV3Client'
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
        logsBloom: `0x${'0'.repeat(512)}`,
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
        logsBloom: `0x${'0'.repeat(512)}`,
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
    it('fetches tx from rpc and parses response', async () => {
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
    it('fetches tx receipt from rpc and parses response', async () => {
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

  describe(RpcClient.prototype.getLogs.name, () => {
    it('fetches logs from rpc and parses response', async () => {
      const mockAddresses = [EthereumAddress.random(), EthereumAddress.random()]
      const mockTopics = ['0xabcd', '0xdcba']
      const mockFromBlock = 100
      const mockToBlock = 200

      const http = mockObject<HttpClient>({
        fetch: async () => ({
          result: [
            {
              address: mockAddresses[0],
              topics: mockTopics,
              blockNumber: `0x${mockFromBlock.toString(16)}`,
              blockHash: `0x${'0'.repeat(64)}`,
              transactionHash:
                '0x4c2480937b375524bc27d0068c82a47d3e4c086fb12d2b3c0ac2222042d0e596',
              data: '0xdata',
              logIndex: '0x12ab',
            },
          ],
        }),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.getLogs(
        mockFromBlock,
        mockToBlock,
        mockAddresses,
        mockTopics,
      )

      expect(result).toEqual([
        {
          address: mockAddresses[0],
          topics: mockTopics,
          blockNumber: mockFromBlock,
          blockHash: `0x${'0'.repeat(64)}`,
          transactionHash:
            '0x4c2480937b375524bc27d0068c82a47d3e4c086fb12d2b3c0ac2222042d0e596',
          data: '0xdata',
          logIndex: 0x12ab,
        },
      ])

      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getLogs',
          params: [
            {
              address: mockAddresses,
              topics: [mockTopics],
              fromBlock: `0x${mockFromBlock.toString(16)}`,
              toBlock: `0x${mockToBlock.toString(16)}`,
            },
          ],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )
    })

    it('splits in half when limit exceeded', async () => {
      const mockAddresses = [EthereumAddress.random(), EthereumAddress.random()]
      const mockTopics = ['0xabcd', '0xdcba']
      const mockFromBlock = 100
      const mockToBlock = 200
      const mockMiddleBlock = 150

      const http = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce({
            error: {
              code: -32602,
              message:
                'Log response size exceeded. You can make eth_getLogs requests with up to a 10,000 block range and no limit on the response size, or you can request any block range with a cap of 10K logs in the response. Based on your parameters and the response size limit, this block range should work: [0x148aa7a, 0x148aa86]',
            },
          })
          .resolvesToOnce({
            result: [
              {
                address: mockAddresses[0],
                topics: mockTopics,
                blockNumber: `0x${mockFromBlock.toString(16)}`,
                blockHash: `0x${'0'.repeat(64)}`,
                transactionHash:
                  '0x4c2480937b375524bc27d0068c82a47d3e4c086fb12d2b3c0ac2222042d0e596',
                data: '0xdata',
                logIndex: '0x12ab',
              },
            ],
          })
          .resolvesToOnce({
            result: [
              {
                address: mockAddresses[1],
                topics: mockTopics,
                blockNumber: `0x${mockFromBlock.toString(16)}`,
                blockHash: `0x${'0'.repeat(64)}`,
                transactionHash:
                  '0x4c2480937b375524bc27d0068c82a47d3e4c086fb12d2b3c0ac2222042d0e596',
                data: '0xdata',
                logIndex: '0x34cd',
              },
            ],
          }),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      const result = await rpc.getLogs(
        mockFromBlock,
        mockToBlock,
        mockAddresses,
        mockTopics,
      )

      expect(http.fetch.calls[0].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getLogs',
          params: [
            {
              address: mockAddresses,
              topics: [mockTopics],
              fromBlock: `0x${mockFromBlock.toString(16)}`,
              toBlock: `0x${mockToBlock.toString(16)}`,
            },
          ],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )

      expect(http.fetch.calls[1].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getLogs',
          params: [
            {
              address: mockAddresses,
              topics: [mockTopics],
              fromBlock: `0x${mockFromBlock.toString(16)}`,
              toBlock: `0x${mockMiddleBlock.toString(16)}`,
            },
          ],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )

      expect(http.fetch.calls[2].args[1]?.body).toEqual(
        JSON.stringify({
          method: 'eth_getLogs',
          params: [
            {
              address: mockAddresses,
              topics: [mockTopics],
              fromBlock: `0x${(mockMiddleBlock + 1).toString(16)}`,
              toBlock: `0x${mockToBlock.toString(16)}`,
            },
          ],
          id: 'unique-id',
          jsonrpc: '2.0',
        }),
      )

      expect(result).toEqualUnsorted([
        {
          address: mockAddresses[0],
          topics: mockTopics,
          blockNumber: mockFromBlock,
          blockHash: `0x${'0'.repeat(64)}`,
          transactionHash:
            '0x4c2480937b375524bc27d0068c82a47d3e4c086fb12d2b3c0ac2222042d0e596',
          data: '0xdata',
          logIndex: 0x12ab,
        },
        {
          address: mockAddresses[1],
          topics: mockTopics,
          blockNumber: mockFromBlock,
          blockHash: `0x${'0'.repeat(64)}`,
          transactionHash:
            '0x4c2480937b375524bc27d0068c82a47d3e4c086fb12d2b3c0ac2222042d0e596',
          data: '0xdata',
          logIndex: 0x34cd,
        },
      ])
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
        timeout: 10_000,
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
        timeout: 10_000,
      })
    })

    it('includes from address if provided', async () => {
      const http = mockObject<HttpClient>({
        fetch: async () => ({ result: '0x' }),
      })
      const rpc = mockClient({ http, generateId: () => 'unique-id' })

      await rpc.call(
        {
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
        timeout: 10_000,
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

  describe(RpcClient.prototype.isMulticallDeployed.name, () => {
    it('returns true when multicall client is configured and block number is after deployment', () => {
      const multicallClient = new MulticallV3Client(
        EthereumAddress.random(),
        1000,
        3,
      )

      const rpc = new RpcClient({
        chain: 'chain',
        url: 'API_URL',
        http: mockObject<HttpClient>({}),
        callsPerMinute: 100_000,
        retryStrategy: 'TEST',
        logger: Logger.SILENT,
        multicallClient,
      })

      expect(rpc.isMulticallDeployed(1000)).toEqual(true)
      expect(rpc.isMulticallDeployed(1001)).toEqual(true)
    })

    it('returns false when multicall client is configured but block number is before deployment', () => {
      const multicallClient = new MulticallV3Client(
        EthereumAddress.random(),
        1000,
        3,
      )

      const rpc = new RpcClient({
        chain: 'chain',
        url: 'API_URL',
        http: mockObject<HttpClient>({}),
        callsPerMinute: 100_000,
        retryStrategy: 'TEST',
        logger: Logger.SILENT,
        multicallClient,
      })

      expect(rpc.isMulticallDeployed(999)).toEqual(false)
    })

    it('returns false when multicall client is not configured', () => {
      const rpc = new RpcClient({
        chain: 'chain',
        url: 'API_URL',
        http: mockObject<HttpClient>({}),
        callsPerMinute: 100_000,
        retryStrategy: 'TEST',
        logger: Logger.SILENT,
      })

      expect(rpc.isMulticallDeployed(1000)).toEqual(false)
    })
  })

  describe(RpcClient.prototype.multicall.name, () => {
    it('throws error when multicall client is not configured', async () => {
      const rpc = new RpcClient({
        chain: 'chain',
        url: 'API_URL',
        http: mockObject<HttpClient>({}),
        callsPerMinute: 100_000,
        retryStrategy: 'TEST',
        logger: Logger.SILENT,
      })

      const calls = [
        {
          to: EthereumAddress.random(),
          data: Bytes.fromHex('0x123456'),
        },
      ]

      await expect(rpc.multicall(calls, 1000)).toBeRejectedWith(
        'Multicall not configured for block 1000',
      )
    })

    it('throws error when block number is before multicall deployment', async () => {
      const multicallClient = new MulticallV3Client(
        EthereumAddress.random(),
        1000,
        3,
      )

      const rpc = new RpcClient({
        chain: 'chain',
        url: 'API_URL',
        http: mockObject<HttpClient>({}),
        callsPerMinute: 100_000,
        retryStrategy: 'TEST',
        logger: Logger.SILENT,
        multicallClient,
      })

      const calls = [
        {
          to: EthereumAddress.random(),
          data: Bytes.fromHex('0x123456'),
        },
      ]

      await expect(rpc.multicall(calls, 999)).toBeRejectedWith(
        'Multicall not configured for block 999',
      )
    })

    it('processes calls in batches and returns combined results', async () => {
      const multicallAddress = EthereumAddress.random()
      const multicallClient = new MulticallV3Client(
        multicallAddress,
        1000,
        2, // Small batch size to test batching
      )

      const encodeBatchesMock = mockFn().returns([
        {
          to: multicallAddress,
          data: Bytes.fromHex('0xaaaaaa'),
        },
        {
          to: multicallAddress,
          data: Bytes.fromHex('0xbbbbbb'),
        },
      ])
      multicallClient.encodeBatches = encodeBatchesMock

      const decodeMock = mockFn()
        .returnsOnce([
          { success: true, data: Bytes.fromHex('0x111') },
          { success: true, data: Bytes.fromHex('0x222') },
        ])
        .returnsOnce([{ success: true, data: Bytes.fromHex('0x333') }])
      multicallClient.decode = decodeMock

      const http = mockObject<HttpClient>({
        fetch: mockFn()
          .returnsOnce({ result: '0x123456' })
          .returnsOnce({ result: '0x654321' }),
      })

      const rpc = new RpcClient({
        chain: 'chain',
        url: 'API_URL',
        http,
        callsPerMinute: 100_000,
        retryStrategy: 'TEST',
        logger: Logger.SILENT,
        multicallClient,
      })

      const calls = [
        {
          to: EthereumAddress.random(),
          data: Bytes.fromHex('0x111'),
        },
        {
          to: EthereumAddress.random(),
          data: Bytes.fromHex('0x222'),
        },
        {
          to: EthereumAddress.random(),
          data: Bytes.fromHex('0x333'),
        },
      ]

      const result = await rpc.multicall(calls, 1500)

      expect(encodeBatchesMock).toHaveBeenCalledWith(calls)

      expect(http.fetch).toHaveBeenCalledTimes(2)

      expect(decodeMock).toHaveBeenCalledTimes(2)
      expect(decodeMock).toHaveBeenNthCalledWith(1, Bytes.fromHex('0x123456'))
      expect(decodeMock).toHaveBeenNthCalledWith(2, Bytes.fromHex('0x654321'))

      expect(result).toEqual([
        { success: true, data: Bytes.fromHex('0x111') },
        { success: true, data: Bytes.fromHex('0x222') },
        { success: true, data: Bytes.fromHex('0x333') },
      ])
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
            to: EthereumAddress('0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'),
            data: Bytes.fromHex('0x123456'),
          },
          blockNumber: 'latest' as const,
        },
      ]

      const result = await rpc.batchCall(calls)

      expect(result).toEqual([
        Bytes.fromHex('0x123abc'),
        Bytes.fromHex('0x456def'),
        Bytes.fromHex('0x789abc'),
      ])

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
        timeout: 10_000,
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
        timeout: 10_000,
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
        timeout: 10_000,
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
    chain: 'chain',
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
    logsBloom: `0x${'0'.repeat(512)}`,
    number: `0x${blockNumber.toString(16)}`,
    parentBeaconBlockRoot: '0x123',
  },
})

const mockRawTx = (to: string | undefined) => ({
  hash: '0x1',
  value: 11111111n.toString(),
  from: '0xf',
  to,
  input: '0x1',
  type: '0x2',
  blockNumber: '0x64',
  blobVersionedHashes: ['0x1', '0x2'],
})

const mockTx = (to: string | undefined) => ({
  hash: '0x1',
  value: 11111111n,
  from: '0xf',
  to,
  data: '0x1',
  type: '2',
  blockNumber: 100,
  blobVersionedHashes: ['0x1', '0x2'],
})

const mockReceipt = {
  logs: [{ topics: ['0xabcd', '0xdcba'], data: '0x1234' }],
}
