import { NoBridgeGrissiniDetailsPlaceholder } from '~/components/rosette/grissini/NoBridgeGrissiniDetailsPlaceholder'
import type { RosetteValue } from '~/components/rosette/types'
import { Markdown } from '../../markdown/Markdown'
import { RiskBanner } from '../RiskBanner'
import { ProjectSection } from './ProjectSection'
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
      {/* Markdown's glossary wrapper is inline, so a block keeps the gap. */}
      {description && (
        <div>
          <Markdown className="text-paragraph-15 md:text-paragraph-16">
            {description}
          </Markdown>
        </div>
      )}
      {layerGrissiniValues && layerGrissiniValues.length > 0 && (
        <RiskValues grissiniValues={layerGrissiniValues} />
      )}
      {bridgeGrissiniValues && bridgeGrissiniValues.length > 0 && (
        <RiskValues grissiniValues={bridgeGrissiniValues} />
      )}
      {isNoBridge && <NoBridgeGrissiniDetailsPlaceholder />}
    </ProjectSection>
  )
}

function RiskValues({ grissiniValues }: { grissiniValues: RosetteValue[] }) {
  return (
    // No margin after the last banner: the section's own space-y-6 sets the
    // gap to whatever follows
    <div className="flex flex-col gap-6">
      {Object.values(grissiniValues).map((value, key) => (
        <div key={key} className="flex flex-col gap-2">
          <RiskBanner key={value.name} {...value} size="large" />
        </div>
      ))}
    </div>
  )
}
