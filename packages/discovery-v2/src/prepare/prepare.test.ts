import type {
  ContractSource,
  ContractSources,
  IProvider,
  ProxyDetector,
  SourceCodeService,
} from '@l2beat/discovery'
import {
  Bytes,
  ChainSpecificAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { PreparedSource } from '../types/Prepared'
import { type PrepareDeps, prepare } from './prepare'

/**
 * Drives `prepare` with a mocked provider, proxy detector and source
 * service for the three shapes an address can have: an EOA, a plain verified
 * contract and an EIP1967 proxy. The proxy detector and source service are
 * mocked at their V1 boundaries, so what is tested is the assembly V2 adds:
 * flattening (with a real flattener run), the shape hash, V1's
 * implementation names, and the file layout later tools consume.
 */
describe(prepare.name, () => {
  const CHAIN = 'ethereum'
  const SELF = address('1111111111111111111111111111111111111111')
  const IMPLEMENTATION = address('2222222222222222222222222222222222222222')
  const ADMIN = address('3333333333333333333333333333333333333333')
  const DEPLOYER = address('6666666666666666666666666666666666666666')
  const TX_HASH = Hash256(`0x${'ab'.repeat(32)}`)
  const HASH_A = `0x${'11'.repeat(32)}`
  const HASH_B = `0x${'22'.repeat(32)}`

  const deployment = {
    deployer: DEPLOYER,
    transactionHash: TX_HASH,
    blockNumber: 500,
    timestamp: UnixTime(1_600_000_000),
  }

  function providerFor(code: Bytes): IProvider {
    return mockObject<IProvider>({
      chain: CHAIN,
      blockNumber: 1_000,
      timestamp: UnixTime(1_700_000_000),
      getBytecode: mockFn().resolvesTo(code),
    })
  }

  function depsFor(
    provider: IProvider,
    proxy: Awaited<ReturnType<ProxyDetector['detectProxy']>>,
    sources: ContractSources,
  ) {
    const detectProxy = mockFn<ProxyDetector['detectProxy']>().resolvesTo(proxy)
    const getSources =
      mockFn<SourceCodeService['getSources']>().resolvesTo(sources)
    const deps: PrepareDeps = {
      provider,
      proxyDetector: { detectProxy },
      sourceCodeService: { getSources },
    }
    return { ...deps, detectProxy, getSources }
  }

  it('returns a minimal record for an EOA: V1 proxy type, no name, no ABI, no shape', async () => {
    const deps = depsFor(
      providerFor(Bytes.EMPTY),
      { type: 'EOA', values: {}, addresses: [], deployment: undefined },
      { name: '', isVerified: true, abi: [], abis: {}, sources: [] },
    )

    const prepared = await prepare(deps, SELF)

    expect(prepared).toEqual({
      chain: CHAIN,
      address: SELF,
      blockNumber: 1_000,
      timestamp: 1_700_000_000,
      isEOA: true,
      name: '',
      isVerified: true,
      proxy: { type: 'EOA', values: {}, addresses: [] },
      abi: [],
      abis: {},
      sources: [],
      warnings: [],
    })
    expect(deps.detectProxy).toHaveBeenOnlyCalledWith(
      deps.provider,
      SELF,
      undefined,
    )
    expect(deps.getSources).toHaveBeenOnlyCalledWith(deps.provider, [], {})
  })

  it('flattens a plain verified contract, hashes it and names the implementation', async () => {
    const source = verifiedSource('Counter', {
      'src/Counter.sol': [
        'pragma solidity ^0.8.0;',
        'import "./Base.sol";',
        'contract Counter is Base { uint256 public count; }',
      ].join('\n'),
      'src/Base.sol': 'pragma solidity ^0.8.0;\ncontract Base {}',
      'README.md': 'not solidity',
    })
    const deps = depsFor(
      providerFor(Bytes.fromHex('0x6080')),
      {
        type: 'immutable',
        values: { $immutable: true },
        addresses: [SELF],
        deployment,
      },
      {
        name: 'Counter',
        isVerified: true,
        abi: source.abi,
        abis: { [SELF.toString()]: source.abi },
        sources: [{ hash: HASH_A, name: 'Counter', address: SELF, source }],
      },
    )

    const prepared = await prepare(deps, SELF)

    expect(prepared.isEOA).toEqual(false)
    expect(prepared.name).toEqual('Counter')
    expect(prepared.proxy).toEqual({
      type: 'immutable',
      values: { $immutable: true },
      addresses: [SELF],
    })
    expect(prepared.deployment).toEqual({
      deployer: DEPLOYER,
      transactionHash: TX_HASH.toString(),
      blockNumber: 500,
      timestamp: 1_600_000_000,
    })
    expect(prepared.abi).toEqual(source.abi)
    expect(prepared.shapeHash).toEqual(HASH_A)
    expect(prepared.implementationNames).toEqual({
      [SELF.toString()]: 'Counter',
    })
    expect(prepared.warnings).toEqual([])

    expect(prepared.sources).toHaveLength(1)
    const flat = prepared.sources[0] as PreparedSource
    expect(flat.hash).toEqual(HASH_A)
    expect(flat.solidityVersion).toEqual('v0.8.20+commit.a1b2c3d4')
    expect(flat.constructorArguments).toEqual('')
    expect(flat.flattened).toMatchRegex(
      /^\/\/ SPDX-License-Identifier: Unknown\npragma solidity 0\.8\.20;\n/,
    )
    expect(flat.flattened).toInclude('contract Base {}')
    expect(flat.flattened).toInclude('contract Counter is Base')
    expect(flat.flattened).not.toInclude('import')
  })

  it('handles an EIP1967 proxy: merged ABI, implementation shape hash, per-address names', async () => {
    const proxySource = verifiedSource('TransparentUpgradeableProxy', {
      'Proxy.sol':
        'pragma solidity ^0.8.0;\ncontract TransparentUpgradeableProxy {}',
    })
    const implementationSource = verifiedSource('Vault', {
      'Vault.sol':
        'pragma solidity ^0.8.0;\ncontract Vault { address public owner; }',
    })
    const abi = [...proxySource.abi, ...implementationSource.abi]
    const deps = depsFor(
      providerFor(Bytes.fromHex('0x6080')),
      {
        type: 'EIP1967 proxy',
        values: { $implementation: IMPLEMENTATION, $admin: ADMIN },
        addresses: [SELF, IMPLEMENTATION],
        deployment,
      },
      {
        name: 'Vault',
        isVerified: true,
        abi,
        abis: {
          [SELF.toString()]: proxySource.abi,
          [IMPLEMENTATION.toString()]: implementationSource.abi,
        },
        sources: [
          {
            hash: HASH_A,
            name: 'TransparentUpgradeableProxy',
            address: SELF,
            source: proxySource,
          },
          {
            hash: HASH_B,
            name: 'Vault',
            address: IMPLEMENTATION,
            source: implementationSource,
          },
        ],
      },
    )

    const prepared = await prepare(deps, SELF)

    expect(prepared.name).toEqual('Vault')
    expect(prepared.proxy.type).toEqual('EIP1967 proxy')
    expect(prepared.proxy.values).toEqual({
      $implementation: IMPLEMENTATION,
      $admin: ADMIN,
    })
    expect(prepared.abi).toEqual(abi)
    expect(prepared.shapeHash).toEqual(HASH_B)
    expect(prepared.implementationNames).toEqual({
      [SELF.toString()]: 'TransparentUpgradeableProxy',
      [IMPLEMENTATION.toString()]: 'Vault',
    })
    expect(prepared.sources.map((source) => source.address)).toEqual([
      SELF,
      IMPLEMENTATION,
    ])
    expect(String(prepared.sources[1]?.flattened)).toInclude(
      'address public owner',
    )
    expect(deps.getSources).toHaveBeenOnlyCalledWith(
      deps.provider,
      [SELF, IMPLEMENTATION],
      {},
    )
  })

  it('keeps an unverified implementation as an empty flattened source with no shape hash', async () => {
    const proxySource = verifiedSource('Proxy', {
      'Proxy.sol': 'pragma solidity ^0.8.0;\ncontract Proxy {}',
    })
    const unverified: ContractSource = {
      ...verifiedSource('', {}),
      isVerified: false,
      abi: [],
      solidityVersion: '',
    }
    const deps = depsFor(
      providerFor(Bytes.fromHex('0x6080')),
      {
        type: 'EIP1967 proxy',
        values: { $implementation: IMPLEMENTATION },
        addresses: [SELF, IMPLEMENTATION],
        deployment,
      },
      {
        name: '',
        isVerified: false,
        abi: proxySource.abi,
        abis: { [SELF.toString()]: proxySource.abi },
        sources: [
          { hash: HASH_A, name: 'Proxy', address: SELF, source: proxySource },
          {
            hash: undefined,
            name: '',
            address: IMPLEMENTATION,
            source: unverified,
          },
        ],
      },
    )

    const prepared = await prepare(deps, SELF)

    expect(prepared.isVerified).toEqual(false)
    expect(prepared.shapeHash).toEqual(undefined)
    expect(prepared.sources[1]).toEqual({
      address: IMPLEMENTATION,
      name: '',
      solidityVersion: '',
      constructorArguments: '',
      flattened: '',
    })
    expect(prepared.warnings).toEqual([])
  })

  it('records a flattener failure as a warning and an empty flattened source', async () => {
    const broken = verifiedSource('Broken', {
      'Broken.sol':
        'pragma solidity ^0.8.0;\ncontract Broken { this is not solidity',
    })
    const deps = depsFor(
      providerFor(Bytes.fromHex('0x6080')),
      {
        type: 'immutable',
        values: { $immutable: true },
        addresses: [SELF],
        deployment,
      },
      {
        name: 'Broken',
        isVerified: true,
        abi: broken.abi,
        abis: { [SELF.toString()]: broken.abi },
        sources: [
          { hash: HASH_A, name: 'Broken', address: SELF, source: broken },
        ],
      },
    )

    const prepared = await prepare(deps, SELF)

    expect(prepared.sources[0]?.flattened).toEqual('')
    expect(prepared.warnings).toHaveLength(1)
    expect(String(prepared.warnings[0])).toMatchRegex(
      /^Flattener error at Broken \(eth:0x1111/,
    )
    expect(prepared.shapeHash).toEqual(HASH_A)
  })

  function verifiedSource(
    name: string,
    files: Record<string, string>,
  ): ContractSource {
    return {
      name,
      rootFile: Object.keys(files).find((file) => file.endsWith('.sol')),
      isVerified: true,
      abi:
        name === ''
          ? []
          : [`function ${name.toLowerCase()}() view returns (uint256)`],
      solidityVersion: 'v0.8.20+commit.a1b2c3d4',
      constructorArguments: '',
      files,
      remappings: [],
      libraries: {},
    }
  }

  function address(hex: string): ChainSpecificAddress {
    return ChainSpecificAddress.fromLong(CHAIN, `0x${hex}`)
  }
})
