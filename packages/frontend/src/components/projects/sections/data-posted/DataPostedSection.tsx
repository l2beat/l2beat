import type { Milestone, ProjectDaTrackingConfig } from '@l2beat/config'
import { EigenDataSourceInfo } from '~/components/chart/data-availability/EigenDataSourceInfo'
import { ProjectDataPostedChart } from '~/components/chart/data-posted/ProjectDataPostedChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { CustomLink } from '~/components/link/CustomLink'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { DataPostedTrackedTransactions } from './DataPostedTrackedTransactions'

export interface DataPostedSectionProps extends ProjectSectionProps {
  projectId: string
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
  projectId,
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
      {daLayer.name === 'EigenDA' && <EigenDataSourceInfo />}
      <ProjectDataPostedChart
        projectId={projectId}
        defaultRange={defaultRange}
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
