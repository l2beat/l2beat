import { SingleGrisiniDetails } from '~/components/grisini/single-grisini-details'
import { type GrisiniValue } from '~/components/grisini/types'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

export interface GrisiniRiskAnalysisSectionProps extends ProjectSectionProps {
  isVerified: boolean | undefined
  grisiniValues: GrisiniValue[]
}

export function GrisiniRiskAnalysisSection({
  isVerified,
  grisiniValues,
  ...sectionProps
}: GrisiniRiskAnalysisSectionProps) {
  const isUnderReview =
    !!sectionProps.isUnderReview ||
    Object.values(grisiniValues).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  return (
    <ProjectSection {...sectionProps} isUnderReview={isUnderReview} className='space-y-6'>
      {Object.values(grisiniValues).map((value, key) => (
        <div key={key} className="flex flex-col gap-2">
          <SingleGrisiniDetails {...value} />
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