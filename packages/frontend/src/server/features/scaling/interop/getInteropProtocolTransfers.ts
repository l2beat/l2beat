import { INTEROP_CHAINS } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type {
  InteropProtocolTransferDetailsItem,
  InteropProtocolTransfersCursor,
  InteropProtocolTransfersParams,
  InteropProtocolTransfersResponse,
} from './types'
import {
  buildTokensDetailsMap,
  type TokensDetailsMap,
} from './utils/buildTokensDetailsMap'

interface TransfersPage {
  items: InteropTransferRecord[]
  nextCursor: InteropProtocolTransfersCursor | undefined
}

const DEFAULT_PAGE_SIZE = 100
const MAX_PAGE_SIZE = 100
const RAW_BATCH_SIZE = 500
const UNKNOWN_TOKEN_SYMBOL = 'Unknown'

interface InteropChainDetails {
  name: string
  iconUrl: string
  explorerUrl: string
}

const INTEROP_CHAIN_DETAILS = new Map<string, InteropChainDetails>(
  INTEROP_CHAINS.map((chain) => [
    chain.id,
    {
      name: chain.name,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
      explorerUrl: chain.explorerUrl,
    },
  ]),
)

export async function getInteropProtocolTransfers({
  id,
  from,
  to,
  type,
  tokenId,
  snapshotTimestamp,
  limit,
  cursor,
}: InteropProtocolTransfersParams): Promise<InteropProtocolTransfersResponse> {
  if (from.length === 0 || to.length === 0) {
    return {
      items: [],
      nextCursor: undefined,
    }
  }

  if (env.MOCK) {
    return getMockInteropProtocolTransfers({ from, to })
  }

  const interopProject = await ps.getProject({
    id,
    select: ['interopConfig'],
  })
  if (!interopProject?.interopConfig) {
    return {
      items: [],
      nextCursor: undefined,
    }
  }

  const plugins = type
    ? interopProject.interopConfig.plugins.filter(
        (plugin) => plugin.bridgeType === type,
      )
    : interopProject.interopConfig.plugins
  if (plugins.length === 0) {
    return {
      items: [],
      nextCursor: undefined,
    }
  }

  const classifier = new InteropTransferClassifier()
  const pluginMatcher = classifier.createMatcher<InteropTransferRecord>(plugins)
  const matcher = tokenId
    ? (transfer: InteropTransferRecord) =>
        pluginMatcher(transfer) &&
        (transfer.srcAbstractTokenId === tokenId ||
          transfer.dstAbstractTokenId === tokenId)
    : pluginMatcher
  const pluginIds = [...new Set(plugins.map((plugin) => plugin.plugin))]
  const result = await getFilteredTransfersPage({
    snapshotTimestamp,
    sourceChains: from,
    destinationChains: to,
    pluginIds,
    matcher,
    limit: getPageSize(limit),
    cursor,
  })
  const tokensDetailsMap = await buildTokensDetailsMap(
    getAbstractTokenIds(result.items),
  )
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

async function getFilteredTransfersPage({
  snapshotTimestamp,
  sourceChains,
  destinationChains,
  pluginIds,
  matcher,
  limit,
  cursor,
}: {
  snapshotTimestamp: number
  sourceChains: string[]
  destinationChains: string[]
  pluginIds: string[]
  matcher: (transfer: InteropTransferRecord) => boolean
  limit: number
  cursor: InteropProtocolTransfersCursor | undefined
}): Promise<TransfersPage> {
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

      if (!matcher(transfer)) {
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

export function toInteropProtocolTransferDetailsItem(
  transfer: InteropTransferRecord,
  chainDetailsById: Map<string, InteropChainDetails>,
  tokensDetailsMap: TokensDetailsMap,
): InteropProtocolTransferDetailsItem {
  const srcDetails = chainDetailsById.get(transfer.srcChain)
  const dstDetails = chainDetailsById.get(transfer.dstChain)
  const srcTxHashHref = getTxHashHref(
    srcDetails?.explorerUrl,
    transfer.srcTxHash,
  )
  const dstTxHashHref = getTxHashHref(
    dstDetails?.explorerUrl,
    transfer.dstTxHash,
  )

  return {
    transferId: transfer.transferId,
    timestamp: transfer.timestamp,
    srcAmount: transfer.srcAmount,
    srcSymbol: transfer.srcSymbol ?? UNKNOWN_TOKEN_SYMBOL,
    srcTokenIconUrl: getTokenIconUrl(
      transfer.srcAbstractTokenId,
      tokensDetailsMap,
    ),
    dstAmount: transfer.dstAmount,
    dstSymbol: transfer.dstSymbol ?? UNKNOWN_TOKEN_SYMBOL,
    dstTokenIconUrl: getTokenIconUrl(
      transfer.dstAbstractTokenId,
      tokensDetailsMap,
    ),
    valueUsd: transfer.srcValueUsd ?? transfer.dstValueUsd,
    duration: transfer.duration,
    srcChain: srcDetails?.name ?? transfer.srcChain,
    srcChainIconUrl: srcDetails?.iconUrl,
    srcTxHash: transfer.srcTxHash,
    srcTxHashHref,
    dstChain: dstDetails?.name ?? transfer.dstChain,
    dstChainIconUrl: dstDetails?.iconUrl,
    dstTxHash: transfer.dstTxHash,
    dstTxHashHref,
  }
}

function getAbstractTokenIds(transfers: InteropTransferRecord[]): string[] {
  return [
    ...new Set(
      transfers
        .flatMap((transfer) => [
          transfer.srcAbstractTokenId,
          transfer.dstAbstractTokenId,
        ])
        .filter((id): id is string => id !== undefined),
    ),
  ]
}

function getTokenIconUrl(
  abstractTokenId: string | undefined,
  tokensDetailsMap: TokensDetailsMap,
): string {
  if (!abstractTokenId) return TOKEN_PLACEHOLDER_ICON_URL
  return (
    tokensDetailsMap.get(abstractTokenId)?.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL
  )
}

function getTxHashHref(
  explorerUrl: string | undefined,
  txHash: string | undefined,
): string | undefined {
  if (!txHash || !explorerUrl) {
    return undefined
  }

  return `${explorerUrl}/tx/${txHash}`
}

function getMockInteropProtocolTransfers({
  from,
  to,
}: {
  from: string[]
  to: string[]
}): InteropProtocolTransfersResponse {
  const ethIcon =
    'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'
  const srcChain = from[0] ?? 'ethereum'
  const dstChain = to[0] ?? 'optimism'
  const timestamp = UnixTime.now() - UnixTime.HOUR

  const items: InteropProtocolTransferDetailsItem[] = Array.from(
    { length: 5 },
    (_, i) => ({
      transferId: `mock-transfer-${i}`,
      timestamp: timestamp - i * 60,
      srcAmount: 1_000,
      srcSymbol: 'ETH',
      srcTokenIconUrl: ethIcon,
      dstAmount: 1_000,
      dstSymbol: 'ETH',
      dstTokenIconUrl: ethIcon,
      valueUsd: 1_000,
      duration: 60_000,
      srcChain: INTEROP_CHAIN_DETAILS.get(srcChain)?.name ?? srcChain,
      srcChainIconUrl: INTEROP_CHAIN_DETAILS.get(srcChain)?.iconUrl,
      srcTxHash: undefined,
      srcTxHashHref: undefined,
      dstChain: INTEROP_CHAIN_DETAILS.get(dstChain)?.name ?? dstChain,
      dstChainIconUrl: INTEROP_CHAIN_DETAILS.get(dstChain)?.iconUrl,
      dstTxHash: undefined,
      dstTxHashHref: undefined,
    }),
  )

  return { items, nextCursor: undefined }
}
