import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { buildCropsAddressIndex } from './getCropsAddressIndex'
import { type ChainLookup, parseCropsAddressWith } from './parseCropsAddress'

const FACTORY = 'eth:0x1F98431c8aD98523631AE4a59f267346ea31F984'
const PROXY = 'eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc'
const IMPLEMENTATION = 'eth:0x03893a7c7463AE47D46bc7f091665f1893656003'
const MULTISIG = 'eth:0x07687e702b410Fa43f4cB4Af7FA097918ffD2730'

const PROJECTS = [
  {
    id: 'uniswapv3',
    contracts: {
      addresses: {
        ethereum: [
          {
            address: ChainSpecificAddress(FACTORY),
            name: 'UniswapV3Factory',
          },
          {
            address: ChainSpecificAddress(PROXY),
            name: 'Router',
            upgradeability: {
              implementations: [ChainSpecificAddress(IMPLEMENTATION)],
            },
          },
        ],
      },
    },
    permissions: {
      ethereum: {
        actors: [
          {
            name: 'Governance',
            accounts: [{ address: ChainSpecificAddress(MULTISIG) }],
          },
        ],
      },
    },
  },
  {
    // A second project sharing the factory, as shared modules really do.
    id: 'someotherproject',
    contracts: {
      addresses: {
        ethereum: [
          { address: ChainSpecificAddress(FACTORY), name: 'SharedFactory' },
        ],
      },
    },
  },
]

describe(buildCropsAddressIndex.name, () => {
  const index = buildCropsAddressIndex(PROJECTS)
  const bare = (address: string) =>
    ChainSpecificAddress.address(ChainSpecificAddress(address))

  it('resolves an immutable contract as an implementation', () => {
    expect(index.lookup('ethereum', bare(FACTORY))).toInclude({
      projectId: 'uniswapv3',
      targetName: 'UniswapV3Factory',
      role: 'implementation',
    })
  })

  it('resolves an upgradeable contract as a proxy', () => {
    expect(index.lookup('ethereum', bare(PROXY))).toEqual([
      { projectId: 'uniswapv3', targetName: 'Router', role: 'proxy' },
    ])
  })

  it('resolves an address behind a proxy to the same project', () => {
    expect(index.lookup('ethereum', bare(IMPLEMENTATION))).toEqual([
      { projectId: 'uniswapv3', targetName: 'Router', role: 'implementation' },
    ])
  })

  it('resolves a permission holder', () => {
    expect(index.lookup('ethereum', bare(MULTISIG))).toEqual([
      { projectId: 'uniswapv3', targetName: 'Governance', role: 'permission' },
    ])
  })

  it('returns every project that claims a shared address', () => {
    const matches = index.lookup('ethereum', bare(FACTORY))
    expect(matches.map((x) => x.projectId).sort()).toEqual([
      'someotherproject',
      'uniswapv3',
    ])
  })

  it('does not leak matches across chains', () => {
    expect(index.lookup('arbitrum', bare(FACTORY))).toEqual([])
  })

  it('returns an empty list for an unknown address', () => {
    expect(
      index.lookup(
        'ethereum',
        EthereumAddress('0xdead00000000000000000000000000000000dead'),
      ),
    ).toEqual([])
  })
})

describe(parseCropsAddressWith.name, () => {
  const chains: ChainLookup = {
    byChainId: new Map([
      [1, 'ethereum'],
      [42161, 'arbitrum'],
    ]),
    longNames: new Set(['ethereum', 'arbitrum']),
  }
  const parse = (input: string) => parseCropsAddressWith(input, chains)
  const expected = {
    chain: 'ethereum',
    address: EthereumAddress(FACTORY.slice(4)),
  }

  it('accepts an ERC-3770 short name', () => {
    expect(parse(FACTORY)).toEqual(expected)
  })

  it('accepts a long chain name', () => {
    expect(parse(`ethereum:${FACTORY.slice(4)}`)).toEqual(expected)
  })

  it('accepts a chain id', () => {
    expect(parse(`1:${FACTORY.slice(4)}`)).toEqual(expected)
  })

  it('accepts a lowercase address, as wallets send', () => {
    expect(parse(FACTORY.toLowerCase())).toEqual(expected)
  })

  it('accepts an address whose mixed case is not a valid checksum', () => {
    // Rejecting these would fail on input real wallets produce.
    expect(parse('eth:0x1f98431c8AD98523631AE4a59f267346ea31F984')).toEqual(
      expected,
    )
  })

  it('rejects an unknown chain', () => {
    expect(parse(`notachain:${FACTORY.slice(4)}`)).toEqual(undefined)
    expect(parse(`999999:${FACTORY.slice(4)}`)).toEqual(undefined)
  })

  it('rejects input that is not chain:address', () => {
    expect(parse('nonsense')).toEqual(undefined)
    expect(parse(FACTORY.slice(4))).toEqual(undefined)
    expect(parse('eth:0x123')).toEqual(undefined)
  })
})
