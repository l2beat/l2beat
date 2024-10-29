import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import { RetryHandler } from '../../tools/RetryHandler'
import { HttpClient2 } from '../http/HttpClient2'
import { RpcClient2 } from './RpcClient2'

export const erc20Interface = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
])

describe(RpcClient2.name, () => {
  describe(RpcClient2.prototype.getBlockWithTransactions.name, () => {
    it('fetches block from rpc are parsers response', async () => {
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

  describe(RpcClient2.prototype.call.name, () => {
    it('calls eth_call with correct parameters', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          result: '0x123abc',
        }),
      })
      const rpc = mockClient({ http })

      const result = await rpc.call(
        {
          to: EthereumAddress('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
          data: Bytes.fromHex('0x70a08231'),
        },
        'latest',
      )

      expect(result).toEqual(Bytes.fromHex('0x123abc'))
      expect(http.fetch).toHaveBeenCalledTimes(1)
      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(
        /"method":"eth_call"/,
      )
      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(
        /"params":\[{"to":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","data":"0x70a08231"},"latest"\]/,
      )
    })

    it('handles numeric block numbers', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          result: '0x1',
        }),
      })
      const rpc = mockClient({ http })

      await rpc.call(
        {
          to: EthereumAddress('0x1234567890123456789012345678901234567890'),
          data: Bytes.fromHex('0x'),
        },
        12345678,
      )

      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(
        /"params":\[{"to":"0x1234567890123456789012345678901234567890","data":"0x"},"0xbc614e"\]/,
      )
    })

    it('includes from address if provided', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          result: '0x',
        }),
      })
      const rpc = mockClient({ http })

      await rpc.call(
        {
          from: EthereumAddress('0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'),
          to: EthereumAddress('0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'),
          data: Bytes.fromHex('0x123456'),
        },
        'latest',
      )

      //@ts-expect-error
      expect(http.fetch.calls[0].args[1]?.body).toMatchRegex(
        /"params":\[{"to":"0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB","from":"0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa","data":"0x123456"},"latest"\]/,
      )
    })

    it('handles empty response', async () => {
      const http = mockObject<HttpClient2>({
        fetch: async () => ({
          result: '0x',
        }),
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
      expect(http.fetch).toHaveBeenOnlyCalledWith(
        'API_URL',
        {
          body: expect.anything(),
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          redirect: 'follow',
        },
        5000,
      )

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
      const http = mockObject<HttpClient2>({
        fetch: async () => mockResponse(100),
      })
      const rateLimiter = mockObject<RateLimiter>({
        //@ts-ignore
        call: async () => {},
      })
      const rpc = mockClient({ http, rateLimiter })
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
  http: HttpClient2
  url?: string
  rateLimiter?: RateLimiter
  retryHandler?: RetryHandler
}) {
  return new RpcClient2({
    url: deps.url ?? 'API_URL',
    http: deps.http,
    rateLimiter:
      deps.rateLimiter ?? new RateLimiter({ callsPerMinute: 100_000 }),
    retryHandler: deps.retryHandler ?? RetryHandler.TEST,
    logger: Logger.SILENT,
    chain: 'chain',
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
