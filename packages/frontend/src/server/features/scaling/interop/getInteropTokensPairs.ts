import { assert, unique } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import type {
  CommonInteropData,
  InteropTopItemsParams,
  TokenFlowData,
  TokensPairData,
} from './types'
import {
  accumulateTokensPairs,
  INITIAL_COMMON_INTEROP_DATA,
} from './utils/accumulate'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getAggregatedInteropSnapshotTimestamp } from './utils/getAggregatedInteropTimestamp'
import {
  getAverageDuration,
  getDurationSplit,
} from './utils/getAverageDuration'
import { getInteropChains } from './utils/getInteropChains'
import { getRelevantBridgeTypes } from './utils/getRelevantBridgeTypes'

type TokensPairInteropData = CommonInteropData & {
  flows: Map<string, TokenFlowData>
}

export async function getInteropTokensPairs({
  id,
  from,
  to,
  type,
}: InteropTopItemsParams): Promise<TokensPairData[]> {
  const db = getDb()

  const interopProject = id
    ? await ps.getProject({ id, select: ['interopConfig'] })
    : undefined
  if (id && !interopProject) {
    return []
  }

  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) {
    return []
  }

  const pairs = await db.aggregatedInteropTokensPair.getByChainsIdAndTimestamp(
    snapshotTimestamp,
    from,
    to,
    id,
    type,
  )

  const abstractTokenIds = unique(
    pairs
      .map((p) => [p.tokenA, p.tokenB])
      .flat()
      .filter((t) => t !== 'unknown'),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)

  const relevantBridgeTypes = interopProject
    ? getRelevantBridgeTypes(interopProject, type)
    : []
  const durationSplit = interopProject
    ? getDurationSplit(interopProject, relevantBridgeTypes)
    : undefined

  const chainIconMap = new Map(
    getInteropChains().map((chain) => [
      chain.id,
      manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    ]),
  )

  const result: Map<string, TokensPairInteropData> = new Map()
  for (const pair of pairs) {
    const pairKey =
      pair.tokenA === 'unknown' && pair.tokenB === 'unknown'
        ? 'unknown'
        : `${pair.tokenA}::${pair.tokenB}`
    const current = result.get(pairKey) ?? {
      ...INITIAL_COMMON_INTEROP_DATA,
      flows: new Map<string, TokenFlowData>(),
    }

    result.set(pairKey, {
      ...accumulateTokensPairs(current, pair),
      flows: current.flows,
    })

    const flowKey = `${pair.srcChain}::${pair.dstChain}`
    const currentFlow = current.flows.get(flowKey)
    if (currentFlow) {
      currentFlow.volume += pair.volume
    } else {
      current.flows.set(flowKey, {
        srcChain: {
          id: pair.srcChain,
          iconUrl: chainIconMap.get(pair.srcChain),
        },
        dstChain: {
          id: pair.dstChain,
          iconUrl: chainIconMap.get(pair.dstChain),
        },
        volume: pair.volume,
      })
    }
  }

  const placeholder = manifest.getUrl('/images/token-placeholder.png')

  return Array.from(result.entries())
    .map(([pairId, data]) => {
      if (pairId === 'unknown') {
        return {
          id: pairId,
          tokenA: { symbol: 'Unknown', iconUrl: placeholder },
          tokenB: { symbol: 'Unknown', iconUrl: placeholder },
          volume: null,
          transferCount: data.transferCount,
          avgDuration: null,
          avgValue: null,
          minTransferValueUsd: undefined,
          maxTransferValueUsd: undefined,
          netMintedValue: undefined,
          flows: [],
        }
      }

      const parts = pairId.split('::')
      const tokenA = parts[0] ? tokensDetailsMap.get(parts[0]) : undefined
      const tokenB = parts[1] ? tokensDetailsMap.get(parts[1]) : undefined

      assert(tokenA && tokenB, `Tokens not found: ${pairId}`)

      const avgDuration = getAverageDuration(data, durationSplit)

      return {
        id: pairId,
        tokenA,
        tokenB,
        volume: data.volume,
        transferCount: data.transferCount,
        avgDuration,
        avgValue:
          data.transferCount > 0 ? data.volume / data.transferCount : null,
        minTransferValueUsd: data.minTransferValueUsd,
        maxTransferValueUsd: data.maxTransferValueUsd,
        netMintedValue: undefined,
        flows: Array.from(data.flows.values()).toSorted(
          (a, b) => b.volume - a.volume,
        ),
      }
    })
    .toSorted((a, b) => {
      const aUnknown = a.id === 'unknown'
      const bUnknown = b.id === 'unknown'
      if (aUnknown !== bUnknown) {
        return aUnknown ? 1 : -1
      }
      return (b.volume ?? 0) - (a.volume ?? 0)
    })
}
