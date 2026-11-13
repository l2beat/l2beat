import { useMemo, useState } from 'react'
import { ChartDataSourceInfo } from '~/components/chart/ChartDataSourceInfo'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { TvsValueChart } from '~/components/chart/tvs/TvsValueChart'
import { Checkbox } from '~/components/core/Checkbox'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface DefiTvlSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  /** External provider attribution, absent when the data is our own. */
  dataSource?: {
    name: string
    url?: string
    scope?: string
  }
  /** Offers to draw the ETH staked network-wide, which the TVL is a part of. */
  ethStakedToggle?: boolean
}

export function DefiTvlSection({
  defaultRange,
  project,
  dataSource,
  ethStakedToggle,
  ...projectSectionProps
}: DefiTvlSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [showEthStaked, setShowEthStaked] = useState(false)
  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.defi.tvlChart,
    { projectId: project.id, range, withEthStaked: showEthStaked },
  )

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, value, ethStaked]) => ({
        timestamp,
        value,
        ethStaked,
      })),
    [data],
  )
  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )
  const sourceDetails = [
    dataSource?.scope,
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
      {dataSource && (
        <div className="mb-3">
          <ChartDataSourceInfo
            dataSource={dataSource.name}
            href={dataSource.url}
            scope={sourceDetails || undefined}
          />
        </div>
      )}
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <TvsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <TvsValueChart
        isPlaceholderData={isPlaceholderData}
        resolution={data?.resolution ?? 'day'}
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        project={project}
        withEthStaked={showEthStaked}
      />
      {ethStakedToggle && (
        <div className="mt-2 flex justify-end">
          <Checkbox
            name="showEthStaked"
            checked={showEthStaked}
            onCheckedChange={(checked) => setShowEthStaked(checked === true)}
          >
            Show total ETH staked
          </Checkbox>
        </div>
      )}
    </ProjectSection>
  )
}
