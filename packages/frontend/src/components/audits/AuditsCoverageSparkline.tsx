import { formatInteger, pluralize } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipVisualOnly,
} from '~/components/core/tooltip/Tooltip'
import type { AuditsSummaryCoverageHistory } from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { getLabeledTicks, getTimeScale, getYearTicks } from './auditsTimeline'
import { getCoverageTrendColor } from './coverageScale'

const WIDTH = 240
const HEIGHT = 32
const PAD = 4
// Zero, fully audited, is the bottom of the plot; year ticks and labels
// hang below it.
const PLOT_TOP = 2
const PLOT_BOTTOM = 20
const CRISP = { shapeRendering: 'crispEdges' } as const

/** Centers a 1px line on a device pixel, so it is not blurred over two. */
function snap(x: number) {
  return Math.round(x) + 0.5
}

/**
 * AuditsCoverageChart at its MAX range on one line: the uncovered lines from
 * the launch to the present, rising from zero at the bottom and colored by
 * whether the present is below (green) or above (red) the launch. A link to
 * the full chart.
 */
export function AuditsCoverageSparkline({
  history,
  to,
  href,
  className,
}: {
  history: AuditsSummaryCoverageHistory
  /** The end of the range, the present. */
  to: number
  /** The project's full timeline. */
  href: string
  className?: string
}) {
  const { launch, points } = history
  const first = points[0]
  const last = points[points.length - 1]
  if (first === undefined || last === undefined) return null

  const toX = getTimeScale(launch, to, PAD, WIDTH - PAD)
  const years = getYearTicks(launch, to)
  const labeled = getLabeledTicks(years, toX, 24)
  const max = Math.max(1, ...points.map((point) => point.uncovered))
  const toY = (value: number) =>
    PLOT_BOTTOM - (value / max) * (PLOT_BOTTOM - PLOT_TOP)
  const line = points
    .map((point, i) => {
      const end = points[i + 1]?.timestamp ?? to
      const y = toY(point.uncovered)
      return `${i === 0 ? 'M' : 'L'}${toX(point.timestamp)} ${y} L${toX(end)} ${y}`
    })
    .join(' ')
  const area = `${line} L${toX(to)} ${toY(0)} L${toX(first.timestamp)} ${toY(0)} Z`
  const color = getCoverageTrendColor(first.uncovered, last.uncovered)

  const now = `${formatInteger(last.uncovered)} unaudited ${pluralize(last.uncovered, 'line')} now`
  const then = `${formatInteger(first.uncovered)} at the launch, ${formatTimestamp(launch)}`
  const trend =
    last.uncovered < first.uncovered
      ? 'Fewer than at the launch.'
      : last.uncovered > first.uncovered
        ? 'More than at the launch.'
        : 'As many as at the launch.'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href={href} className={cn('block w-fit', className)}>
          <svg
            width={WIDTH}
            height={HEIGHT}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`Unaudited lines over time. ${now}, ${then}. ${trend}`}
          >
            <path d={area} fill={color} fillOpacity={0.15} />
            <path
              d={line}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
            {years.map((tick) => (
              <g key={tick.ordinal}>
                <line
                  x1={snap(toX(tick.timestamp))}
                  x2={snap(toX(tick.timestamp))}
                  y1={PLOT_BOTTOM + 1}
                  y2={PLOT_BOTTOM + 4}
                  stroke="var(--secondary)"
                  strokeOpacity={0.7}
                  {...CRISP}
                />
                {labeled.has(tick.ordinal) && (
                  <text
                    x={toX(tick.timestamp)}
                    y={HEIGHT - 2}
                    fontSize={9}
                    fill="var(--secondary)"
                    textAnchor="middle"
                  >
                    {`'${tick.label.slice(2)}`}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </a>
      </TooltipTrigger>
      <TooltipContent className="flex max-w-72 flex-col gap-1">
        <span className="font-bold">{now}</span>
        <span className="text-secondary">
          {then}. {trend}
        </span>
        <TooltipVisualOnly>
          <span className="text-secondary">
            Click to open the full timeline.
          </span>
        </TooltipVisualOnly>
      </TooltipContent>
    </Tooltip>
  )
}
