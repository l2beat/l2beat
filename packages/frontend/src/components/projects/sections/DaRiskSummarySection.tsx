import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { WarningBar } from '~/components/WarningBar'
import { ShieldIcon } from '~/icons/Shield'
import { UnverifiedIcon } from '~/icons/Unverified'
import { ProjectSection } from './ProjectSection'
import type { RiskGroup } from './RiskSummarySection'
import { EnumeratedRisks } from './RiskSummarySection'
import type { ProjectSectionProps } from './types'

export interface DaRiskSummarySectionProps extends ProjectSectionProps {
  layer: {
    risks: RiskGroup[]
    name: string
  }
  bridge: {
    risks: RiskGroup[]
    name: string
    isVerified: boolean
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
          className="my-4 text-paragraph-15 md:text-paragraph-16"
          icon={UnverifiedIcon}
        />
      )}
      {redWarning && (
        <WarningBar
          text={redWarning}
          color="red"
          className="my-4 text-paragraph-15 md:text-paragraph-16"
          icon={ShieldIcon}
        />
      )}
      {warning && (
        <WarningBar
          text={warning}
          color="yellow"
          isCritical={false}
          className="my-4 text-paragraph-15 md:text-paragraph-16"
        />
      )}
      {layer.risks.length > 0 && (
        <div className="flex flex-col gap-2 ">
          <span className="font-medium text-xs text-zinc-500 uppercase dark:text-gray-50">
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
          <span className="font-medium text-xs text-zinc-500 uppercase dark:text-gray-50">
            {bridge.name}
            {bridge.name === layer.name ? ' bridge' : ''} risks
          </span>
          {!bridge.isVerified && (
            <WarningBar
              text="This bridge includes unverified contracts."
              color="red"
              isCritical={true}
            />
          )}
          <EnumeratedRisks risks={bridge.risks} />
        </div>
      )}
    </ProjectSection>
  )
}
