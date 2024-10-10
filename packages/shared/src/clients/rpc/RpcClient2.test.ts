import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import { HttpClient2 } from '../http/HttpClient2'
import { RpcClient2 } from './RpcClient2'

describe(RpcClient2.name, () => {
  describe(RpcClient2.prototype.getBlock.name, () => {})
  describe(RpcClient2.prototype.getBlockNumber.name, () => {})
  describe(RpcClient2.prototype.getBlockNumberAtOrBefore.name, () => {})
  describe(RpcClient2.prototype.query.name, () => {
    it('calls http client with correct params and returns data', async () => {
      const http = mockObject<HttpClient2>({
        fetchJson: async () => ({
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
      expect(http.fetchJson).toHaveBeenCalledWith('API_URL', {
        body: expect.anything(),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
      })

      //@ts-expect-error
      expect(http.fetchJson.calls[0].args[1]?.body).toMatchRegex(
        /"method":"rpc_method"/,
      )
      //@ts-expect-error
      expect(http.fetchJson.calls[0].args[1]?.body).toMatchRegex(
        /"params":\["a",1,true\]/,
      )
      //@ts-expect-error
      expect(http.fetchJson.calls[0].args[1]?.body).toMatchRegex(
        /"jsonrpc":"2.0"/,
      )
    })

    it('throws when response cannot be parsed', async () => {
      const http = mockObject<HttpClient2>({
        fetchJson: async () => ({
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
