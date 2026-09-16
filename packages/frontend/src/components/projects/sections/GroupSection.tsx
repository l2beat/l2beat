import type { Milestone } from '@l2beat/config'
import { Markdown } from '~/components/markdown/Markdown'
import { ProjectDetails } from '../ProjectDetails'
import { ProjectSection } from './ProjectSection'
import type { ProjectDetailsSection, ProjectSectionProps } from './types'

export interface GroupSectionProps extends ProjectSectionProps {
  // This is a circular ref, but it's fine
  description?: string
  items: ProjectDetailsSection[]
  milestones?: Milestone[]
}

export function GroupSection({
  description,
  items,
  milestones,
  as = 'section',
  ...sectionProps
}: GroupSectionProps) {
  return (
    <ProjectSection {...sectionProps} as={as}>
      <div className="flex flex-1 flex-col gap-2 lg:min-w-[400px]">
        {description && (
          <Markdown className="text-paragraph-15 md:text-paragraph-16">
            {description}
          </Markdown>
        )}
        <ProjectDetails
          nested
          items={items}
          milestones={milestones}
          parentSection={sectionProps.sectionOrder}
        />
      </div>
    </ProjectSection>
  )
}
