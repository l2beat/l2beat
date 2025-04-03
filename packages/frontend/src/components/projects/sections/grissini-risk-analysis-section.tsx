import { InlinedNoBridgeGrissiniDetailsPlaceholder } from '~/components/rosette/grissini/no-bridge-grissini-details-placeholder'
import type { RosetteValue } from '~/components/rosette/types'
import { Markdown } from '../../markdown/markdown'
import { RiskBanner } from '../risk-banner'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'

export interface GrissiniRiskAnalysisSectionProps extends ProjectSectionProps {
  isVerified: boolean | undefined
  isNoBridge?: boolean
  layerGrissiniValues?: RosetteValue[]
  bridgeGrissiniValues?: RosetteValue[]
  description?: string
}

export function GrissiniRiskAnalysisSection({
  layerGrissiniValues,
  bridgeGrissiniValues,
  description,
  isNoBridge = false,
  ...sectionProps
}: GrissiniRiskAnalysisSectionProps) {
  const isUnderReview =
    !!sectionProps.isUnderReview ||
    Object.values([
      ...(layerGrissiniValues ?? []),
      ...(bridgeGrissiniValues ?? []),
    ]).some(({ sentiment }) => sentiment === 'UnderReview')
  return (
    <ProjectSection
      {...sectionProps}
      isUnderReview={isUnderReview}
      className="space-y-6"
    >
      {description && <Markdown>{description}</Markdown>}
      {layerGrissiniValues && layerGrissiniValues.length > 0 && (
        <RiskValues grissiniValues={layerGrissiniValues} />
      )}
      {bridgeGrissiniValues && bridgeGrissiniValues.length > 0 && (
        <RiskValues grissiniValues={bridgeGrissiniValues} />
      )}
      {isNoBridge && <InlinedNoBridgeGrissiniDetailsPlaceholder />}
    </ProjectSection>
  )
}

function RiskValues({
  grissiniValues,
}: {
  grissiniValues: RosetteValue[]
}) {
  return (
    <div>
      {Object.values(grissiniValues).map((value, key) => (
        <div key={key} className="mb-6 flex flex-col gap-2">
          <RiskBanner key={value.name} {...value} />
        </div>
      ))}
    </div>
  )
}
