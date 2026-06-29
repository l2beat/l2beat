import type { PrivacyExitWindow, PrivacySummaryValue } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectRiskTooltipContent } from '~/components/projects/ProjectRiskTooltipContent'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import { cn } from '~/utils/cn'
import { sentimentToRiskDot } from '../../sentimentToRiskDot'

interface Props {
  exitWindow: PrivacyExitWindow
  adminViewingKey: PrivacySummaryValue
  reproducibility: PrivacySummaryValue
  className?: string
}

export function PrivacyProjectRiskProfile({
  exitWindow,
  adminViewingKey,
  reproducibility,
  className,
}: Props) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-3', className)}>
      <ProjectSummaryStat
        title="Exit window"
        tooltip="Time users have to withdraw before a malicious upgrade can take effect."
        value={<RiskValue value={exitWindow} />}
      />
      <ProjectSummaryStat
        title="Privacy"
        tooltip="What is private and what are the trust assumptions? How is compliance facilitated?"
        value={<RiskValue value={adminViewingKey} />}
      />
      <ProjectSummaryStat
        title="Reproducibility"
        tooltip="Whether all source code needed to audit the protocol and participate in it is published and can be used locally."
        value={<RiskValue value={reproducibility} />}
      />
    </div>
  )
}

function RiskValue({
  value,
}: {
  value: PrivacyExitWindow | PrivacySummaryValue
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="flex items-center gap-2"
        aria-label={value.value}
      >
        <TrustedSetupRiskDot
          risk={sentimentToRiskDot(value.sentiment)}
          size="md"
          className="shrink-0"
        />
        <span>{value.value}</span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <ProjectRiskTooltipContent risk={value} variant="table" />
      </TooltipContent>
    </Tooltip>
  )
}
