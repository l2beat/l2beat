import type { Milestone, ProjectDaTrackingConfig } from '@l2beat/config'
import { ProjectDataPostedChart } from '~/components/chart/data-posted/ProjectDataPostedChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import { DATA_POSTED_DESCRIPTION } from '../sectionCopy'
import type { ProjectSectionProps } from '../types'
import { DataPostedTrackedTransactions } from './DataPostedTrackedTransactions'

export interface DataPostedSectionProps extends ProjectSectionProps {
  project: ChartProject
  currentDaLayers: {
    name: string
    logo: string
  }[]
  pastDaLayers: {
    name: string
    logo: string
  }[]
  milestones: Milestone[]
  defaultRange: ChartRange
  daTrackingConfig: (ProjectDaTrackingConfig & {
    daLayerName: string
  })[]
}

export function DataPostedSection({
  project,
  currentDaLayers,
  pastDaLayers,
  milestones,
  defaultRange,
  daTrackingConfig,
  ...sectionProps
}: DataPostedSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <p className="text-paragraph-15 md:text-paragraph-16">
        {DATA_POSTED_DESCRIPTION}{' '}
        {currentDaLayers.length > 0 ? (
          <>
            The project currently posts data to
            <DaLayerNames daLayers={currentDaLayers} />
          </>
        ) : (
          'The project no longer posts data'
        )}
        {pastDaLayers.length > 0 && (
          <>
            ; previously it posted to
            <DaLayerNames daLayers={pastDaLayers} />
          </>
        )}
        .
      </p>
      <HorizontalSeparator className="my-4" />
      <ProjectDataPostedChart
        project={project}
        defaultRange={defaultRange}
        milestones={milestones}
      />
      <HorizontalSeparator className="my-4" />
      <DataPostedTrackedTransactions daTrackingConfig={daTrackingConfig} />
    </ProjectSection>
  )
}

function DaLayerNames({
  daLayers,
}: {
  daLayers: { name: string; logo: string }[]
}) {
  return (
    <span>
      {daLayers.map((daLayer) => (
        <DaLayerName key={daLayer.name} daLayer={daLayer} />
      ))}
    </span>
  )
}

function DaLayerName({ daLayer }: { daLayer: { name: string; logo: string } }) {
  return (
    <span className="ml-1 font-medium">
      <img
        src={daLayer.logo}
        alt={daLayer.name}
        className="mr-1 inline-block size-5"
      />
      {daLayer.name}
    </span>
  )
}
