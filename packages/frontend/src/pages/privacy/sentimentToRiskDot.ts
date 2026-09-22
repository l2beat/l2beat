import type { PrivacyExitWindow, PrivacySummaryValue } from '@l2beat/config'
import type { TrustedSetupRisk } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'

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

/**
 * The same palette as the risk dots, as an SVG fill, so the privacy rosette
 * and the dots that label it are the same colours. 'N/A' and 'None' lose their
 * dot shapes here and read as neutral, which is what a slice can carry.
 */
export function riskToFillColor(risk: TrustedSetupRisk): string {
  switch (risk) {
    case 'green':
      return 'fill-positive'
    case 'yellow':
      return 'fill-surface-warning'
    case 'red':
      return 'fill-negative'
    case 'N/A':
    case 'None':
      return 'fill-gray-400 dark:fill-zinc-700'
  }
}
