import type { HttpClient } from '@l2beat/shared'
import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Response } from 'node-fetch'
import { BlockscoutV2SourceClient } from './BlockscoutV2SourceClient'

const API_URL = 'https://blockscout.example/api/v2'

describe(BlockscoutV2SourceClient.name, () => {
  it('maps verified smart contract metadata', async () => {
    const libraryAddress = EthereumAddress.random()
    const response = {
      is_verified: true,
      name: 'Example',
      compiler_version: 'v0.8.26+commit.8a97fa7a',
      optimization_runs: null,
      abi: [
        {
          type: 'function',
          name: 'value',
          inputs: [],
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
        },
      ],
      source_code: 'contract Example {}',
      file_path: 'src/Example.sol',
      compiler_settings: {
        optimizer: { enabled: true, runs: 200 },
        evmVersion: 'paris',
        viaIR: true,
        remappings: ['@openzeppelin/=lib/openzeppelin/'],
        libraries: {
          'src/Example.sol': { ExampleLibrary: libraryAddress.toString() },
        },
      },
      constructor_args: '0x1234',
      additional_sources: [
        {
          file_path: 'src/Dependency.sol',
          source_code: 'library Dependency {}',
        },
      ],
      external_libraries: [],
      language: 'solidity',
    }
    const httpClient = mockObject<HttpClient>({
      fetchRaw: mockFn().resolvesTo(
        new Response(JSON.stringify(response), { status: 200 }),
      ),
    })
    const client = new BlockscoutV2SourceClient(httpClient, API_URL)

    const result = await client.getContractSource(EthereumAddress.random())

    expect(result).toEqual({
      name: 'Example',
      rootFile: 'src/Example.sol',
      isVerified: true,
      abi: ['function value() view returns (uint256)'],
      solidityVersion: 'v0.8.26+commit.8a97fa7a',
      constructorArguments: '1234',
      remappings: ['@openzeppelin/=lib/openzeppelin/'],
      files: {
        'src/Example.sol': 'contract Example {}',
        'src/Dependency.sol': 'library Dependency {}',
      },
      libraries: { ExampleLibrary: libraryAddress },
      compilerSettings: {
        optimizer: { enabled: true, runs: 200 },
        evmVersion: 'paris',
        viaIR: true,
        metadata: undefined,
        debug: undefined,
      },
    })
  })

  it('reports an unverified contract on a 404', async () => {
    const httpClient = mockObject<HttpClient>({
      fetchRaw: mockFn().resolvesTo(new Response('', { status: 404 })),
    })
    const client = new BlockscoutV2SourceClient(httpClient, API_URL)

    const result = await client.getContractSource(EthereumAddress.random())

    expect(result).toEqual({
      name: '',
      rootFile: undefined,
      isVerified: false,
      abi: [],
      solidityVersion: '',
      constructorArguments: '',
      remappings: [],
      files: {},
      libraries: {},
    })
  })

  it('rejects inconsistent verified metadata without source code', async () => {
    const httpClient = mockObject<HttpClient>({
      fetchRaw: mockFn().resolvesTo(
        new Response(JSON.stringify({ is_verified: true, name: 'Example' }), {
          status: 200,
        }),
      ),
    })
    const client = new BlockscoutV2SourceClient(httpClient, API_URL)

    await expect(
      client.getContractSource(EthereumAddress.random()),
    ).toBeRejectedWith('returned a verified contract without source code')
  })

  it('gets the contract deployment transaction', async () => {
    const address = EthereumAddress.random()
    const transactionHash = Hash256.random()
    const fetch = mockFn().resolvesTo({
      creation_transaction_hash: transactionHash.toString(),
    })
    const client = new BlockscoutV2SourceClient(
      mockObject<HttpClient>({ fetch }),
      API_URL,
    )

    const result = await client.getContractDeploymentTx(address)

    expect(result).toEqual(transactionHash)
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/addresses/${address.toString()}`,
      { timeout: 10000 },
    )
  })

  it('returns undefined when an address has no deployment transaction', async () => {
    const client = new BlockscoutV2SourceClient(
      mockObject<HttpClient>({
        fetch: mockFn().resolvesTo({ creation_transaction_hash: null }),
      }),
      API_URL,
    )

    const result = await client.getContractDeploymentTx(
      EthereumAddress.random(),
    )

    expect(result).toEqual(undefined)
  })
})
