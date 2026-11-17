import type { HttpClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { SourcifyClient } from './SourcifyClient'

describe(SourcifyClient.name, () => {
  describe(SourcifyClient.prototype.getContractSource.name, () => {
    it('pins the root file sourcify compiled when there are several sources', async () => {
      const client = clientReturning(
        response('contracts/proxies/SafeProxy.sol:SafeProxy', {
          '/contracts/proxies/SafeProxy.sol': 'contract SafeProxy {}',
          'contracts/proxies/SafeProxy.sol': 'contract SafeProxy {}',
        }),
      )

      const source = await client.getContractSource(EthereumAddress.random())

      expect(source.rootFile).toEqual('contracts/proxies/SafeProxy.sol')
    })

    it('leaves the root file unset for a single source', async () => {
      const client = clientReturning(
        response('contracts/proxies/SafeProxy.sol:SafeProxy', {
          'contracts/proxies/SafeProxy.sol': 'contract SafeProxy {}',
        }),
      )

      const source = await client.getContractSource(EthereumAddress.random())

      expect(source.rootFile).toEqual(undefined)
      expect(Object.keys(source.files)).toEqual(['SafeProxy.sol'])
    })

    it('leaves the root file unset when the compiled file is not among the sources', async () => {
      const client = clientReturning(
        response('contracts/Missing.sol:SafeProxy', {
          'a/SafeProxy.sol': 'contract SafeProxy {}',
          'b/Other.sol': 'contract Other {}',
        }),
      )

      const source = await client.getContractSource(EthereumAddress.random())

      expect(source.rootFile).toEqual(undefined)
    })
  })

  // Methodology: time is faked, so the retry waits pass without sleeping.
  describe(SourcifyClient.prototype.callWithRetries.name, () => {
    let time: InstalledClock

    beforeEach(() => {
      time = install()
    })

    afterEach(() => {
      time.uninstall()
    })

    it('does not retry an HTTP 400', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn().resolvesTo(httpResponse(400, 'Bad Request')),
      })
      const client = new SourcifyClient(httpClient, 1)

      const result = client
        .getContractSource(EthereumAddress.random())
        .catch((e: unknown) => e)
      await time.runAllAsync()

      const error = await result
      expect(error).toBeA(Error)
      expect((error as Error).message).toEqual('HTTP error')
      expect((error as Error).cause).toEqual({
        status: 400,
        statusText: 'Bad Request',
      })
      expect(httpClient.fetchRaw).toHaveBeenCalledTimes(1)
    })

    it('retries an HTTP 503 and an HTTP 429', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: mockFn()
          .resolvesToOnce(httpResponse(503, 'Service Unavailable'))
          .resolvesToOnce(httpResponse(429, 'Too Many Requests'))
          .resolvesToOnce(httpResponse(404, 'Not Found')),
      })
      const client = new SourcifyClient(httpClient, 1)

      const result = client.getContractSource(EthereumAddress.random())
      await time.runAllAsync()

      expect((await result).isVerified).toEqual(false)
      expect(httpClient.fetchRaw).toHaveBeenCalledTimes(3)
    })
  })
})

function httpResponse(status: number, statusText: string) {
  return { status, statusText, ok: false, json: async () => ({}) }
}

function clientReturning(body: unknown) {
  const httpClient = mockObject<HttpClient>({
    fetchRaw: mockFn().resolvesToOnce({
      status: 200,
      ok: true,
      json: async () => body,
    }),
  })
  return new SourcifyClient(httpClient, 1)
}

function response(fullyQualifiedName: string, sources: Record<string, string>) {
  return {
    abi: [],
    compilation: {
      language: 'Solidity',
      compiler: 'solc',
      compilerVersion: '0.7.6+commit.7338295f',
      compilerSettings: {},
      name: fullyQualifiedName.slice(fullyQualifiedName.lastIndexOf(':') + 1),
      fullyQualifiedName,
    },
    creationBytecode: { transformationValues: null },
    sources: Object.fromEntries(
      Object.entries(sources).map(([path, content]) => [path, { content }]),
    ),
    deployment: { transactionHash: null },
  }
}
