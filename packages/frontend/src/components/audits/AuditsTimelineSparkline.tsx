import { pluralize } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipVisualOnly,
} from '~/components/core/tooltip/Tooltip'
import type { AuditsSummaryTimeline } from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { getLabeledTicks, getTimeScale, getYearTicks } from './auditsTimeline'

const WIDTH = 240
const HEIGHT = 32
const PAD = 4
// Audit ticks stand on the axis, year ticks and labels hang below it.
const AXIS = 19
const TICK_HEIGHT = 11
const CRISP = { shapeRendering: 'crispEdges' } as const

/** Centers a 1px line on a device pixel, so it is not blurred over two. */
function snap(x: number) {
  return Math.round(x) + 0.5
}

/**
 * The project's life on one line: the launch as a circle and the project's
 * audit reports, own and stack, as green ticks above the axis. The same model
 * as AuditsTimelineChart, without the upgrades, and a link to it.
 */
export function AuditsTimelineSparkline({
  timeline,
  href,
  className,
}: {
  timeline: AuditsSummaryTimeline
  /** The project's full timeline. */
  href: string
  className?: string
}) {
  const { from, to, launch, audits, latestAudit } = timeline
  const toX = getTimeScale(from, to, PAD, WIDTH - PAD)
  const years = getYearTicks(from, to)
  const labeled = getLabeledTicks(years, toX, 24)
  const count = `${audits.length} project ${pluralize(audits.length, 'audit')}`
  const summary =
    latestAudit === null
      ? `${count}.`
      : `${count}, the latest ${formatTimestamp(latestAudit)}.`
  const launchNote =
    launch === null
      ? 'Launch date unknown.'
      : 'The circle marks the project launch.'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href={href} className={cn('block w-fit', className)}>
          <svg
            width={WIDTH}
            height={HEIGHT}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`Audit timeline. ${summary} ${launchNote}`}
          >
            <line
              x1={0}
              x2={WIDTH}
              y1={snap(AXIS)}
              y2={snap(AXIS)}
              stroke="var(--secondary)"
              strokeOpacity={0.6}
              strokeDasharray="2 2"
              {...CRISP}
            />
            {years.map((tick) => (
              <g key={tick.ordinal}>
                <line
                  x1={snap(toX(tick.timestamp))}
                  x2={snap(toX(tick.timestamp))}
                  y1={AXIS + 1}
                  y2={AXIS + 4}
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
            {launch !== null && (
              <circle
                cx={snap(toX(launch))}
                cy={snap(AXIS)}
                r={2.5}
                fill="var(--surface-primary)"
                stroke="var(--secondary)"
                strokeWidth={1.5}
              />
            )}
            {audits.map((audit, i) => (
              <rect
                // Several reports can share a day.
                key={`${audit}-${i}`}
                x={Math.round(toX(audit)) - 1}
                y={AXIS - TICK_HEIGHT}
                width={2}
                height={TICK_HEIGHT}
                rx={1}
                fill="var(--positive)"
              />
            ))}
          </svg>
        </a>
      </TooltipTrigger>
      <TooltipContent className="flex max-w-72 flex-col gap-1">
        <span>{summary}</span>
        <span className="flex items-center gap-1.5 text-secondary">
          {launch === null ? (
            launchNote
          ) : (
            <>
              <span className="inline-block size-2.5 shrink-0 rounded-full border-2 border-secondary" />
              marks the project launch.
            </>
          )}
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
