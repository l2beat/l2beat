'use client'

import type { Milestone } from '@l2beat/config'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { TvsChartUnitControls } from '~/components/chart/tvs/tvs-chart-unit-controls'
import { TokenCombobox } from '~/components/token-combobox'
import type {
  ProjectToken,
  ProjectTokens,
} from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
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
  slug?: string
}

export function ProjectStackedTvsChart({
  milestones,
  projectId,
  tokens,
  isBridge,
  slug,
}: Props) {
  const [token, setToken] = useState<ProjectToken>()
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const tvsBreakdownUrl = slug
    ? `/scaling/projects/${slug}/tvs-breakdown`
    : undefined

  if (tokens && token) {
    return (
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
    )
  }

  return (
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
  tvsBreakdownUrl: string | undefined
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
      <div className="flex flex-wrap justify-between gap-1">
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
        {tvsBreakdownUrl && (
          <TvsBreakdownButton tvsBreakdownUrl={tvsBreakdownUrl} />
        )}
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
        'text-xs font-bold leading-none text-white',
        'w-fit rounded-md bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
      )}
    >
      View TVS breakdown
    </Link>
  )
}
