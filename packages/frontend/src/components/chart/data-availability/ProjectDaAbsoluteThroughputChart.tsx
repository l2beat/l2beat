import type { Milestone } from '@l2beat/config'
import { formatBytes, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { scaleLog } from 'd3-scale'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
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
import { tinted } from '~/components/core/chart/tint'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { BlobFeeChartPoint } from '~/server/features/data-availability/throughput/getBlobFeeChart'
import { formatRange } from '~/utils/dates'
import type { ChartResolution } from '~/utils/range/range'
import { getDaDataParams } from './getDaDataParams'

export type ProjectChartDataWithConfiguredThroughput = [
  number,
  number | null,
  number | null,
  number | null,
]
interface Props {
  dataWithConfiguredThroughputs:
    | ProjectChartDataWithConfiguredThroughput[]
    | undefined
  project: ChartProject
  isLoading: boolean
  isPlaceholderData: boolean
  milestones: Milestone[]
  syncedUntil: UnixTime | undefined
  resolution: ChartResolution
  /** For when the page already says whose data it is */
  hideProjectLogo?: boolean
  /** The hint's extra row would lift this chart's baseline above a hint-less chart beside it */
  disableLegendOnboarding?: boolean
  /**
   * The blob base fee over the same buckets, on an axis of its own, hidden
   * until picked in the legend. Given before its data has loaded, so the
   * legend lists it from the first paint and does not shift later
   */
  blobFee?: { data: BlobFeeChartPoint[] | undefined }
}

type SeriesKey = 'project' | 'projectTarget' | 'projectMax' | 'blobFee'
type ChartRow = { timestamp: number; blobFeeMax: number | null } & Record<
  SeriesKey,
  number | null
>

export function ProjectDaAbsoluteThroughputChart({
  dataWithConfiguredThroughputs,
  project,
  isLoading,
  isPlaceholderData,
  milestones,
  syncedUntil,
  resolution,
  hideProjectLogo,
  disableLegendOnboarding,
  blobFee,
}: Props) {
  const withBlobFee = blobFee !== undefined
  const projectChartMeta = useMemo(
    () => getProjectChartMeta(project.id, withBlobFee),
    [project.id, withBlobFee],
  )
  const hiddenDataKeys = useMemo<SeriesKey[]>(
    () => (withBlobFee ? ['projectMax', 'blobFee'] : ['projectMax']),
    [withBlobFee],
  )

  const { dataKeys, toggleDataKey } = useChartDataKeys(
    projectChartMeta,
    hiddenDataKeys,
  )
  const max = useMemo(() => {
    return dataWithConfiguredThroughputs
      ? Math.max(
          ...dataWithConfiguredThroughputs.map(([_, ...rest]) =>
            Math.max(...rest.filter((x) => x !== null)),
          ),
        )
      : undefined
  }, [dataWithConfiguredThroughputs])
  const { denominator, unit } = getDaDataParams(max)

  // The fee runs from thousandths of a gwei to tens within a month: on a
  // linear axis a spike flattens the rest into the baseline
  const feeTicks = useMemo(
    () => getPowerOfTenTicks(blobFee?.data?.map(([, avg]) => avg) ?? []),
    [blobFee?.data],
  )

  const chartData = useMemo(() => {
    const feeByTimestamp = new Map(
      blobFee?.data?.map(([timestamp, avg, max]) => [timestamp, { avg, max }]),
    )
    return dataWithConfiguredThroughputs?.map(
      ([timestamp, value, target, max]): ChartRow => {
        const fee = feeByTimestamp.get(timestamp)
        return {
          timestamp,
          project: value !== null ? value / denominator : null,
          projectTarget: target !== null ? target / denominator : null,
          projectMax: max !== null ? max / denominator : null,
          blobFee: fee?.avg ?? null,
          blobFeeMax: fee?.max ?? null,
        }
      },
    )
  }, [dataWithConfiguredThroughputs, denominator, blobFee?.data])

  const series: ChartSeries<SeriesKey, ChartRow>[] = [
    {
      key: 'project',
      ...tinted(projectChartMeta.project?.color),
    },
    {
      key: 'projectTarget',
      stroke: projectChartMeta.projectTarget?.color,
      strokeDasharray:
        projectChartMeta.projectTarget?.indicatorType.strokeDasharray,
      curve: 'stepAfter',
    },
    {
      key: 'projectMax',
      stroke: projectChartMeta.projectMax?.color,
      strokeDasharray:
        projectChartMeta.projectMax?.indicatorType.strokeDasharray,
      curve: 'stepAfter',
    },
    {
      key: 'blobFee',
      stroke: projectChartMeta.blobFee?.color,
      axis: 'right',
    },
  ]

  return (
    <ChartContainer
      isPlaceholderData={isPlaceholderData}
      meta={projectChartMeta}
      data={chartData}
      project={hideProjectLogo ? undefined : project}
      isLoading={isLoading}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
        disableOnboarding: disableLegendOnboarding,
      }}
      milestones={milestones}
      legend
    >
      <TimeSeriesChart
        data={chartData}
        series={series}
        ariaLabel="Data throughput"
        syncedUntil={syncedUntil}
        yAxis={{ unit: ` ${unit}`, tickCount: 4 }}
        rightAxis={{
          scale: scaleLog,
          domain: 'auto',
          ticks: feeTicks,
          format: formatGwei,
          unit: ' gwei',
        }}
        renderTooltip={(row, keys) => (
          <ProjectDaThroughputCustomTooltip
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

function ProjectDaThroughputCustomTooltip({
  row,
  keys,
  denominator,
  resolution,
}: {
  row: ChartRow
  keys: SeriesKey[]
  denominator: number
  resolution: ChartResolution
}) {
  const label = row.timestamp

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(label, label + UnixTime.periodToSeconds(resolution))}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {getTooltipEntries(row, keys).map((entry, index) => {
          return (
            <ChartTooltipRow
              key={index}
              name={entry.name}
              gap="gap-x-6"
              wrapLabel={false}
            >
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {entry.name === 'blobFee'
                  ? formatBlobFee(entry.value, row.blobFeeMax)
                  : entry.value !== null
                    ? formatBytes(entry.value * denominator)
                    : entry.name === 'project'
                      ? 'No data'
                      : entry.name === 'projectMax'
                        ? 'No cap'
                        : formatBytes(0)}
              </span>
            </ChartTooltipRow>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}

/** The average, and the peak when it stands out from it: a spike lasts minutes and an average hides it */
function formatBlobFee(avg: number | null, max: number | null) {
  if (avg === null) return 'No data'
  const peak = max !== null && max > avg * 2 ? ` (peak ${formatGwei(max)})` : ''
  return `${formatGwei(avg)} gwei${peak}`
}

/** Every power of ten the values span, the bounds included */
function getPowerOfTenTicks(values: (number | null)[]): number[] {
  const present = values.filter((v): v is number => v !== null && v > 0)
  if (present.length === 0) return []
  const lo = Math.floor(Math.log10(Math.min(...present)))
  const hi = Math.ceil(Math.log10(Math.max(...present)))
  return Array.from({ length: hi - lo + 1 }, (_, i) => 10 ** (lo + i))
}

/** Three significant figures, as the fee runs from thousandths of a gwei to tens */
function formatGwei(value: number) {
  if (value === 0) return '0'
  const digits = Math.max(0, 2 - Math.floor(Math.log10(Math.abs(value))))
  return String(Number(value.toFixed(Math.min(digits, 6))))
}

function getProjectChartMeta(projectId: ProjectId, withBlobFee: boolean) {
  switch (projectId) {
    case 'ethereum':
      return {
        project: {
          label: 'Actual data size',
          color: 'var(--chart-ethereum)',
          indicatorType: { shape: 'line' },
        },
        projectTarget: {
          label: 'Target capacity',
          color: 'var(--chart-ethereum-secondary)',
          indicatorType: { shape: 'line', strokeDasharray: '9 3' },
        },
        projectMax: {
          label: 'Max capacity',
          color: 'var(--chart-ethereum)',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
        ...(withBlobFee && {
          blobFee: {
            label: 'Blob base fee',
            color: 'var(--chart-orange)',
            indicatorType: { shape: 'line' },
          },
        }),
      } satisfies ChartMeta
    default:
      throw new Error(`Unknown project ID: ${projectId}`)
  }
}
