import type { Sentiment } from '@l2beat/config'
import { sentimentToText } from '~/utils/sentiment'

export function HiddenSentiment({ sentiment }: { sentiment: Sentiment }) {
  return <span className="sr-only">{`, ${sentimentToText(sentiment)}`}</span>
}
