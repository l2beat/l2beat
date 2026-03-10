import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import type {
  ChainData,
  CommonInteropData,
  InteropProtocolTokensParams,
} from './types'
import { accumulateChains } from './utils/accumulate'
import { getAggregatedInteropSnapshotTimestamp } from './utils/getAggregatedInteropTimestamp'
import { buildDurationSplitMap } from './utils/getAverageDuration'
import { getChainsData } from './utils/getChainsData'
import { getRelevantBridgeTypes } from './utils/getRelevantBridgeTypes'
import { INITIAL_COMMON_INTEROP_DATA } from './utils/getProtocolsDataMap'

export async function getInteropProtocolChains({
  id,
  from,
  to,
  type,
}: InteropProtocolTokensParams): Promise<ChainData[]> {
  const logger = getLogger().for('getProtocolChains')
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

  const durationSplitMap = buildDurationSplitMap([interopProject])
  const relevantBridgeTypes = getRelevantBridgeTypes(interopProject, type)
  const transfers =
    await db.aggregatedInteropTransfer.getByChainsIdAndTimestamp(
      snapshotTimestamp,
      id,
      from,
      to,
      type,
    )

  const chainsMap = new Map<string, CommonInteropData>()

  for (const transfer of transfers) {
    const srcCurrent =
      chainsMap.get(transfer.srcChain) ?? INITIAL_COMMON_INTEROP_DATA
    chainsMap.set(
      transfer.srcChain,
      accumulateChains(srcCurrent, transfer, 'src'),
    )

    if (transfer.dstChain !== transfer.srcChain) {
      const dstCurrent =
        chainsMap.get(transfer.dstChain) ?? INITIAL_COMMON_INTEROP_DATA
      chainsMap.set(
        transfer.dstChain,
        accumulateChains(dstCurrent, transfer, 'dst'),
      )
    }
  }

  return getChainsData({
    projectId: id,
    bridgeTypes: relevantBridgeTypes,
    chains: chainsMap,
    durationSplitMap,
    logger,
  })
}
