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
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import {
  PrivacyWalkawayTestIcon,
  PrivacyWalkawayTestTooltipContent,
} from '../../PrivacyWalkawayTestIcon'
import { sentimentToRiskDot } from '../../sentimentToRiskDot'
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
              <TrustedSetupRiskDot
                risk={sentimentToRiskDot(value.sentiment)}
                size="sm"
                className="shrink-0"
              />
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
