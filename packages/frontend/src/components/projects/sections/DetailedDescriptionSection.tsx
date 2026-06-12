import { Markdown } from '../../markdown/Markdown'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface DetailedDescriptionSectionProps extends ProjectSectionProps {
  description: string | undefined
  detailedDescription: string | undefined
}

export function DetailedDescriptionSection({
  description,
  detailedDescription,
  ...sectionProps
}: DetailedDescriptionSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <div className="text-paragraph-15 md:text-paragraph-16">
        {description && <Markdown>{description}</Markdown>}
        {detailedDescription && (
          <Markdown className="mt-4">{detailedDescription}</Markdown>
        )}
      </div>
    </ProjectSection>
  )
}
