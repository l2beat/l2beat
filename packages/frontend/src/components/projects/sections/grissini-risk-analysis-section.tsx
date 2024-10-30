import { SingleGrissiniDetails } from '~/components/rosette/grissini/single-grissini-details'
import { type RosetteValue } from '~/components/rosette/types'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

export interface GrissiniRiskAnalysisSectionProps extends ProjectSectionProps {
  isVerified: boolean | undefined
  grissiniValues: RosetteValue[]
}

export function GrissiniRiskAnalysisSection({
  grissiniValues,
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
      className="space-y-6"
    >
      {Object.values(grissiniValues).map((value, key) => (
        <div key={key} className="flex flex-col gap-2">
          <SingleGrissiniDetails {...value} />
          {value.description && (
            <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400">
              {value.description}
            </Markdown>
          )}
        </div>
      ))}
    </ProjectSection>
  )
}
