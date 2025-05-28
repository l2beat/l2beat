'use client'
import uniq from 'lodash/uniq'
import { useMemo } from 'react'
import { ProjectChartTimeRange } from '~/components/core/chart/chart-time-range'
import { ChartTimeRangeControls } from '~/components/core/chart/chart-time-range-controls'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { Skeleton } from '~/components/core/skeleton'
import { ProjectCombobox } from '~/components/project-combobox'
import { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/react'
import { DaThroughputByProjectChart } from './da-throughput-by-project-chart'
import type { Milestone } from '@l2beat/config'

const DEFAULT_PROJECTS_TO_SHOW = 5

interface Props {
  daLayer: string
  range: DaThroughputTimeRange
  setRange: (range: DaThroughputTimeRange) => void
  selectedProjects: string[] | undefined
  setSelectedProjects: (projects: string[] | undefined) => void
  customColors: Record<string, string>
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
  const { data, isLoading } = api.da.projectChartByProject.useQuery({
    range,
    daLayer,
  })

  const allProjects = useMemo(() => {
    // We want to get latest top projects.
    return data
      ? uniq(
          [...data]
            .reverse()
            .flatMap(([_, values]) => Object.keys(values))
            .sort((a, b) => {
              if (a === 'Unknown') return 1
              if (b === 'Unknown') return -1
              return 0
            }),
        )
      : []
  }, [data])

  const chartRange = useMemo(
    () => getChartRange(data?.map(([timestamp]) => ({ timestamp }))),
    [data],
  )

  const projectsToShow = useMemo(
    () =>
      selectedProjects ??
      allProjects
        .filter((p) => p !== 'Unknown')
        .slice(0, DEFAULT_PROJECTS_TO_SHOW),
    [allProjects, selectedProjects],
  )

  return (
    <div>
      <div className="mb-3 mt-4 flex flex-col justify-between gap-1">
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          {!data && isLoading ? (
            <Skeleton className="h-8 w-44" />
          ) : (
            <ProjectCombobox
              allProjects={allProjects}
              projects={projectsToShow}
              setProjects={setSelectedProjects}
            />
          )}
          <ChartTimeRangeControls
            name="Range"
            value={range}
            setValue={setRange}
            options={Object.values(DaThroughputTimeRange.Enum).map((v) => ({
              value: v,
              label: v.toUpperCase(),
            }))}
          />
        </div>
      </div>
      <DaThroughputByProjectChart
        data={data}
        isLoading={isLoading}
        projectsToShow={projectsToShow}
        customColors={customColors}
        milestones={milestones}
      />
    </div>
  )
}
