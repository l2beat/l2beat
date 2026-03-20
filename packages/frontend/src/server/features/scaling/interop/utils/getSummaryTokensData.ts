import { notUndefined } from '@l2beat/shared-pure'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type {
  AggregatedInteropTransferWithTokens,
  CommonInteropData,
  TokenData,
  TokenFlowData,
} from '../types'
import { accumulateTokens, INITIAL_COMMON_INTEROP_DATA } from './accumulate'
import type { TokensDetailsMap } from './buildTokensDetailsMap'
import { getInteropChains } from './getInteropChains'

type TokenInteropData = CommonInteropData & {
  flows: Map<string, TokenFlowData>
}

const logger = getLogger().for('getSummaryTokensData')

export function getSummaryTokensData(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: TokensDetailsMap,
): TokenData[] {
  const chainIconMap = new Map(
    getInteropChains().map((chain) => [
      chain.id,
      manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    ]),
  )

  const counts = {
    transferCount: records.reduce(
      (acc, transfer) => acc + transfer.transferCount,
      0,
    ),
    identifiedCount: records.reduce(
      (acc, transfer) => acc + transfer.identifiedCount,
      0,
    ),
  }

  const tokenDataMap: Map<string, TokenInteropData> = new Map()
  for (const record of records) {
    for (const token of record.tokens) {
      const current = tokenDataMap.get(token.abstractTokenId) ?? {
        ...INITIAL_COMMON_INTEROP_DATA,
        flows: new Map<string, TokenFlowData>(),
      }

      tokenDataMap.set(token.abstractTokenId, {
        ...accumulateTokens(current, token),
        flows: current.flows,
      })

      const flowKey = `${record.srcChain}::${record.dstChain}`
      const currentFlow = current.flows.get(flowKey)
      if (currentFlow) {
        currentFlow.volume += token.volume
      } else {
        current.flows.set(flowKey, {
          srcChain: {
            id: record.srcChain,
            iconUrl: chainIconMap.get(record.srcChain),
          },
          dstChain: {
            id: record.dstChain,
            iconUrl: chainIconMap.get(record.dstChain),
          },
          volume: token.volume,
        })
      }
    }
  }

  const result: TokenData[] = Array.from(tokenDataMap.entries())
    .map(([tokenId, token]) => {
      const tokenDetails = tokensDetailsMap.get(tokenId)

      if (!tokenDetails) {
        logger.warn(`Token not found: ${tokenId}`)
        return undefined
      }

      return {
        id: tokenId,
        symbol: tokenDetails.symbol,
        issuer: tokenDetails.issuer,
        iconUrl:
          tokenDetails.iconUrl ??
          manifest.getUrl('/images/token-placeholder.png'),
        volume: token.volume,
        transferCount: token.transferCount,
        avgDuration:
          token.transferCount > 0
            ? {
                type: 'single',
                duration: Math.floor(
                  token.totalDurationSum / token.transferCount,
                ),
              }
            : null,
        avgValue:
          token.transferCount > 0 ? token.volume / token.transferCount : null,
        minTransferValueUsd: token.minTransferValueUsd,
        maxTransferValueUsd: token.maxTransferValueUsd,
        netMintedValue:
          token.mintedValueUsd !== undefined &&
          token.burnedValueUsd !== undefined
            ? token.mintedValueUsd - token.burnedValueUsd
            : undefined,
        flows: Array.from(token.flows.values()).toSorted(
          (a, b) => b.volume - a.volume,
        ),
      } satisfies TokenData
    })
    .filter(notUndefined)
    .toSorted((a, b) => (b.volume ?? 0) - (a.volume ?? 0))

  const unknownTransfersCount = counts.transferCount - counts.identifiedCount
  if (unknownTransfersCount > 0) {
    result.push({
      id: 'unknown',
      symbol: 'Unknown',
      issuer: null,
      iconUrl: manifest.getUrl('/images/token-placeholder.png'),
      transferCount: unknownTransfersCount,
      avgDuration: null,
      avgValue: null,
      volume: null,
      minTransferValueUsd: undefined,
      maxTransferValueUsd: undefined,
      netMintedValue: undefined,
      flows: [],
    })
  }

  return result
}
