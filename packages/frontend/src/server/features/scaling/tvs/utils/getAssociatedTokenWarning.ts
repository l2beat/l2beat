import type {
  ProjectAssociatedToken,
  WarningWithSentiment,
} from '@l2beat/config'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { languageJoin } from '~/utils/languageJoin'

interface Params {
  name: string
  associatedRatio: number
  associatedTokens: ProjectAssociatedToken[]
}

export function getAssociatedTokenWarning({
  name,
  associatedRatio,
  associatedTokens,
}: Params): WarningWithSentiment | undefined {
  if (associatedRatio < 0.1) return
  const sentiment: 'bad' | 'warning' = associatedRatio > 0.8 ? 'bad' : 'warning'

  const percent = formatPercent(associatedRatio)
  if (associatedTokens.length === 1) {
    const what = `The ${associatedTokens[0]?.symbol} token associated with ${name}`
    return {
      value: `${what} accounts for ${percent} of the TVS!`,
      sentiment,
    }
  }

  const joined = languageJoin(associatedTokens.map((t) => t.symbol))
  const what = `The ${joined} tokens associated with ${name}`

  return {
    value: `${what} account for ${percent} of the TVS!`,
    sentiment,
  }
}
