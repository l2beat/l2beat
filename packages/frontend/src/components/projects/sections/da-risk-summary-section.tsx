import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { WarningBar } from '~/components/warning-bar'
import { ShieldIcon } from '~/icons/shield'
import { UnverifiedIcon } from '~/icons/unverified'
import { ProjectSection } from './project-section'
import type { RiskGroup } from './risk-summary-section'
import { EnumeratedRisks } from './risk-summary-section'
import type { ProjectSectionProps } from './types'

export interface DaRiskSummarySectionProps extends ProjectSectionProps {
  layer: {
    risks: RiskGroup[]
    name: string
  }
  bridge: {
    risks: RiskGroup[]
    name: string
  }
  warning: string | undefined
  isVerified: boolean | undefined
  redWarning: string | undefined
}

export function DaRiskSummarySection({
  layer,
  bridge,
  isVerified,
  redWarning,
  warning,
  ...sectionProps
}: DaRiskSummarySectionProps) {
  if (layer.risks.concat(bridge.risks).length === 0) {
    return null
  }
  return (
    <ProjectSection {...sectionProps}>
      {isVerified === false && (
        <WarningBar
          text="This project includes unverified contracts."
          color="red"
          isCritical={true}
          className="my-4"
          icon={UnverifiedIcon}
        />
      )}
      {redWarning && (
        <WarningBar
          text={redWarning}
          color="red"
          className="my-4"
          icon={ShieldIcon}
        />
      )}
      {warning && (
        <WarningBar
          text={warning}
          color="yellow"
          isCritical={false}
          className="my-4"
        />
      )}
      {layer.risks.length > 0 && (
        <div className="flex flex-col gap-2 ">
          <span className="text-xs font-medium uppercase text-zinc-500 dark:text-gray-50">
            {layer.name} risks
          </span>
          <EnumeratedRisks risks={layer.risks} />
        </div>
      )}
      {layer.risks.length > 0 && bridge.risks.length > 0 && (
        <HorizontalSeparator className="my-4 border-divider md:my-6" />
      )}
      {bridge.risks.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase text-zinc-500 dark:text-gray-50">
            {bridge.name} risks
          </span>
          <EnumeratedRisks risks={bridge.risks} />
        </div>
      )}
    </ProjectSection>
  )
}
