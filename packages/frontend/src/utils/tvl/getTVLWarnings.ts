import {
  Layer2,
  safeGetTokenByAssetId,
  WarningWithSentiment,
} from '@l2beat/config'
import { TvlApiResponse, TvlApiToken } from '@l2beat/shared-pure'

import { getTvlWarning } from './getTVLBreakdown'
import { unifyTokensResponse } from './getTvlStats'

export function getTvlWarnings(
  apiProject: TvlApiResponse['projects'][string],
  associatedTokens: string[],
  project: Layer2,
): WarningWithSentiment[] {
  const total = apiProject?.charts.hourly.data.at(-1)?.[1] ?? 0
  const tokens = unifyTokensResponse(apiProject?.tokens)
  const associatedRatio = getAssociatedRatio(associatedTokens, total, tokens)
  const { warning, warningSeverity } = getTvlWarning(
    associatedRatio,
    project.display.name,
    associatedTokens,
  )

  const tvlWarnings: WarningWithSentiment[] = []
  if (warning && warningSeverity === 'bad') {
    tvlWarnings.push({
      content: warning,
      sentiment: warningSeverity,
    })
  }
  if (project.display.tvlWarning) {
    tvlWarnings.push(project.display.tvlWarning)
  }
  return tvlWarnings
}

function getAssociatedRatio(
  associatedTokens: string[],
  total: number,
  tokens: TvlApiToken[],
) {
  let associated = 0

  for (const token of tokens) {
    const safeToken = safeGetTokenByAssetId(token.assetId)
    if (safeToken && associatedTokens.includes(safeToken.symbol)) {
      associated += token.usdValue
    }
  }
  return total === 0 ? 0 : associated / total
}
