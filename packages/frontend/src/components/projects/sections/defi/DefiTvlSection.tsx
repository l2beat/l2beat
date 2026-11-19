import type { WarningWithSentiment } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { ChartDataSourceInfo } from '~/components/chart/ChartDataSourceInfo'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import { TvsValueChart } from '~/components/chart/tvs/TvsValueChart'
import type { ChartUnit } from '~/components/chart/types'
import { Checkbox } from '~/components/core/Checkbox'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { sentimentToWarningBarColor, WarningBar } from '~/components/WarningBar'
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
  /** What the number leaves out or overcounts, shown above the chart. */
  warnings: WarningWithSentiment[]
}

export function DefiTvlSection({
  defaultRange,
  project,
  dataSource,
  ethStakedToggle,
  warnings,
  ...projectSectionProps
}: DefiTvlSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const [showEthStaked, setShowEthStaked] = useState(false)
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.defi.tvlChart,
    { projectId: project.id, range, withEthStaked: showEthStaked },
  )

  const chartData = useMemo(
    () =>
      data?.chart.map(
        ([timestamp, valueUsd, ethStakedUsd, stakedEthShare, ethPrice]) => ({
          timestamp,
          value: toUnit(valueUsd, unit, ethPrice),
          ethStaked: toUnit(ethStakedUsd, unit, ethPrice),
          stakedEthShare,
        }),
      ),
    [data, unit],
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
      {warnings.map((warning) => (
        <WarningBar
          key={warning.value}
          text={warning.value}
          color={sentimentToWarningBarColor(warning.sentiment)}
          className="mb-3"
        />
      ))}
      {dataSource && (
        <div className="mb-3">
          <ChartDataSourceInfo
            dataSource={dataSource.name}
            href={dataSource.url}
            scope={sourceDetails || undefined}
          />
        </div>
      )}
      <TvsChartControls
        className="mb-4"
        isPlaceholderData={isPlaceholderData}
        timeRange={timeRange}
        unit={{ value: unit, setValue: setUnit }}
        range={{ value: range, setValue: setRange }}
      />
      <TvsValueChart
        isPlaceholderData={isPlaceholderData}
        resolution={data?.resolution ?? 'day'}
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        project={project}
        withEthStaked={shownInput.withEthStaked}
        unit={unit}
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

/** A point without ETH's price has no value in ETH. */
function toUnit(
  usd: number | null,
  unit: ChartUnit,
  ethPrice: number | null,
): number | null {
  if (usd === null || unit === 'usd') return usd
  return ethPrice ? usd / ethPrice : null
}
