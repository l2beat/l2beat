import { SingleGrissiniDetails } from '~/components/rosette/grissini/single-grissini-details'
import { type RosetteValue } from '~/components/rosette/types'
import { cn } from '~/utils/cn'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

export interface GrissiniRiskAnalysisSectionProps extends ProjectSectionProps {
  isVerified: boolean | undefined
  grissiniValues: RosetteValue[]
  description?: string
  hideRisks?: boolean
}

export function GrissiniRiskAnalysisSection({
  grissiniValues,
  description,
  hideRisks = false,
  ...sectionProps
}: GrissiniRiskAnalysisSectionProps) {
  const isUnderReview =
    !!sectionProps.isUnderReview ||
    Object.values(grissiniValues).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  return (
    <ProjectSection
      {...sectionProps}
      isUnderReview={isUnderReview}
      className={cn(hideRisks ? 'space-y-0' : 'space-y-6')}
    >
      {description && <Markdown>{description}</Markdown>}
      {Object.values(grissiniValues).map((value, key) => (
        <div key={key} className="flex flex-col gap-2">
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
    </ProjectSection>
  )
}
