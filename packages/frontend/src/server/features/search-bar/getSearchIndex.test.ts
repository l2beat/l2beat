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

  beforeEach(() => {
    env.MOCK = true
  })

  afterEach(() => {
    ps.getProjects = originalGetProjects
    env.MOCK = originalMock
    env.INTEROP_CHAINS = originalInteropChains
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
