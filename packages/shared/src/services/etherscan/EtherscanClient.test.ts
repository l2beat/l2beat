import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { EthereumAddress, Hash256 } from '../../types'
import { HttpClient } from '../HttpClient'
import { EtherscanClient } from './EtherscanClient'

describe(EtherscanClient.name, () => {
  describe(EtherscanClient.prototype.call.name, () => {
    it('constructs a correct url', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            'https://example.com/api?module=mod&action=act&foo=bar&baz=123&apikey=KEY123',
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const etherscanClient = new EtherscanClient(
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

      const etherscanClient = new EtherscanClient(httpClient, 'url', 'key')
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

      const etherscanClient = new EtherscanClient(httpClient, 'url', 'key')
      await expect(etherscanClient.call('mod', 'act', {})).toBeRejectedWith(
        'json',
      )
    })

    it('throws on malformed json', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify({ foo: 'bar' }))
        },
      })

      const etherscanClient = new EtherscanClient(httpClient, 'url', 'key')
      await expect(etherscanClient.call('mod', 'act', {})).toBeRejected()
    })

    it('returns a success response', async () => {
      const response = { status: '1' as const, message: 'OK', result: [1, 2] }
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify(response))
        },
      })

      const etherscanClient = new EtherscanClient(httpClient, 'url', 'key')
      const result = await etherscanClient.call('mod', 'act', {})
      expect(result).toEqual(response)
    })

    it('returns an error response', async () => {
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

      const etherscanClient = new EtherscanClient(httpClient, 'url', 'key')
      const result = await etherscanClient.call('mod', 'act', {})
      expect(result).toEqual(response)
    })

    it('retries 3 times, then throws', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          throw new Error('timeout')
        },
      })

      const etherscanClient = new EtherscanClient(httpClient, 'url', 'key')

      await expect(etherscanClient.call('mod', 'act', {})).toBeRejected()
      expect(httpClient.fetch.calls.length).toEqual(3)
    })

    it('retries on erros, then fetches the result', async () => {
      const response = { status: '1' as const, message: 'OK', result: [1, 2] }
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          throw new Error('timeout')
        },
      })

      httpClient.fetch
        .throwsOnce(new Error('timeout'))
        .resolvesToOnce(new Response(JSON.stringify(response)))

      const etherscanClient = new EtherscanClient(httpClient, 'url', 'key')

      const result = await etherscanClient.call('mod', 'act', {})
      expect(result).toEqual(response)
      expect(httpClient.fetch.calls.length).toEqual(2)
    })
  })

  describe(EtherscanClient.prototype.getContractSource.name, () => {
    it('constructs a correct url', async () => {
      const result = {
        SourceCode: '',
        ABI: 'Contract source code not verified',
        ContractName: '',
        CompilerVersion: '',
        OptimizationUsed: '',
        Runs: '',
        ConstructorArguments: '',
        EVMVersion: 'Default',
        Library: '',
        LicenseType: 'Unknown',
        Proxy: '0',
        Implementation: '',
        SwarmSource: '',
      }
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({ status: '1', message: 'OK', result: [result] }),
          )
        },
      })

      const etherscanClient = new EtherscanClient(httpClient, 'url', 'key')
      const source = await etherscanClient.getContractSource(
        EthereumAddress.ZERO,
      )

      expect(httpClient.fetch).toHaveBeenOnlyCalledWith(
        'url?module=contract&action=getsourcecode&address=0x0000000000000000000000000000000000000000&apikey=key',
        expect.anything(),
      )
      expect(source).toEqual(result)
    })
  })

  describe(EtherscanClient.prototype.getContractDeploymentTx.name, () => {
    it('constructs a correct url', async () => {
      const result = {
        contractAddress: EthereumAddress.random(),
        contractCreator: EthereumAddress.random(),
        txHash: Hash256.random(),
      }
      const httpClient = mockObject<HttpClient>({
        async fetch() {
          return new Response(
            JSON.stringify({ status: '1', message: 'OK', result: [result] }),
          )
        },
      })

      const etherscanClient = new EtherscanClient(httpClient, 'url', 'key')
      const source = await etherscanClient.getContractDeploymentTx(
        EthereumAddress.ZERO,
      )

      expect(httpClient.fetch).toHaveBeenOnlyCalledWith(
        'url?module=contract&action=getcontractcreation&contractaddresses=0x0000000000000000000000000000000000000000&apikey=key',
        expect.anything(),
      )
      expect(source).toEqual(result.txHash)
    })
  })
})
