import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type {
  InteropProtocolTransferDetailsItem,
  InteropProtocolTransfersParams,
  InteropProtocolTransfersResponse,
} from './types'
import {
  buildTokensDetailsMap,
  type TokensDetailsMap,
} from './utils/buildTokensDetailsMap'
import { getAbstractTokenIds } from './utils/getAbstractTokenIds'
import { getFilteredInteropTransfersPage } from './utils/getFilteredInteropTransfersPage'
import { getMockInteropTransfers } from './utils/getMockInteropTransfers'
import {
  INTEROP_CHAIN_DETAILS,
  type InteropChainDetails,
} from './utils/interopChainDetails'

const UNKNOWN_TOKEN_SYMBOL = 'Unknown'

export async function getInteropProtocolTransfers({
  id,
  protocolIds,
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
    return getMockInteropTransfers({ from, to })
  }

  // Either a single protocol (`id`) or a set of protocols (`protocolIds`).
  const ids = id ? [id] : (protocolIds ?? [])
  if (ids.length === 0) {
    return { items: [], nextCursor: undefined }
  }
  const idSet = new Set(ids.map((value) => value.toString()))
  const interopProjects = (
    await ps.getProjects({ select: ['interopConfig'] })
  ).filter((project) => idSet.has(project.id.toString()))
  if (interopProjects.length === 0) {
    return {
      items: [],
      nextCursor: undefined,
    }
  }

  const allPlugins = interopProjects.flatMap(
    (project) => project.interopConfig.plugins,
  )
  const plugins = type
    ? allPlugins.filter((plugin) => plugin.bridgeType === type)
    : allPlugins
  if (plugins.length === 0) {
    return {
      items: [],
      nextCursor: undefined,
    }
  }

  const classifier = new InteropTransferClassifier()
  const matcher = classifier.createMatcher<InteropTransferRecord>(plugins)
  const pluginIds = [...new Set(plugins.map((plugin) => plugin.plugin))]
  const result = await getFilteredInteropTransfersPage({
    tokenId,
    snapshotTimestamp,
    sourceChains: from,
    destinationChains: to,
    pluginIds,
    matcher,
    limit,
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
    srcAbstractTokenId: transfer.srcAbstractTokenId,
    srcTokenIssuer:
      transfer.srcAbstractTokenId !== undefined
        ? (tokensDetailsMap.get(transfer.srcAbstractTokenId)?.issuer ?? null)
        : null,
    srcTokenIconUrl: getTokenIconUrl(
      transfer.srcAbstractTokenId,
      tokensDetailsMap,
    ),
    dstAmount: transfer.dstAmount,
    dstSymbol: transfer.dstSymbol ?? UNKNOWN_TOKEN_SYMBOL,
    dstAbstractTokenId: transfer.dstAbstractTokenId,
    dstTokenIssuer:
      transfer.dstAbstractTokenId !== undefined
        ? (tokensDetailsMap.get(transfer.dstAbstractTokenId)?.issuer ?? null)
        : null,
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
