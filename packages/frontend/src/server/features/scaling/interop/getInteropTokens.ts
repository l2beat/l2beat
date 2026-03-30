import { unique } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import type { InteropTopItemsParams, TokenData } from './types'
import { buildTokensDataMap } from './utils/buildTokensDataMap'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getDurationSplit } from './utils/getAverageDuration'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getRelevantBridgeTypes } from './utils/getRelevantBridgeTypes'
import { getTokensData } from './utils/getTokensData'

const logger = getLogger().for('getInteropTokens')

export async function getInteropTokens({
  id,
  from,
  to,
  type,
}: InteropTopItemsParams): Promise<TokenData[]> {
  const interopProject = id
    ? await ps.getProject({ id, select: ['interopConfig'] })
    : undefined
  if (id && !interopProject) {
    return []
  }

  const { records } = await getLatestAggregatedInteropTransferWithTokens(
    { from, to },
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

  const relevantBridgeTypes = interopProject
    ? getRelevantBridgeTypes(interopProject, type)
    : []
  const durationSplit = interopProject
    ? getDurationSplit(interopProject, relevantBridgeTypes)
    : undefined

  const tokenDataMap = buildTokensDataMap(records)

  return getTokensData({
    tokens: tokenDataMap,
    tokensDetailsMap,
    unknownTransfersCount: counts.transferCount - counts.identifiedCount,
    logger,
    durationSplit,
  })
}
