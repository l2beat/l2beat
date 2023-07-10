import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { HttpClient } from '../HttpClient'
import { EtherscanLikeClient as EtherscanLikeClient } from './EtherscanLikeClient'

describe(EtherscanLikeClient.name, () => {
  describe(EtherscanLikeClient.prototype.call.name, () => {
    it('constructs a correct url', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            'https://example.com/api?module=mod&action=act&foo=bar&baz=123&apikey=KEY123',
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const etherscanClient = new EtherscanLikeClient(
        httpClient,
        'https://example.com/api',
        'KEY123',
      )
      await etherscanClient.call('mod', 'act', { foo: 'bar', baz: '123' })
    })

    it('throws on non-2XX result', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response('', { status: 404 })
        },
      })

      const etherscanClient = new EtherscanLikeClient(httpClient, 'url', 'key')
      await expect(etherscanClient.call('mod', 'act', {})).toBeRejectedWith(
        'Server responded with non-2XX result: 404 Not Found',
      )
    })

    it('throws on non-json response', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response('text')
        },
      })

      const etherscanClient = new EtherscanLikeClient(httpClient, 'url', 'key')
      await expect(etherscanClient.call('mod', 'act', {})).toBeRejectedWith(
        'Invalid Etherscan response.',
      )
    })

    it('throws on malformed json', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ foo: 'bar' }))
        },
      })

      const etherscanClient = new EtherscanLikeClient(httpClient, 'url', 'key')
      await expect(etherscanClient.call('mod', 'act', {})).toBeRejected()
    })

    it('returns a success response', async () => {
      const response = { status: '1' as const, message: 'OK', result: [1, 2] }
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify(response))
        },
      })

      const etherscanClient = new EtherscanLikeClient(httpClient, 'url', 'key')
      const result = await etherscanClient.call('mod', 'act', {})
      expect(result).toEqual(response.result)
    })

    it('throws on an error response', async () => {
      const response = {
        status: '0' as const,
        message: 'NOTOK',
        result: 'Oops',
      }
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify(response))
        },
      })

      const etherscanClient = new EtherscanLikeClient(httpClient, 'url', 'key')
      await expect(etherscanClient.call('mod', 'act', {})).toBeRejectedWith(
        response.result,
      )
    })
  })
})
