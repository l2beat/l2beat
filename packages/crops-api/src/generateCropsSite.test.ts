import type { Validator } from '@l2beat/validate'
import { expect } from 'earl'
import { type GeneratedFile, generateCropsSite } from './generateCropsSite'
import {
  AddressesResponseSchema,
  AddressResponseSchema,
  CropsResponseSchema,
  ProjectResponseSchema,
} from './schemas'
import {
  ARBITRUM_CONTRACT,
  ATTESTATION_UID,
  FACTORY,
  FIXTURE_INPUT,
  IMPLEMENTATION,
  LEDGER,
  lowerAddress,
  MULTISIG,
  PROXY,
} from './test/fixtures'

const addressPath = (address: typeof FACTORY, chainId = 1) =>
  `v1/address/${chainId}/${lowerAddress(address)}.json`

describe(generateCropsSite.name, () => {
  const files = generateCropsSite(FIXTURE_INPUT)
  const paths = files.map((x) => x.path).sort()
  /** Parsed with the response schema, so every read is also a contract check. */
  const read = <T>(path: string, schema: Validator<T>): T => {
    const file = files.find((x) => x.path === path)
    if (!file) {
      throw new Error(`Missing ${path}`)
    }
    return schema.parse(file.body)
  }

  it('writes the whole file set, checked by listing every path', () => {
    expect(paths).toEqual(
      [
        'v1/crops.json',
        'v1/project/uniswapv3.json',
        'v1/project/uniswap-v3.json',
        'v1/project/other.json',
        addressPath(FACTORY),
        addressPath(PROXY),
        addressPath(IMPLEMENTATION),
        addressPath(MULTISIG),
        addressPath(ARBITRUM_CONTRACT, 42161),
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
    const byId = read('v1/project/uniswapv3.json', ProjectResponseSchema)
    expect(byId).toEqual(
      read('v1/project/uniswap-v3.json', ProjectResponseSchema),
    )
    expect(byId).toHaveSubset({
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
    const { addresses } = read('v1/addresses.json', AddressesResponseSchema)
    expect(Object.keys(addresses).sort()).toEqual(
      [
        `1:${lowerAddress(FACTORY)}`,
        `1:${lowerAddress(PROXY)}`,
        `1:${lowerAddress(IMPLEMENTATION)}`,
        `1:${lowerAddress(MULTISIG)}`,
        `42161:${lowerAddress(ARBITRUM_CONTRACT)}`,
      ].sort(),
    )
  })

  it('serves the same matches per address and in the index, checked by comparing both', () => {
    const file = read(addressPath(PROXY), AddressResponseSchema)
    const { addresses } = read('v1/addresses.json', AddressesResponseSchema)
    expect(file).toHaveSubset({ chainId: 1, address: lowerAddress(PROXY) })
    expect(addresses[`1:${lowerAddress(PROXY)}`]).toEqual(file.matches)
  })

  it('lists each project once for a shared contract, with its own contract name', () => {
    const file = read(addressPath(FACTORY), AddressResponseSchema)
    expect(file.matches.map((x) => [x.id, x.contractName]).sort()).toEqual([
      ['other', 'SharedFactory'],
      ['uniswapv3', 'UniswapV3Factory'],
    ])
  })

  it('resolves an implementation and a permission holder to the project', () => {
    const implementation = read(
      addressPath(IMPLEMENTATION),
      AddressResponseSchema,
    )
    expect(implementation.matches).toEqual([
      expect.subset({ id: 'uniswapv3', contractName: 'Router' }),
    ])
    const multisig = read(addressPath(MULTISIG), AddressResponseSchema)
    expect(multisig.matches).toEqual([
      expect.subset({ id: 'uniswapv3', contractName: 'Governance' }),
    ])
  })

  it('gives a match the crops summary, page link and attestation, checked on the attested project', () => {
    const file = read(addressPath(MULTISIG), AddressResponseSchema)
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
    const { projects } = read('v1/crops.json', CropsResponseSchema)
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
