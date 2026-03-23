import { unique } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import type { InteropProtocolTokensParams, TokenData } from './types'
import { buildTokensDataMap } from './utils/buildTokensDataMap'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getAggregatedInteropSnapshotTimestamp } from './utils/getAggregatedInteropTimestamp'
import { getDurationSplit } from './utils/getAverageDuration'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getRelevantBridgeTypes } from './utils/getRelevantBridgeTypes'
import { getTokensData } from './utils/getTokensData'

export async function getInteropProtocolTokens({
  id,
  from,
  to,
  type,
}: InteropProtocolTokensParams): Promise<TokenData[]> {
  const logger = getLogger().for('getProtocolTokens')

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

  const { records } = await getLatestAggregatedInteropTransferWithTokens(
    {
      from,
      to,
    },
    type,
    id,
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

  const abstractTokenIds = unique(
    records.flatMap((record) =>
      record.tokens.map((token) => token.abstractTokenId),
    ),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)
  const relevantBridgeTypes = getRelevantBridgeTypes(interopProject, type)
  const durationSplit = getDurationSplit(interopProject, relevantBridgeTypes)
  const tokenDataMap = buildTokensDataMap(records)

  return getTokensData({
    tokens: tokenDataMap,
    tokensDetailsMap,
    unknownTransfersCount: counts.transferCount - counts.identifiedCount,
    logger,
    durationSplit,
  })
}
