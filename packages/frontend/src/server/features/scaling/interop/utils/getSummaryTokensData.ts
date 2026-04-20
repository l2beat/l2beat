import type { Project } from '@l2beat/config'
import { getLogger } from '~/server/utils/logger'
import type { AggregatedInteropTransferWithTokens, TokenData } from '../types'
import { buildTokensDataMap } from './buildTokensDataMap'
import type { TokensDetailsMap } from './buildTokensDetailsMap'
import { getTokensData } from './getTokensData'

const logger = getLogger().for('getSummaryTokensData')

export function getSummaryTokensData(
  records: AggregatedInteropTransferWithTokens[],
  tokensDetailsMap: TokensDetailsMap,
  interopProjects: Project<'interopConfig'>[],
): TokenData[] {
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

  const tokenDataMap = buildTokensDataMap(records)

  return getTokensData({
    tokens: tokenDataMap,
    tokensDetailsMap,
    interopProjects,
    unknownTransfersCount: counts.transferCount - counts.identifiedCount,
    logger,
    // No duration split map for tokens summary view
    durationSplit: undefined,
  })
}
