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
import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import type { PrivacyTrustedSetupSummary } from '~/server/features/privacy/utils/getPrivacyTrustedSetup'
import { cn } from '~/utils/cn'
import {
  PrivacyWalkawayTestIcon,
  PrivacyWalkawayTestTooltipContent,
} from '../../PrivacyWalkawayTestIcon'
import { PRIVACY_ASSESSMENT } from '../../privacyAssessment'
import { PrivacyProjectRosette } from '../../rosette/PrivacyProjectRosette'
import { sentimentToRiskDot } from '../../sentimentToRiskDot'
import { MOBILE_SUMMARY_ROWS } from './PrivacyProjectStats'
import { PrivacyReferenceAppStat } from './PrivacyReferenceAppStat'

interface Props {
  trustedSetup: PrivacyTrustedSetupSummary
  exitWindow: PrivacyExitWindow
  adversaries: PrivacyAdversariesSummary
  /** This project's page, which the adversary rosette links into. */
  href: string
  isUnderReview: boolean
  reproducibility: PrivacySummaryValue
  /**
   * The app the privacy assessment was made with, and the link to the section
   * that explains the choice. Its grade holds for this app only.
   */
  referenceApp?: { app: PrivacyReferenceApp; href: string }
  className?: string
}

export function PrivacyProjectRiskProfile({
  trustedSetup,
  exitWindow,
  adversaries,
  href,
  isUnderReview,
  reproducibility,
  referenceApp,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'grid md:gap-4',
        referenceApp ? 'md:grid-cols-5' : 'md:grid-cols-4',
        MOBILE_SUMMARY_ROWS,
        className,
      )}
    >
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
      {referenceApp && <PrivacyReferenceAppStat {...referenceApp} />}
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
        className={cn(
          'flex items-center gap-2 text-left',
          // A lone 16px dot is too small to tap; the padding grows the
          // target without moving the dot.
          dotOnly && 'max-md:-m-2 max-md:p-2',
        )}
        aria-label={value.value}
      >
        {/* Text height on phones, where the dots sit in rows of text. */}
        <TrustedSetupRiskDot
          risk={risk}
          size={null}
          className="size-4 shrink-0 md:size-6"
        />
        {!dotOnly && <span>{value.value}</span>}
        {walkawayTest && (
          <PrivacyWalkawayTestIcon
            passed={walkawayTest.passed}
            className="max-md:size-4"
          />
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
