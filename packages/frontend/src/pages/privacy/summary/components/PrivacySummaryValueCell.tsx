import type { PrivacyExitWindow, PrivacySummaryValue } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectRiskTooltipContent } from '~/components/projects/ProjectRiskTooltipContent'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import { cn } from '~/utils/cn'

type PrivacySummaryTableValue = PrivacyExitWindow | PrivacySummaryValue

export function PrivacySummaryValueCell({
  value,
  showValue = false,
}: {
  value: PrivacySummaryTableValue
  showValue?: boolean
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
        <TrustedSetupRiskDot
          risk={toRiskDotRisk(value.sentiment)}
          size="sm"
          className="shrink-0"
        />
        {showValue && (
          <span className="font-medium text-[11px] text-secondary leading-none">
            {value.value}
          </span>
        )}
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <ProjectRiskTooltipContent risk={value} variant="table" />
      </TooltipContent>
    </Tooltip>
  )
}

function toRiskDotRisk(sentiment: PrivacySummaryTableValue['sentiment']) {
  switch (sentiment) {
    case 'good':
      return 'green'
    case 'warning':
      return 'yellow'
    case 'bad':
      return 'red'
    case 'neutral':
    case 'UnderReview':
    case undefined:
      return 'N/A'
  }
}
