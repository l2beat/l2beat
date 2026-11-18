import type { Project } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import {
  isCoingeckoIcon,
  MAX_RECENTLY_ADDED,
  type SearchIndex,
  type SearchIndexProject,
  type SearchIndexProjectKind,
  type SearchIndexToken,
  toCoingeckoIcon,
} from '~/components/search-bar/searchIndex'
import { env } from '~/env'
import { hasDefiProjectPage } from '~/server/features/defi/project/hasDefiProjectPage'
import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/layer2s/interop/consts'
import {
  getActiveInteropAbstractTokens,
  type InteropAbstractToken,
} from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import {
  PROJECT_PAGE_FIELDS,
  type ProjectPageEntry,
  type ProjectPageSection,
  selectProjectPages,
} from '~/server/features/projects/getProjectPage'
import { ps } from '~/server/projects'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import { getCropsAttestedIds } from './utils/getCropsAttestedIds'

const searchIndexCache = new FrontendInMemoryCache('getSearchIndex')

// Short, because the token list it reads has a cache of its own: with equal
// lifetimes, an index built from that cache's stale copy would keep it for
// another full lifetime. A rebuild costs ~10 ms.
export function getSearchIndexJson(): Promise<string> {
  return searchIndexCache.get(
    { key: ['search-index'], ttl: 60, staleWhileRevalidate: 60 * 15 },
    async () => JSON.stringify(await buildSearchIndex()),
  )
}

export async function buildSearchIndex(): Promise<SearchIndex> {
  const [tokens, projects, cropsAttested] = await Promise.all([
    getActiveInteropAbstractTokens(),
    ps.getProjects({ optional: [...SEARCH_INDEX_PROJECT_KEYS] }),
    getCropsAttestedIds(),
  ])

  const chainIds = new Map(projects.map((p) => [p.slug, getChainIdTag(p)]))
  // Rows are arrays themselves, so they are wrapped to survive flatMap.
  const projectRows = selectProjectPages(projects).flatMap((entry) => {
    const row = toSearchIndexProject(entry, cropsAttested, chainIds)
    return row ? [row] : []
  })
  const indexedIds = new Set(projectRows.map(([id]) => id))
  return {
    projects: projectRows,
    // The token query has no order, and a reordered list would change the
    // ETag, making browsers download the same index again.
    tokens: tokens
      .filter((token) => token.id !== UNKNOWN_ABSTRACT_TOKEN_ID)
      .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map(toSearchIndexToken),
    versionGroups: getVersionGroups(projects),
    recentlyAdded: projects
      .filter((p) => indexedIds.has(p.id))
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(0, MAX_RECENTLY_ADDED)
      .map((p) => p.id),
  }
}

export const SEARCH_INDEX_PROJECT_KEYS = [
  ...PROJECT_PAGE_FIELDS,
  'garden',
  'aliases',
  'versions',
  'chainConfig',
] as const

type SearchIndexSourceProject = Project<
  never,
  (typeof SEARCH_INDEX_PROJECT_KEYS)[number]
>

/**
 * Undefined for a page the search bar does not link to.
 * `cropsAttested`: ids the current CROPS attestation names.
 * `chainIds`: the chain id tag of each project, for pages of chains alone.
 */
export function toSearchIndexProject(
  entry: ProjectPageEntry<SearchIndexSourceProject>,
  cropsAttested: ReadonlySet<string>,
  chainIds: ReadonlyMap<string, string | undefined> = new Map(),
): SearchIndexProject | undefined {
  if (entry.kind === 'chain') {
    const { slug, chain } = entry
    const chainIdTag = chainIds.get(slug)
    return [
      slug,
      slug,
      chain.name,
      manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
      ['chain'],
      null,
      chainIdTag === undefined ? [chain.display] : [chain.display, chainIdTag],
      null,
      null,
    ]
  }
  const { project } = entry
  const kinds = entry.sections.flatMap((section): SearchIndexProjectKind[] => {
    if (!isSearchable(project, entry.listed, section, cropsAttested)) return []
    switch (section) {
      case 'layer2s':
        return project.scalingInfo ? [project.scalingInfo.layer] : []
      // Listed as a chain only when the page shows nothing else.
      case 'chain':
        return []
      default:
        return [section]
    }
  })
  if (kinds.length === 0) return undefined

  return [
    project.id,
    project.slug,
    project.name,
    manifest.getUrl(`/icons/${project.slug}.png`),
    kinds,
    project.scalingInfo?.type ?? null,
    // The group name, so "privacy pools" matches v2 as directly as v1 (slug
    // "privacy-pools"), instead of hiding it as a fuzzy match.
    [
      project.shortName,
      ...(project.aliases ?? []),
      project.versions?.group.name,
      getChainIdTag(project),
    ].filter((tag): tag is string => !!tag),
    project.interopConfig?.name ?? null,
    project.interopConfig?.shortName ?? null,
  ]
}

/** Project ids of each version group, latest first, then newest first. */
function getVersionGroups(projects: SearchIndexSourceProject[]): string[][] {
  const groups = new Map<string, string[]>()
  for (const { versions } of projects) {
    if (!versions || groups.has(versions.group.id)) continue
    // Siblings are in display order, oldest first.
    const { siblings } = versions
    groups.set(versions.group.id, [
      ...siblings.filter((s) => s.isLatest).map((s) => s.id),
      ...siblings
        .filter((s) => !s.isLatest)
        .reverse()
        .map((s) => s.id),
    ])
  }
  return [...groups.values()]
}

/**
 * A section lists the project, or, for a DeFi project outside a listed
 * category, the current CROPS attestation names it, as the garden lists it
 * only then.
 */
function isSearchable(
  project: SearchIndexSourceProject,
  listed: ProjectPageSection[],
  section: ProjectPageSection,
  cropsAttested: ReadonlySet<string>,
): boolean {
  if (listed.includes(section)) return true
  return (
    section === 'defi' &&
    env.CLIENT_SIDE_GARDEN_ENABLED &&
    project.garden !== undefined &&
    cropsAttested.has(project.id) &&
    hasDefiProjectPage(project)
  )
}

/** So a chain is found by its id too, like 1101 for Polygon zkEVM. */
function getChainIdTag(project: SearchIndexSourceProject): string | undefined {
  const chainId = project.chainConfig?.chainId
  if (chainId === undefined) return undefined
  assert(Number.isSafeInteger(chainId), 'Chain id is not an integer')
  assert(chainId > 0, 'Chain id is not positive')
  return chainId.toString()
}

export function toSearchIndexToken(
  token: InteropAbstractToken,
): SearchIndexToken {
  assert(token.id !== UNKNOWN_ABSTRACT_TOKEN_ID, 'Unknown token has no page')
  const iconUrl = token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL
  const icon = toCoingeckoIcon(iconUrl) ?? iconUrl
  if (icon === iconUrl) {
    assert(!isCoingeckoIcon(iconUrl), 'Icon URL reads as a CoinGecko image')
  }
  return [token.id, token.symbol, token.issuer, icon]
}
