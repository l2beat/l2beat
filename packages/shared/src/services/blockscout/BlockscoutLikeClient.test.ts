import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { HttpClient } from '../HttpClient'
import { BlockscoutLikeClient as BlockscoutLikeClient } from './BlockscoutLikeClient'

const API_URL = 'https://example.com/api'

describe(BlockscoutLikeClient.name, () => {
  describe(BlockscoutLikeClient.prototype.call.name, () => {
    it('constructs a correct url', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            `${API_URL}?module=mod&action=act&foo=bar&baz=123`,
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const blockscoutClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        new UnixTime(0),
      )
      await blockscoutClient.call('mod', 'act', { foo: 'bar', baz: '123' })
    })

    it('throws on non-2XX result', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response('', { status: 404 })
        },
      })

      const blockscoutClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        new UnixTime(0),
      )
      await expect(blockscoutClient.call('mod', 'act', {})).toBeRejectedWith(
        'Server responded with non-2XX result: 404 Not Found',
      )
    })

    it('throws on non-json response', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response('mytestresp')
        },
      })

      const blockscoutClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        new UnixTime(0),
      )
      await expect(blockscoutClient.call('mod', 'act', {})).toBeRejectedWith(
        `Invalid Blockscout response [mytestresp] for request [${API_URL}?module=mod&action=act].`,
      )
    })

    it('throws on malformed json', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ foo: 'bar' }))
        },
      })

      const blockscoutClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        new UnixTime(0),
      )
      await expect(blockscoutClient.call('mod', 'act', {})).toBeRejected()
    })

    it('returns a success response', async () => {
      const response = { status: '1' as const, message: 'OK', result: [1, 2] }
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify(response))
        },
      })

      const blockscoutClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        new UnixTime(0),
      )
      const result = await blockscoutClient.call('mod', 'act', {})
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

      const blockscoutClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        new UnixTime(0),
      )
      await expect(blockscoutClient.call('mod', 'act', {})).toBeRejectedWith(
        response.result,
      )
    })
  })

  describe(BlockscoutLikeClient.prototype.getBlockNumberAtOrBefore.name, () => {
    it('constructs a correct url', async () => {
      const result = 1234
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({
              status: '1',
              message: 'OK',
              result: { blockNumber: result },
            }),
          )
        },
      })

      const blockscoutClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        new UnixTime(0),
      )
      const blockNumber = await blockscoutClient.getBlockNumberAtOrBefore(
        new UnixTime(3141592653),
      )

      expect(httpClient.fetch).toHaveBeenOnlyCalledWith(
        `${API_URL}?module=block&action=getblocknobytime&timestamp=3141592653&closest=before`,
        expect.anything(),
      )
      expect(blockNumber).toEqual(result)
    })

    it('if there is no closes block number try 10 minutes earlier', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const result = 1234
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: '1',
                message: 'NOTOK',
                result: `Error! Block does not exist`,
              }),
            ),
          )
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: '1',
                message: 'OK',
                result: { blockNumber: result },
              }),
            ),
          ),
      })

      const blockscoutClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        new UnixTime(0),
      )
      const blockNumber = await blockscoutClient.getBlockNumberAtOrBefore(
        timestamp,
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp.toNumber()}&closest=before`,
        expect.anything(),
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp
          .add(-10, 'minutes')
          .toNumber()}&closest=before`,
        expect.anything(),
      )

      expect(blockNumber).toEqual(result)
    })

    it('tries to find a block earlier only if no closest block found error, throws otherwise', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const gatewayError = {
        status: '1',
        message: 'NOTOK',
        result: `Gateway error`,
      }
      const gatewayErrorJsonString = JSON.stringify(gatewayError)
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: '1',
                message: 'NOTOK',
                result: `Error! Block does not exist`,
              }),
            ),
          )
          .resolvesToOnce(new Response(gatewayErrorJsonString)),
      })

      const blockscoutLikeClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        timestamp.add(-40, 'minutes'),
      )

      await expect(() =>
        blockscoutLikeClient.getBlockNumberAtOrBefore(timestamp),
      ).toBeRejectedWith(gatewayError.result)

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp.toNumber()}&closest=before`,
        expect.anything(),
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp
          .add(-10, 'minutes')
          .toNumber()}&closest=before`,
        expect.anything(),
      )
    })

    it('when trying to find a block going backwards if error type is string, throws it', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const errorString = '{"error":"string error"}'
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: '1',
                message: 'NOTOK',
                result: `Error! Block does not exist`,
              }),
            ),
          )
          .throwsOnce(errorString),
      })

      const blockscoutLikeClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        timestamp.add(-40, 'minutes'),
      )

      await expect(() =>
        blockscoutLikeClient.getBlockNumberAtOrBefore(timestamp),
      ).toBeRejectedWith(errorString)

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp.toNumber()}&closest=before`,
        expect.anything(),
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp
          .add(-10, 'minutes')
          .toNumber()}&closest=before`,
        expect.anything(),
      )
    })

    it('when trying to find a block going backwards if error type is neither string nor object, throws unknown error', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const httpClient = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: '1',
                message: 'NOTOK',
                result: `Error! Block does not exist`,
              }),
            ),
          )
          .throwsOnce(1234),
      })

      const blockscoutLikeClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        timestamp.add(-40, 'minutes'),
      )

      await expect(() =>
        blockscoutLikeClient.getBlockNumberAtOrBefore(timestamp),
      ).toBeRejectedWith('Unknown error type caught')

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp.toNumber()}&closest=before`,
        expect.anything(),
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp
          .add(-10, 'minutes')
          .toNumber()}&closest=before`,
        expect.anything(),
      )
    })

    it('tries to find blockNumber until minTimestamp then throw', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const result = 1234
      const httpClient = mockObject<HttpClient>({
        fetch: mockFn()
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: '1',
                message: 'NOTOK',
                result: `Error! Block does not exist`,
              }),
            ),
          )
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: '1',
                message: 'NOTOK',
                result: `Error! Block does not exist`,
              }),
            ),
          )
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: '1',
                message: 'NOTOK',
                result: `Error! Block does not exist`,
              }),
            ),
          )
          .resolvesToOnce(
            new Response(
              JSON.stringify({
                status: '1',
                message: 'OK',
                result: `${result}`,
              }),
            ),
          ),
      })

      const blockscoutLikeClient = new BlockscoutLikeClient(
        httpClient,
        API_URL,
        timestamp.add(-20, 'minutes'),
      )

      await expect(() =>
        blockscoutLikeClient.getBlockNumberAtOrBefore(timestamp),
      ).toBeRejectedWith('Could not fetch block number')

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp.toNumber()}&closest=before`,
        expect.anything(),
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp
          .add(-10, 'minutes')
          .toNumber()}&closest=before`,
        expect.anything(),
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        3,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp
          .add(-20, 'minutes')
          .toNumber()}&closest=before`,
        expect.anything(),
      )
    })
  })
})
