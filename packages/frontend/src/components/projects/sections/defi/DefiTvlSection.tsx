import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ChartDataSourceInfo } from '~/components/chart/ChartDataSourceInfo'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { TvsValueChart } from '~/components/chart/tvs/TvsValueChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface DefiTvlSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  dataSource: {
    name: string
    url?: string
    scope?: string
  }
}

export function DefiTvlSection({
  defaultRange,
  project,
  dataSource,
  ...projectSectionProps
}: DefiTvlSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = useQuery(
    trpc.defi.tvlChart.queryOptions({ projectId: project.id, range }),
  )

  const chartData = useMemo(
    () => data?.chart.map(([timestamp, value]) => ({ timestamp, value })),
    [data],
  )
  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )
  const sourceDetails = [
    dataSource.scope,
    data?.sourceTimestamp
      ? `Latest source update: ${formatTimestamp(data.sourceTimestamp, {
          mode: 'datetime',
        })}`
      : undefined,
  ]
    .filter((value) => value !== undefined)
    .join(' · ')

  return (
    <ProjectSection {...projectSectionProps}>
      <div className="mb-3">
        <ChartDataSourceInfo
          dataSource={dataSource.name}
          href={dataSource.url}
          scope={sourceDetails || undefined}
        />
      </div>
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange timeRange={timeRange} />
        <TvsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <TvsValueChart
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        project={project}
      />
    </ProjectSection>
  )
}
