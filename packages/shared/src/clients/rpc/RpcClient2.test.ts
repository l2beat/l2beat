import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import { HttpClient2 } from '../http/HttpClient2'
import { RpcClient2 } from './RpcClient2'

describe(RpcClient2.name, () => {
  describe(RpcClient2.prototype.getBlock.name, () => {
    it('fetches block from rpc are parsers response', async () => {
      const { rpc, http } = createClients(100)

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
      const { rpc, http } = createClients(100)

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

      const rpc = new RpcClient2({
        http,
        logger: Logger.SILENT,
        url: 'API_URL',
      })

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

      const rpc = new RpcClient2({
        http,
        logger: Logger.SILENT,
        url: 'API_URL',
      })

      await expect(
        async () => await rpc.query('rpc_method', []),
      ).toBeRejectedWith('Error during parsing of rpc response')
    })
  })
})

function createClients(blockNumber: number) {
  const http = mockObject<HttpClient2>({
    fetch: async () => mockResponse(blockNumber),
  })

  const rpc = new RpcClient2({
    http,
    logger: Logger.SILENT,
    url: 'API_URL',
    callsPerMinute: 100_000,
  })
  return { rpc, http }
}

const mockResponse = (blockNumber: number) => ({
  result: {
    transactions: ['0x0', '0x1'],
    timestamp: `0x${blockNumber.toString(16)}`,
    hash: '0xabcdef',
    number: `0x${blockNumber.toString(16)}`,
  },
})
