import type { ReferenceLink } from '@l2beat/config'
import { Markdown } from '../../markdown/Markdown'
import { ProjectSection } from './ProjectSection'
import { ReferenceList } from './ReferenceList'
import type { ProjectSectionProps } from './types'

export interface DetailedDescriptionSectionProps extends ProjectSectionProps {
  description: string | undefined
  detailedDescription: string | undefined
  references?: ReferenceLink[]
}

export function DetailedDescriptionSection({
  description,
  detailedDescription,
  references,
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
      {references && references.length > 0 && (
        <ReferenceList references={references} />
      )}
    </ProjectSection>
  )
}
