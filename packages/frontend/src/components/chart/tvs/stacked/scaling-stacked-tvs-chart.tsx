'use client'

import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { useScalingAssociatedTokensContext } from '~/app/(side-nav)/scaling/_components/scaling-associated-tokens-context'
import { useScalingFilterValues } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { TvsChartUnitControls } from '~/components/chart/tvs/tvs-chart-unit-controls'
import { Checkbox } from '~/components/core/checkbox'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { useLocalStorage } from '~/hooks/use-local-storage'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'

import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/project-filter-utils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartControlsWrapper } from '../../core/chart-controls-wrapper'
import type { ChartUnit } from '../../types'
import { TvsChartHeader } from '../tvs-chart-header'
import { TvsChartTimeRangeControls } from '../tvs-chart-time-range-controls'
import { StackedTvsChartHover } from './stacked-tvs-chart-hover'
import { StackedTvsChartLegend } from './stacked-tvs-chart-legend'
import { useStackedTvsChartRenderParams } from './use-stacked-tvs-chart-render-params'

interface Props {
  milestones: Milestone[]
  entries: ScalingTvsEntry[]
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
}

export function ScalingStackedTvsChart({ milestones, entries, tab }: Props) {
  const { checked } = useRecategorisationPreviewContext()
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  const filters = useScalingFilterValues()
  const [timeRange, setTimeRange] = useState<TvsChartRange>('1y')

  const [unit, setUnit] = useLocalStorage<ChartUnit>('scaling-tvs-unit', 'usd')

  const filter = useMemo<TvsProjectFilter>(() => {
    if (filters.isEmpty) {
      return {
        type: tab,
      }
    }
    return {
      type: 'projects',
      projectIds: entries.map((project) => project.id),
    }
  }, [entries, filters.isEmpty, tab])

  const { data, isLoading } = api.tvs.chart.useQuery({
    range: timeRange,
    excludeAssociatedTokens,
    filter,
    previewRecategorisation: checked,
  })

  const { columns, chartRange, valuesStyle, change, total } =
    useStackedTvsChartRenderParams({
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
        <StackedTvsChartHover {...data} unit={unit} />
      )}
    >
      <section className="flex flex-col gap-2">
        <TvsChartHeader
          unit={unit}
          value={total?.[unit]}
          change={change}
          range={timeRange}
          timeRange={chartRange}
        />
        <Chart className="mt-2" />
        <StackedTvsChartLegend />
        <ChartControlsWrapper>
          <TvsChartUnitControls unit={unit} setUnit={setUnit}>
            <Checkbox
              name="excludeAssociatedTokens"
              checked={excludeAssociatedTokens}
              onCheckedChange={(checked) =>
                setExcludeAssociatedTokens(!!checked)
              }
            >
              Exclude associated tokens
            </Checkbox>
          </TvsChartUnitControls>
          <TvsChartTimeRangeControls
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartControlsWrapper>
      </section>
    </ChartProvider>
  )
}
