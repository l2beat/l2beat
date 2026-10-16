import { INTEROP_TRANSFER_RETENTION } from '@l2beat/database'
import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getLatestInteropTokenData } from '~/server/features/layer2s/interop/getInteropTokenData'
import { findInteropAbstractToken } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { getInteropTokenEntry } from '~/server/features/layer2s/interop/token/getInteropTokenEntry'
import { getAggregatedInteropSnapshotTimestamp } from '~/server/features/layer2s/interop/utils/getAggregatedInteropTimestamp'
import { getActiveInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import { getTokenGraphs } from '~/server/features/tokens/getTokenGraphs'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { getInteropTokenUrl } from '../utils/getInteropTokenUrl'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'
import type { InteropSelection } from '../utils/types'
import { renderInteropTokenMarkdown } from './renderInteropTokenMarkdown'

export async function getInteropTokenPageData(
  req: Request<{ slug: string }>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const appLayoutProps = await getAppLayoutProps()
  const interopChainsWithIcons = getInteropChainsWithIcons(manifest)
  const data = await getCachedInteropTokenPage(
    req.params.slug,
    interopChainsWithIcons,
    cache,
  )

  if (!data) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: data.token.symbol,
        description: `Interoperability activity for ${data.token.symbol} across the Ethereum ecosystem.`,
        // The page is reachable by id alone, so point metadata at the full
        // issuer/symbol URL to keep a single canonical address per token.
        url: getInteropTokenUrl(data.token) ?? req.originalUrl,
        openGraph: {
          image: `/interop/tokens/${data.token.slug}/opengraph-image.png`,
          dynamic: true,
        },
      }),
    },
    ssr: {
      page: 'InteropTokenPage',
      props: {
        ...appLayoutProps,
        token: {
          ...data.token,
          iconUrl: data.token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
        },
        tokenEntry: data.tokenEntry,
        tokenData: data.tokenData,
        lastSyncedAt: data.lastSyncedAt,
        apiSelection: data.apiSelection,
        interopChains: interopChainsWithIcons,
        initialSelection: ALL_CHAINS_SELECTION,
      },
    },
  }
}

/** The markdown alternate of the page, built from the same cached data as the HTML. */
export async function getInteropTokenMarkdown(
  slug: string,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<string | undefined> {
  const data = await getCachedInteropTokenPage(
    slug,
    getInteropChainsWithIcons(manifest),
    cache,
  )
  return data && renderInteropTokenMarkdown(data)
}

// Token pages do not honor chain selection from query params; an empty
// selection makes the backend default to all active chains.
const ALL_CHAINS_SELECTION: InteropSelection = { from: [], to: [] }

function getInteropChainsWithIcons(manifest: Manifest) {
  return mapInteropChainsToWithIcons(manifest, getActiveInteropChains())
}

function getCachedInteropTokenPage(
  slug: string,
  interopChainsWithIcons: InteropChainWithIcon[],
  cache: InMemoryCache,
) {
  return cache.get(
    {
      key: [
        'interop',
        'tokens',
        slug,
        ALL_CHAINS_SELECTION.from.join(','),
        ALL_CHAINS_SELECTION.to.join(','),
      ],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () =>
      getCachedData({
        slug,
        initialSelection: ALL_CHAINS_SELECTION,
        interopChainsWithIcons,
      }),
  )
}

async function getCachedData({
  slug,
  initialSelection,
  interopChainsWithIcons,
}: {
  slug: string
  initialSelection: InteropSelection
  interopChainsWithIcons: InteropChainWithIcon[]
}) {
  const [token, snapshotTimestamp, interopProjects] = await Promise.all([
    findInteropAbstractToken(slug),
    getAggregatedInteropSnapshotTimestamp(),
    ps.getProjects({ select: ['interopConfig'] }),
  ])
  if (!token) return undefined

  const apiSelection = initialSelection

  const [{ tokenData, lastSyncedAt }, relationsGraph] = await Promise.all([
    getLatestInteropTokenData(token.id, { snapshotTimestamp, interopProjects }),
    getRelationsGraph(token.id),
  ])

  const tokenEntry = getInteropTokenEntry({
    token,
    interopChains: interopChainsWithIcons,
    relationsGraph,
    lastSyncedAt,
    hasRawTransfers: hasRawTransfers(tokenData?.snapshotTimestamp),
  })

  return {
    token: {
      ...token,
      slug: token.id,
    },
    tokenEntry,
    tokenData,
    lastSyncedAt,
    apiSelection,
  }
}

/**
 * Raw transfers are cleaned up long before aggregates, so a stale snapshot may
 * have no transfers left to list next to its aggregated numbers.
 */
function hasRawTransfers(snapshotTimestamp: number | undefined) {
  if (snapshotTimestamp === undefined) return false
  const snapshotWindowStart = snapshotTimestamp - UnixTime.DAY
  return snapshotWindowStart >= UnixTime.now() - INTEROP_TRANSFER_RETENTION
}

/** The page stays useful without its deployments section, so a failed build only hides it. */
async function getRelationsGraph(tokenId: string) {
  try {
    return (await getTokenGraphs()).graphs.get(tokenId)
  } catch (error) {
    getLogger()
      .for('getInteropTokenPageData')
      .error('Token graphs unavailable', { tokenId, error })
    return undefined
  }
}
