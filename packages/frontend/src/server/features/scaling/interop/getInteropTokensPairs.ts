import { assert, InMemoryCache, unique } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import { INTEROP_PAIR_SEPARATOR } from './consts'
import type {
  CommonInteropData,
  InteropTokensPairsResponse,
  InteropTopItemsInfiniteParams,
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
import { getTopProtocolDisplay } from './utils/getTopProtocolDisplay'
import { sortInteropTopItems } from './utils/sortInteropTopItems'

type TokensPairInteropData = CommonInteropData & {
  flows: Map<string, TokenFlowData>
  protocols: Map<string, number>
}

const PAGE_SIZE = 100
const interopTokensPairsCache = new InMemoryCache({})

export async function getInteropTokensPairs(
  params: InteropTopItemsParams,
): Promise<TokensPairData[]> {
  return await getCachedInteropTokensPairs(params)
}

export async function getInteropTokensPairsInfinite({
  cursor,
  sort,
  ...params
}: InteropTopItemsInfiniteParams): Promise<InteropTokensPairsResponse> {
  const pairs = sortInteropTopItems(
    await getCachedInteropTokensPairs(params),
    sort,
  )
  const startIndex = cursor ?? 0
  const items = pairs.slice(startIndex, startIndex + PAGE_SIZE)
  const nextCursor =
    startIndex + PAGE_SIZE < pairs.length ? startIndex + PAGE_SIZE : undefined

  return { items, nextCursor }
}

async function getCachedInteropTokensPairs(params: InteropTopItemsParams) {
  return await interopTokensPairsCache.get(
    {
      key: [
        'interop-token-pairs',
        params.id?.toString() ?? 'all',
        params.type ?? 'all',
        [...params.from].sort().join(','),
        [...params.to].sort().join(','),
        [...(params.protocolIds ?? [])].sort().join(','),
      ],
      ttl: 60 * 10,
      staleWhileRevalidate: 60 * 15,
    },
    () => getInteropTokensPairsData(params),
  )
}

async function getInteropTokensPairsData({
  id,
  from,
  to,
  type,
  protocolIds,
}: InteropTopItemsParams): Promise<TokensPairData[]> {
  const db = getDb()

  const [interopProject, interopProjects] = await Promise.all([
    id ? ps.getProject({ id, select: ['interopConfig'] }) : undefined,
    ps.getProjects({ select: ['interopConfig'] }),
  ])
  if (id && !interopProject) {
    return []
  }

  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) {
    return []
  }
  if (protocolIds?.length === 0) {
    return []
  }

  const pairs = (
    await db.aggregatedInteropTokensPair.getByChainsIdAndTimestamp(
      snapshotTimestamp,
      from,
      to,
      id,
      type,
    )
  ).filter((pair) => !protocolIds || protocolIds.includes(pair.id))

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
  const projectsById = new Map(
    interopProjects.map((project) => [project.id, project]),
  )

  const result: Map<string, TokensPairInteropData> = new Map()
  for (const pair of pairs) {
    const pairKey =
      pair.tokenA === 'unknown' && pair.tokenB === 'unknown'
        ? 'unknown'
        : `${pair.tokenA}${INTEROP_PAIR_SEPARATOR}${pair.tokenB}`
    const current = result.get(pairKey) ?? {
      ...INITIAL_COMMON_INTEROP_DATA,
      flows: new Map<string, TokenFlowData>(),
      protocols: new Map<string, number>(),
    }

    result.set(pairKey, {
      ...accumulateTokensPairs(current, pair),
      flows: current.flows,
      protocols: current.protocols,
    })

    const flowKey = `${pair.srcChain}${INTEROP_PAIR_SEPARATOR}${pair.dstChain}`
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

    const currentProtocol = current.protocols.get(pair.id)
    if (currentProtocol) {
      current.protocols.set(pair.id, (currentProtocol ?? 0) + pair.volume)
    } else {
      current.protocols.set(pair.id, pair.volume)
    }
  }

  return Array.from(result.entries())
    .map(([pairId, data]) => {
      if (pairId === 'unknown') {
        return {
          id: pairId,
          tokenA: { symbol: 'Unknown', iconUrl: TOKEN_PLACEHOLDER_ICON_URL },
          tokenB: { symbol: 'Unknown', iconUrl: TOKEN_PLACEHOLDER_ICON_URL },
          topProtocol: undefined,
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

      const parts = pairId.split(INTEROP_PAIR_SEPARATOR)
      const tokenA = parts[0] ? tokensDetailsMap.get(parts[0]) : undefined
      const tokenB = parts[1] ? tokensDetailsMap.get(parts[1]) : undefined

      assert(tokenA && tokenB, `Tokens not found: ${pairId}`)

      const avgDuration = getAverageDuration(data, durationSplit)

      return {
        id: pairId,
        tokenA,
        tokenB,
        topProtocol: getTopProtocolDisplay(data.protocols, projectsById),
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
