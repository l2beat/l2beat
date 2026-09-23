import type { Sentiment } from '@l2beat/config'
import { sentimentToText } from '~/utils/sentiment'

/** Sentiment as text for readers who cannot see the colour that shows it. */
export function HiddenSentiment({ sentiment }: { sentiment: Sentiment }) {
  return <span className="sr-only">{`, ${sentimentToText(sentiment)}`}</span>
}
