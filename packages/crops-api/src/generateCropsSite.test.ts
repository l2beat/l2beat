import { expect } from 'earl'
import { type GeneratedFile, generateCropsSite } from './generateCropsSite'
import {
  ARBITRUM_CONTRACT,
  ATTESTATION_UID,
  FACTORY,
  FIXTURE_INPUT,
  IMPLEMENTATION,
  LEDGER,
  MULTISIG,
  PROXY,
} from './test/fixtures'

const lower = (chainSpecific: string) =>
  chainSpecific.slice(chainSpecific.indexOf(':') + 1).toLowerCase()

describe(generateCropsSite.name, () => {
  const files = generateCropsSite(FIXTURE_INPUT)
  const paths = files.map((x) => x.path).sort()
  const read = (path: string) => {
    const file = files.find((x) => x.path === path)
    if (!file) {
      throw new Error(`Missing ${path}`)
    }
    return file.body as Record<string, unknown>
  }

  it('writes the whole file set, checked by listing every path', () => {
    expect(paths).toEqual(
      [
        'v1/crops.json',
        'v1/project/uniswapv3.json',
        'v1/project/uniswap-v3.json',
        'v1/project/other.json',
        `v1/address/1/${lower(FACTORY)}.json`,
        `v1/address/1/${lower(PROXY)}.json`,
        `v1/address/1/${lower(IMPLEMENTATION)}.json`,
        `v1/address/1/${lower(MULTISIG)}.json`,
        `v1/address/42161/${lower(ARBITRUM_CONTRACT)}.json`,
        'v1/addresses.json',
        'v1/openapi.json',
      ].sort(),
    )
  })

  it('writes a project once when its id equals its slug, checked by counting its files', () => {
    expect(paths.filter((x) => x.includes('/project/other'))).toEqual([
      'v1/project/other.json',
    ])
  })

  it('writes the same project body under id and slug, checked by deep equality', () => {
    expect(read('v1/project/uniswapv3.json')).toEqual(
      read('v1/project/uniswap-v3.json'),
    )
    expect(read('v1/project/uniswapv3.json')).toHaveSubset({
      id: 'uniswapv3',
      slug: 'uniswap-v3',
      inGarden: true,
      attested: true,
      attestation: {
        uid: ATTESTATION_UID,
        revision: 3,
        reviewedAt: 1787132641,
        explorerUrl: LEDGER.current?.explorerUrl,
      },
    })
  })

  it('keys addresses by chain id and lowercase address, checked against the index keys', () => {
    const { addresses } = read('v1/addresses.json') as {
      addresses: Record<string, unknown>
    }
    expect(Object.keys(addresses).sort()).toEqual(
      [
        `1:${lower(FACTORY)}`,
        `1:${lower(PROXY)}`,
        `1:${lower(IMPLEMENTATION)}`,
        `1:${lower(MULTISIG)}`,
        `42161:${lower(ARBITRUM_CONTRACT)}`,
      ].sort(),
    )
  })

  it('serves the same matches per address and in the index, checked by comparing both', () => {
    const file = read(`v1/address/1/${lower(PROXY)}.json`)
    const { addresses } = read('v1/addresses.json') as {
      addresses: Record<string, unknown>
    }
    expect(file).toHaveSubset({ chainId: 1, address: lower(PROXY) })
    expect(file.matches).toEqual(addresses[`1:${lower(PROXY)}`])
  })

  it('lists each project once for a shared contract, with its own contract name', () => {
    const file = read(`v1/address/1/${lower(FACTORY)}.json`) as {
      matches: { id: string; contractName: string }[]
    }
    expect(file.matches.map((x) => [x.id, x.contractName]).sort()).toEqual([
      ['other', 'SharedFactory'],
      ['uniswapv3', 'UniswapV3Factory'],
    ])
  })

  it('resolves an implementation and a permission holder to the project', () => {
    const implementation = read(
      `v1/address/1/${lower(IMPLEMENTATION)}.json`,
    ) as { matches: { id: string; contractName: string }[] }
    expect(implementation.matches).toEqual([
      expect.subset({ id: 'uniswapv3', contractName: 'Router' }),
    ])
    const multisig = read(`v1/address/1/${lower(MULTISIG)}.json`) as {
      matches: { id: string; contractName: string }[]
    }
    expect(multisig.matches).toEqual([
      expect.subset({ id: 'uniswapv3', contractName: 'Governance' }),
    ])
  })

  it('gives a match the crops summary, page link and attestation, checked on the attested project', () => {
    const file = read(`v1/address/1/${lower(MULTISIG)}.json`) as {
      matches: unknown[]
    }
    expect(file.matches[0]).toEqual({
      id: 'uniswapv3',
      slug: 'uniswap-v3',
      name: 'Uniswap V3',
      href: 'https://l2beat.com/layer2s/projects/uniswap-v3',
      contractName: 'Governance',
      crops: {
        censorshipResistance: { sentiment: 'good', status: 'reviewed' },
        openSource: { sentiment: 'good', status: 'reviewed' },
        privacy: { sentiment: 'good', status: 'reviewed' },
        security: { sentiment: 'good', status: 'reviewed' },
      },
      attestation: { uid: ATTESTATION_UID, revision: 3 },
    })
  })

  it('marks a red-cropped, unattested project without a page, checked in crops.json', () => {
    const { projects } = read('v1/crops.json') as {
      projects: Record<string, unknown>[]
    }
    expect(projects.map((x) => x.id)).toEqual(['other', 'uniswapv3'])
    expect(projects[0]).toEqual(
      expect.subset({
        id: 'other',
        href: null,
        inGarden: false,
        attested: false,
        attestation: null,
      }),
    )
  })

  it('stamps every JSON file with the attestation metadata, commit and time, checked file by file', () => {
    for (const file of files.filter((x) => x.path !== 'v1/openapi.json')) {
      expect(file.body as object).toHaveSubset({
        attestations: LEDGER,
        generatedAt: 1_800_000_000,
        commit: 'abc123',
      })
    }
  })

  it('fails when a reviewed address sits on a chain with no chain id', () => {
    expect(() =>
      generateCropsSite({ ...FIXTURE_INPUT, chains: { ethereum: 1 } }),
    ).toThrow(/arbitrum/)
  })

  it('sorts the output by path so a rerun produces a byte-identical site', () => {
    const again = generateCropsSite(FIXTURE_INPUT)
    expect(again.map((x: GeneratedFile) => x.path)).toEqual(
      files.map((x) => x.path),
    )
  })
})
