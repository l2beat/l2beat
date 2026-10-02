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
import {
  type TrustedSetupRisk,
  TrustedSetupRiskDot,
} from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import type { PrivacyTrustedSetupSummary } from '~/server/features/privacy/utils/getPrivacyTrustedSetup'
import { cn } from '~/utils/cn'
import {
  PrivacyWalkawayTestIcon,
  PrivacyWalkawayTestTooltipContent,
} from '../../PrivacyWalkawayTestIcon'
import { PRIVACY_ASSESSMENT } from '../../privacyAssessment'
import { PrivacyProjectRosette } from '../../rosette/PrivacyProjectRosette'
import { sentimentToRiskDot } from '../../sentimentToRiskDot'

interface Props {
  trustedSetup: PrivacyTrustedSetupSummary
  exitWindow: PrivacyExitWindow
  adversaries: PrivacyAdversariesSummary
  /** This project's page, which the adversary rosette links into. */
  href: string
  isUnderReview: boolean
  reproducibility: PrivacySummaryValue
  className?: string
}

export function PrivacyProjectRiskProfile({
  trustedSetup,
  exitWindow,
  adversaries,
  href,
  isUnderReview,
  reproducibility,
  className,
}: Props) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-4', className)}>
      <ProjectSummaryStat
        title={PRIVACY_ASSESSMENT.title}
        tooltip={PRIVACY_ASSESSMENT.tooltip}
        value={
          <PrivacyProjectRosette
            adversaries={adversaries}
            href={href}
            isUnderReview={isUnderReview}
          />
        }
      />
      <ProjectSummaryStat
        title="Trusted setup"
        tooltip="Trusted setup used by the project's proving system and its risk."
        value={
          <RiskValue
            value={trustedSetup}
            risk={trustedSetup.risk}
            dotOnly={trustedSetup.label === undefined}
          />
        }
      />
      <ProjectSummaryStat
        title="Exit window"
        tooltip="Time users have to withdraw before a malicious upgrade can take effect."
        value={
          <RiskValue
            value={exitWindow}
            risk={sentimentToRiskDot(exitWindow.sentiment)}
            walkawayTest={exitWindow.walkawayTest}
          />
        }
      />
      <ProjectSummaryStat
        title="Reproducibility"
        tooltip="Whether all source code needed to audit the protocol and participate in it is published and can be used locally."
        value={
          <RiskValue
            value={reproducibility}
            risk={sentimentToRiskDot(reproducibility.sentiment)}
          />
        }
      />
    </div>
  )
}

function RiskValue({
  value,
  risk,
  walkawayTest,
  dotOnly,
}: {
  value: PrivacyExitWindow | PrivacySummaryValue
  risk: TrustedSetupRisk
  walkawayTest?: PrivacyWalkawayTest
  /** Leaves the value to the tooltip. */
  dotOnly?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="flex items-center gap-2 text-left"
        aria-label={value.value}
      >
        <TrustedSetupRiskDot risk={risk} size="md" className="shrink-0" />
        {!dotOnly && <span>{value.value}</span>}
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
