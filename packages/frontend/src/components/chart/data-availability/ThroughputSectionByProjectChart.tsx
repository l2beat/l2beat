'use client'
import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { ChartTimeRangeControls } from '~/components/core/chart/ChartTimeRangeControls'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { useIncludeScalingOnly } from '~/pages/data-availability/throughput/components/DaThroughputContext'
import {
  type DaThroughputTimeRange,
  DaThroughputTimeRangeValues,
  rangeToResolution,
} from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/React'
import { DaThroughputByProjectChart } from './DaThroughputByProjectChart'
import { EigenDataSourceInfo } from './EigenDataSourceInfo'
import { EthereumProjectsOnlyCheckbox } from './EthereumProjectsOnlyCheckbox'

interface Props {
  daLayer: string
  range: DaThroughputTimeRange
  setRange: (range: DaThroughputTimeRange) => void
  customColors: Record<string, string> | undefined
  milestones: Milestone[]
}

export function ThroughputSectionByProjectChart({
  daLayer,
  range,
  setRange,
  customColors,
  milestones,
}: Props) {
  const { includeScalingOnly, setIncludeScalingOnly } = useIncludeScalingOnly()
  const { data, isLoading } = api.da.projectChartByProject.useQuery({
    range,
    daLayer,
  })

  const chartRange = useMemo(
    () => getChartRange(data?.chart.map(([timestamp]) => ({ timestamp }))),
    [data],
  )

  const resolution = useMemo(() => rangeToResolution({ type: range }), [range])

  return (
    <div>
      <div className="mt-2 mb-3 flex flex-col justify-between gap-1">
        <div className="flex flex-wrap items-center justify-between gap-x-1">
          <ProjectChartTimeRange range={chartRange} />
          {daLayer === 'eigenda' && <EigenDataSourceInfo />}
        </div>
        <div className="flex justify-between gap-1">
          <EthereumProjectsOnlyCheckbox
            name="projectByProjectThroughputIncludeScalingOnly"
            checked={includeScalingOnly}
            onCheckedChange={setIncludeScalingOnly}
          />
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
        data={data}
        isLoading={isLoading}
        customColors={customColors}
        milestones={milestones}
        resolution={resolution}
      />
    </div>
  )
}
