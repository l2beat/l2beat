import type { Project } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
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
import { selectChainProjects } from '~/server/features/chains/getChainProjects'
import { isListedDefiProject } from '~/server/features/defi/isListedDefiProject'
import { hasDefiProjectPage } from '~/server/features/defi/project/hasDefiProjectPage'
import { getAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/layer2s/interop/consts'
import {
  getActiveInteropAbstractTokens,
  type InteropAbstractToken,
} from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { ps } from '~/server/projects'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'

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
  const [tokens, projects, attestation] = await Promise.all([
    getActiveInteropAbstractTokens(),
    ps.getProjects({ optional: SEARCH_INDEX_PROJECT_KEYS }),
    getAttestationsMeta(),
  ])
  const cropsAttested = new Set(attestation.current?.projectIds)

  // Rows are arrays themselves, so they are wrapped to survive flatMap.
  const projectRows = projects.flatMap((p) => {
    const row = toSearchIndexProject(p, cropsAttested)
    return row ? [row] : []
  })
  const indexedIds = new Set(projectRows.map(([id]) => id))
  const l2ProjectIds = new Set(
    projects.filter((p) => p.scalingInfo).map((p) => p.id),
  )
  return {
    projects: [
      ...projectRows,
      ...selectChainProjects(l2ProjectIds).map(toSearchIndexChain),
    ],
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

type SearchIndexProjectKey =
  | 'scalingInfo'
  | 'interopConfig'
  | 'zkCatalogInfo'
  | 'privacyInfo'
  | 'defiInfo'
  | 'garden'
  | 'ossificationHistory'
  | 'aliases'
  | 'versions'

export const SEARCH_INDEX_PROJECT_KEYS: SearchIndexProjectKey[] = [
  'scalingInfo',
  'interopConfig',
  'zkCatalogInfo',
  'privacyInfo',
  'defiInfo',
  'garden',
  'ossificationHistory',
  'aliases',
  'versions',
]

type SearchIndexSourceProject = Project<never, SearchIndexProjectKey>

/**
 * Undefined for projects with no page the search bar links to.
 * `cropsAttested`: ids the current CROPS attestation names.
 */
export function toSearchIndexProject(
  project: SearchIndexSourceProject,
  cropsAttested: ReadonlySet<string>,
): SearchIndexProject | undefined {
  const kinds = getProjectKinds(project, cropsAttested)
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

function getProjectKinds(
  project: SearchIndexSourceProject,
  cropsAttested: ReadonlySet<string>,
): SearchIndexProjectKind[] {
  const kinds: SearchIndexProjectKind[] = []
  if (project.id === ProjectId.ETHEREUM) kinds.push('ethereum')
  if (project.scalingInfo) kinds.push(project.scalingInfo.layer)
  // A scaling project's bridge is listed on its scaling page.
  if (project.interopConfig && !project.scalingInfo) kinds.push('interop')
  if (project.zkCatalogInfo) kinds.push('zkCatalog')
  if (project.privacyInfo) kinds.push('privacy')
  if (isSearchableDefiProject(project, cropsAttested)) kinds.push('defi')
  return kinds
}

/**
 * A DeFi project outside a listed category is found once the current CROPS
 * attestation names it, as the garden lists it only then.
 */
function isSearchableDefiProject(
  project: SearchIndexSourceProject,
  cropsAttested: ReadonlySet<string>,
): boolean {
  if (!project.defiInfo) return false
  if (env.CLIENT_SIDE_DEFI_ENABLED && isListedDefiProject(project.defiInfo)) {
    return true
  }
  return (
    env.CLIENT_SIDE_GARDEN_ENABLED &&
    project.garden !== undefined &&
    cropsAttested.has(project.id) &&
    hasDefiProjectPage(project)
  )
}

function toSearchIndexChain(
  chain: ReturnType<typeof selectChainProjects>[number],
): SearchIndexProject {
  return [
    chain.slug,
    chain.slug,
    chain.name,
    manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    ['chain'],
    null,
    [chain.display],
    null,
    null,
  ]
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
