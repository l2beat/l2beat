import type { Milestone, ProjectDaTrackingConfig } from '@l2beat/config'
import { ChartDataSourceInfo } from '~/components/chart/ChartDataSourceInfo'
import { ProjectDataPostedChart } from '~/components/chart/data-posted/ProjectDataPostedChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { CustomLink } from '~/components/link/CustomLink'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { DataPostedTrackedTransactions } from './DataPostedTrackedTransactions'

export interface DataPostedSectionProps extends ProjectSectionProps {
  project: ChartProject
  daLayer: {
    name: string
    logo: string
    href: string
  }
  milestones: Milestone[]
  defaultRange: DataPostedTimeRange
  daTrackingConfig: ProjectDaTrackingConfig[]
}

export function DataPostedSection({
  project,
  daLayer,
  milestones,
  defaultRange,
  daTrackingConfig,
  ...sectionProps
}: DataPostedSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-paragraph-15 md:text-paragraph-16">
        This section shows the amount of data the project has posted to the{' '}
        <CustomLink href={daLayer.href}>
          <img
            src={daLayer.logo}
            alt={daLayer.name}
            className="mr-1 inline-block size-5"
          />
          <span>{daLayer.name}</span>
        </CustomLink>
        .
      </p>
      <HorizontalSeparator className="my-4" />
      {daLayer.name === 'EigenDA' && (
        <ChartDataSourceInfo dataSource="API provided by EigenLayer" />
      )}
      <ProjectDataPostedChart
        project={project}
        defaultRange={defaultRange}
        milestones={milestones}
      />
      {daLayer.name !== 'EigenDA' && (
        <>
          <HorizontalSeparator className="my-4" />
          <DataPostedTrackedTransactions daTrackingConfig={daTrackingConfig} />
        </>
      )}
    </ProjectSection>
  )
}
