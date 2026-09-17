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
import {
  PrivacyWalkawayTestIcon,
  PrivacyWalkawayTestTooltipContent,
} from '../../PrivacyWalkawayTestIcon'
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
          dot={
            <div className="relative">
<PrivacySentimentDot sentiment={value.sentiment} />
              {walkawayTest && (
                <PrivacyWalkawayTestIcon
                  passed={walkawayTest.passed}
                  className="-right-6 -translate-y-1/2 absolute top-1/2"
                />
              )}
            </div>
          }
          label={value.value}
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
