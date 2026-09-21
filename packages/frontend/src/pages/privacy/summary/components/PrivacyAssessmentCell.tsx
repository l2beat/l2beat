import type {
  PrivacyExitWindow,
  PrivacySummaryValue,
  PrivacyWalkawayTest,
} from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectRiskTooltipContent } from '~/components/projects/ProjectRiskTooltipContent'
import { PrivacySentimentDot } from '../../PrivacySentimentDot'
import { PrivacyWalkawayTestTooltipContent } from '../../PrivacyWalkawayTestIcon'
import { DotWithLabel } from './DotWithLabel'

type PrivacyAssessmentValue = PrivacyExitWindow | PrivacySummaryValue

export function PrivacyAssessmentCell({
  value,
  walkawayTest,
}: {
  value: PrivacyAssessmentValue
  walkawayTest?: PrivacyWalkawayTest
}) {
  return (
    <Tooltip>
      <TooltipTrigger aria-label={value.value}>
        <DotWithLabel
          dot={<PrivacySentimentDot sentiment={value.sentiment} />}
          label={value.value}
          // The walkaway test is the other half of "what happens when the
          // operators turn hostile", so it reads as a clause under the exit
          // window rather than as an icon floating beside its dot.
          detail={
            walkawayTest &&
            (walkawayTest.passed ? 'Walkaway passed' : 'Walkaway failed')
          }
          detailClassName={
            walkawayTest && !walkawayTest.passed ? 'text-negative' : undefined
          }
        />
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <ProjectRiskTooltipContent risk={value} variant="table" />
        {walkawayTest && (
          <PrivacyWalkawayTestTooltipContent walkawayTest={walkawayTest} />
        )}
      </TooltipContent>
    </Tooltip>
  )
}
