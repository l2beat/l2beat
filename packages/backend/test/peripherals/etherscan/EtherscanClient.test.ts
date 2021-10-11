import { expect } from 'chai'
import { Response } from 'node-fetch'

import { UnixTime } from '../../../src/model/UnixTime'
import {
  EtherscanClient,
  EtherscanError,
} from '../../../src/peripherals/etherscan'
import { IHttpClient } from '../../../src/peripherals/HttpClient'
import { Logger } from '../../../src/tools/Logger'
import { mock } from '../../mock'

describe('EtherscanClient', () => {
  describe('callUnsafe', () => {
    it('throws for error responses', async () => {
      const httpClient = mock<IHttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({ status: '0', message: 'NOTOK', result: 'Oops!' })
          )
        },
      })
      const etherscanClient = new EtherscanClient(
        'xXApiKeyXx',
        httpClient,
        Logger.SILENT
      )
      await expect(
        etherscanClient['callUnsafe']('foo', 'bar', { baz: '1234' })
      ).to.be.rejectedWith(EtherscanError, 'Oops!')
    })

    it('throws for malformed responses', async () => {
      const httpClient = mock<IHttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ status: '2', foo: 'bar' }))
        },
      })
      const etherscanClient = new EtherscanClient(
        'xXApiKeyXx',
        httpClient,
        Logger.SILENT
      )
      await expect(
        etherscanClient['callUnsafe']('foo', 'bar', { baz: '1234' })
      ).to.be.rejectedWith(TypeError, 'Invalid Etherscan response')
    })

    it('throws for http errors', async () => {
      const httpClient = mock<IHttpClient>({
        async fetch() {
          return new Response('foo', { status: 400 })
        },
      })
      const etherscanClient = new EtherscanClient(
        'xXApiKeyXx',
        httpClient,
        Logger.SILENT
      )
      await expect(
        etherscanClient['callUnsafe']('foo', 'bar', { baz: '1234' })
      ).to.be.rejectedWith(Error, 'Http error 400: foo')
    })
  })

  describe('getBlockNumberAtOrBefore', () => {
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

      const httpClient = mock<IHttpClient>({
        async fetch(url) {
          expect(url).to.equal(`https://api.etherscan.io/api?${params}`)
          return new Response(
            JSON.stringify({ status: '1', message: 'OK', result: '9251482' })
          )
        },
      })

      const etherscanClient = new EtherscanClient(
        apiKey,
        httpClient,
        Logger.SILENT
      )
      await etherscanClient.getBlockNumberAtOrBefore(timestamp)
    })

    it('returns the block number', async () => {
      const httpClient = mock<IHttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({ status: '1', message: 'OK', result: '9251482' })
          )
        },
      })

      const etherscanClient = new EtherscanClient(
        'xXApiKeyXx',
        httpClient,
        Logger.SILENT
      )
      const result = await etherscanClient.getBlockNumberAtOrBefore(
        new UnixTime(1578638524)
      )
      expect(result).to.equal(9251482n)
    })
  })
})
