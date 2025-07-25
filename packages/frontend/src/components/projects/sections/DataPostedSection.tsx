import type { Milestone } from '@l2beat/config'
import { ProjectDataPostedChart } from '~/components/chart/data-posted/ProjectDataPostedChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface DataPostedSectionProps extends ProjectSectionProps {
  projectId: string
  milestones: Milestone[]
  defaultRange: DataPostedTimeRange
}

export function DataPostedSection({
  projectId,
  milestones,
  defaultRange,
  ...sectionProps
}: DataPostedSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-paragraph-15 md:text-paragraph-16">
        This section shows the amount of data the project has posted to its
        respective Data Availability (DA) layer.
      </p>
      <HorizontalSeparator className="my-4" />
      <ProjectDataPostedChart
        projectId={projectId}
        defaultRange={defaultRange}
      />
    </ProjectSection>
  )
}
