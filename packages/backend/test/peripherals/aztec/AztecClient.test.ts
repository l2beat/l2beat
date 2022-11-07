import { HttpClient, mock } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'
import { Response } from 'node-fetch'

import { AztecClient } from '../../../src/peripherals/aztec'

describe(AztecClient.name, () => {
  describe(AztecClient.prototype.getBlock.name, () => {
    it('gets block', async () => {
      const mined = new Date()
      const httpClient = mock<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              data: {
                rollup: {
                  id: 42,
                  mined,
                  numTxs: 10,
                },
              },
            }),
          ),
      })
      const aztecClient = new AztecClient(httpClient, 'aztec')
      const result = await aztecClient.getBlock(42)
      expect(result).toEqual({
        number: 42,
        timestamp: UnixTime.fromDate(mined),
        transactionCount: 10,
      })
    })

    it('throws for invalid schema', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () => new Response(JSON.stringify({ foo: 'bar' })),
      })
      const client = new AztecClient(httpClient, 'aztec')
      await expect(client.getBlock(1)).toBeRejected()
    })

    it('throws for http errors', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const aztecClient = new AztecClient(httpClient, 'aztec')
      await expect(aztecClient.getBlock(1)).toBeRejected()
    })

    it('uses different url for version', async () => {
      const mined = new Date()
      const httpClient = mock<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              data: {
                rollup: {
                  id: 42,
                  mined,
                  numTxs: 10,
                },
              },
            }),
          ),
      })
      const aztecClient = new AztecClient(httpClient, 'aztec')
      const aztecConnectClient = new AztecClient(httpClient, 'aztecconnect')
      await aztecClient.getBlock(42)
      await aztecConnectClient.getBlock(42)
      const [
        {
          args: [url1],
        },
        {
          args: [url2],
        },
      ] = httpClient.fetch.calls
      expect(url1).not.toEqual(url2)
      const path = '/graphql?query={rollup(id:42){id mined numTxs}}'
      expect(url1.endsWith(path))
      expect(url2.endsWith(path))
    })
  })

  describe(AztecClient.prototype.getLatestBlock.name, () => {
    it('gets block', async () => {
      const mined = new Date()
      const httpClient = mock<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              data: {
                rollups: [
                  {
                    id: 42,
                    mined,
                    numTxs: 10,
                  },
                ],
              },
            }),
          ),
      })
      const aztecClient = new AztecClient(httpClient, 'aztec')
      const result = await aztecClient.getLatestBlock()
      expect(result).toEqual({
        number: 42,
        timestamp: UnixTime.fromDate(mined),
        transactionCount: 10,
      })
    })

    it('throws for invalid schema', async () => {
      const httpClient = mock<HttpClient>({
        fetch: async () => new Response(JSON.stringify({ foo: 'bar' })),
      })
      const client = new AztecClient(httpClient, 'aztec')
      await expect(client.getLatestBlock()).toBeRejected()
    })

    it('throws for http errors', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const aztecClient = new AztecClient(httpClient, 'aztec')
      await expect(aztecClient.getLatestBlock()).toBeRejected()
    })

    it('uses different url for version', async () => {
      const mined = new Date()
      const httpClient = mock<HttpClient>({
        fetch: async () =>
          new Response(
            JSON.stringify({
              data: {
                rollups: [
                  {
                    id: 42,
                    mined,
                    numTxs: 10,
                  },
                ],
              },
            }),
          ),
      })
      const aztecClient = new AztecClient(httpClient, 'aztec')
      const aztecConnectClient = new AztecClient(httpClient, 'aztecconnect')
      await aztecClient.getLatestBlock()
      await aztecConnectClient.getLatestBlock()
      const [
        {
          args: [url1],
        },
        {
          args: [url2],
        },
      ] = httpClient.fetch.calls
      expect(url1).not.toEqual(url2)
      const path = '/graphql?query={rollups(take:1,skip:0){id mined numTxs}}'
      expect(url1.endsWith(path))
      expect(url2.endsWith(path))
    })
  })
})
