import { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { HttpClient } from '../HttpClient'
import { EtherscanClient } from './EtherscanClient'

describe(EtherscanClient.name, () => {
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

      const etherscanClient = new EtherscanClient(
        httpClient,
        'key',
        new UnixTime(0),
      )
      const source = await etherscanClient.getContractSource(
        EthereumAddress.ZERO,
      )

      expect(httpClient.fetch).toHaveBeenOnlyCalledWith(
        `${EtherscanClient.API_URL}?module=contract&action=getsourcecode&address=0x0000000000000000000000000000000000000000&apikey=key`,
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

      const etherscanClient = new EtherscanClient(
        httpClient,
        'key',
        new UnixTime(0),
      )
      const source = await etherscanClient.getContractDeploymentTx(
        EthereumAddress.ZERO,
      )

      expect(httpClient.fetch).toHaveBeenOnlyCalledWith(
        `${EtherscanClient.API_URL}?module=contract&action=getcontractcreation&contractaddresses=0x0000000000000000000000000000000000000000&apikey=key`,
        expect.anything(),
      )
      expect(source).toEqual(result.txHash)
    })
  })
})
