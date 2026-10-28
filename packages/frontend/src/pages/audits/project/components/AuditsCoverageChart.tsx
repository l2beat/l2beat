import { formatInteger, pluralize } from '@l2beat/shared-pure'
import { useMemo, useRef, useState } from 'react'
import {
  getLabeledTicks,
  getTimeScale,
  getTimeTicks,
} from '~/components/audits/auditsTimeline'
import {
  getValueDomain,
  getValueTicks,
} from '~/components/audits/coverageScale'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { tooltipContentVariants } from '~/components/core/tooltip/Tooltip'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type {
  AuditsCoverageHistory,
  AuditsCoverageHistoryPoint,
  AuditsUnitReportRef,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { type ChartRange, optionToRange } from '~/utils/range/range'

const HEIGHT = 170
const PAD_X = 12
const PLOT_TOP = 14
const PLOT_BOTTOM = 136
const LABEL_Y = 166
const DOT_RADIUS = 3.5
const CRISP = { shapeRendering: 'crispEdges' } as const

interface Props {
  history: AuditsCoverageHistory
}

/**
 * The perimeter's lines that no audit covered, from the launch to the
 * present, as a step: the value only changes at a point, where an audit began
 * to count or the perimeter's code changed. Absolute lines, not a share, as
 * every uncovered line is a possible exploit whatever the perimeter's size.
 * Hovering a step shows what changed there, below the plot so that the
 * tooltip covers no data. The range is the chart's own; MAX reaches back to
 * the launch, where the series starts.
 */
export function AuditsCoverageChart({ history }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref })
  const [hovered, setHovered] = useState<number | undefined>()
  const [range, setRange] = useState<ChartRange>(() => optionToRange('max'))
  const from = range[0] ?? history.launch
  const to = range[1]

  const toX = useMemo(
    () => getTimeScale(from, to, PAD_X, (width ?? 0) - PAD_X),
    [from, to, width],
  )
  const ticks = useMemo(() => getTimeTicks(from, to), [from, to])
  const labeled = getLabeledTicks(ticks, toX, 48)

  // The steps inside the range: each point holds from its timestamp (or the
  // range start) to the next point (or the range end).
  const steps = useMemo(
    () => getSteps(history.points, from, to),
    [history.points, from, to],
  )
  // The y axis follows the visible values, see coverageScale.
  const domain = useMemo(
    () => getValueDomain(steps.map((step) => uncoveredOf(step.point))),
    [steps],
  )
  const valueTicks = useMemo(() => getValueTicks(domain), [domain])
  const toY = (value: number) =>
    PLOT_BOTTOM -
    ((value - domain.min) / (domain.max - domain.min)) *
      (PLOT_BOTTOM - PLOT_TOP)
  const line =
    steps.length === 0
      ? undefined
      : steps
          .map(
            (step, i) =>
              `${i === 0 ? 'M' : 'L'}${toX(step.start)} ${toY(uncoveredOf(step.point))} L${toX(step.end)} ${toY(uncoveredOf(step.point))}`,
          )
          .join(' ')
  const first = steps[0]
  const last = steps[steps.length - 1]
  const area =
    line !== undefined && first !== undefined && last !== undefined
      ? `${line} L${toX(last.end)} ${PLOT_BOTTOM} L${toX(first.start)} ${PLOT_BOTTOM} Z`
      : undefined
  const active =
    hovered === undefined
      ? undefined
      : steps.find((step) => hovered >= step.start && hovered <= step.end)
  const present = history.points[history.points.length - 1]

  return (
    <div className="flex flex-col gap-3">
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={[from, to]} />
        <ChartRangeControls
          name="audits-coverage"
          value={range}
          setValue={setRange}
          options={[
            { value: '1y', label: '1Y' },
            { value: 'max', label: 'MAX' },
          ]}
        />
      </ChartControlsWrapper>
      <div
        ref={ref}
        className="relative w-full"
        style={{ height: HEIGHT }}
        onMouseMove={(event) => {
          if (width === undefined) return
          const x =
            event.clientX - event.currentTarget.getBoundingClientRect().left
          const span = Math.max(1, to - from)
          const t = from + ((x - PAD_X) / Math.max(1, width - 2 * PAD_X)) * span
          setHovered(Math.min(to, Math.max(from, t)))
        }}
        onMouseLeave={() => setHovered(undefined)}
      >
        {width !== undefined && width > 2 * PAD_X && (
          <>
            <svg
              className="absolute inset-0"
              width={width}
              height={HEIGHT}
              role="img"
              aria-label="Lines of the critical contracts not covered by audits over time"
            >
              {valueTicks.map((value) => (
                <g key={value}>
                  <line
                    x1={PAD_X}
                    x2={width - PAD_X}
                    y1={snap(toY(value))}
                    y2={snap(toY(value))}
                    stroke="var(--divider)"
                    {...CRISP}
                  />
                  <text
                    x={PAD_X + 2}
                    y={toY(value) - 3}
                    fontSize={10}
                    fill="var(--secondary)"
                  >
                    {formatInteger(value)}
                  </text>
                </g>
              ))}
              {ticks.map((tick) => (
                <g key={tick.ordinal}>
                  <line
                    x1={snap(toX(tick.timestamp))}
                    x2={snap(toX(tick.timestamp))}
                    y1={PLOT_TOP}
                    y2={PLOT_BOTTOM + 6}
                    stroke="var(--divider)"
                    strokeDasharray="2 3"
                    {...CRISP}
                  />
                  {labeled.has(tick.ordinal) && (
                    <text
                      x={toX(tick.timestamp)}
                      y={LABEL_Y}
                      fontSize={11}
                      fill="var(--secondary)"
                      textAnchor="middle"
                    >
                      {tick.label}
                    </text>
                  )}
                </g>
              ))}
              {area && (
                <path d={area} fill="var(--negative)" fillOpacity={0.1} />
              )}
              {line && (
                <path
                  d={line}
                  fill="none"
                  stroke="var(--negative)"
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
              )}
              {steps
                .filter((step) => step.point.timestamp >= from)
                .map((step) => (
                  <circle
                    key={step.point.timestamp}
                    cx={toX(step.point.timestamp)}
                    cy={toY(uncoveredOf(step.point))}
                    r={DOT_RADIUS}
                    fill="var(--surface-primary)"
                    stroke="var(--negative)"
                    strokeWidth={2}
                  />
                ))}
              {active && (
                <g>
                  <line
                    x1={snap(toX(Math.max(active.point.timestamp, from)))}
                    x2={snap(toX(Math.max(active.point.timestamp, from)))}
                    y1={PLOT_TOP}
                    y2={PLOT_BOTTOM}
                    stroke="var(--secondary)"
                    strokeOpacity={0.6}
                    {...CRISP}
                  />
                  <circle
                    cx={toX(Math.max(active.point.timestamp, from))}
                    cy={toY(uncoveredOf(active.point))}
                    r={DOT_RADIUS + 1}
                    fill="var(--negative)"
                  />
                </g>
              )}
            </svg>
            {active && (
              <PointTooltip
                point={active.point}
                x={toX(Math.max(active.point.timestamp, from))}
                width={width}
                isPresent={active.point === present}
                undatedReports={history.undatedReports}
              />
            )}
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-secondary text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 bg-negative" />
          Lines not covered by the audits published by then
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border-2 border-negative" />
          Audit counted or code changed
        </span>
      </div>
    </div>
  )
}

/** What the chart draws. */
function uncoveredOf(point: AuditsCoverageHistoryPoint): number {
  return point.lines.uncovered
}

interface Step {
  point: AuditsCoverageHistoryPoint
  start: number
  end: number
}

function getSteps(
  points: AuditsCoverageHistoryPoint[],
  from: number,
  to: number,
): Step[] {
  const steps: Step[] = []
  for (const [i, point] of points.entries()) {
    const next = points[i + 1]
    const start = Math.max(point.timestamp, from)
    const end = Math.min(next?.timestamp ?? to, to)
    if (start > to || end < from || end < start) continue
    steps.push({ point, start, end })
  }
  return steps
}

/** Centers a 1px line on a device pixel, so it is not blurred over two. */
function snap(x: number) {
  return Math.round(x) + 0.5
}

const TOOLTIP_WIDTH = 288

function PointTooltip({
  point,
  x,
  width,
  isPresent,
  undatedReports,
}: {
  point: AuditsCoverageHistoryPoint
  x: number
  width: number
  isPresent: boolean
  undatedReports: AuditsUnitReportRef[]
}) {
  // Below the plot, centered on the point and kept inside the chart's width.
  const left = Math.min(
    Math.max(x - TOOLTIP_WIDTH / 2, 0),
    Math.max(0, width - TOOLTIP_WIDTH),
  )
  return (
    <div
      className={cn(
        tooltipContentVariants(),
        'pointer-events-none absolute flex flex-col gap-1 text-left',
      )}
      style={{ left, top: HEIGHT + 4, width: TOOLTIP_WIDTH }}
    >
      <span className="text-secondary text-xs">
        {isPresent ? 'Now' : formatTimestamp(point.timestamp)}
      </span>
      <span className="font-bold">
        {formatInteger(point.lines.uncovered)} uncovered{' '}
        {pluralize(point.lines.uncovered, 'line')}
      </span>
      <span className="text-secondary text-xs">
        {point.percent.toFixed(1)}% of {formatInteger(point.lines.total)} lines
        covered in {point.contracts} {pluralize(point.contracts, 'contract')}
        {point.withoutSource > 0 &&
          `, ${point.withoutSource} without verified source`}
      </span>
      {point.reports.length > 0 && (
        <ReportList label="Audits counted from here" reports={point.reports} />
      )}
      {point.changes.length > 0 && (
        <div className="flex flex-col">
          <span className="text-secondary text-xs">Code changed</span>
          {point.changes.map((change) => (
            <span key={change.address} className="text-xs">
              {change.name} {CHANGE_LABELS[change.kind]}
            </span>
          ))}
        </div>
      )}
      {isPresent && undatedReports.length > 0 && (
        <ReportList
          label="Undated audits, counted only now"
          reports={undatedReports}
        />
      )}
    </div>
  )
}

const CHANGE_LABELS = {
  added: 'joined the perimeter',
  removed: 'left the perimeter',
  upgraded: 'was upgraded',
} as const

function ReportList({
  label,
  reports,
}: {
  label: string
  reports: AuditsUnitReportRef[]
}) {
  return (
    <div className="flex flex-col">
      <span className="text-secondary text-xs">{label}</span>
      {reports.map((report) => (
        <span key={report.id} className="text-xs">
          {report.auditor} · {report.title}
        </span>
      ))}
    </div>
  )
}
