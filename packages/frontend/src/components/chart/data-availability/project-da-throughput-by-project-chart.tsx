'use client'
import { uniq } from 'lodash'
import { useMemo, useState } from 'react'
import { ProjectChartTimeRange } from '~/components/core/chart/chart-time-range'
import { ChartTimeRangeControls } from '~/components/core/chart/chart-time-range-controls'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { ProjectCombobox } from '~/components/project-combobox'
import { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/react'
import { DaThroughputByProjectChart } from './da-throughput-by-project-chart'

export function ProjectDaThroughputByProjectChart({
  daLayer,
}: { daLayer: string }) {
  const [range, setRange] = useState<DaThroughputTimeRange>('30d')

  const { data, isLoading } = api.da.projectChartByProject.useQuery({
    range: range,
    daLayer,
  })

  const allProjects = useMemo(() => {
    // We want to get latest top 8 projects.
    return data
      ? uniq([...data].reverse().flatMap(([_, values]) => Object.keys(values)))
      : []
  }, [data])

  const [selectedProjects, setSelectedProjects] = useState<string[]>()
  const chartRange = useMemo(
    () => getChartRange(data?.map(([timestamp]) => ({ timestamp }))),
    [data],
  )

  return (
    <div>
      <div className="mb-3 mt-4 flex flex-col justify-between gap-1">
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          <ProjectCombobox
            allProjects={allProjects}
            projects={selectedProjects ?? allProjects.slice(0, 8)}
            setProjects={setSelectedProjects}
          />
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
        range={range}
        isLoading={isLoading}
        selectedProjects={selectedProjects ?? allProjects.slice(0, 8)}
      />
    </div>
  )
}
