'use client'

import { type Milestone } from '@l2beat/config'
import { sum } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useScalingAssociatedTokensContext } from '~/app/(side-nav)/scaling/_components/scaling-associated-tokens-context'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { Chart } from '~/components/chart/core/chart'
import { ChartProvider } from '~/components/chart/core/chart-provider'
import { TvlChartUnitControls } from '~/components/chart/tvl/tvl-chart-unit-controls'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type TvlProjectFilter } from '~/server/features/scaling/tvl/utils/project-filter-utils'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { api } from '~/trpc/react'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { ChartControlsWrapper } from '../../core/chart-controls-wrapper'
import { type SeriesStyle } from '../../core/styles'
import { getChartRange } from '../../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../../core/utils/map-milestones'
import { type ChartUnit } from '../../types'
import { TvlChartHeader } from '../tvl-chart-header'
import { TvlChartHover2 } from '../tvl-chart-hover-2'
import { TvlChartTimeRangeControls } from '../tvl-chart-time-range-controls'

interface Props {
  milestones: Milestone[]
  entries: ScalingTvlEntry[]
}

export function ScalingStackedTvlChart({ milestones, entries }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()

  const filters = useScalingFilterValues()
  const includeFilter = useScalingFilter()
  const [timeRange, setTimeRange] = useState<TvlChartRange>('1y')

  const [unit, setUnit] = useLocalStorage<ChartUnit>('scaling-tvl-unit', 'usd')

  const filter = useMemo<TvlProjectFilter>(() => {
    if (filters.isEmpty) {
      return { type: 'layer2' }
    }

    return {
      type: 'projects',
      projectIds: entries.filter(includeFilter).map((project) => project.id),
    }
  }, [entries, filters, includeFilter])

  const { data, isLoading } = api.tvl.chartV2.useQuery({
    range: timeRange,
    excludeAssociatedTokens,
    filter,
  })

  const mappedMilestones = useMemo(
    () => mapMilestones(milestones),
    [milestones],
  )

  const formatYAxisLabel = useCallback(
    (value: number) => formatCurrency(value, unit),
    [unit],
  )

  const columns = useMemo(
    () =>
      data?.map((dataPoint) => {
        const [timestamp] = dataPoint
        const { values, data } = getChartValues(dataPoint, unit)
        const milestone = mappedMilestones[timestamp]

        return {
          values,
          data,
          milestone,
        }
      }) ?? [],
    [data, unit, mappedMilestones],
  )

  const total = useMemo(() => {
    const lastColumn = columns.at(-1)
    if (!lastColumn) {
      return undefined
    }
    return {
      usd:
        lastColumn.data.rollups.usd +
        lastColumn.data.validiumAndOptimiums.usd +
        lastColumn.data.others.usd,
      eth:
        lastColumn.data.rollups.eth +
        lastColumn.data.validiumAndOptimiums.eth +
        lastColumn.data.others.eth,
    }
  }, [columns])

  const firstValue = useMemo(
    () => sum(columns[0]?.values.map((value) => value.value)),
    [columns],
  )
  const lastValue = useMemo(
    () => sum(columns[columns.length - 1]?.values.map((value) => value.value)),
    [columns],
  )
  const change = useMemo(
    () => (lastValue && firstValue ? lastValue / firstValue - 1 : 0),
    [firstValue, lastValue],
  )
  const chartRange = useMemo(() => getChartRange(data), [data])

  const valuesStyle: SeriesStyle[] = useMemo(
    () => [
      {
        line: 'blue',
        point: 'circle',
      },
      {
        line: 'yellow',
      },
      {
        line: 'pink',
      },
    ],
    [],
  )

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => <TvlChartHover2 data={data} />}
    >
      <section className="flex flex-col gap-4">
        <TvlChartHeader
          unit={unit}
          value={total?.[unit]}
          change={change}
          range={timeRange}
          timeRange={chartRange}
        />
        <Chart />
        <ChartControlsWrapper>
          <TvlChartUnitControls unit={unit} setUnit={setUnit} />
          <TvlChartTimeRangeControls
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartControlsWrapper>
      </section>
    </ChartProvider>
  )
}

type TvlDataPoint = readonly [number, number, number, number, number]

function getChartValues(dataPoint: TvlDataPoint, unit: CostsUnit) {
  const [timestamp, rollups, validiumAndOptimiums, others, ethPrice] = dataPoint
  const rollupsUsd = rollups / 100
  const rollupsEth = rollupsUsd / ethPrice

  const validiumAndOptimiumsUsd = validiumAndOptimiums / 100
  const validiumAndOptimiumsEth = validiumAndOptimiumsUsd / ethPrice

  const othersUsd = others / 100
  const othersEth = othersUsd / ethPrice

  return {
    values:
      unit === 'usd'
        ? [
            { value: rollupsUsd },
            { value: validiumAndOptimiumsUsd },
            { value: othersUsd },
          ]
        : [
            { value: rollupsEth },
            { value: validiumAndOptimiumsEth },
            { value: othersEth },
          ],
    data: {
      timestamp,
      rollups: {
        usd: rollupsUsd,
        eth: rollupsEth,
      },
      validiumAndOptimiums: {
        usd: validiumAndOptimiumsUsd,
        eth: validiumAndOptimiumsEth,
      },
      others: {
        usd: othersUsd,
        eth: othersEth,
      },
    },
  }
}
