'use client'
import type { Milestone } from '@l2beat/config'
import uniq from 'lodash/uniq'
import { useMemo } from 'react'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { ChartTimeRangeControls } from '~/components/core/chart/ChartTimeRangeControls'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { Skeleton } from '~/components/core/Skeleton'
import { ProjectCombobox } from '~/components/ProjectCombobox'
import { useIncludeScalingOnly } from '~/pages/data-availability/throughput/components/DaThroughputContext'
import {
  type DaThroughputTimeRange,
  DaThroughputTimeRangeValues,
} from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/React'
import { DaThroughputByProjectChart } from './DaThroughputByProjectChart'
import { EigenDataSourceInfo } from './EigenDataSourceInfo'
import { EthereumProjectsOnlyCheckbox } from './EthereumProjectsOnlyCheckbox'

const DEFAULT_PROJECTS_TO_SHOW = 5

interface Props {
  daLayer: string
  range: DaThroughputTimeRange
  setRange: (range: DaThroughputTimeRange) => void
  selectedProjects: string[] | undefined
  setSelectedProjects: (projects: string[] | undefined) => void
  customColors: Record<string, string> | undefined
  milestones: Milestone[]
}

export function ThroughputSectionByProjectChart({
  daLayer,
  range,
  setRange,
  selectedProjects,
  setSelectedProjects,
  customColors,
  milestones,
}: Props) {
  const { includeScalingOnly, setIncludeScalingOnly } = useIncludeScalingOnly()
  const { data, isLoading } = api.da.projectChartByProject.useQuery({
    range,
    daLayer,
  })

  const allProjects = useMemo(() => {
    // We want to get latest top projects.
    const result = data
      ? uniq(
          [...data.chart]
            .reverse()
            .flatMap(([_, values]) => Object.keys(values ?? {}))
            .sort((a, b) => {
              if (a === 'Unknown') return 1
              if (b === 'Unknown') return -1
              return 0
            }),
        )
      : []

    if (includeScalingOnly) {
      result.pop()
    }
    return result
  }, [data, includeScalingOnly])

  const chartRange = useMemo(
    () => getChartRange(data?.chart.map(([timestamp]) => ({ timestamp }))),
    [data],
  )

  const projectsToShow = useMemo(
    () =>
      selectedProjects?.filter((p) => {
        if (includeScalingOnly) {
          return p !== 'Unknown'
        }
        return true
      }) ??
      allProjects
        .filter((p) => p !== 'Unknown')
        .slice(0, DEFAULT_PROJECTS_TO_SHOW),
    [allProjects, includeScalingOnly, selectedProjects],
  )

  return (
    <div>
      <div className="mt-4 mb-3 flex flex-col justify-between gap-1">
        <div className="flex flex-wrap items-center justify-between gap-x-1">
          <ProjectChartTimeRange range={chartRange} />
          {daLayer === 'eigenda' && <EigenDataSourceInfo />}
        </div>
        <div className="flex justify-between gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <EthereumProjectsOnlyCheckbox
              name="projectByProjectThroughputIncludeScalingOnly"
              checked={includeScalingOnly}
              onCheckedChange={setIncludeScalingOnly}
            />
            {!data && isLoading ? (
              <Skeleton className="h-8 w-44" />
            ) : (
              <ProjectCombobox
                allProjects={allProjects}
                projects={projectsToShow}
                setProjects={setSelectedProjects}
              />
            )}
          </div>
          <ChartTimeRangeControls
            name="Range"
            value={range}
            setValue={setRange}
            options={Object.values(DaThroughputTimeRangeValues).map((v) => ({
              value: v,
              label: v.toUpperCase(),
            }))}
          />
        </div>
      </div>
      <DaThroughputByProjectChart
        daLayer={daLayer}
        data={data}
        isLoading={isLoading}
        projectsToShow={projectsToShow}
        customColors={customColors}
        milestones={milestones}
      />
    </div>
  )
}
