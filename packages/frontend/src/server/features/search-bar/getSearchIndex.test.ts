import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { searchProjectsAndTokens } from '~/components/search-bar/searchBarResults'
import {
  decodeSearchIndex,
  SearchIndex,
} from '~/components/search-bar/searchIndex'
import { env } from '~/env'
import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/layer2s/interop/consts'
import type { InteropAbstractToken } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { ps } from '~/server/projects'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import { getSearchBarAddressEntries } from './getSearchBarAddressEntries'
import { buildSearchIndex, toSearchIndexToken } from './getSearchIndex'

/**
 * Searches the way the browser does: the index goes through JSON and the
 * browser's parser, so the tests cover encoding and decoding too.
 */
async function getSearchBarEntries(search: string) {
  if (EthereumAddress.checkIgnoringCase(search.trim())) {
    return getSearchBarAddressEntries(search)
  }
  const json = JSON.stringify(await buildSearchIndex())
  const index = decodeSearchIndex(SearchIndex.parse(JSON.parse(json)))
  return searchProjectsAndTokens(search, index)
}

describe('search bar search', () => {
  const originalGetProjects = ps.getProjects.bind(ps)
  const originalMock = env.MOCK
  const originalInteropChains = env.INTEROP_CHAINS
  const originalFlags = {
    defi: env.CLIENT_SIDE_DEFI_ENABLED,
    garden: env.CLIENT_SIDE_GARDEN_ENABLED,
    ossification: env.CLIENT_SIDE_OSSIFICATION_ENABLED,
  }

  beforeEach(() => {
    env.MOCK = true
  })

  afterEach(() => {
    ps.getProjects = originalGetProjects
    env.MOCK = originalMock
    env.INTEROP_CHAINS = originalInteropChains
    env.CLIENT_SIDE_DEFI_ENABLED = originalFlags.defi
    env.CLIENT_SIDE_GARDEN_ENABLED = originalFlags.garden
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = originalFlags.ossification
  })

  it('keeps only direct project matches when they exist', async () => {
    ps.getProjects = async () =>
      [
        l2Project('ethereal', 'Ethereal', 'Other', 'layer3'),
        l2Project('jetstreamchain', 'Jetstream'),
        l2Project('etherex', 'Etherex'),
      ] as never

    const result = await getSearchBarEntries('ethere')

    expect(result.map((entry) => entry.name)).toEqual(['Etherex', 'Ethereal'])
    expect(result.map((entry) => entry.searchMatchKind)).toEqual([
      'direct',
      'direct',
    ])
  })

  // Ethereum is a DA layer, not a scaling project, yet has its own page.
  it('finds Ethereum and links its page', async () => {
    ps.getProjects = async () =>
      [
        { id: ProjectId.ETHEREUM, slug: 'ethereum', name: 'Ethereum' },
        l2Project('etherex', 'Etherex'),
      ] as never

    const result = await getSearchBarEntries('ethereum')

    expect(result.find((entry) => entry.name === 'Ethereum')?.href).toEqual(
      '/projects/ethereum',
    )
  })

  // Some chain pages have no project behind them, like Solana's.
  it('finds interop chains that have a chain page', async () => {
    env.INTEROP_CHAINS = ['solana', 'arbitrum']
    ps.getProjects = async () =>
      [l2Project('arbitrum', 'Arbitrum One')] as never

    const result = await getSearchBarEntries('sol')

    expect(
      result.map(({ name, href, category }) => ({ name, href, category })),
    ).toEqual([
      { name: 'Solana', href: '/projects/solana', category: 'interop' },
    ])
  })

  it('links a scaling chain to its scaling page only', async () => {
    env.INTEROP_CHAINS = ['solana', 'arbitrum']
    ps.getProjects = async () =>
      [l2Project('arbitrum', 'Arbitrum One')] as never

    const result = await getSearchBarEntries('arbitrum')

    expect(result.map((entry) => entry.href)).toEqual([
      '/layer2s/projects/arbitrum',
    ])
  })

  // Regression: "az" listed Aztec Network v5 first, as its shorter slug
  // ("aztecnetwork") scored higher than v6's.
  it('lists the versions of a project together, latest first', async () => {
    const v4 = l2Project('aztec', 'Aztec Network v4', 'ZK Rollup')
    const v5 = l2Project('aztecnetwork', 'Aztec Network v5', 'ZK Rollup')
    const v6 = l2Project('aztecnetworkv6', 'Aztec Network v6', 'ZK Rollup')
    const siblings = [v4, v5, v6].map((p) => ({
      id: p.id,
      isLatest: p === v6,
    }))
    ps.getProjects = async () =>
      [
        l2Project('azure', 'Azure'),
        ...[v4, v5, v6].map((p) => ({
          ...p,
          versions: { group: { id: 'aztec', name: 'Aztec' }, siblings },
        })),
      ] as never

    for (const query of ['az', 'aztec', 'aztec network']) {
      const result = await getSearchBarEntries(query)
      const names = result.map((entry) => entry.name)
      expect(names.filter((name) => name.startsWith('Aztec'))).toEqual([
        'Aztec Network v6',
        'Aztec Network v5',
        'Aztec Network v4',
      ])
      // Together, wherever the group ranks.
      const first = names.indexOf('Aztec Network v6')
      expect(names[first + 1]).toEqual('Aztec Network v5')
      expect(names[first + 2]).toEqual('Aztec Network v4')
    }
  })

  // Regression: "privacy pools" equals v1's slug, a direct match that hid v2.
  it('finds every version by the name of their group', async () => {
    const v1 = l2Project('privacy-pools', 'Privacy Pools v1')
    const v2 = l2Project('privacy-pools-v2', 'Privacy Pools v2')
    const siblings = [
      { id: v1.id, isLatest: false },
      { id: v2.id, isLatest: true },
    ]
    const group = { id: 'privacy-pools', name: 'Privacy Pools' }
    ps.getProjects = async () =>
      [v1, v2].map((p) => ({ ...p, versions: { group, siblings } })) as never

    const result = await getSearchBarEntries('privacy pools')

    expect(result.map((entry) => entry.name)).toEqual([
      'Privacy Pools v2',
      'Privacy Pools v1',
    ])
  })

  it('falls back to fuzzy project matches when there are no direct matches', async () => {
    ps.getProjects = async () =>
      [l2Project('jetstreamchain', 'Jetstream')] as never

    const result = await getSearchBarEntries('jtsrm')

    expect(result.map((entry) => entry.name)).toEqual(['Jetstream'])
    expect(result[0]?.searchMatchKind).toEqual('fuzzy')
  })

  // Regression: with one shared limit, "rob" returned only short token symbols
  // and no "Robinhood Chain". Mock tokens are fixed, so here exact "Usd"
  // project matches do the crowding instead, outscoring USDC/USDT.
  it('limits projects and tokens separately', async () => {
    ps.getProjects = async () =>
      Array.from({ length: 16 }, (_, i) =>
        l2Project(`usd-${i}`, 'Usd'),
      ) as never

    const result = await getSearchBarEntries('usd')

    expect(result.filter((entry) => entry.type === 'project')).toHaveLength(15)
    expect(
      result
        .filter((entry) => entry.type === 'token')
        .map((entry) => entry.name),
    ).toEqual(['USDC', 'USDT'])
  })

  it('allows searching interop tokens by symbol', async () => {
    ps.getProjects = async () => [] as never

    const result = await getSearchBarEntries('usdc')

    expect(result).toHaveLength(1)
    expect(result[0]?.type).toEqual('token')
    expect(result[0]?.category).toEqual('tokens')
    expect(result[0]?.name).toEqual('USDC')
    expect(result[0]?.searchMatchKind).toEqual('direct')
  })

  it('finds a token by the address of its onchain deployment', async () => {
    ps.getProjects = async () => [] as never

    const result = await getSearchBarEntries(USDC_ADDRESS)

    expect(result).toHaveLength(1)
    expect(result[0]?.type).toEqual('token')
    expect(result[0]?.name).toEqual('USDC')
    expect(result[0]?.href).toEqual('/tokens/usdc01/circle/usdc')
    expect(result[0]?.searchMatchKind).toEqual('direct')
  })

  it('ranks the token above projects that list its contract', async () => {
    ps.getProjects = async () =>
      [l2ProjectWithContract('etherex', 'Etherex', USDC_ADDRESS)] as never

    const result = await getSearchBarEntries(USDC_ADDRESS)

    expect(result.map((entry) => entry.name)).toEqual(['USDC', 'Etherex'])
  })

  it('finds projects by a lowercase contract address', async () => {
    const address = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
    ps.getProjects = async () =>
      [l2ProjectWithContract('etherex', 'Etherex', address)] as never

    const result = await getSearchBarEntries(address)

    expect(result.map((entry) => entry.name)).toEqual(['Etherex'])
  })

  it('ignores whitespace around a pasted address', async () => {
    ps.getProjects = async () => [] as never

    const result = await getSearchBarEntries(` ${USDC_ADDRESS}\n`)

    expect(result.map((entry) => entry.name)).toEqual(['USDC'])
  })

  it('lists a project once per page it has', async () => {
    ps.getProjects = async () =>
      [
        {
          ...l2Project('scroll', 'Scroll', 'ZK Rollup'),
          zkCatalogInfo: {},
          interopConfig: { name: 'Scroll Canonical' },
        },
      ] as never

    const result = await getSearchBarEntries('scroll')

    expect(
      result.map((entry) => ({
        href: entry.href,
        category: entry.category,
        l2Category: entry.type === 'project' ? entry.l2Category : undefined,
      })),
    ).toEqual([
      {
        href: '/layer2s/projects/scroll',
        category: 'l2',
        l2Category: 'ZK Rollup',
      },
      {
        href: '/zk-catalog/scroll',
        category: 'zkCatalog',
        l2Category: undefined,
      },
    ])
  })

  // DeFi pages are off, but those the ossification table measures exist.
  it('finds DeFi projects reviewed in CROPS', async () => {
    env.CLIENT_SIDE_DEFI_ENABLED = false
    env.CLIENT_SIDE_GARDEN_ENABLED = true
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = true
    const safe = defiProject('safe', 'Safe', {
      garden: {},
      ossificationHistory: {},
    })
    const projects = [
      safe,
      defiProject('safeswap', 'Safeswap', { ossificationHistory: {} }),
      defiProject('safelend', 'Safelend', { garden: {} }),
      // Evaluated in config, but not yet attested.
      defiProject('safebox', 'Safebox', {
        garden: {},
        ossificationHistory: {},
      }),
    ]
    // In mock mode the attestation names what this query returns.
    ps.getProjects = (async (query?: { where?: string[] }) =>
      query?.where?.includes('crops') ? [safe] : projects) as never

    const result = await getSearchBarEntries('safe')

    expect(
      result.map(({ name, href, category }) => ({ name, href, category })),
    ).toEqual([{ name: 'Safe', href: '/defi/projects/safe', category: 'defi' }])
  })

  it('searches without CROPS projects when the attestation cannot be read', async () => {
    env.CLIENT_SIDE_DEFI_ENABLED = false
    env.CLIENT_SIDE_GARDEN_ENABLED = true
    env.CLIENT_SIDE_OSSIFICATION_ENABLED = true
    const projects = [
      defiProject('safe', 'Safe', { garden: {}, ossificationHistory: {} }),
      l2Project('safechain', 'Safechain'),
    ]
    // In mock mode this query stands in for the attestation read.
    ps.getProjects = (async (query?: { where?: string[] }) => {
      if (query?.where?.includes('crops')) throw new Error('Database down')
      return projects
    }) as never

    const result = await getSearchBarEntries('safe')

    expect(result.map((entry) => entry.name)).toEqual(['Safechain'])
  })

  it('lists recently added projects with a page, newest first', async () => {
    env.CLIENT_SIDE_DEFI_ENABLED = false
    ps.getProjects = async () =>
      [
        { ...l2Project('scroll', 'Scroll'), addedAt: 1, zkCatalogInfo: {} },
        // No page the search bar links to.
        { ...defiProject('aave', 'Aave', {}), addedAt: 3 },
        { ...l2Project('base', 'Base'), addedAt: 2 },
      ] as never

    const index = decodeSearchIndex(await buildSearchIndex())

    expect(index.recentlyAdded.map((entry) => entry.href)).toEqual([
      '/layer2s/projects/base',
      '/layer2s/projects/scroll',
      '/zk-catalog/scroll',
    ])
  })

  it('names an interop protocol by its interop name and finds it by alias', async () => {
    ps.getProjects = async () =>
      [
        {
          id: ProjectId('stargate'),
          slug: 'stargate',
          name: 'Stargate Finance',
          aliases: ['LayerZero'],
          interopConfig: { name: 'Stargate' },
        },
      ] as never

    const result = await getSearchBarEntries('layerzero')

    expect(result.map(({ name, href }) => ({ name, href }))).toEqual([
      { name: 'Stargate', href: '/interop/protocols/stargate' },
    ])
  })
})

describe(toSearchIndexToken.name, () => {
  it('keeps only the number and file of a CoinGecko icon', () => {
    const row = toSearchIndexToken(
      token({
        iconUrl:
          'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      }),
    )
    const [entry] = decodeSearchIndex({ projects: [], tokens: [row] }).tokens

    expect(row[3]).toEqual('6319/usdc.png')
    expect(entry?.iconUrl).toEqual(
      'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png',
    )
  })

  it('keeps other icons whole', () => {
    const iconUrl = 'https://example.com/icon.png'
    const row = toSearchIndexToken(token({ iconUrl }))
    const [entry] = decodeSearchIndex({ projects: [], tokens: [row] }).tokens

    expect(entry?.iconUrl).toEqual(iconUrl)
  })

  it('links issuerless tokens by id and symbol and falls back to the placeholder icon', () => {
    const row = toSearchIndexToken(
      token({ id: 'eth001', symbol: 'ETH', issuer: null, iconUrl: null }),
    )
    const [entry] = decodeSearchIndex({ projects: [], tokens: [row] }).tokens

    expect(entry?.href).toEqual('/tokens/eth001/eth')
    expect(entry?.iconUrl).toEqual(TOKEN_PLACEHOLDER_ICON_URL)
  })

  it('rejects the unknown abstract token', () => {
    expect(() =>
      toSearchIndexToken(token({ id: UNKNOWN_ABSTRACT_TOKEN_ID })),
    ).toThrow()
  })
})

function token(overrides: Partial<InteropAbstractToken>): InteropAbstractToken {
  return {
    id: 'tkn001',
    symbol: 'TKN',
    issuer: null,
    iconUrl: 'https://example.com/icon.png',
    category: 'stablecoin',
    isPriceUnreliable: false,
    ...overrides,
  }
}

const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

function l2ProjectWithContract(slug: string, name: string, address: string) {
  return {
    ...l2Project(slug, name),
    contracts: {
      addresses: {
        ethereum: [
          { address: `eth:${EthereumAddress(address)}`, name: 'Bridge' },
        ],
      },
    },
  }
}

function defiProject(slug: string, name: string, rest: object) {
  return {
    id: ProjectId(slug),
    slug,
    name,
    defiInfo: { category: 'Multisig' },
    ...rest,
  }
}

function l2Project(
  slug: string,
  name: string,
  l2Category: 'Other' | 'Optimistic Rollup' | 'ZK Rollup' = 'Other',
  layer: 'layer2' | 'layer3' = 'layer2',
) {
  return {
    id: ProjectId(slug),
    slug,
    name,
    scalingInfo: {
      layer,
      type: l2Category,
    },
  }
}
