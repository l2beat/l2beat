import type { HttpClient } from '@l2beat/shared'
import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Response } from 'node-fetch'
import { CombiningEtherscanClient } from './CombiningEtherscanClient'

const BLOCKSCOUT_URL = 'https://blockscout.example/api'
const CHAIN_ID = 1

describe(CombiningEtherscanClient.name, () => {
  it('reports unverified when one source client fails and another reports unverified', async () => {
    const address = EthereumAddress.random()
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().rejectsWith(
        new Error('HTTP error: 429 Too Many Requests'),
      ),
      fetchRaw: mockFn().resolvesTo(
        new Response('', { status: 404, statusText: 'Not Found' }),
      ),
    })
    const client = new CombiningEtherscanClient(httpClient, [
      { type: 'blockscout', url: BLOCKSCOUT_URL },
      { type: 'sourcify', chainId: CHAIN_ID },
    ])

    const result = await client.getContractSource(address)

    expect(result.isVerified).toEqual(false)
  })

  it('throws with provider errors when every source client fails', async () => {
    const address = EthereumAddress.random()
    const client = new CombiningEtherscanClient(
      mockObject<HttpClient>({
        fetch: mockFn().rejectsWith(
          new Error('HTTP error: 429 Too Many Requests'),
        ),
      }),
      [
        { type: 'blockscout', url: `${BLOCKSCOUT_URL}/one` },
        { type: 'blockscout', url: `${BLOCKSCOUT_URL}/two` },
      ],
    )

    await expect(client.getContractSource(address)).toBeRejectedWith(
      `All clients failed to fetch contract source for ${address.toString()}: blockscout:${BLOCKSCOUT_URL}/one failed to fetch contract source: HTTP error: 429 Too Many Requests; blockscout:${BLOCKSCOUT_URL}/two failed to fetch contract source: HTTP error: 429 Too Many Requests`,
    )
  })

  it('reports unverified when all source clients report unverified', async () => {
    const address = EthereumAddress.random()
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesTo({
        message: 'OK',
        result: [{ Address: address.toString() }],
      }),
      fetchRaw: mockFn().resolvesTo(
        new Response('', { status: 404, statusText: 'Not Found' }),
      ),
    })
    const client = new CombiningEtherscanClient(httpClient, [
      { type: 'blockscout', url: BLOCKSCOUT_URL },
      { type: 'sourcify', chainId: CHAIN_ID },
    ])

    const result = await client.getContractSource(address)

    expect(result.isVerified).toEqual(false)
  })

  it('returns verified source without querying remaining clients', async () => {
    const address = EthereumAddress.random()
    const fetchRaw = mockFn()
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().resolvesTo({
        message: 'OK',
        result: [
          {
            SourceCode: 'contract Example {}',
            ABI: '[]',
            ContractName: 'Example',
            FileName: 'Example.sol',
            CompilerVersion: 'v0.8.0',
            OptimizationUsed: '0',
            EVMVersion: 'default',
          },
        ],
      }),
      fetchRaw,
    })
    const client = new CombiningEtherscanClient(httpClient, [
      { type: 'blockscout', url: BLOCKSCOUT_URL },
      { type: 'sourcify', chainId: CHAIN_ID },
    ])

    const result = await client.getContractSource(address)

    expect(result.isVerified).toEqual(true)
    expect(result.name).toEqual('Example')
    expect(fetchRaw).toHaveBeenCalledTimes(0)
  })

  it('uses Blockscout V2 source metadata before V1', async () => {
    const address = EthereumAddress.random()
    const fetch = mockFn()
    const httpClient = mockObject<HttpClient>({
      fetch,
      fetchRaw: mockFn().resolvesTo(
        new Response(
          JSON.stringify({
            is_verified: true,
            name: 'ExampleV2',
            source_code: 'contract ExampleV2 {}',
            file_path: 'ExampleV2.sol',
          }),
          { status: 200 },
        ),
      ),
    })
    const client = new CombiningEtherscanClient(httpClient, [
      { type: 'blockscoutV2', url: `${BLOCKSCOUT_URL}/v2` },
      { type: 'blockscout', url: BLOCKSCOUT_URL },
    ])

    const result = await client.getContractSource(address)

    expect(result.isVerified).toEqual(true)
    expect(result.name).toEqual('ExampleV2')
    expect(fetch).toHaveBeenCalledTimes(0)
  })

  it('uses Blockscout V2 contract deployment metadata before V1', async () => {
    const address = EthereumAddress.random()
    const transactionHash = Hash256.random()
    const fetch = mockFn().resolvesTo({
      creation_transaction_hash: transactionHash.toString(),
    })
    const client = new CombiningEtherscanClient(
      mockObject<HttpClient>({ fetch }),
      [
        { type: 'blockscoutV2', url: `${BLOCKSCOUT_URL}/v2` },
        { type: 'blockscout', url: BLOCKSCOUT_URL },
      ],
    )

    const result = await client.getContractDeploymentTx(address)

    expect(result).toEqual(transactionHash)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      `${BLOCKSCOUT_URL}/v2/addresses/${address.toString()}`,
      { timeout: 10000 },
    )
  })
})
