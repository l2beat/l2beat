import type { PrivacyExitWindow, PrivacySummaryValue } from '@l2beat/config'

type PrivacySentiment = (PrivacyExitWindow | PrivacySummaryValue)['sentiment']

export function sentimentToRiskDot(sentiment: PrivacySentiment) {
  switch (sentiment) {
    case 'good':
      return 'green'
    case 'warning':
      return 'yellow'
    case 'bad':
      return 'red'
    case 'neutral':
    case 'UnderReview':
    case undefined:
      return 'N/A'
  }
}
