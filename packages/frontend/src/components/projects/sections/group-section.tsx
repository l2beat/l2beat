import { Markdown } from '~/components/markdown/markdown'
import { ProjectDetails } from '../project-details'
import { ProjectSection } from './project-section'
import type { ProjectDetailsSection, ProjectSectionProps } from './types'

export interface GroupSectionProps extends ProjectSectionProps {
  // This is a circular ref, but it's fine
  description?: string
  items: ProjectDetailsSection[]
}

export function GroupSection({
  description,
  items,
  as = 'div',
  ...sectionProps
}: GroupSectionProps) {
  return (
    <ProjectSection {...sectionProps} as={as}>
      <div className="flex flex-1 flex-col gap-2 lg:min-w-[400px]">
        {description && <Markdown>{description}</Markdown>}
        <ProjectDetails
          nested
          items={items}
          parentSection={sectionProps.sectionOrder}
        />
      </div>
    </ProjectSection>
  )
}
