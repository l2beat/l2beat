import type { Milestone } from '@l2beat/config'
import { formatBytes, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import sum from 'lodash/sum'
import uniq from 'lodash/uniq'
import { useEffect, useMemo, useRef } from 'react'
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
import {
  getProjectChartMeta,
  type ProjectChartDataWithConfiguredThroughput,
} from './ProjectDaAbsoluteThroughputChart'

interface Props {
  data: DaThroughputChartDataPoint[] | undefined
  project?: ChartProject
  syncedUntil: UnixTime | undefined
  isLoading: boolean
  isPlaceholderData: boolean
  customColors: Record<string, string> | undefined
  /** Target and max capacity lines, drawn over the stacked projects */
  capacity?: {
    /** Whose capacity, for its line colors and labels */
    projectId: ProjectId
    data: ProjectChartDataWithConfiguredThroughput[] | undefined
  }
  milestones: Milestone[]
  resolution: ChartResolution
  /** The hint's extra row would lift this chart's baseline above a hint-less chart beside it */
  disableLegendOnboarding?: boolean
}

type ChartRow = { timestamp: number; [key: string]: number | null }

const CAPACITY_KEYS = ['projectTarget', 'projectMax'] as const

const colorsCache = new Map<string, string>()

/**
 * Sums every project whose legend item is off, so the stack always adds up
 * to the total chart. Turning a project on breaks it out of this band.
 */
const OTHERS_KEY = '__others'
const UNKNOWN_KEY = 'Unknown'
/** Projects broken out of Others when the chart loads */
const SHOWN_PROJECTS = 5

export function DaThroughputByProjectChart({
  data,
  project,
  syncedUntil,
  isLoading,
  isPlaceholderData,
  customColors,
  capacity,
  milestones,
  resolution,
  disableLegendOnboarding,
}: Props) {
  const capacityProjectId = capacity?.projectId
  const capacityData = capacity?.data
  const capacityMeta = useMemo(() => {
    if (!capacityProjectId) return undefined
    const { projectTarget, projectMax } = getProjectChartMeta(capacityProjectId)
    return { projectTarget, projectMax } satisfies ChartMeta
  }, [capacityProjectId])
  const allProjects = useMemo(() => {
    // We want to get latest top projects.
    const result = data
      ? uniq(
          [...data]
            .reverse()
            .flatMap(([_, values]) => Object.keys(values ?? {}))
            .sort((a, b) => {
              if (a === UNKNOWN_KEY) return 1
              if (b === UNKNOWN_KEY) return -1
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
    const projectsMeta = allProjects?.reduce((acc, project) => {
      if (!acc[project]) {
        let color: string
        const colorFromCache = colorsCache.get(project)
        if (colorFromCache) {
          color = colorFromCache
        } else if (project === UNKNOWN_KEY) {
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
    // Empty until projects load: the legend picks its shown keys from the
    // first non-empty meta, which would otherwise hide every project
    if (allProjects.length === 0) return projectsMeta
    const { [UNKNOWN_KEY]: unknownMeta, ...namedMeta } = projectsMeta
    const named = Object.entries(namedMeta)
    // Capacity leads the legend, then the shown projects, Unknown and
    // Others, so the tail of off projects comes last
    return {
      ...capacityMeta,
      ...Object.fromEntries(named.slice(0, SHOWN_PROJECTS)),
      ...(unknownMeta && { [UNKNOWN_KEY]: unknownMeta }),
      [OTHERS_KEY]: {
        label: 'Others',
        color:
          'color-mix(in oklab, var(--secondary) 40%, var(--surface-primary))',
        indicatorType: { shape: 'square' },
      },
      ...Object.fromEntries(named.slice(SHOWN_PROJECTS)),
    } as ChartMeta
  }, [colors, customColors, allProjects, capacityMeta])

  const hiddenDataKeys = useMemo(
    () => [
      // Off projects are drawn inside Others
      ...allProjects
        .filter((project) => project !== UNKNOWN_KEY)
        .slice(SHOWN_PROJECTS),
      // Max capacity starts hidden, as on the total chart
      'projectMax',
    ],
    [allProjects],
  )

  const capacityByTimestamp = useMemo(
    () =>
      new Map(
        capacityData?.map(([timestamp, _, target, max]) => [
          timestamp,
          { projectTarget: target, projectMax: max },
        ]),
      ),
    [capacityData],
  )

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta, hiddenDataKeys)

  // The legend keeps its keys from the first data. A project that appears
  // later (another range, or non-L2 posters) gets the same default as on
  // load: broken out if it is Unknown or a top project, else in Others.
  const seenProjects = useRef(new Set<string>())
  useEffect(() => {
    const seen = seenProjects.current
    const isFirstData = seen.size === 0
    for (const project of allProjects) {
      if (seen.has(project)) continue
      seen.add(project)
      if (
        !isFirstData &&
        !hiddenDataKeys.includes(project) &&
        !dataKeys.includes(project)
      ) {
        toggleDataKey(project)
      }
    }
  }, [allProjects, hiddenDataKeys, dataKeys, toggleDataKey])

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
          ...[...capacityByTimestamp.values()].flatMap(
            ({ projectTarget, projectMax }) => [
              projectTarget ?? 0,
              projectMax ?? 0,
            ],
          ),
        )
      : undefined
  }, [data, allProjects, capacityByTimestamp])

  const { denominator, unit } = useMemo(() => getDaDataParams(max), [max])

  const othersProjects = useMemo(
    () => allProjects.filter((project) => !dataKeys.includes(project)),
    [allProjects, dataKeys],
  )

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

        let others: number | null = isSynced ? 0 : null
        for (const project of othersProjects) {
          const value = values?.[project]
          if (value !== undefined) others = (others ?? 0) + value / denominator
        }
        result[OTHERS_KEY] = others

        if (capacityMeta) {
          const capacity = capacityByTimestamp.get(timestamp)
          for (const key of CAPACITY_KEYS) {
            const value = capacity?.[key]
            result[key] = value != null ? value / denominator : null
          }
        }

        return result
      }) ?? []
    )
  }, [
    data,
    allProjects,
    othersProjects,
    denominator,
    capacityMeta,
    capacityByTimestamp,
  ])

  const series: ChartSeries<string, ChartRow>[] = [
    // Others last, so its band tops the stack
    ...[...allProjects, OTHERS_KEY].map(
      (project): ChartSeries<string, ChartRow> => ({
        key: project,
        fill: chartMeta?.[project]?.color,
        stack: true,
        curve: 'step',
        activeDot: false,
      }),
    ),
    // After the projects, so the lines are drawn over the stack
    ...(capacityMeta
      ? CAPACITY_KEYS.map(
          (key): ChartSeries<string, ChartRow> => ({
            key,
            stroke: capacityMeta[key].color,
            strokeDasharray: capacityMeta[key].indicatorType.strokeDasharray,
            curve: 'stepAfter',
          }),
        )
      : []),
  ]

  return (
    <ChartContainer
      isPlaceholderData={isPlaceholderData}
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
            othersProjects={othersProjects}
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
  othersProjects,
}: {
  row: ChartRow
  keys: string[]
  denominator: number
  resolution: ChartResolution
  othersProjects: string[]
}) {
  const label = row.timestamp
  // Hidden series are not in `keys`.
  const entries = getTooltipEntries(row, keys)
  const capacityPayload = entries.filter((entry) => isCapacityKey(entry.name))
  const actualPayload = entries
    .filter((entry) => !isCapacityKey(entry.name))
    .sort((a, b) => {
      // Unknown, then Others, close the list
      for (const key of [OTHERS_KEY, UNKNOWN_KEY]) {
        if (a.name === key) return 1
        if (b.name === key) return -1
      }
      return (b.value ?? 0) - (a.value ?? 0)
    })
  const othersCount = othersProjects.filter(
    (project) => (row[project] ?? 0) > 0,
  ).length

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(label, label + UnixTime.periodToSeconds(resolution))}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {capacityPayload.map((entry) => (
          <ChartTooltipRow
            key={entry.name}
            name={entry.name}
            gap="gap-x-6"
            wrapLabel={false}
          >
            <span className="font-medium text-label-value-15 text-primary tabular-nums">
              {entry.value !== null
                ? formatBytes(entry.value * mainDenominator)
                : entry.name === 'projectMax'
                  ? 'No cap'
                  : formatBytes(0)}
            </span>
          </ChartTooltipRow>
        ))}
        {capacityPayload.length > 0 && <HorizontalSeparator />}
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
                {entry.name === OTHERS_KEY && othersCount > 0 && (
                  <span className="text-secondary">
                    {othersCount} {othersCount === 1 ? 'project' : 'projects'}
                    {' · '}
                  </span>
                )}
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

function isCapacityKey(key: string): key is (typeof CAPACITY_KEYS)[number] {
  return (CAPACITY_KEYS as readonly string[]).includes(key)
}
