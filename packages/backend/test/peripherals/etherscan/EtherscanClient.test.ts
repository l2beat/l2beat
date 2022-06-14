import { Logger, mock, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'
import { Response } from 'node-fetch'

import {
  EtherscanClient,
  EtherscanError,
} from '../../../src/peripherals/etherscan'
import { HttpClient } from '../../../src/peripherals/HttpClient'

describe(EtherscanClient.name, () => {
  describe(EtherscanClient.prototype['call'].name, () => {
    it('throws for error responses', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({ status: '0', message: 'NOTOK', result: 'Oops!' }),
          )
        },
      })
      const etherscanClient = new EtherscanClient(
        'xXApiKeyXx',
        httpClient,
        Logger.SILENT,
      )
      await expect(
        etherscanClient['call']('foo', 'bar', { baz: '1234' }),
      ).toBeRejected(EtherscanError, 'Oops!')
    })

    it('throws for malformed responses', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ status: '2', foo: 'bar' }))
        },
      })
      const etherscanClient = new EtherscanClient(
        'xXApiKeyXx',
        httpClient,
        Logger.SILENT,
      )
      await expect(
        etherscanClient['call']('foo', 'bar', { baz: '1234' }),
      ).toBeRejected(TypeError, 'Invalid Etherscan response.')
    })

    it('throws for http errors', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const etherscanClient = new EtherscanClient(
        'xXApiKeyXx',
        httpClient,
        Logger.SILENT,
      )
      await expect(
        etherscanClient['call']('foo', 'bar', { baz: '1234' }),
      ).toBeRejected(Error, 'Http error 400: foo')
    })
  })

  describe(EtherscanClient.prototype.getBlockNumberAtOrBefore.name, () => {
    it('constructs the correct url', async () => {
      const apiKey = 'xXApiKeyXx'
      const timestamp = new UnixTime(1578638524)

      const params = new URLSearchParams({
        module: 'block',
        action: 'getblocknobytime',
        timestamp: timestamp.toString(),
        closest: 'before',
        apikey: apiKey,
      })

      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(`https://api.etherscan.io/api?${params}`)
          return new Response(
            JSON.stringify({ status: '1', message: 'OK', result: '9251482' }),
          )
        },
      })

      const etherscanClient = new EtherscanClient(
        apiKey,
        httpClient,
        Logger.SILENT,
      )
      await etherscanClient.getBlockNumberAtOrBefore(timestamp)
    })

    it('returns the block number', async () => {
      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({ status: '1', message: 'OK', result: '9251482' }),
          )
        },
      })

      const etherscanClient = new EtherscanClient(
        'xXApiKeyXx',
        httpClient,
        Logger.SILENT,
      )
      const result = await etherscanClient.getBlockNumberAtOrBefore(
        new UnixTime(1578638524),
      )
      expect(result).toEqual(9251482n)
    })
  })
})
