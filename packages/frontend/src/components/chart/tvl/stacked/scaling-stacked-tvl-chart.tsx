'use client'

import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { useScalingAssociatedTokensContext } from '~/app/(side-nav)/scaling/_components/scaling-associated-tokens-context'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { TvlChartUnitControls } from '~/components/chart/tvl/tvl-chart-unit-controls'
import { Checkbox } from '~/components/core/checkbox'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type TvlProjectFilter } from '~/server/features/scaling/tvl/utils/project-filter-utils'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartControlsWrapper } from '../../core/chart-controls-wrapper'
import { type ChartUnit } from '../../types'
import { TvlChartHeader } from '../tvl-chart-header'
import { TvlChartTimeRangeControls } from '../tvl-chart-time-range-controls'
import { StackedTvlChartHover } from './stacked-tvl-chart-hover'
import { StackedTvlChartLegend } from './stacked-tvl-chart-legend'
import { useStackedTvlChartRenderParams } from './use-stacked-tvl-chart-render-params'

interface Props {
  milestones: Milestone[]
  entries: ScalingTvlEntry[]
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
}

export function ScalingStackedTvlChart({ milestones, entries, tab }: Props) {
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  const filters = useScalingFilterValues()
  const includeFilter = useScalingFilter()
  const [timeRange, setTimeRange] = useState<TvlChartRange>('1y')

  const [unit, setUnit] = useLocalStorage<ChartUnit>('scaling-tvl-unit', 'usd')

  const filter = useMemo<TvlProjectFilter>(() => {
    if (filters.isEmpty) {
      return {
        type: tab,
      }
    }
    return {
      type: 'projects',
      projectIds: entries.filter(includeFilter).map((project) => project.id),
    }
  }, [entries, filters.isEmpty, includeFilter, tab])

  const { data, isLoading } = api.tvl.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens,
    filter,
  })

  const { columns, chartRange, valuesStyle, change, total } =
    useStackedTvlChartRenderParams({
      milestones,
      unit,
      data,
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={(value: number) => formatCurrency(value, unit)}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <StackedTvlChartHover {...data} unit={unit} />
      )}
    >
      <section className="flex flex-col gap-2">
        <TvlChartHeader
          unit={unit}
          value={total?.[unit]}
          change={change}
          range={timeRange}
          timeRange={chartRange}
        />
        <Chart className="mt-2" />
        <StackedTvlChartLegend />
        <ChartControlsWrapper>
          <TvlChartUnitControls unit={unit} setUnit={setUnit}>
            <Checkbox
              name="excludeAssociatedTokens"
              checked={excludeAssociatedTokens}
              onCheckedChange={(checked) =>
                setExcludeAssociatedTokens(!!checked)
              }
            >
              Exclude associated tokens
            </Checkbox>
          </TvlChartUnitControls>
          <TvlChartTimeRangeControls
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartControlsWrapper>
      </section>
    </ChartProvider>
  )
}
