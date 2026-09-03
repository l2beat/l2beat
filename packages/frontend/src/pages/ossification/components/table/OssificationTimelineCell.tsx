import { formatCurrency, formatSeconds, unique } from '@l2beat/shared-pure'
import clamp from 'lodash/clamp'
import { useId } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { OssificationTimeline } from '~/server/features/projects/ossification/getProjectOssification'
import { formatTimestamp } from '~/utils/dates'

const WIDTH = 132
const HEIGHT = 30
/** The plot band, then a 5px lane below the baseline for the event ticks. */
const PLOT_TOP = 3
const BASELINE = 22
const TICK_TOP = 24
const TICK_BOTTOM = 29

/** The site's TVS hue, so the cell reads as the same measure as the full-size
 *  TVS charts, plus the secondary text ink as the de-emphasis tone. The
 *  categorical palette checks do not apply to a single-series chart whose
 *  second tone is deliberately gray, but the pair does clear both CVD
 *  separation and 3:1 contrast against the surface in light and dark mode. */
const ACCENT = 'var(--chart-pink)'
const MUTED = 'var(--secondary)'

interface Props {
  timeline: OssificationTimeline
  projectName: string
}

/**
 * TVS over a trailing year with the unchanged period highlighted, so the shaded
 * area is the battle-tested exposure reported beside it, and the perimeter
 * resets that came before it as ticks. The window is the same for every row;
 * only the TVS height is normalized per project.
 */
export function OssificationTimelineCell({ timeline, projectName }: Props) {
  // React's ids carry colons, which are legal in an XML id but awkward in a
  // `url(#...)` reference; strip them and keep the uniqueness.
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const { from, to, clockStart, resets, tvs } = timeline
  const scaleTime = (timestamp: number) =>
    clamp(((timestamp - from) / (to - from)) * WIDTH, 0, WIDTH)

  const clockX = scaleTime(clockStart)
  const startsBeforeWindow = clockStart < from
  const shape = getShape(tvs)
  // Events after the clock start belong to contracts that have since left the
  // perimeter; drawing them inside the highlight would contradict what the
  // highlight claims. The full history is on the project page.
  const ticks = unique(
    resets
      .filter((reset) => reset <= clockStart)
      .map((reset) => crisp(scaleTime(reset))),
  )

  const chart = (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={getAriaLabel(timeline, projectName)}
    >
      {shape && (
        <>
          <defs>
            <clipPath id={`${id}-history`}>
              <rect x={0} y={0} width={clockX} height={HEIGHT} />
            </clipPath>
            <clipPath id={`${id}-unchanged`}>
              <rect x={clockX} y={0} width={WIDTH - clockX} height={HEIGHT} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${id}-history)`}>
            <path d={shape.area} fill={MUTED} fillOpacity={0.12} />
            <path
              d={shape.line}
              fill="none"
              stroke={MUTED}
              strokeWidth={1}
              strokeOpacity={0.75}
            />
          </g>
          <g clipPath={`url(#${id}-unchanged)`}>
            <path d={shape.area} fill={ACCENT} fillOpacity={0.18} />
            <path
              d={shape.line}
              fill="none"
              stroke={ACCENT}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </g>
        </>
      )}
      <line
        x1={0}
        y1={BASELINE + 0.5}
        x2={WIDTH}
        y2={BASELINE + 0.5}
        stroke="var(--divider)"
        strokeWidth={1}
      />
      {/* Runs through the tick lane too, so it reads as the reset that started
          the clock — and stays visible when the unchanged tail is only a few
          pixels wide. */}
      {!startsBeforeWindow && (
        <line
          x1={crisp(clockX)}
          y1={PLOT_TOP - 1}
          x2={crisp(clockX)}
          y2={TICK_BOTTOM}
          stroke={ACCENT}
          strokeWidth={1}
        />
      )}
      {/* The clock started before the window: the highlight runs off the left
          edge. The tick lane is empty in exactly this case. */}
      {startsBeforeWindow && (
        <path
          d={`M4.5 ${TICK_TOP} L0.5 ${(TICK_TOP + TICK_BOTTOM) / 2} L4.5 ${TICK_BOTTOM} Z`}
          fill={ACCENT}
        />
      )}
      {ticks.map((x) => (
        <line
          key={x}
          x1={x}
          y1={TICK_TOP}
          x2={x}
          y2={TICK_BOTTOM}
          stroke={MUTED}
          strokeWidth={1}
          strokeOpacity={0.8}
        />
      ))}
    </svg>
  )

  return (
    <Tooltip>
      <TooltipTrigger disabledOnMobile className="h-[inherit] px-3">
        {chart}
      </TooltipTrigger>
      <TooltipContent>
        <div className="font-medium text-sm">TVS &amp; critical changes</div>
        <div className="mt-0.5 text-secondary text-xs">
          {formatTimestamp(from, { mode: 'date' })} –{' '}
          {formatTimestamp(to, { mode: 'date' })}
        </div>
        <p className="mt-2 text-xs">{getUnchangedSentence(timeline)}</p>
        <p className="mt-1 text-xs">{getResetSentence(timeline)}</p>
        {tvs && <p className="mt-1 text-xs">{getTvsSentence(tvs)}</p>}
        <p className="mt-2 text-secondary text-xs">
          Height is scaled to each project's own peak.
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

function getShape(tvs: (number | null)[] | null) {
  if (tvs === null || tvs.length < 2) return null

  const max = Math.max(...tvs.map((value) => value ?? 0))
  // A zero baseline keeps the filled area proportional to the value; min-max
  // normalization would turn flat TVS into dramatic noise.
  const points = tvs.flatMap((value, index) =>
    value === null
      ? []
      : [
          {
            x: (index / (tvs.length - 1)) * WIDTH,
            y: BASELINE - (max > 0 ? value / max : 0) * (BASELINE - PLOT_TOP),
          },
        ],
  )
  const first = points[0]
  const last = points.at(-1)
  if (first === undefined || last === undefined || points.length < 2) {
    return null
  }

  const line = points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'}${round(point.x)} ${round(point.y)}`,
    )
    .join(' ')
  return {
    line,
    area: `${line} L${round(last.x)} ${BASELINE} L${round(first.x)} ${BASELINE} Z`,
  }
}

function getUnchangedSentence(timeline: OssificationTimeline): string {
  const { to, clockStart, from } = timeline
  const age = formatSeconds(to - clockStart)
  const since = formatTimestamp(clockStart, { mode: 'date' })
  return clockStart < from
    ? `Unchanged for ${age}, since ${since} — before this window, so the whole year is highlighted.`
    : `Unchanged for the highlighted ${age}, since ${since}.`
}

function getResetSentence(timeline: OssificationTimeline): string {
  const count = timeline.resets.length
  if (count === 0) {
    return 'No critical upgrade in this window.'
  }
  return `${count} critical ${count === 1 ? 'upgrade' : 'upgrades'} in this window, marked below the baseline.`
}

function getTvsSentence(tvs: (number | null)[]): string {
  const values = tvs.filter((value): value is number => value !== null)
  const latest = values.at(-1)
  if (latest === undefined) return ''
  const peak = Math.max(...values)
  return `TVS now ${formatCurrency(latest, 'usd')}, peaking at ${formatCurrency(peak, 'usd')}.`
}

function getAriaLabel(
  timeline: OssificationTimeline,
  projectName: string,
): string {
  return [
    `${projectName}: TVS over the last 12 months.`,
    getUnchangedSentence(timeline),
    getResetSentence(timeline),
  ].join(' ')
}

/** Half-pixel offset so a 1px vertical rule lands on one device pixel. */
function crisp(x: number): number {
  return clamp(Math.round(x), 1, WIDTH - 1) + 0.5
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}
