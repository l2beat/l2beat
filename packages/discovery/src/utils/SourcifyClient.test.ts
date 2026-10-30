import type { HttpClient } from '@l2beat/shared'
import { EthereumAddress } from '@l2beat/shared-pure'
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
})

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
