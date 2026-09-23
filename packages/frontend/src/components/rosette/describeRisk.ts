import type { Sentiment } from '@l2beat/config'
import { sentimentToText } from '~/utils/sentiment'
import type { RosetteValue } from './types'

export function describeRisk(
  risk: RosetteValue,
  sentiment?: Sentiment,
): string {
  const shownSentiment = sentiment ?? risk.sentiment ?? 'neutral'
  return `${risk.name}: ${risk.value}, ${sentimentToText(shownSentiment)}`
}

export function describeRisks(
  risks: RosetteValue[],
  isUnderReview?: boolean,
): string {
  return risks
    .map((risk) =>
      describeRisk(risk, isUnderReview ? 'UnderReview' : undefined),
    )
    .join('; ')
}
