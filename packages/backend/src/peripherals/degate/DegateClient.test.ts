import { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { DegateClient } from './DegateClient'

describe(DegateClient.name, () => {
  describe(DegateClient.prototype.getBlock.name, () => {
    it('gets block', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              blockId: 42,
              createdAt: 1000,
              transactions: [{ txType: 'foo' }],
            }),
          ),
      })
      const degateClient = new DegateClient(
        httpClient,
        Logger.SILENT,
        'https://example.com',
      )

      const result = await degateClient.getBlock(42)
      expect(result).toEqual({
        blockId: 42,
        createdAt: new UnixTime(1),
        transactions: 1,
      })
    })

    it('throws for invalid schema', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async () => new Response(JSON.stringify({ foo: 'bar' })),
      })
      const degateClient = new DegateClient(
        httpClient,
        Logger.SILENT,
        'https://example.com',
      )

      await expect(degateClient.getBlock(1)).toBeRejectedWith(
        TypeError,
        'Invalid Degate response.',
      )
    })

    it('throws for http errors', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const degateClient = new DegateClient(
        httpClient,
        Logger.SILENT,
        'https://example.com',
      )
      await expect(degateClient.getBlock(1)).toBeRejectedWith(
        Error,
        'Http error 400: foo',
      )
    })
  })
})
