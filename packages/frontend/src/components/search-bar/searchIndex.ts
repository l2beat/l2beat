import type { ProjectScalingCategory } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getChainProjectPath } from '~/pages/chain/paths'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import type {
  SearchBarProjectEntry,
  SearchBarTokenEntry,
} from '~/server/features/search-bar/types'
import type { SearchBarCategory } from './searchBarCategories'

/*
 * The names the search bar matches against, sent to the browser once so it
 * searches as you type. Rows are positional and leave out whatever the
 * browser can rebuild (links, categories, repeated tags), so the index stays
 * small. The server encodes it in `getSearchIndex.ts`.
 */

/**
 * Versioned, so a page never reads rows in a layout it doesn't know. Bump it
 * on any change to the schemas below, new enum values included: open tabs
 * parse strictly, so one they don't know would fail their search.
 */
export const SEARCH_INDEX_PATH = '/api/search-index/v2'

export const SearchIndexProjectKind = v.enum([
  'ethereum',
  'layer2',
  'layer3',
  'interop',
  'zkCatalog',
  'privacy',
  'defi',
  'chain',
])
export type SearchIndexProjectKind = v.infer<typeof SearchIndexProjectKind>

const SCALING_CATEGORIES = [
  'Optimistic Rollup',
  'ZK Rollup',
  'Plasma',
  'Validium',
  'Optimium',
  'Other',
] as const satisfies readonly ProjectScalingCategory[]
// Fails to compile when config adds a category the list above misses.
const _everyScalingCategoryListed: (typeof SCALING_CATEGORIES)[number] =
  '' as ProjectScalingCategory

/** One row per project, listing every page it has, so it is sent once. */
export const SearchIndexProject = v.tuple([
  v.string(), // id
  v.string(), // slug
  v.string(), // name
  v.string(), // icon URL
  v.array(SearchIndexProjectKind),
  v.union([v.enum(SCALING_CATEGORIES), v.null()]),
  v.array(v.string()), // tags besides the slug and the name
  v.union([v.string(), v.null()]), // interop name
  v.union([v.string(), v.null()]), // interop short name
  // Version group id and rank, 0 for the latest version, see `SearchBarProjectEntry`.
  v.union([v.tuple([v.string(), v.number()]), v.null()]),
])
export type SearchIndexProject = v.infer<typeof SearchIndexProject>

export const SearchIndexToken = v.tuple([
  v.string(), // id
  v.string(), // symbol
  v.union([v.string(), v.null()]), // issuer
  v.string(), // icon: a CoinGecko image (see `toCoingeckoIcon`) or a URL
])
export type SearchIndexToken = v.infer<typeof SearchIndexToken>

export const SearchIndex = v.object({
  projects: v.array(SearchIndexProject),
  tokens: v.array(SearchIndexToken),
})
export type SearchIndex = v.infer<typeof SearchIndex>

export interface DecodedSearchIndex {
  projects: SearchBarProjectEntry[]
  tokens: SearchBarTokenEntry[]
}

export function decodeSearchIndex(index: SearchIndex): DecodedSearchIndex {
  return {
    projects: index.projects.flatMap(decodeSearchIndexProject),
    tokens: index.tokens.map(decodeSearchIndexToken),
  }
}

const PROJECT_PAGES: Record<
  SearchIndexProjectKind,
  { category: SearchBarCategory; getHref: (slug: string) => string }
> = {
  ethereum: { category: 'other', getHref: () => ETHEREUM_PROJECT_PATH },
  layer2: { category: 'l2', getHref: (s) => `/layer2s/projects/${s}` },
  layer3: { category: 'l2', getHref: (s) => `/layer2s/projects/${s}` },
  interop: { category: 'interop', getHref: (s) => `/interop/protocols/${s}` },
  zkCatalog: { category: 'zkCatalog', getHref: (s) => `/zk-catalog/${s}` },
  privacy: { category: 'privacy', getHref: (s) => `/privacy/projects/${s}` },
  defi: { category: 'defi', getHref: (s) => `/defi/projects/${s}` },
  chain: { category: 'interop', getHref: getChainProjectPath },
}

/** One entry per page of the project, in the order of its kinds. */
export function decodeSearchIndexProject(
  row: SearchIndexProject,
): SearchBarProjectEntry[] {
  const [id, slug, name, iconUrl, kinds, l2Category, tags, ...rest] = row
  const [interopName, interopShortName, version] = rest
  assert(kinds.length > 0, 'Search index project without a page')

  const commonTags = unique([slug, name, ...tags])
  const interopTags = unique([...commonTags, interopName, interopShortName])
  return kinds.map((kind) => {
    const page = PROJECT_PAGES[kind]
    const entry: SearchBarProjectEntry = {
      type: 'project',
      id,
      name,
      iconUrl,
      href: page.getHref(slug),
      category: page.category,
      kind,
      tags: commonTags,
    }
    if (version) entry.version = { group: version[0], rank: version[1] }
    if (kind === 'layer2' || kind === 'layer3') {
      entry.tags = interopTags
      if (l2Category !== null) entry.l2Category = l2Category
    }
    if (kind === 'interop') {
      entry.name = interopName ?? name
      entry.tags = unique([...interopTags, 'interop'])
    }
    return entry
  })
}

export function decodeSearchIndexToken(
  row: SearchIndexToken,
): SearchBarTokenEntry {
  const [id, symbol, issuer, icon] = row
  const href = getInteropTokenUrl({ id, symbol, issuer })
  assert(href, 'Search index token without a page')
  return {
    type: 'token',
    category: 'tokens',
    id,
    name: symbol,
    href,
    iconUrl: fromCoingeckoIcon(icon) ?? icon,
    issuer,
  }
}

/*
 * Nearly every token icon is a CoinGecko image, so the index keeps only its
 * number and file name. Both CoinGecko hosts serve every image, and the
 * `?<timestamp>` suffix does not change the response.
 */
const COINGECKO_ICON_URL =
  /^https:\/\/(?:assets|coin-images)\.coingecko\.com\/coins\/images\/(\d+)\/large\/([^/?]+)(?:\?\d+)?$/
const COINGECKO_ICON = /^(\d+)\/([^/]+)$/

export function toCoingeckoIcon(iconUrl: string): string | undefined {
  const match = COINGECKO_ICON_URL.exec(iconUrl)
  if (!match) return undefined
  return `${match[1]}/${match[2]}`
}

function fromCoingeckoIcon(icon: string): string | undefined {
  const match = COINGECKO_ICON.exec(icon)
  if (!match) return undefined
  return `https://coin-images.coingecko.com/coins/images/${match[1]}/large/${match[2]}`
}

export function isCoingeckoIcon(icon: string): boolean {
  return COINGECKO_ICON.test(icon)
}

function unique(values: (string | null)[]): string[] {
  return [...new Set(values.filter((value): value is string => !!value))]
}
