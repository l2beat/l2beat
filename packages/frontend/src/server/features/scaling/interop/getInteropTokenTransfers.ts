import { INTEROP_CHAINS } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { toInteropProtocolTransferDetailsItem } from './getInteropProtocolTransfers'
import type {
  InteropProtocolTransferDetailsItem,
  InteropProtocolTransfersCursor,
  InteropProtocolTransfersResponse,
  InteropTokenTransfersParams,
} from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'

const DEFAULT_PAGE_SIZE = 100
const MAX_PAGE_SIZE = 100
const RAW_BATCH_SIZE = 500

const INTEROP_CHAIN_DETAILS = new Map(
  INTEROP_CHAINS.map((chain) => [
    chain.id,
    {
      name: chain.name,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
      explorerUrl: chain.explorerUrl,
    },
  ]),
)
const INTEROP_CHAIN_ICON_URLS = new Map(
  INTEROP_CHAINS.map((chain) => [
    chain.id,
    manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
  ]),
)

export async function getInteropTokenTransfers({
  tokenId,
  from,
  to,
  snapshotTimestamp,
  limit,
  cursor,
}: InteropTokenTransfersParams): Promise<InteropProtocolTransfersResponse> {
  if (from.length === 0 || to.length === 0) {
    return { items: [], nextCursor: undefined }
  }

  if (env.MOCK) {
    return getMockInteropTokenTransfers({ tokenId, from, to })
  }

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const plugins = interopProjects.flatMap(
    (project) => project.interopConfig.plugins,
  )
  if (plugins.length === 0) {
    return { items: [], nextCursor: undefined }
  }

  const classifier = new InteropTransferClassifier()
  const matcher = classifier.createMatcher<InteropTransferRecord>(plugins)
  const pluginIds = [...new Set(plugins.map((plugin) => plugin.plugin))]

  const result = await getFilteredTokenTransfersPage({
    tokenId,
    snapshotTimestamp,
    sourceChains: from,
    destinationChains: to,
    pluginIds,
    matcher,
    limit: getPageSize(limit),
    cursor,
  })
  const tokensDetailsMap = await buildTokensDetailsMap([tokenId])

  return {
    items: result.items.map((transfer) =>
      toInteropProtocolTransferDetailsItem(
        transfer,
        INTEROP_CHAIN_DETAILS,
        tokensDetailsMap,
      ),
    ),
    nextCursor: result.nextCursor,
  }
}

async function getFilteredTokenTransfersPage({
  tokenId,
  snapshotTimestamp,
  sourceChains,
  destinationChains,
  pluginIds,
  matcher,
  limit,
  cursor,
}: {
  tokenId: string
  snapshotTimestamp: number
  sourceChains: string[]
  destinationChains: string[]
  pluginIds: string[]
  matcher: (transfer: InteropTransferRecord) => boolean
  limit: number
  cursor: InteropProtocolTransfersCursor | undefined
}): Promise<{
  items: InteropTransferRecord[]
  nextCursor: InteropProtocolTransfersCursor | undefined
}> {
  const db = getDb()
  const items: InteropTransferRecord[] = []
  let dbCursor = cursor

  while (items.length < limit) {
    const transfers = await db.interopTransfer.getProjectTransfersPage({
      plugins: pluginIds,
      snapshotTimestamp: UnixTime(snapshotTimestamp),
      sourceChains,
      destinationChains,
      cursor: dbCursor
        ? {
            timestamp: UnixTime(dbCursor.timestamp),
            transferId: dbCursor.transferId,
          }
        : undefined,
      limit: RAW_BATCH_SIZE,
    })

    if (transfers.length === 0) {
      return { items, nextCursor: undefined }
    }

    for (const [i, transfer] of transfers.entries()) {
      dbCursor = toTransferCursor(transfer)

      if (
        !matcher(transfer) ||
        (transfer.srcAbstractTokenId !== tokenId &&
          transfer.dstAbstractTokenId !== tokenId)
      ) {
        continue
      }

      items.push(transfer)

      if (items.length === limit) {
        const stoppedAtEnd =
          i === transfers.length - 1 && transfers.length < RAW_BATCH_SIZE
        return {
          items,
          nextCursor: stoppedAtEnd ? undefined : toTransferCursor(transfer),
        }
      }
    }

    if (transfers.length < RAW_BATCH_SIZE) {
      return { items, nextCursor: undefined }
    }
  }

  return { items, nextCursor: undefined }
}

function getPageSize(limit: number | undefined): number {
  if (limit === undefined) {
    return DEFAULT_PAGE_SIZE
  }

  const pageSize = Math.floor(limit)
  if (!Number.isFinite(pageSize)) {
    return DEFAULT_PAGE_SIZE
  }

  return Math.max(1, Math.min(MAX_PAGE_SIZE, pageSize))
}

function toTransferCursor(
  transfer: Pick<InteropTransferRecord, 'timestamp' | 'transferId'>,
): InteropProtocolTransfersCursor {
  return {
    timestamp: transfer.timestamp,
    transferId: transfer.transferId,
  }
}

function getMockInteropTokenTransfers({
  tokenId,
  from,
  to,
}: {
  tokenId: string
  from: string[]
  to: string[]
}): InteropProtocolTransfersResponse {
  const srcChain = from[0] ?? 'ethereum'
  const dstChain = to[0] ?? 'optimism'
  const timestamp = UnixTime.now() - UnixTime.HOUR
  const symbol = tokenId.includes('usdc') ? 'USDC' : 'ETH'

  const items: InteropProtocolTransferDetailsItem[] = Array.from(
    { length: 5 },
    (_, i) => ({
      transferId: `mock-token-transfer-${i}`,
      timestamp: timestamp - i * 60,
      srcAmount: 1_000,
      srcSymbol: symbol,
      srcTokenIssuer: tokenId.includes('usdc') ? 'circle' : 'ethereum',
      srcTokenIconUrl: INTEROP_CHAIN_ICON_URLS.get(srcChain) ?? '',
      dstAmount: 1_000,
      dstSymbol: symbol,
      dstTokenIssuer: tokenId.includes('usdc') ? 'circle' : 'ethereum',
      dstTokenIconUrl: INTEROP_CHAIN_ICON_URLS.get(dstChain) ?? '',
      valueUsd: 1_000,
      duration: 60_000,
      srcChain,
      srcChainIconUrl: INTEROP_CHAIN_ICON_URLS.get(srcChain),
      srcTxHash: undefined,
      srcTxHashHref: undefined,
      dstChain,
      dstChainIconUrl: INTEROP_CHAIN_ICON_URLS.get(dstChain),
      dstTxHash: undefined,
      dstTxHashHref: undefined,
    }),
  )

  return { items, nextCursor: undefined }
}
