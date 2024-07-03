import {
  type Layer2,
  type Layer3,
  type WarningWithSentiment,
  safeGetTokenByAssetId,
} from '@l2beat/config'
import { type TvlApiToken } from '@l2beat/shared-pure'
import { formatPercent } from '~/utils/get-percentage-change'
import { type TvlProject } from '../get-tvl'
import { unifyTokensResponse } from './get-tvl-stats'

export function getTvlWarnings(
  apiProject: TvlProject,
  project: Layer2 | Layer3,
  associatedTokens: string[],
): WarningWithSentiment[] {
  const total = apiProject?.charts.hourly.data.at(-1)?.[1] ?? 0
  const tokens = unifyTokensResponse(apiProject?.tokens)
  const associatedRatio = getAssociatedRatio(associatedTokens, total, tokens)
  const { warning, warningSeverity } = getAssociatedTokensWarning(
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

export function getAssociatedTokensWarning(
  associatedRatio: number,
  name: string,
  associatedTokens: string[],
) {
  let warning: string | undefined
  if (associatedRatio > 0.1) {
    const percent = formatPercent(associatedRatio)
    if (associatedTokens.length === 1) {
      const what = `The ${associatedTokens[0]} token associated with ${name}`
      warning = `${what} accounts for ${percent} of the TVL!`
    } else {
      const joined = associatedTokens.join(' and ')
      const what = `The ${joined} tokens associated with ${name}`
      warning = `${what} account for ${percent} of the TVL!`
    }
  }
  const warningSeverity: 'bad' | 'warning' =
    associatedRatio > 0.8 ? 'bad' : 'warning'
  return { warning, warningSeverity }
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
