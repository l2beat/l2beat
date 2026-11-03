import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { type PointerEvent, useId, useRef } from 'react'
import {
  ChartContext,
  type ChartMeta,
} from '~/components/core/chart/ChartContext'
import { ChartLegend } from '~/components/core/chart/ChartLegend'
import { ChartTooltipRow } from '~/components/core/chart/ChartTooltip'
import {
  type Anchor,
  TOOLTIP_OFFSET,
  useChartTooltip,
} from '~/components/core/chart/useChartTooltip'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { tooltipContentVariants } from '~/components/core/tooltip/Tooltip'
import { Logo } from '~/components/Logo'
import { EM_DASH } from '~/consts/characters'
import { useIsClient } from '~/hooks/useIsClient'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type { TransferSizeDataPoint } from '~/server/features/layer2s/interop/utils/getTransferSizeChartData'
import { cn } from '~/utils/cn'
import { transferSizeBuckets } from '../../../utils/transferSizeBuckets'

interface Props {
  data: TransferSizeDataPoint[]
  isLoading: boolean
  horizontal?: boolean
  /** Label gutter of the horizontal variant; widen it for long protocol names. */
  categoryAxisWidth?: number
}

const chartMeta = {
  percentageUnder100: {
    label: transferSizeBuckets.under100.label,
    color: transferSizeBuckets.under100.color,
    indicatorType: { shape: 'square' },
  },
  percentage100To1K: {
    label: transferSizeBuckets.from100To1K.label,
    color: transferSizeBuckets.from100To1K.color,
    indicatorType: { shape: 'square' },
  },
  percentage1KTo10K: {
    label: transferSizeBuckets.from1KTo10K.label,
    color: transferSizeBuckets.from1KTo10K.color,
    indicatorType: { shape: 'square' },
  },
  percentage10KTo100K: {
    label: transferSizeBuckets.from10KTo100K.label,
    color: transferSizeBuckets.from10KTo100K.color,
    indicatorType: { shape: 'square' },
  },
  percentageOver100K: {
    label: transferSizeBuckets.over100K.label,
    color: transferSizeBuckets.over100K.color,
    indicatorType: { shape: 'square' },
  },
} satisfies ChartMeta

type BucketKey = keyof typeof chartMeta
/** Stack order: the first bucket sits at the base of each bar. */
const BUCKETS = Object.keys(chartMeta) as BucketKey[]

const PERCENT_TICKS = [0, 25, 50, 75, 100]
/** The x axis' height, and a tick label's distance from its axis. */
const AXIS_HEIGHT = 30
const TICK_OFFSET = 8
const BAR_SIZE = 10
const MAX_BAR_SIZE = 24

const gridClassName =
  'stroke-primary/25 dark:stroke-primary/40 [stroke-dasharray:5_5]'
// The page's y tick overrides, which also restyled the category labels.
const yTickClassName = 'fill-secondary font-bold! text-subtitle-11'

export function TransferSizeChart({
  data,
  isLoading,
  horizontal = false,
  categoryAxisWidth = 70,
}: Props) {
  const isClient = useIsClient()

  if (isLoading || !isClient) {
    return (
      <Skeleton
        className={cn('h-full w-full', !horizontal && 'mt-5 min-h-[250px]')}
      />
    )
  }

  return (
    <div className="relative size-full">
      <ChartContext.Provider value={{ meta: chartMeta }}>
        <TransferSizeBars
          data={data}
          horizontal={horizontal}
          categoryAxisWidth={categoryAxisWidth}
        />
      </ChartContext.Provider>
      <Logo
        animated={false}
        className={cn(
          'pointer-events-none absolute right-3 bottom-10 h-8 w-20 opacity-50',
        )}
      />
    </div>
  )
}

/**
 * The stacked bars: the legend's height comes off the plot, the category
 * axis is a band scale without padding, and each band holds one stack.
 */
function TransferSizeBars({
  data,
  horizontal,
  categoryAxisWidth,
}: {
  data: TransferSizeDataPoint[]
  horizontal: boolean
  categoryAxisWidth: number
}) {
  const clipId = useId()
  const legendRef = useRef<HTMLDivElement>(null)
  const legend = useResizeObserver({ ref: legendRef })

  // Its callbacks run on events, after the layout below is computed.
  const tooltip = useChartTooltip({
    count: data.length,
    anchorOf: (index) => {
      // The band's middle, half way along the value axis.
      const center = bandStart(index) + band / 2
      const middle = horizontal
        ? plot.x + plot.width / 2
        : plot.y + plot.height / 2
      return horizontal ? { x: middle, y: center } : { x: center, y: middle }
    },
    place: (anchor, size) => placeInPlot(anchor, size, plot, horizontal),
    arrowKeys: horizontal ? 'upDown' : 'leftRight',
  })
  const box = useResizeObserver({ ref: tooltip.rootRef })
  const { active } = tooltip

  const width = Math.round(box.width ?? 0)
  const height = Math.round(box.height ?? 0)
  const legendHeight = legend.height ?? 0

  const margin = horizontal
    ? { top: 4, right: 8, bottom: 4, left: 4 }
    : { top: 20, right: 0, bottom: 0, left: 0 }
  const plotLeft = margin.left + (horizontal ? categoryAxisWidth : 30)
  const plotTop = margin.top + (horizontal ? 0 : legendHeight)
  const plotRight = width - margin.right
  const plotBottom =
    height - margin.bottom - AXIS_HEIGHT - (horizontal ? legendHeight : 0)
  const plot = {
    x: plotLeft,
    y: plotTop,
    width: Math.max(0, plotRight - plotLeft),
    height: Math.max(0, plotBottom - plotTop),
  }

  const count = data.length
  const band = count > 0 ? (horizontal ? plot.height : plot.width) / count : 0
  const bandStart = (i: number) => (horizontal ? plot.y : plot.x) + i * band
  const bar = getBarPosition(band, horizontal)
  // Percentages map onto the value axis, 0-100.
  const valueToPixel = (value: number) =>
    horizontal
      ? plot.x + (value / 100) * plot.width
      : plot.y + plot.height - (value / 100) * plot.height

  const row = active ? data[active.index] : undefined

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const inPlot =
      x >= plot.x &&
      x <= plot.x + plot.width &&
      y >= plot.y &&
      y <= plot.y + plot.height
    if (!inPlot || band <= 0) {
      tooltip.clear()
      return
    }
    const along = horizontal ? y - plot.y : x - plot.x
    const index = Math.min(count - 1, Math.floor(along / band))
    // The tooltip follows the pointer along the band, centred across it.
    const center = bandStart(index) + band / 2
    tooltip.select(index, horizontal ? { x, y: center } : { x: center, y })
  }

  const hasSize = width > 0 && height > 0

  return (
    <div
      ref={tooltip.rootRef}
      className={cn(
        'relative flex aspect-video size-full select-none justify-center text-xs outline-none md:aspect-auto',
        !horizontal && 'min-h-[250px]!',
      )}
    >
      {hasSize && (
        <svg
          width={width}
          height={height}
          className="absolute inset-0 block outline-none"
          {...tooltip.interactiveProps}
          aria-label="Protocol transfer size"
          onPointerMove={onPointerMove}
          onPointerDown={onPointerMove}
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                x={plot.x}
                y={plot.y}
                width={plot.width}
                height={plot.height}
              />
            </clipPath>
          </defs>
          {active && (
            <rect
              className="fill-primary/25"
              {...(horizontal
                ? {
                    x: plot.x + 0.5,
                    y: bandStart(active.index),
                    width: plot.width - 1,
                    height: band,
                  }
                : {
                    x: bandStart(active.index),
                    y: plot.y + 0.5,
                    width: band,
                    height: plot.height - 1,
                  })}
            />
          )}
          <g clipPath={`url(#${clipId})`}>
            {data.map((point, i) => {
              let cumulative = 0
              return BUCKETS.map((bucket) => {
                const from = cumulative
                cumulative += point[bucket]
                const a = valueToPixel(from)
                const b = valueToPixel(cumulative)
                const start = bandStart(i) + bar.offset
                const length = Math.abs(b - a)
                if (length === 0 || bar.size === 0) return null
                return (
                  <rect
                    key={`${point.name}-${bucket}`}
                    x={horizontal ? Math.min(a, b) : start}
                    y={horizontal ? start : Math.min(a, b)}
                    width={horizontal ? length : bar.size}
                    height={horizontal ? bar.size : length}
                    fill={chartMeta[bucket].color}
                    fillOpacity={0.8}
                  />
                )
              })
            })}
          </g>
          {/* Over the bars, like the time-series grid. */}
          <g className={gridClassName}>
            {PERCENT_TICKS.map((tick) => {
              const at = valueToPixel(tick)
              return horizontal ? (
                <line
                  key={tick}
                  x1={at}
                  x2={at}
                  y1={plot.y}
                  y2={plot.y + plot.height}
                />
              ) : (
                <line
                  key={tick}
                  x1={plot.x}
                  x2={plot.x + plot.width}
                  y1={at}
                  y2={at}
                />
              )
            })}
          </g>
          {horizontal ? (
            <>
              <g>
                {PERCENT_TICKS.map((tick) => (
                  <text
                    key={tick}
                    x={valueToPixel(tick)}
                    y={plot.y + plot.height + TICK_OFFSET}
                    dy="0.71em"
                    textAnchor="middle"
                    className="fill-secondary font-medium text-3xs leading-none"
                  >
                    {tick}%
                  </text>
                ))}
              </g>
              <g>
                {data.map((point, i) => (
                  <g
                    key={point.name}
                    transform={`translate(${margin.left + categoryAxisWidth - TICK_OFFSET},${bandStart(i) + band / 2})`}
                  >
                    <image
                      x={4 - categoryAxisWidth}
                      y={-7}
                      width={14}
                      height={14}
                      href={point.iconUrl}
                    >
                      <title>{point.name}</title>
                    </image>
                    <text
                      x={22 - categoryAxisWidth}
                      dy="0.32em"
                      className={yTickClassName}
                    >
                      {point.name}
                    </text>
                  </g>
                ))}
              </g>
            </>
          ) : (
            <>
              {/* The category axis has a line; the percent axis has none. */}
              <line
                x1={plot.x}
                x2={plot.x + plot.width}
                y1={plot.y + plot.height}
                y2={plot.y + plot.height}
                stroke="#666"
              />
              <g>
                {data.map((point, i) => (
                  <image
                    key={point.name}
                    x={bandStart(i) + band / 2}
                    y={plot.y + plot.height + TICK_OFFSET}
                    className="-translate-x-1.5 sm:-translate-x-2.5 xs:-translate-x-2 size-3 xs:size-4 sm:size-5"
                    href={point.iconUrl}
                  >
                    <title>{point.name}</title>
                  </image>
                ))}
              </g>
              <g>
                {PERCENT_TICKS.map((tick) => (
                  <text
                    key={tick}
                    x={plot.x - TICK_OFFSET}
                    y={valueToPixel(tick)}
                    dx={5}
                    dy="0.355em"
                    textAnchor="end"
                    className={yTickClassName}
                  >
                    {tick}%
                  </text>
                ))}
              </g>
            </>
          )}
        </svg>
      )}
      <div
        ref={legendRef}
        className="absolute"
        style={{
          left: margin.left,
          width: Math.max(0, width - margin.left - margin.right),
          ...(horizontal ? { bottom: margin.bottom } : { top: margin.top }),
        }}
      >
        <ChartLegend
          align={horizontal ? 'center' : 'start'}
          className={cn('pt-0', !horizontal && 'pb-4 md:pb-8')}
        />
      </div>
      <div {...tooltip.tooltipProps}>
        {row && <CustomTooltip row={row} horizontal={horizontal} />}
      </div>
    </div>
  )
}

/**
 * A stack's position in its band: a fixed bar size centred, or the band
 * less 10% each side, capped at the maximum bar size.
 */
function getBarPosition(band: number, horizontal: boolean) {
  if (horizontal) {
    if (BAR_SIZE >= band) {
      const size = band * 0.9
      return { offset: Math.round((band - size) / 2), size }
    }
    return { offset: Math.round((band - BAR_SIZE) / 2), size: BAR_SIZE }
  }
  const gap = band * 0.1
  let originalSize = band - 2 * gap
  if (originalSize > 1) originalSize = Math.round(originalSize)
  const size = Math.min(originalSize, MAX_BAR_SIZE)
  return { offset: gap + (originalSize - size) / 2, size }
}

/**
 * Beside the anchor like other charts, but the vertical chart's tooltip
 * stays within the plot sideways and the horizontal one up and down.
 */
function placeInPlot(
  anchor: Anchor,
  size: { width: number; height: number },
  plot: { x: number; y: number; width: number; height: number },
  horizontal: boolean,
): Anchor {
  const { width: w, height: h } = size
  const onLeft = anchor.x > plot.x + plot.width / 2
  const positiveX = anchor.x + TOOLTIP_OFFSET
  const negativeX = anchor.x - w - TOOLTIP_OFFSET
  const positiveY = anchor.y + TOOLTIP_OFFSET
  const negativeY = anchor.y - h - TOOLTIP_OFFSET
  if (horizontal) {
    return {
      x: onLeft ? negativeX : positiveX,
      y:
        positiveY + h > plot.y + plot.height
          ? Math.max(negativeY, plot.y)
          : Math.max(positiveY, plot.y),
    }
  }
  const x = onLeft
    ? negativeX < plot.x
      ? Math.max(positiveX, plot.x)
      : Math.max(negativeX, plot.x)
    : positiveX + w > plot.x + plot.width
      ? Math.max(negativeX, plot.x)
      : Math.max(positiveX, plot.x)
  return { x, y: positiveY }
}

const percentageToCountKey: Record<
  Extract<keyof TransferSizeDataPoint, `percentage${string}`>,
  Extract<keyof TransferSizeDataPoint, `count${string}`>
> = {
  percentageUnder100: 'countUnder100',
  percentage100To1K: 'count100To1K',
  percentage1KTo10K: 'count1KTo10K',
  percentage10KTo100K: 'count10KTo100K',
  percentageOver100K: 'countOver100K',
}

function CustomTooltip({
  row: data,
  horizontal,
}: {
  row: TransferSizeDataPoint
  horizontal: boolean
}) {
  const totalTransfers =
    data.countUnder100 +
    data.count100To1K +
    data.count1KTo10K +
    data.count10KTo100K +
    data.countOver100K

  // Vertical bars stack bottom-to-top; reverse to match visual order.
  const orderedBuckets = horizontal ? BUCKETS : [...BUCKETS].reverse()

  return (
    <div className={tooltipContentVariants()}>
      <div className="font-medium text-label-value-14 text-secondary">
        {data.name}
      </div>

      <HorizontalSeparator className="my-1.5" />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">
            Total identified transfers
          </span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatInteger(totalTransfers)} transfers
          </span>
        </div>
        {orderedBuckets.map((bucket) => {
          const count = data[percentageToCountKey[bucket]]

          return (
            <ChartTooltipRow
              key={bucket}
              name={bucket}
              gap="gap-x-6"
              wrapLabel={false}
            >
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {formatInteger(count)} transfers
              </span>
            </ChartTooltipRow>
          )
        })}
      </div>
      <HorizontalSeparator className="my-1.5" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Min size</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatTransferSize(data.minTransferValueUsd)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Average size</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatTransferSize(data.averageTransferSizeUsd)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Max size</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatTransferSize(data.maxTransferValueUsd)}
          </span>
        </div>
      </div>
    </div>
  )
}

function formatTransferSize(value: number | undefined) {
  return value !== undefined ? formatCurrency(value, 'usd') : EM_DASH
}
