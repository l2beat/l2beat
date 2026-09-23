import type { WarningWithSentiment } from '@l2beat/config'
import { sentimentToText } from './sentiment'

export function describeWarnings(warnings: WarningWithSentiment[]): string {
  return warnings
    .map((warning) => `${warning.value}, ${sentimentToText(warning.sentiment)}`)
    .join('; ')
}
