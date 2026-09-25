import { sentimentToText } from '~/utils/sentiment'
import type { RosetteValue } from './types'

/** A rosette under review greys out every slice, so its text says so too. */
export function describeRisks(
  risks: RosetteValue[],
  isUnderReview = false,
): string {
  return risks
    .map((risk) => {
      const sentiment = isUnderReview
        ? 'UnderReview'
        : (risk.sentiment ?? 'neutral')
      return `${risk.name}: ${risk.value}, ${sentimentToText(sentiment)}`
    })
    .join('; ')
}
