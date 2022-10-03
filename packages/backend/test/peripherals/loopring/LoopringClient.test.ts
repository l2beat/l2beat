import { HttpClient, Logger, mock } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'
import { Response } from 'node-fetch'

import { LoopringClient } from '../../../src/peripherals/loopring'

describe(LoopringClient.name, () => {
  describe(LoopringClient.prototype.getBlock.name, () => {
    it('gets block', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              blockId: 42,
              createdAt: 1000,
              transactions: [{ txType: 'foo' }],
            }),
          ),
      })
      const loopringClient = new LoopringClient(httpClient, Logger.SILENT)

      const result = await loopringClient.getBlock(42)
      expect(result).toEqual({
        blockId: 42,
        createdAt: new UnixTime(1),
        transactions: 1,
      })
    })

    it('throws for invalid schema', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () => new Response(JSON.stringify({ foo: 'bar' })),
      })
      const loopringClient = new LoopringClient(httpClient, Logger.SILENT)

      await expect(loopringClient.getBlock(1)).toBeRejected(
        TypeError,
        'Invalid Loopring response.',
      )
    })

    it('throws for http errors', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const loopringClient = new LoopringClient(httpClient, Logger.SILENT)
      await expect(loopringClient.getBlock(1)).toBeRejected(
        Error,
        'Http error 400: foo',
      )
    })
  })
})
