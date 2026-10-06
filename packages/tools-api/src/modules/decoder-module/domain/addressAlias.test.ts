import { expect, mockObject } from 'earl'
import type { Chain, DiscoveredConfig } from '../../../config/types'
import type { AlchemyClient } from '../../../third-party/AlchemyClient'
import type { EtherscanClient } from '../../../third-party/EtherscanClient'
import { AddressService } from './AddressService'
import { findAddressAlias } from './addressAlias'

const l1 = '0x5a0aae59d09fccbddb6c6cceb07b7279367c3d2a'
const alias = '0x6B1BAE59D09fCcbdDB6C6cceb07B7279367C4E3b'
const names: DiscoveredConfig['names'] = {
  [`eth:${l1}`]: 'SuperchainProxyAdminOwner',
}

describe('findAddressAlias', () => {
  it('adds metadata without extra network lookups or inheriting the L1 ABI', async () => {
    const lookups: string[] = []
    const chain = mockObject<Chain>({
      chainId: 10,
      shortName: 'oeth',
      etherscanApi: true,
      explorerUrl: 'https://optimistic.etherscan.io',
    })
    const service = new AddressService(
      mockObject<AlchemyClient>({
        hasNoCode: async (address) => {
          lookups.push(`rpc:${address}`)
          return true
        },
      }),
      mockObject<EtherscanClient>({
        getContractInfo: async (_chainId, address) => {
          lookups.push(`explorer:${address}`)
          return { verified: false, name: '', abi: [] }
        },
      }),
      {
        names: {
          ...names,
          [`oeth:${alias.toLowerCase()}`]: 'Existing L2 name',
        },
        abis: { [`eth:${l1}`]: ['function approveHash(bytes32 hash)'] },
        allAbis: [],
        preImages: [],
      },
      {},
      [chain],
    )
    const result = await service.lookup(
      `oeth:${alias.toLowerCase()}` as `oeth:0x${string}`,
    )
    expect(result.name).toEqual('Existing L2 name')
    expect(result.alias?.address).toEqual(l1)
    expect(result.abi).toEqual([])
    expect(lookups).toEqual([
      `rpc:${alias.toLowerCase()}`,
      `explorer:${alias.toLowerCase()}`,
    ])
  })

  it('recognizes a known Ethereum address on OP Stack and Arbitrum', () => {
    for (const chainId of [10, 8453, 42161, 42170, 130, 7777777]) {
      expect(findAddressAlias(alias, chainId, names)).toEqual({
        address: l1,
        chainId: 1,
        name: 'SuperchainProxyAdminOwner',
        context: 'l2',
      })
    }
  })

  it('labels addresses in L1 calldata as matches with unknown L2 context', () => {
    expect(findAddressAlias(alias, 1, names)?.context).toEqual('unknown')
  })

  it('does not infer aliases on unsupported chains or from L2 names', () => {
    for (const chainId of [0, 100, 137, 999999]) {
      expect(findAddressAlias(alias, chainId, names)).toEqual(undefined)
    }
    expect(
      findAddressAlias(alias, 10, { [`oeth:${l1}`]: 'Wrong chain' }),
    ).toEqual(undefined)
    expect(findAddressAlias(alias, 10, {})).toEqual(undefined)
  })

  it('wraps subtraction at 160 bits and keeps leading zeros', () => {
    const max = `eth:0x${'f'.repeat(40)}` as const
    expect(
      findAddressAlias('0x1111000000000000000000000000000000001110', 10, {
        [max]: 'Wraparound',
      })?.address,
    ).toEqual(`0x${'f'.repeat(40)}`)
    expect(
      findAddressAlias('0x1111000000000000000000000000000000001112', 10, {
        'eth:0x0000000000000000000000000000000000000001': 'Leading zeros',
      })?.address,
    ).toEqual('0x0000000000000000000000000000000000000001')
  })

  it('rejects malformed addresses', () => {
    expect(findAddressAlias('0x1234', 10, names)).toEqual(undefined)
    expect(
      findAddressAlias('0xzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz', 10, names),
    ).toEqual(undefined)
  })

  it('uses one dictionary read, without scanning known addresses', () => {
    const reads: string[] = []
    const indexed = new Proxy(names, {
      get(target, key: string) {
        reads.push(key)
        return target[key as keyof typeof target]
      },
      ownKeys() {
        throw new Error('Must not scan addresses')
      },
    })
    expect(findAddressAlias(alias, 10, indexed)?.address).toEqual(l1)
    expect(reads).toEqual([`eth:${l1}`])
  })
})
