import type { Sentiment } from '@l2beat/config'
import { Badge } from '~/components/badge/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { sentimentToTextColor } from '~/utils/sentiment'
import { OSSIFICATION_SCORE_BANDS } from './ossificationScoreBands'

export function OssificationScore({
  score,
  isUnverified,
}: {
  score: number
  isUnverified: boolean
}) {
  if (isUnverified) {
    return <UnverifiedContractsBadge />
  }
  return (
    <span className={sentimentToTextColor(getScoreSentiment(score))}>
      {score}
    </span>
  )
}

function getScoreSentiment(score: number): Sentiment {
  if (score >= OSSIFICATION_SCORE_BANDS.good) return 'good'
  if (score >= OSSIFICATION_SCORE_BANDS.warning) return 'warning'
  return 'bad'
}

function UnverifiedContractsBadge() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge type="error" size="small">
          Unverified contract(s)
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        Ossification % can only be calculated if all critical smart contracts
        have published verified source code.
      </TooltipContent>
    </Tooltip>
  )
}
