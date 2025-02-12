import { InlinedNoBridgeGrissiniDetailsPlaceholder } from '~/components/rosette/grissini/no-bridge-grissini-details-placeholder'
import { SingleGrissiniDetails } from '~/components/rosette/grissini/single-grissini-details'
import type { RosetteValue } from '~/components/rosette/types'
import { cn } from '~/utils/cn'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'

export interface GrissiniRiskAnalysisSectionProps extends ProjectSectionProps {
  isVerified: boolean | undefined
  isNoBridge?: boolean
  layerGrissiniValues?: RosetteValue[]
  bridgeGrissiniValues?: RosetteValue[]
  description?: string
  hideRisks?: boolean
  hideTitle?: boolean
}

export function GrissiniRiskAnalysisSection({
  layerGrissiniValues,
  bridgeGrissiniValues,
  description,
  hideRisks = false,
  hideTitle,
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
      className={cn(hideRisks ? 'space-y-0' : 'space-y-6')}
    >
      {description && <Markdown>{description}</Markdown>}
      {layerGrissiniValues && layerGrissiniValues.length > 0 && (
        <RiskValues
          grissiniValues={layerGrissiniValues}
          hideRisks={hideRisks}
          title="DA Layer Risks"
          hideTitle={hideTitle}
        />
      )}
      {bridgeGrissiniValues && bridgeGrissiniValues.length > 0 && (
        <RiskValues
          grissiniValues={bridgeGrissiniValues}
          hideRisks={hideRisks}
          title="DA Bridge Risks"
          hideTitle={hideTitle}
        />
      )}
      {isNoBridge && <InlinedNoBridgeGrissiniDetailsPlaceholder />}
    </ProjectSection>
  )
}

function RiskValues({
  title,
  grissiniValues,
  hideRisks,
  hideTitle,
}: {
  title: string
  grissiniValues: RosetteValue[]
  hideRisks?: boolean
  hideTitle?: boolean
}) {
  return (
    <div>
      {!hideTitle && (
        <div className="mb-2 text-lg font-bold md:text-xl">{title}</div>
      )}
      {Object.values(grissiniValues).map((value, key) => (
        <div key={key} className="mb-6 flex flex-col gap-2">
          <SingleGrissiniDetails
            {...value}
            className={hideRisks ? 'hidden' : ''}
          />
          {value.description && (
            <Markdown
              className={cn(
                'leading-snug text-gray-850 dark:text-gray-400 md:text-lg',
                hideRisks ? 'mt-0' : 'mt-1.5',
              )}
            >
              {value.description}
            </Markdown>
          )}
        </div>
      ))}
    </div>
  )
}
