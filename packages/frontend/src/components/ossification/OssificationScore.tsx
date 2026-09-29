import type { Sentiment } from '@l2beat/config'
import { sentimentToTextColor } from '~/utils/sentiment'
import { OssificationUnverifiedBadge } from './OssificationUnverifiedBadge'

export function OssificationScore({
  score,
  isUnverified,
}: {
  score: number
  isUnverified: boolean
}) {
  if (isUnverified) {
    return <OssificationUnverifiedBadge />
  }
  return (
    <span className={sentimentToTextColor(getScoreSentiment(score))}>
      {score}
    </span>
  )
}

function getScoreSentiment(score: number): Sentiment {
  if (score >= 80) return 'neutral'
  if (score >= 50) return 'warning'
  return 'bad'
}
