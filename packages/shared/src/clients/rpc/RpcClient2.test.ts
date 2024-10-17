import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import { RetryHandler } from '../../tools/RetryHandler'
import { HttpClient2 } from '../http/HttpClient2'
import { RpcClient2 } from './RpcClient2'

describe(RpcClient2.name, () => {
  describe(RpcClient2.prototype.getBlock.name, () => {
    it('fetches block from rpc are parsers response', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => mockResponse(100),
      })
      const rpc = mockClient({ http })

      const result = await rpc.getBlock(100)

      expect(result).toEqual({
        transactions: ['0x0', '0x1'],
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
        /"params":\["0x64",false\]/,
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
        /"params":\["latest",false\]/,
      )
    })
  })

  describe(RpcClient2.prototype.query.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          result: 'data-returned-from-api',
        }),
      })

      const rpc = mockClient({ http })

      const result = await rpc.query('rpc_method', ['a', 1, true])

      expect(result).toEqual('data-returned-from-api')
      expect(http.fetch).toHaveBeenCalledWith('API_URL', {
        body: expect.anything(),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
      })

      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(
        /"method":"rpc_method"/,
      )
      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(
        /"params":\["a",1,true\]/,
      )
      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(/"jsonrpc":"2.0"/)
    })

    it('throws when response cannot be parsed', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          wrongKey: 'error',
        }),
      })

      const rpc = mockClient({ http })

      await expect(
        async () => await rpc.query('rpc_method', []),
      ).toBeRejectedWith('Error during parsing of rpc response')
    })

    it('applies rate limiting', async () => {
      const rateLimiter = mockObject<RateLimiter>({
        //@ts-ignore
        call: async () => {},
      })
      const rpc = mockClient({ rateLimiter })
      await rpc.query('rpc_method', [])

      expect(rateLimiter.call).toHaveBeenCalledTimes(1)
    })

    it('retries on error', async () => {
      const http = mockObject<HttpClient2>({
        fetch: mockFn()
          .rejectsWithOnce(new Error())
          .resolvesToOnce(mockResponse(1)),
      })

      const rateLimiter = mockObject<RateLimiter>({
        call: async (fn) => fn(),
      })

      const retryHandler = mockObject<RetryHandler>({
        retry: async (fn) => fn(),
      })

      const rpc = mockClient({ http, rateLimiter, retryHandler })
      await rpc.query('rpc_method', [])

      expect(http.fetch).toHaveBeenCalledTimes(2)
      expect(retryHandler.retry).toHaveBeenCalledTimes(1)
      expect(rateLimiter.call).toHaveBeenCalledTimes(2)
    })
  })
})

function mockClient(deps: {
  url?: string
  http?: HttpClient2
  rateLimiter?: RateLimiter
  retryHandler?: RetryHandler
}) {
  return new RpcClient2({
    url: deps.url ?? 'API_URL',
    http:
      deps.http ??
      new HttpClient2({
        timeoutMs: 10_000,
        initialRetryDelayMs: 1000,
        maxRetries: 5, // 2 4 8 16 32 ~ 1min
        maxRetryDelayMs: Infinity,
      }),
    rateLimiter:
      deps.rateLimiter ?? new RateLimiter({ callsPerMinute: 100_000 }),
    retryHandler:
      deps.retryHandler ??
      new RetryHandler({
        timeoutMs: 1,
        initialRetryDelayMs: 1,
        maxRetries: 0,
        maxRetryDelayMs: Infinity,
        logger: Logger.SILENT,
      }),
    logger: Logger.SILENT,
  })
}

const mockResponse = (blockNumber: number) => ({
  result: {
    transactions: ['0x0', '0x1'],
    timestamp: `0x${blockNumber.toString(16)}`,
    hash: '0xabcdef',
    number: `0x${blockNumber.toString(16)}`,
  },
})
