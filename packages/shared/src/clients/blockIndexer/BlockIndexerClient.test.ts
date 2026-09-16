import { RateLimiter } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { HttpClient } from '../http/HttpClient'
import { BlockIndexerClient } from './BlockIndexerClient'

const API_URL = 'https://example.com/api'

const OPTIONS = {
  type: 'etherscan' as const,
  apiKey: 'key',
  url: API_URL,
  chain: 'chain',
  chainId: 1,
}

const rate = new RateLimiter({ callsPerMinute: 10000 })

describe(BlockIndexerClient.name, () => {
  describe(BlockIndexerClient.prototype.getBlockNumberAtOrBefore.name, () => {
    it('constructs a correct url', async () => {
      const result = 1234
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return { status: '1', message: 'OK', result: `${result}` }
        },
      })

      const arbiscanClient = new BlockIndexerClient(httpClient, rate, OPTIONS)
      const blockNumber = await arbiscanClient.getBlockNumberAtOrBefore(
        UnixTime(3141592653),
      )

      expect(httpClient.fetch).toHaveBeenCalledExactlyOnceWith(
        `${API_URL}?module=block&action=getblocknobytime&timestamp=3141592653&closest=before&apikey=key&chainId=1`,
        {},
      )
      expect(blockNumber).toStrictEqual(result)
    })

    it('if there is no closest block number try 10 minutes earlier', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const result = 1234
      const httpClient = mockObject<HttpClient>({
        fetch: vi
          .fn()
          .mockResolvedValueOnce({
            status: '1',
            message: 'NOTOK',
            result: 'Error! No closest block found',
          })
          .mockResolvedValueOnce({
            status: '1',
            message: 'OK',
            result: `${result}`,
          }),
      })

      const arbiscanClient = new BlockIndexerClient(httpClient, rate, OPTIONS)
      const blockNumber =
        await arbiscanClient.getBlockNumberAtOrBefore(timestamp)

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=key&chainId=1`,
        {},
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${
          timestamp - (10) * UnixTime.MINUTE
        }&closest=before&apikey=key&chainId=1`,
        {},
      )

      expect(blockNumber).toStrictEqual(result)
    })

    it('tries to find a block earlier only if no closest block found error, throws otherwise', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const gatewayError = {
        status: '1',
        message: 'NOTOK',
        result: 'Gateway error',
      }
      const httpClient = mockObject<HttpClient>({
        fetch: vi
          .fn()
          .mockResolvedValueOnce({
            status: '1',
            message: 'NOTOK',
            result: 'Error! No closest block found',
          })
          .mockResolvedValueOnce(gatewayError),
      })

      const etherscanClient = new BlockIndexerClient(httpClient, rate, OPTIONS)

      await expect(() =>
        etherscanClient.getBlockNumberAtOrBefore(timestamp),
      ).rejects.toThrow(gatewayError.result)

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=key&chainId=1`,
        {},
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${
          timestamp - (10) * UnixTime.MINUTE
        }&closest=before&apikey=key&chainId=1`,
        {},
      )
    })

    it('when trying to find a block going backwards if error type is string, throws it', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const errorString = '{"error":"string error"}'
      const httpClient = mockObject<HttpClient>({
        fetch: vi
          .fn()
          .mockResolvedValueOnce({
            status: '1',
            message: 'NOTOK',
            result: 'Error! No closest block found',
          })
          .mockImplementationOnce(() => {
            throw errorString
          }),
      })

      const etherscanClient = new BlockIndexerClient(httpClient, rate, OPTIONS)

      await expect(() =>
        etherscanClient.getBlockNumberAtOrBefore(timestamp),
      ).rejects.toThrow(errorString)

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=key&chainId=1`,
        {},
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${
          timestamp - (10) * UnixTime.MINUTE
        }&closest=before&apikey=key&chainId=1`,
        {},
      )
    })

    it('when trying to find a block going backwards if error type is neither string nor object, throws unknown error', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const httpClient = mockObject<HttpClient>({
        fetch: vi
          .fn()
          .mockResolvedValueOnce({
            status: '1',
            message: 'NOTOK',
            result: 'Error! No closest block found',
          })
          .mockImplementationOnce(() => {
            throw 1234
          }),
      })

      const etherscanClient = new BlockIndexerClient(httpClient, rate, OPTIONS)

      await expect(() =>
        etherscanClient.getBlockNumberAtOrBefore(timestamp),
      ).rejects.toThrow('Unknown error type caught')

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        1,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=key&chainId=1`,
        {},
      )

      expect(httpClient.fetch).toHaveBeenNthCalledWith(
        2,
        `${API_URL}?module=block&action=getblocknobytime&timestamp=${
          timestamp - (10) * UnixTime.MINUTE
        }&closest=before&apikey=key&chainId=1`,
        {},
      )
    })

    it('tries to find blockNumber until maximumCallsForBlockTimestamp then throw', async () => {
      const timestamp = UnixTime.fromDate(new Date('2022-07-19T00:00:00Z'))

      const NOT_OK = {
        status: '1',
        message: 'NOTOK',
        result: 'Error! No closest block found',
      }
      const httpClient = mockObject<HttpClient>({
        fetch: vi
          .fn()
          // maximumCallsForBlockTimestamp = 3
          .mockResolvedValueOnce(NOT_OK)
          .mockResolvedValueOnce(NOT_OK)
          .mockResolvedValueOnce(NOT_OK)
          .mockResolvedValueOnce(NOT_OK),
      })

      const etherscanClient = new BlockIndexerClient(httpClient, rate, OPTIONS)

      await expect(() =>
        etherscanClient.getBlockNumberAtOrBefore(timestamp),
      ).rejects.toThrow()
    })
  })

  describe(BlockIndexerClient.prototype.call.name, () => {
    it('constructs a correct url', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch(url) {
          expect(url).toStrictEqual(
            `${API_URL}?module=mod&action=act&foo=bar&baz=123&apikey=key&chainId=1`,
          )
          return { status: '1', message: 'OK', result: '' }
        },
      })

      const etherscanClient = new BlockIndexerClient(httpClient, rate, OPTIONS)
      await etherscanClient.call('mod', 'act', { foo: 'bar', baz: '123' })
    })

    it('does not add api key for blockscout', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch(url) {
          expect(url).toStrictEqual(
            `${API_URL}?module=mod&action=act&foo=bar&baz=123`,
          )
          return { status: '1', message: 'OK', result: '' }
        },
      })

      const etherscanClient = new BlockIndexerClient(httpClient, rate, {
        type: 'blockscout',
        url: API_URL,
        chain: 'chain',
      })
      await etherscanClient.call('mod', 'act', { foo: 'bar', baz: '123' })
    })

    it('returns a success response', async () => {
      const response = { status: '1' as const, message: 'OK', result: [1, 2] }
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return response
        },
      })

      const etherscanClient = new BlockIndexerClient(httpClient, rate, OPTIONS)
      const result = await etherscanClient.call('mod', 'act', {})
      expect(result).toStrictEqual(response.result)
    })

    it('throws on an error response', async () => {
      const response = {
        status: '0' as const,
        message: 'NOTOK',
        result: 'Oops',
      }
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return response
        },
      })

      const etherscanClient = new BlockIndexerClient(httpClient, rate, OPTIONS)
      await expect(etherscanClient.call('mod', 'act', {})).rejects.toThrow(
        response.result,
      )
    })
  })
})

// TODO: test all blockscout options
