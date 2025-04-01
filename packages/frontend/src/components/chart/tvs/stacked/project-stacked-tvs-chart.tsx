'use client'

import type { Milestone, ProjectTvlInfo } from '@l2beat/config'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { TvsBreakdownSummaryBox } from '~/app/(top-nav)/scaling/projects/[slug]/tvs-breakdown/_components/tvs-breakdown-summary-box'
import { TvsChartUnitControls } from '~/components/chart/tvs/tvs-chart-unit-controls'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { TokenCombobox } from '~/components/token-combobox'
import type {
  ProjectToken,
  ProjectTokens,
} from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import type { ProjectSevenDayTvsBreakdown } from '~/server/features/scaling/tvs/utils/get-7d-tvs-breakdown'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { cn } from '~/utils/cn'
import { ChartControlsWrapper } from '../../../core/chart/chart-controls-wrapper'
import { ProjectChartTimeRange } from '../../../core/chart/chart-time-range'
import { getChartRange } from '../../../core/chart/utils/get-chart-range-from-columns'
import type { ChartUnit } from '../../types'
import { ProjectTokenChart } from '../project-token-chart'
import { TvsChartTimeRangeControls } from '../tvs-chart-time-range-controls'
import { StackedTvsChart } from './stacked-tvs-chart'

interface Props {
  milestones: Milestone[]
  projectId: string
  tokens: ProjectTokens | undefined
  isBridge: boolean
  slug: string
  tvsProjectStats: ProjectSevenDayTvsBreakdown
  tvlInfo: ProjectTvlInfo
}

export function ProjectStackedTvsChart({
  milestones,
  projectId,
  tokens,
  isBridge,
  slug,
  tvsProjectStats,
  tvlInfo,
}: Props) {
  const [token, setToken] = useState<ProjectToken>()
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const tvsBreakdownUrl = `/scaling/projects/${slug}/tvs-breakdown`

  const chartComponent =
    tokens && token ? (
      <ProjectTokenChart
        isBridge={isBridge}
        tokens={tokens}
        setToken={setToken}
        token={token}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        unit={unit}
        setUnit={setUnit}
        milestones={milestones}
        projectId={projectId}
        tvsBreakdownUrl={tvsBreakdownUrl}
        showStackedChartLegend
      />
    ) : (
      <DefaultChart
        isBridge={isBridge}
        projectId={projectId}
        milestones={milestones}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        tokens={tokens}
        token={token}
        setToken={setToken}
        unit={unit}
        setUnit={setUnit}
        tvsBreakdownUrl={tvsBreakdownUrl}
      />
    )

  return (
    <>
      {chartComponent}
      {tvsProjectStats && (
        <>
          <HorizontalSeparator className="my-4" />
          <TvsBreakdownSummaryBox
            total={{
              value: tvsProjectStats.breakdown.total,
              change: tvsProjectStats.change.total,
            }}
            canonical={{
              value: tvsProjectStats.breakdown.canonical,
              change: tvsProjectStats.change.canonical,
            }}
            external={{
              value: tvsProjectStats.breakdown.external,
              change: tvsProjectStats.change.external,
            }}
            native={{
              value: tvsProjectStats.breakdown.native,
              change: tvsProjectStats.change.native,
            }}
            warning={tvlInfo?.warnings[0]}
          />
          <div className="w-full md:hidden">
            <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
          </div>
        </>
      )}
    </>
  )
}

interface DefaultChartProps {
  projectId: string
  isBridge: boolean
  milestones: Milestone[]
  timeRange: TvsChartRange
  setTimeRange: (timeRange: TvsChartRange) => void
  tokens: ProjectTokens | undefined
  token: ProjectToken | undefined
  setToken: (token: ProjectToken | undefined) => void
  unit: ChartUnit
  setUnit: (unit: ChartUnit) => void
  tvsBreakdownUrl: string
}

function DefaultChart({
  projectId,
  isBridge,
  milestones,
  timeRange,
  setTimeRange,
  tokens,
  token,
  setToken,
  unit,
  setUnit,
  tvsBreakdownUrl,
}: DefaultChartProps) {
  const { data, isLoading } = api.tvs.chart.useQuery({
    filter: { type: 'projects', projectIds: [projectId] },
    range: timeRange,
    excludeAssociatedTokens: false,
  })

  const chartData = useMemo(
    () =>
      data?.map(([timestamp, native, canonical, external, ethPrice]) => {
        const divider = unit === 'usd' ? 100 : ethPrice
        return {
          timestamp,
          native: native / divider,
          canonical: canonical / divider,
          external: external / divider,
        }
      }),
    [data, unit],
  )
  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <section className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <TvsChartTimeRangeControls
          projectSection
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </ChartControlsWrapper>
      <StackedTvsChart
        data={chartData}
        milestones={milestones}
        unit={unit}
        isLoading={isLoading}
        className="mb-2 mt-4"
      />
      <div className="flex flex-wrap items-center justify-between gap-1">
        <TvsChartUnitControls unit={unit} setUnit={setUnit}>
          {tokens && (
            <TokenCombobox
              tokens={tokens}
              value={token}
              setValue={setToken}
              isBridge={isBridge}
            />
          )}
        </TvsChartUnitControls>
        <div className="hidden md:inline-block">
          <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
        </div>
      </div>
    </section>
  )
}

export function TvsBreakdownButton({
  tvsBreakdownUrl,
}: { tvsBreakdownUrl: string }) {
  return (
    <Link
      href={tvsBreakdownUrl}
      className={cn(
        'text-xs font-bold leading-none text-primary md:text-white',
        'mt-4 flex w-full justify-center rounded-md border border-brand bg-transparent from-purple-100 to-pink-100 p-3 md:mt-0 md:w-fit md:border-0 md:bg-gradient-to-r md:py-2',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
      )}
    >
      View TVS breakdown
    </Link>
  )
}
