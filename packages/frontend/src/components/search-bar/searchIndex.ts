import type { ProjectScalingCategory } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import type {
  SearchBarProjectEntry,
  SearchBarTokenEntry,
} from '~/server/features/search-bar/types'
import { getProjectPath } from '~/utils/project/getProjectUrl'
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
 * parse strictly, so one they don't know would fail their search. A new
 * optional key on `SearchIndex` needs no bump, as open tabs ignore it.
 */
export const SEARCH_INDEX_PATH = '/api/search-index/v1'

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

/**
 * One row per project page, listing the sections it covers in the order of
 * the page's labels: the first is the section the page is built on.
 */
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
  // Project ids of each version group, latest first. Optional, because a
  // browser may still hold an index cached before the key existed.
  versionGroups: v.array(v.array(v.string())).optional(),
})
export type SearchIndex = v.infer<typeof SearchIndex>

export interface DecodedSearchIndex {
  projects: SearchBarProjectEntry[]
  tokens: SearchBarTokenEntry[]
}

export function decodeSearchIndex(index: SearchIndex): DecodedSearchIndex {
  const versions = new Map<string, SearchBarProjectEntry['version']>()
  for (const ids of index.versionGroups ?? []) {
    for (const [rank, id] of ids.entries()) {
      versions.set(id, { group: ids[0] ?? id, rank })
    }
  }
  const projects = index.projects.flatMap(decodeSearchIndexProject)
  for (const project of projects) {
    const version = versions.get(project.id)
    if (version) project.version = version
  }
  return { projects, tokens: index.tokens.map(decodeSearchIndexToken) }
}

const KIND_CATEGORIES: Record<SearchIndexProjectKind, SearchBarCategory> = {
  ethereum: 'other',
  layer2: 'l2',
  layer3: 'l2',
  interop: 'interop',
  zkCatalog: 'zkCatalog',
  privacy: 'privacy',
  defi: 'defi',
  chain: 'interop',
}

/** One entry per project page, under the section it is built on. */
export function decodeSearchIndexProject(
  row: SearchIndexProject,
): SearchBarProjectEntry[] {
  const [id, slug, name, iconUrl, kinds, l2Category, tags, ...interop] = row
  const [interopName, interopShortName] = interop
  const [kind, ...otherKinds] = kinds
  assert(kind, 'Search index project without a page')

  const hasInterop = kinds.some(
    (k) => k === 'layer2' || k === 'layer3' || k === 'interop',
  )
  const entry: SearchBarProjectEntry = {
    type: 'project',
    id,
    // An interop protocol's page shows the protocol's name.
    name: kind === 'interop' ? (interopName ?? name) : name,
    iconUrl,
    href: getProjectPath(slug),
    category: KIND_CATEGORIES[kind],
    kind,
    tags: unique([
      slug,
      name,
      ...tags,
      ...(hasInterop ? [interopName, interopShortName] : []),
      ...(kinds.includes('interop') ? ['interop'] : []),
    ]),
  }
  if (otherKinds.length > 0) entry.otherKinds = otherKinds
  if (l2Category !== null) entry.l2Category = l2Category
  return [entry]
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
