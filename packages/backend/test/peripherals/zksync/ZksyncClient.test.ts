import { HttpClient, Logger, mock } from '@l2beat/common'
import { expect } from 'earljs'
import { Response } from 'node-fetch'

import { ZksyncClient } from '../../../src/peripherals/zksync'

describe(ZksyncClient.name, () => {
  describe(ZksyncClient.prototype.getLatestBlock.name, () => {
    it('gets latest block', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              status: 'success',
              error: null,
              result: { blockNumber: 42 },
            }),
          ),
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)

      const result = await zksyncClient.getLatestBlock()
      expect(result).toEqual(42)
    })
  })

  describe(ZksyncClient.prototype.call.name, () => {
    it('throws for error responses', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({
              status: 'error',
              error: { errorType: 'type', code: 45, message: 'Oops!' },
              result: null,
            }),
          )
        },
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)
      await expect(zksyncClient.call('foo', { bar: '1234' })).toBeRejected(
        Error,
        'Oops!',
      )
    })

    it('throws for malformed responses', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ status: '', foo: 'bar' }))
        },
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)
      await expect(zksyncClient.call('foo', { bar: '1234' })).toBeRejected(
        TypeError,
        'Invalid Zksync response.',
      )
    })

    it('throws for http errors', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const zksyncClient = new ZksyncClient(httpClient, Logger.SILENT)
      await expect(zksyncClient.call('foo', { bar: '1234' })).toBeRejected(
        Error,
        'Http error 400: foo',
      )
    })
  })
})
