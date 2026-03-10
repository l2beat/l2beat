import { unique } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import type {
  CommonInteropData,
  InteropProtocolTokensParams,
  TokenData,
  TokenFlowData,
} from './types'
import { accumulateTokens } from './utils/accumulate'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getAggregatedInteropSnapshotTimestamp } from './utils/getAggregatedInteropTimestamp'
import { buildDurationSplitMap } from './utils/getAverageDuration'
import { getInteropChains } from './utils/getInteropChains'
import { getRelevantBridgeTypes } from './utils/getRelevantBridgeTypes'
import { INITIAL_COMMON_INTEROP_DATA } from './utils/getProtocolsDataMap'
import { getTokensData } from './utils/getTokensData'

type TokenInteropData = CommonInteropData & {
  flows: Map<string, TokenFlowData>
}

export async function getInteropProtocolTokens({
  id,
  from,
  to,
  type,
}: InteropProtocolTokensParams): Promise<TokenData[]> {
  const logger = getLogger().for('getProtocolTokens')
  const db = getDb()

  const interopProject = await ps.getProject({
    id,
    select: ['interopConfig'],
  })
  if (!interopProject) {
    return []
  }

  const snapshotTimestamp = await getAggregatedInteropSnapshotTimestamp()
  if (!snapshotTimestamp) {
    return []
  }

  const [transfers, tokens] = await Promise.all([
    db.aggregatedInteropTransfer.getByChainsIdAndTimestamp(
      snapshotTimestamp,
      id,
      from,
      to,
      type,
    ),
    db.aggregatedInteropToken.getByChainsIdAndTimestamp(
      snapshotTimestamp,
      id,
      from,
      to,
      type,
    ),
  ])

  const counts = {
    transferCount: transfers.reduce(
      (acc, transfer) => acc + transfer.transferCount,
      0,
    ),
    identifiedCount: transfers.reduce(
      (acc, transfer) => acc + transfer.identifiedCount,
      0,
    ),
  }

  const abstractTokenIds = unique(tokens.map((token) => token.abstractTokenId))
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)
  const durationSplitMap = buildDurationSplitMap([interopProject])
  const relevantBridgeTypes = getRelevantBridgeTypes(interopProject, type)
  const chainIconMap = new Map(
    getInteropChains().map((chain) => [
      chain.id,
      manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    ]),
  )

  const result: Map<string, TokenInteropData> = new Map()
  for (const token of tokens) {
    const current = result.get(token.abstractTokenId) ?? {
      ...INITIAL_COMMON_INTEROP_DATA,
      flows: new Map<string, TokenFlowData>(),
    }

    result.set(token.abstractTokenId, {
      ...accumulateTokens(current, token),
      flows: current.flows,
    })

    const flowKey = `${token.srcChain}::${token.dstChain}`
    const currentFlow = current.flows.get(flowKey)
    if (currentFlow) {
      currentFlow.volume += token.volume
    } else {
      current.flows.set(flowKey, {
        srcChain: {
          id: token.srcChain,
          iconUrl: chainIconMap.get(token.srcChain),
        },
        dstChain: {
          id: token.dstChain,
          iconUrl: chainIconMap.get(token.dstChain),
        },
        volume: token.volume,
      })
    }
  }

  return getTokensData({
    projectId: id,
    bridgeTypes: relevantBridgeTypes,
    tokens: result,
    tokensDetailsMap,
    durationSplitMap,
    unknownTransfersCount: counts.transferCount - counts.identifiedCount,
    logger,
  })
}
