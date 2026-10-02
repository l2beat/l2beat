import type { Milestone, ProjectDaTrackingConfig } from '@l2beat/config'
import { ChartDataSourceInfo } from '~/components/chart/ChartDataSourceInfo'
import { ProjectDataPostedChart } from '~/components/chart/data-posted/ProjectDataPostedChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { CustomLink } from '~/components/link/CustomLink'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import { DATA_POSTED_DESCRIPTION, EIGENLAYER_DATA_SOURCE } from '../sectionCopy'
import type { ProjectSectionProps } from '../types'
import { DataPostedTrackedTransactions } from './DataPostedTrackedTransactions'

export interface DataPostedSectionProps extends ProjectSectionProps {
  project: ChartProject
  currentDaLayers: {
    name: string
    logo: string
    href: string
  }[]
  pastDaLayers: {
    name: string
    logo: string
    href: string
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
        {DATA_POSTED_DESCRIPTION} The project currently posts data to
        <span>
          {currentDaLayers.map((daLayer) => (
            <CustomLink key={daLayer.href} href={daLayer.href} className="ml-1">
              <img
                src={daLayer.logo}
                alt={daLayer.name}
                className="mr-1 inline-block size-5"
              />
              <span>{daLayer.name}</span>
            </CustomLink>
          ))}
        </span>
        {pastDaLayers.length > 0 && (
          <span>
            ; previously it posted to
            {pastDaLayers.map((daLayer) => (
              <CustomLink
                key={daLayer.href}
                href={daLayer.href}
                className="ml-1"
              >
                <img
                  src={daLayer.logo}
                  alt={daLayer.name}
                  className="mr-1 inline-block size-5"
                />
                <span>{daLayer.name}</span>
              </CustomLink>
            ))}
          </span>
        )}
        .
      </p>
      <HorizontalSeparator className="my-4" />
      {[...pastDaLayers, ...currentDaLayers].some(
        (daLayer) => daLayer.name === 'EigenDA',
      ) && <ChartDataSourceInfo dataSource={EIGENLAYER_DATA_SOURCE} />}
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
