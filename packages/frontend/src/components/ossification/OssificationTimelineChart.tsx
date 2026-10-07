import { formatCurrency, formatSeconds, pluralize } from '@l2beat/shared-pure'
import { useId } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { OSSIFICATION_VALUE_LABELS } from '~/components/ossification/ossificationValueLabels'
import type { OssificationStats } from '~/server/features/projects/ossification/getOssificationStats'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'

const WIDTH = 132
const HEIGHT = 30
const TOP = 2
// The area sits above it, change ticks, the genesis dot and the arrow below.
const BASELINE = 24
const GENESIS_RADIUS = 2
const LINE_PROPS = {
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const
const SCALE_NOTE = "Height is scaled to each project's own peak"
const CRISP = { shapeRendering: 'crispEdges' } as const

type Props = Pick<OssificationStats, 'timeline' | 'valueSource'>

export function OssificationTimelineChart({
  timeline,
  valueSource,
  className,
}: Props & { className?: string }) {
  const id = useId()
  const { from, to, clockStart, genesis, criticalChanges, values } = timeline
  const toX = (timestamp: number) => ((timestamp - from) / (to - from)) * WIDTH
  const clockBeforeWindow = clockStart < from
  const clockX = clockBeforeWindow ? 0 : toX(clockStart)
  const area = values ? getAreaPaths(values) : undefined
  const description = getDescription({
    timeline,
    valueSource,
    clockBeforeWindow,
  })

  return (
    <Tooltip>
      <TooltipTrigger className={cn('block', className)}>
        <svg
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={[
            `${description.title}, ${description.period}.`,
            ...description.lines,
            `${SCALE_NOTE}.`,
          ].join(' ')}
        >
          <defs>
            <clipPath id={`${id}-before`}>
              <rect x={0} y={0} width={clockX} height={HEIGHT} />
            </clipPath>
            <clipPath id={`${id}-after`}>
              <rect x={clockX} y={0} width={WIDTH - clockX} height={HEIGHT} />
            </clipPath>
          </defs>
          <line
            x1={0}
            x2={WIDTH}
            y1={BASELINE + 0.5}
            y2={BASELINE + 0.5}
            stroke="var(--divider)"
            {...CRISP}
          />
          {area && (
            <>
              <g clipPath={`url(#${id}-before)`}>
                <path
                  d={area.fill}
                  fill="var(--secondary)"
                  fillOpacity={0.15}
                />
                <path
                  d={area.line}
                  fill="none"
                  stroke="var(--secondary)"
                  strokeOpacity={0.5}
                  {...LINE_PROPS}
                />
              </g>
              <g clipPath={`url(#${id}-after)`}>
                <path
                  d={area.fill}
                  fill="var(--chart-pink)"
                  fillOpacity={0.25}
                />
                <path
                  d={area.line}
                  fill="none"
                  stroke="var(--chart-pink)"
                  {...LINE_PROPS}
                />
              </g>
            </>
          )}
          {criticalChanges.map((change) => (
            <line
              key={change}
              x1={snap(toX(change))}
              x2={snap(toX(change))}
              y1={BASELINE + 2}
              y2={HEIGHT}
              stroke="var(--secondary)"
              strokeOpacity={0.6}
              {...CRISP}
            />
          ))}
          {clockBeforeWindow ? (
            <path
              d={`M5 ${BASELINE + 1.5}L1 ${BASELINE + 3.5}L5 ${BASELINE + 5.5}Z`}
              fill="var(--chart-pink)"
            />
          ) : (
            <line
              x1={snap(clockX)}
              x2={snap(clockX)}
              y1={0}
              y2={HEIGHT}
              stroke="var(--chart-pink)"
              {...CRISP}
            />
          )}
          {/* Drawn last: with no change since, the pink line is at the genesis. */}
          {genesis >= from && (
            <circle
              cx={Math.min(
                Math.max(toX(genesis), GENESIS_RADIUS),
                WIDTH - GENESIS_RADIUS,
              )}
              cy={BASELINE + 2 + GENESIS_RADIUS}
              r={GENESIS_RADIUS}
              fill="var(--secondary)"
            />
          )}
        </svg>
      </TooltipTrigger>
      <TooltipContent className="flex max-w-80 flex-col gap-1.5">
        <div>
          <div className="font-bold">{description.title}</div>
          <div className="text-secondary">{description.period}</div>
        </div>
        {description.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
        <span className="text-secondary">{SCALE_NOTE}.</span>
      </TooltipContent>
    </Tooltip>
  )
}

/** Centers a 1px line on a device pixel, so it is not blurred over two. */
function snap(x: number) {
  return Math.min(Math.max(Math.round(x), 0), WIDTH - 1) + 0.5
}

/** Area and line through the samples, from a zero baseline to the peak. */
function getAreaPaths(values: (number | null)[]) {
  const peak = Math.max(...values.map((value) => value ?? 0))
  const step = WIDTH / (values.length - 1)
  const points = values.flatMap((value, i) =>
    value === null
      ? []
      : [
          {
            x: i * step,
            y: BASELINE - (peak > 0 ? value / peak : 0) * (BASELINE - TOP),
          },
        ],
  )
  const first = points[0]
  const last = points.at(-1)
  if (!first || !last) {
    return undefined
  }
  const line = `M${points.map((p) => `${p.x} ${p.y}`).join(' L')}`
  return {
    line,
    fill: `${line} L${last.x} ${BASELINE} L${first.x} ${BASELINE} Z`,
  }
}

function getDescription({
  timeline,
  valueSource,
  clockBeforeWindow,
}: Props & { clockBeforeWindow: boolean }) {
  const { from, to, clockStart, values } = timeline
  const known = values?.filter((value) => value !== null) ?? []
  const current = known.at(-1)
  return {
    title: `${OSSIFICATION_VALUE_LABELS[valueSource ?? 'tvs'].short} & critical changes`,
    period: `${formatTimestamp(from)} – ${formatTimestamp(to)}`,
    lines: [
      `Unchanged for ${formatSeconds(to - clockStart)}, since ${formatTimestamp(clockStart)}${clockBeforeWindow ? ' — before this window, so the whole year is highlighted' : ''}.`,
      getChangesLine(timeline),
      current !== undefined && valueSource
        ? `${OSSIFICATION_VALUE_LABELS[valueSource].long} now ${formatCurrency(current, 'usd')}, peaking at ${formatCurrency(Math.max(...known), 'usd')}.`
        : 'No value data.',
    ],
  }
}

function getChangesLine({ from, genesis, criticalChanges }: Props['timeline']) {
  const span =
    genesis >= from
      ? `since the ossification genesis on ${formatTimestamp(genesis)}`
      : 'in this window'
  const count = criticalChanges.length
  return count === 0
    ? `No critical change ${span}.`
    : `${count} critical ${pluralize(count, 'change')} ${span}.`
}
