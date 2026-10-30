import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import sum from 'lodash/sum'
import uniq from 'lodash/uniq'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import {
  ChartTooltipRow,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { DaThroughputChartDataPoint } from '~/server/features/data-availability/throughput/getDaThroughputChartByProject'
import { formatRange } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'
import type { ChartResolution } from '~/utils/range/range'
import { getDaDataParams } from './getDaDataParams'

interface Props {
  data: DaThroughputChartDataPoint[] | undefined
  project?: ChartProject
  syncedUntil: UnixTime | undefined
  isLoading: boolean
  customColors: Record<string, string> | undefined
  milestones: Milestone[]
  resolution: ChartResolution
  /** The hint's extra row would lift this chart's baseline above a hint-less chart beside it */
  disableLegendOnboarding?: boolean
}

type ChartRow = { timestamp: number; [key: string]: number | null }

const colorsCache = new Map<string, string>()

export function DaThroughputByProjectChart({
  data,
  project,
  syncedUntil,
  isLoading,
  customColors,
  milestones,
  resolution,
  disableLegendOnboarding,
}: Props) {
  const allProjects = useMemo(() => {
    // We want to get latest top projects.
    const result = data
      ? uniq(
          [...data]
            .reverse()
            .flatMap(([_, values]) => Object.keys(values ?? {}))
            .sort((a, b) => {
              if (a === 'Unknown') return 1
              if (b === 'Unknown') return -1
              return 0
            }),
        )
      : []

    return result
  }, [data])

  const colors = useMemo(() => {
    // not `.values().toArray()`: browsers before 2025 have no iterator helpers
    const taken = new Set(colorsCache.values())
    return generateAccessibleColors(allProjects.length).filter(
      (color) => !taken.has(color),
    )
  }, [allProjects])
  const chartMeta = useMemo(() => {
    let colorIndex = 0
    return allProjects?.reduce((acc, project) => {
      if (!acc[project]) {
        let color: string
        const colorFromCache = colorsCache.get(project)
        if (colorFromCache) {
          color = colorFromCache
        } else if (project === 'Unknown') {
          color = 'var(--secondary)'
        } else if (customColors?.[project]) {
          color = customColors[project]
        } else {
          // biome-ignore lint/style/noNonNullAssertion: we know it's there
          color = colors[colorIndex++]!
          colorsCache.set(project, color)
        }

        acc[project] = {
          label: project,
          color,
          indicatorType: { shape: 'square' },
        }
      }

      return acc
    }, {} as ChartMeta)
  }, [colors, customColors, allProjects])

  const hiddenDataKeys = useMemo(() => {
    return allProjects.slice(5)
  }, [allProjects])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta, hiddenDataKeys)

  const max = useMemo(() => {
    return data
      ? Math.max(
          ...data.map(([_, values]) =>
            sum(
              Object.entries(values ?? {}).map(([project, value]) => {
                if (!allProjects.includes(project)) return 0
                return value
              }),
            ),
          ),
        )
      : undefined
  }, [data, allProjects])

  const { denominator, unit } = useMemo(() => getDaDataParams(max), [max])

  const chartData = useMemo(() => {
    if (allProjects.length === 0) {
      return []
    }

    const lastProjectsDataTimestamp = data?.findLast(([_, values]) => {
      return Object.entries(values ?? {}).some(
        ([name, value]) => name !== 'Unknown' && value > 0,
      )
    })?.[0]

    return (
      data?.map(([timestamp, values]) => {
        const isSynced =
          lastProjectsDataTimestamp && timestamp <= lastProjectsDataTimestamp

        const result: ChartRow = { timestamp }

        for (const project of allProjects) {
          const value = values?.[project]
          if (value === undefined) {
            result[project] = isSynced ? 0 : null
          } else {
            result[project] = value / denominator
          }
        }

        return result
      }) ?? []
    )
  }, [data, allProjects, denominator])

  const series: ChartSeries<string, ChartRow>[] = allProjects.map(
    (project) => ({
      key: project,
      fill: chartMeta?.[project]?.color,
      stack: true,
      curve: 'step',
      activeDot: false,
    }),
  )

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
        disableOnboarding: disableLegendOnboarding,
      }}
      isLoading={isLoading}
      project={project}
      milestones={milestones}
      legend
      legendLeading={
        <ChartLegendToggleAll
          showAllSelected={showAllSelected}
          onToggleAll={toggleAllDataKeys}
        />
      }
    >
      <TimeSeriesChart
        data={chartData}
        series={series}
        ariaLabel="Data throughput by project"
        syncedUntil={syncedUntil}
        yAxis={{ unit: ` ${unit}`, tickCount: 4 }}
        renderTooltip={(row, keys) => (
          <CustomTooltip
            row={row}
            keys={keys}
            denominator={denominator}
            resolution={resolution}
          />
        )}
      />
    </ChartContainer>
  )
}

function CustomTooltip({
  row,
  keys,
  denominator: mainDenominator,
  resolution,
}: {
  row: ChartRow
  keys: string[]
  denominator: number
  resolution: ChartResolution
}) {
  const label = row.timestamp
  // Hidden series are not in `keys`.
  const actualPayload = getTooltipEntries(row, keys).sort((a, b) => {
    if (a.name === 'Unknown') return 1
    if (b.name === 'Unknown') return -1
    return (b.value ?? 0) - (a.value ?? 0)
  })

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(label, label + UnixTime.periodToSeconds(resolution))}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {actualPayload.slice(0, 20).map((entry, index) => {
          const value = entry.value ?? 0
          const valueInBytes = value * mainDenominator
          const { unit, denominator } = getDaDataParams(valueInBytes)
          const formattedValue = (valueInBytes / denominator).toFixed(2)
          return (
            <ChartTooltipRow
              key={index}
              name={entry.name}
              gap="gap-x-6"
              wrapLabel={false}
            >
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {entry.value !== null ? `${formattedValue} ${unit}` : 'No data'}
              </span>
            </ChartTooltipRow>
          )
        })}
        {actualPayload.length > 20 && (
          <div className="font-medium text-label-value-14 text-secondary">
            + {actualPayload.length - 20} more
          </div>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}
