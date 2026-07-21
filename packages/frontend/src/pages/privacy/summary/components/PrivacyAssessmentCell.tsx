import type { PrivacyExitWindow, PrivacySummaryValue } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectRiskTooltipContent } from '~/components/projects/ProjectRiskTooltipContent'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import { cn } from '~/utils/cn'
import {
  PrivacyWalkawayTestIcon,
  PrivacyWalkawayTestTooltipContent,
} from '../../PrivacyWalkawayTestIcon'
import { sentimentToRiskDot } from '../../sentimentToRiskDot'

type PrivacyAssessmentValue = PrivacyExitWindow | PrivacySummaryValue

export function PrivacyAssessmentCell({
  value,
  showValue = false,
  isWalkawayTestPassed,
}: {
  value: PrivacyAssessmentValue
  showValue?: boolean
  isWalkawayTestPassed?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'inline-flex items-center justify-center',
          showValue && 'flex-col gap-1',
        )}
        aria-label={value.value}
      >
        <div className="relative">
          <TrustedSetupRiskDot
            risk={sentimentToRiskDot(value.sentiment)}
            size="sm"
            className="shrink-0"
          />
          {isWalkawayTestPassed !== undefined && (
            <PrivacyWalkawayTestIcon
              passed={isWalkawayTestPassed}
              className="-right-6 -translate-y-1/2 absolute top-1/2"
            />
          )}
        </div>
        {showValue && (
          <span className="max-w-20 whitespace-normal text-center font-medium text-[11px] text-secondary leading-tight">
            {value.value}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <ProjectRiskTooltipContent risk={value} variant="table" />
        {isWalkawayTestPassed !== undefined && (
          <PrivacyWalkawayTestTooltipContent passed={isWalkawayTestPassed} />
        )}
      </TooltipContent>
    </Tooltip>
  )
}
