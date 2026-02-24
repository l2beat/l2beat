'use client'
import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import sum from 'lodash/sum'
import uniq from 'lodash/uniq'
import { useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
import type {
  ChartMeta,
  ChartProject,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { DaThroughputChartDataPoint } from '~/server/features/data-availability/throughput/getDaThroughputChartByProject'
import type { DaThroughputResolution } from '~/server/features/data-availability/throughput/utils/range'
import { formatRange } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'
import { getDaDataParams } from './getDaDataParams'

interface Props {
  data: DaThroughputChartDataPoint[] | undefined
  project?: ChartProject
  syncedUntil: UnixTime | undefined
  isLoading: boolean
  customColors: Record<string, string> | undefined
  milestones: Milestone[]
  resolution: DaThroughputResolution
}

const colorsCache = new Map<string, string>()

export function DaThroughputByProjectChart({
  data,
  project,
  syncedUntil,
  isLoading,
  customColors,
  milestones,
  resolution,
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

  const colors = useMemo(
    () =>
      generateAccessibleColors(allProjects.length).filter(
        (color) => !colorsCache.values().toArray().includes(color),
      ),
    [allProjects],
  )
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

        const result: { timestamp: number; [key: string]: number | null } = {
          timestamp,
        }

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

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      isLoading={isLoading}
      project={project}
      milestones={milestones}
    >
      <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <ChartLegendToggleAll
          showAllSelected={showAllSelected}
          onToggleAll={toggleAllDataKeys}
        />
        {allProjects?.map((project) => (
          <Area
            key={project}
            dataKey={project}
            stackId="a"
            hide={!dataKeys.includes(project)}
            fill={chartMeta?.[project]?.color}
            fillOpacity={1}
            activeDot={false}
            isAnimationActive={false}
            strokeWidth={0}
            type="step"
          />
        ))}

        <ChartCommonComponents
          data={chartData}
          isLoading={isLoading}
          yAxis={{
            unit: ` ${unit}`,
            tickCount: 4,
          }}
          syncedUntil={syncedUntil}
        />
        <ChartTooltip
          filterNull={false}
          content={
            <CustomTooltip denominator={denominator} resolution={resolution} />
          }
        />
      </AreaChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  payload,
  label,
  denominator: mainDenominator,
  resolution,
}: CustomChartTooltipProps & {
  denominator: number
  resolution: DaThroughputResolution
}) {
  const { meta: config } = useChart()
  if (!payload || typeof label !== 'number') return null
  const actualPayload = [...payload]
    .sort((a, b) => {
      if (a.name === 'Unknown') return 1
      if (b.name === 'Unknown') return -1
      return (b.value ?? 0) - (a.value ?? 0)
    })
    .filter((p) => !p.hide)

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(
          label,
          label +
            (resolution === 'daily'
              ? UnixTime.DAY
              : resolution === 'sixHourly'
                ? UnixTime.HOUR * 6
                : UnixTime.HOUR),
        )}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {actualPayload.slice(0, 20).map((entry, index) => {
          if (entry.type === 'none') return null
          const configEntry = entry.name ? config[entry.name] : undefined
          if (!configEntry) return null
          const value = entry.value ?? 0
          const valueInBytes = value * mainDenominator
          const { unit, denominator } = getDaDataParams(valueInBytes)
          const formattedValue = (valueInBytes / denominator).toFixed(2)
          return (
            <div
              key={index}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  backgroundColor={configEntry.color}
                  type={configEntry.indicatorType}
                />
                <span className="font-medium text-label-value-14">
                  {configEntry.label}
                </span>
              </div>
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {entry.value !== null && entry.value !== undefined
                  ? `${formattedValue} ${unit}`
                  : 'No data'}
              </span>
            </div>
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
