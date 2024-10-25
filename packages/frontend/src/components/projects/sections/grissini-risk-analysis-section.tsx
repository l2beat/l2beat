import { SingleGrissiniDetails } from '~/components/grissini/single-grissini-details'
import { type GrissiniValue } from '~/components/grissini/types'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

export interface GrissiniRiskAnalysisSectionProps extends ProjectSectionProps {
  isVerified: boolean | undefined
  grissiniValues: GrissiniValue[]
}

export function GrissiniRiskAnalysisSection({
  isVerified,
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
            <Markdown className="mt-1.5 font-normal leading-snug text-black/80 dark:text-white/80 md:text-lg">
              {value.description}
            </Markdown>
          )}
        </div>
      ))}
    </ProjectSection>
  )
}
