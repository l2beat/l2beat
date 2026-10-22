import { getOssificationSentiment } from '@l2beat/shared-pure'
import { Badge } from '~/components/badge/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { sentimentToTextColor } from '~/utils/sentiment'

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
    <span className={sentimentToTextColor(getOssificationSentiment(score))}>
      {score}
    </span>
  )
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
