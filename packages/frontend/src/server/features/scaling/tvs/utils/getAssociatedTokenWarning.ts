import type { WarningWithSentiment } from '@l2beat/config'
import { formatPercent } from '~/utils/calculatePercentageChange'

interface Params {
  name: string
  associatedRatio: number
  associatedTokens: string[]
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
    const what = `The ${associatedTokens[0]} token associated with ${name}`
    return {
      value: `${what} accounts for ${percent} of the TVS!`,
      sentiment,
    }
  }

  const withoutLast = associatedTokens.slice(0, -1)
  const last = associatedTokens.at(-1)

  const joined = withoutLast.join(', ') + ` and ${last}`
  const what = `The ${joined} tokens associated with ${name}`

  return {
    value: `${what} account for ${percent} of the TVS!`,
    sentiment,
  }
}
