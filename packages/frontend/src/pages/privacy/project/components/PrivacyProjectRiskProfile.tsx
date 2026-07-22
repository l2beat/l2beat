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
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import { cn } from '~/utils/cn'
import {
  PrivacyWalkawayTestIcon,
  PrivacyWalkawayTestTooltipContent,
} from '../../PrivacyWalkawayTestIcon'
import { PRIVACY_ASSESSMENT } from '../../privacyAssessment'
import { sentimentToRiskDot } from '../../sentimentToRiskDot'

interface Props {
  trustedSetup: PrivacySummaryValue
  exitWindow: PrivacyExitWindow
  privacy: PrivacySummaryValue
  reproducibility: PrivacySummaryValue
  className?: string
}

export function PrivacyProjectRiskProfile({
  trustedSetup,
  exitWindow,
  privacy,
  reproducibility,
  className,
}: Props) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-4', className)}>
      <ProjectSummaryStat
        title="Trusted setup"
        tooltip="Trusted setup used by the project's proving system and its risk."
        value={<RiskValue value={trustedSetup} />}
      />
      <ProjectSummaryStat
        title="Exit window"
        tooltip="Time users have to withdraw before a malicious upgrade can take effect."
        value={
          <RiskValue
            value={exitWindow}
            walkawayTest={exitWindow.walkawayTest}
          />
        }
      />
      <ProjectSummaryStat
        title={PRIVACY_ASSESSMENT.title}
        tooltip={PRIVACY_ASSESSMENT.tooltip}
        value={<RiskValue value={privacy} />}
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
  walkawayTest,
}: {
  value: PrivacyExitWindow | PrivacySummaryValue
  walkawayTest?: PrivacyWalkawayTest
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
        {walkawayTest && (
          <PrivacyWalkawayTestIcon passed={walkawayTest.passed} />
        )}
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
