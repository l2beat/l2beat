import type { ReferenceLink } from '@l2beat/config'
import { cn } from '~/utils/cn'
import { Markdown } from '../../markdown/Markdown'
import {
  MARKDOWN_DIAGRAM_CLASSES,
  MARKDOWN_HEADING_CLASSES,
} from './markdownDiagramClasses'
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
      <div
        className={cn(
          'text-paragraph-15 md:text-paragraph-16',
          MARKDOWN_DIAGRAM_CLASSES,
          MARKDOWN_HEADING_CLASSES,
        )}
      >
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
