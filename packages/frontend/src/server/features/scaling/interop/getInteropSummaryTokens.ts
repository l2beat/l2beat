import { unique } from '@l2beat/shared-pure'
import type { InteropSelectionInput, TokenData } from './types'
import { buildTokensDetailsMap } from './utils/buildTokensDetailsMap'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import { getSummaryTokensData } from './utils/getSummaryTokensData'

export async function getInteropSummaryTokens(
  input: InteropSelectionInput,
): Promise<TokenData[]> {
  const { records } = await getLatestAggregatedInteropTransferWithTokens(input)
  const abstractTokenIds = unique(
    records.flatMap((record) =>
      record.tokens.map((token) => token.abstractTokenId),
    ),
  )
  const tokensDetailsMap = await buildTokensDetailsMap(abstractTokenIds)

  return getSummaryTokensData(records, tokensDetailsMap)
}
