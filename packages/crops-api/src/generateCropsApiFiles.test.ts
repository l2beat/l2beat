import { describe, expect, it } from 'vitest'
import {
  CROPS_API_ROUTES,
  CROPS_API_SCHEMAS,
  type CropsApiRouteKey,
} from './api'
import {
  type CropsApiFile,
  generateCropsApiFiles,
} from './generateCropsApiFiles'
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

describe(generateCropsApiFiles.name, () => {
  const files = generateCropsApiFiles(FIXTURE_INPUT)
  const paths = files.map((x) => x.path).sort()
  type BodyOf = { [F in CropsApiFile as F['route']]: F['body'] }
  const read = <K extends CropsApiRouteKey>(
    route: K,
    path: string,
  ): BodyOf[K] => {
    const file = files.find((x) => x.route === route && x.path === path)
    if (!file) {
      throw new Error(`Missing ${path}`)
    }
    return file.body as BodyOf[K]
  }

  it('writes the whole file set, checked by listing every path', () => {
    expect(paths).toStrictEqual(
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
      ].sort(),
    )
  })

  it('parses every file with the validator its route publishes, after a JSON round trip', () => {
    for (const file of files) {
      const route = CROPS_API_ROUTES.find((x) => x.key === file.route)
      if (!route) {
        throw new Error(`${file.path} is not published`)
      }
      const result = CROPS_API_SCHEMAS[route.result].safeParse(
        JSON.parse(JSON.stringify(file.body)),
      )
      if (!result.success) {
        throw new Error(`${file.path}: ${result.message}`)
      }
    }
  })

  it('exercises every route with the fixtures, checked by the set of route tags', () => {
    expect([...new Set(files.map((x) => x.route))].sort()).toStrictEqual(
      CROPS_API_ROUTES.map((x) => x.key).sort(),
    )
  })

  it('writes a project once when its id equals its slug, checked by counting its files', () => {
    expect(paths.filter((x) => x.includes('/project/other'))).toStrictEqual([
      'v1/project/other.json',
    ])
  })

  it('writes the same project body under id and slug, checked by deep equality', () => {
    const byId = read('project', 'v1/project/uniswapv3.json')
    expect(byId).toStrictEqual(read('project', 'v1/project/uniswap-v3.json'))
    expect(byId).toMatchObject({
      id: 'uniswapv3',
      slug: 'uniswap-v3',
      inGarden: true,
      attestation: {
        uid: ATTESTATION_UID,
        revision: 3,
        reviewedAt: 1787132641,
        explorerUrl: LEDGER.current?.explorerUrl,
      },
    })
  })

  it('keys an address file by chain id and lowercase address, checked in path and body', () => {
    const file = read('address', addressPath(PROXY))
    expect(file).toMatchObject({ chainId: 1, address: lowerAddress(PROXY) })
  })

  it('lists each project once for a shared contract, with its own contract name', () => {
    const file = read('address', addressPath(FACTORY))
    expect(
      file.matches.map((x) => [x.id, x.contractName]).sort(),
    ).toStrictEqual([
      ['other', 'SharedFactory'],
      ['uniswapv3', 'UniswapV3Factory'],
    ])
  })

  it('resolves an implementation and a permission holder to the project', () => {
    const implementation = read('address', addressPath(IMPLEMENTATION))
    expect(implementation.matches).toStrictEqual([
      expect.objectContaining({ id: 'uniswapv3', contractName: 'Router' }),
    ])
    const multisig = read('address', addressPath(MULTISIG))
    expect(multisig.matches).toStrictEqual([
      expect.objectContaining({ id: 'uniswapv3', contractName: 'Governance' }),
    ])
  })

  it('gives a match the crops summary, page link and attestation, checked on the attested project', () => {
    const file = read('address', addressPath(MULTISIG))
    expect(file.matches[0]).toStrictEqual({
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
    const { projects } = read('crops', 'v1/crops.json')
    expect(projects.map((x) => x.id)).toStrictEqual(['other', 'uniswapv3'])
    expect(projects[0]).toStrictEqual(
      expect.objectContaining({
        id: 'other',
        href: null,
        inGarden: false,
        attestation: null,
      }),
    )
  })

  it('stamps every file with the attestation metadata, commit and time, checked file by file', () => {
    for (const file of files) {
      expect(file.body).toMatchObject({
        attestations: LEDGER,
        generatedAt: 1_800_000_000,
        commit: 'abc123',
      })
    }
  })

  it('fails when a reviewed address sits on a chain with no chain id', () => {
    expect(() =>
      generateCropsApiFiles({ ...FIXTURE_INPUT, chains: { ethereum: 1 } }),
    ).toThrow(/arbitrum/)
  })

  it('sorts the output by path so a rerun produces a byte-identical site', () => {
    const again = generateCropsApiFiles(FIXTURE_INPUT)
    expect(again.map((x: CropsApiFile) => x.path)).toStrictEqual(
      files.map((x) => x.path),
    )
  })
})
