import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import { RetryHandler } from '../../tools/RetryHandler'
import { HttpClient2 } from '../http/HttpClient2'
import { RpcClient2 } from './RpcClient2'

describe(RpcClient2.name, () => {
  describe(RpcClient2.prototype.getBlockWithTransactions.name, () => {
    it('fetches block from rpc and parsers response', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockResponse(100),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getBlockWithTransactions(100)

      expect(result).toEqual({
        transactions: [mockTx('0'), mockTx(null)],
        timestamp: 100,
        hash: '0xabcdef',
        number: 100,
      })

      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(
        /"method":"eth_getBlockByNumber"/,
      )
      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(
        /"params":\["0x64",true\]/,
      )
    })
  })

  describe(RpcClient2.prototype.getLatestBlockNumber.name, () => {
    it('returns number of the block', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockResponse(100),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getLatestBlockNumber()

      expect(result).toEqual(100)
      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(
        /"params":\["latest",true\]/,
      )
    })
  })

  describe(RpcClient2.prototype.query.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient2>({
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

  describe(RpcClient2.prototype.validateResponse.name, () => {
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
  http?: HttpClient2
  url?: string
  rateLimiter?: RateLimiter
  retryHandler?: RetryHandler
  generateId?: () => string
}) {
  return new RpcClient2({
    chain: 'chain',
    url: deps.url ?? 'API_URL',
    http: deps.http ?? mockObject<HttpClient2>({}),
    rateLimiter:
      deps.rateLimiter ?? new RateLimiter({ callsPerMinute: 100_000 }),
    retryHandler: deps.retryHandler ?? RetryHandler.TEST,
    logger: Logger.SILENT,
    generateId: deps.generateId,
  })
}

const mockResponse = (blockNumber: number) => ({
  result: {
    transactions: [mockRawTx('0'), mockRawTx(null)],
    timestamp: `0x${blockNumber.toString(16)}`,
    hash: '0xabcdef',
    number: `0x${blockNumber.toString(16)}`,
  },
})

const mockRawTx = (to: string | null) => ({
  hash: `0x1`,
  from: '0xf',
  to,
  input: `0x1`,
  type: '0x2',
})

const mockTx = (to: string | null) => ({
  hash: `0x1`,
  from: '0xf',
  to,
  data: `0x1`,
  type: 2,
})
