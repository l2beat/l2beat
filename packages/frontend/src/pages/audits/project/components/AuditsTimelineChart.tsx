import { useMemo, useRef, useState } from 'react'
import {
  getLabeledTicks,
  getTimeScale,
  getTimeTicks,
} from '~/components/audits/auditsTimeline'
import { Checkbox } from '~/components/core/Checkbox'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { InfoIcon } from '~/icons/Info'
import type {
  AuditsOtherReport,
  AuditsProjectReport,
  AuditsProjectTimeline,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { type ChartRange, optionToRange } from '~/utils/range/range'

const HEIGHT = 150
const PAD_X = 12
// Audits sit in the lane above the axis, critical upgrades in the lane below.
const AXIS_Y = 78
const AUDIT_Y = 40
const CHANGE_Y = 116
const LABEL_Y = 146
const MARKER_RADIUS = 8
const LAUNCH_RADIUS = 6
const CRISP = { shapeRendering: 'crispEdges' } as const

type AuditMarkerKind = 'own' | 'stack' | 'other'

interface TimelineAudit {
  kind: AuditMarkerKind
  report: AuditsProjectReport | AuditsOtherReport
}

interface Props {
  timeline: AuditsProjectTimeline
}

/**
 * The project's life on one axis: its launch, its audit reports (own and
 * stack) above the axis and the critical upgrades of its contracts below it.
 * Other matched reports, of libraries and unrelated projects, are shown on
 * demand. MAX reaches back to the launch or the first audit, whichever came
 * first.
 */
export function AuditsTimelineChart({ timeline }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref })
  const [withOther, setWithOther] = useState(false)
  const [range, setRange] = useState<ChartRange>(() => optionToRange('1y'))
  const from = range[0] ?? timeline.from
  const to = range[1]
  const inRange = (timestamp: number) => timestamp >= from && timestamp <= to

  const toX = useMemo(
    () => getTimeScale(from, to, PAD_X, (width ?? 0) - PAD_X),
    [from, to, width],
  )
  const audits: TimelineAudit[] = [
    ...timeline.audits.map((report) => ({
      kind: report.origin === 'own' ? ('own' as const) : ('stack' as const),
      report,
    })),
    ...(withOther
      ? timeline.otherAudits.map((report) => ({
          kind: 'other' as const,
          report,
        }))
      : []),
  ].filter((audit) => inRange(audit.report.timestamp))
  const changes = timeline.criticalChanges.filter(inRange)
  const ticks = useMemo(() => getTimeTicks(from, to), [from, to])
  const labeled = getLabeledTicks(ticks, toX, 48)
  const launch =
    timeline.launch !== null && inRange(timeline.launch)
      ? timeline.launch
      : null

  return (
    <div className="flex flex-col gap-3">
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={[from, to]} />
        <ChartRangeControls
          name="audits-timeline"
          value={range}
          setValue={setRange}
          options={[
            { value: '1y', label: '1Y' },
            { value: 'max', label: 'MAX' },
          ]}
        />
      </ChartControlsWrapper>
      <div ref={ref} className="relative w-full" style={{ height: HEIGHT }}>
        {width !== undefined && width > 2 * PAD_X && (
          <>
            <svg
              className="absolute inset-0"
              width={width}
              height={HEIGHT}
              role="img"
              aria-label="Timeline of the project's audits and critical upgrades"
            >
              {ticks.map((tick) => (
                <g key={tick.ordinal}>
                  <line
                    x1={snap(toX(tick.timestamp))}
                    x2={snap(toX(tick.timestamp))}
                    y1={AUDIT_Y - MARKER_RADIUS}
                    y2={LABEL_Y - 14}
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
              <line
                x1={PAD_X}
                x2={width - PAD_X}
                y1={snap(AXIS_Y)}
                y2={snap(AXIS_Y)}
                stroke="var(--secondary)"
                strokeOpacity={0.8}
                {...CRISP}
              />
              {audits.map(({ report }) => (
                <line
                  key={report.id}
                  x1={snap(toX(report.timestamp))}
                  x2={snap(toX(report.timestamp))}
                  y1={AUDIT_Y + MARKER_RADIUS}
                  y2={AXIS_Y}
                  stroke="var(--positive)"
                  strokeOpacity={0.6}
                  {...CRISP}
                />
              ))}
              {changes.map((change) => (
                <line
                  key={change}
                  x1={snap(toX(change))}
                  x2={snap(toX(change))}
                  y1={AXIS_Y}
                  y2={CHANGE_Y - MARKER_RADIUS}
                  stroke="var(--negative)"
                  strokeOpacity={0.6}
                  {...CRISP}
                />
              ))}
              {launch !== null && (
                <g>
                  <circle
                    cx={snap(toX(launch))}
                    cy={snap(AXIS_Y)}
                    r={LAUNCH_RADIUS}
                    fill="var(--surface-primary)"
                    stroke="var(--secondary)"
                    strokeWidth={2}
                  />
                  <text
                    x={toX(launch)}
                    y={AUDIT_Y - MARKER_RADIUS - 6}
                    fontSize={11}
                    fill="var(--secondary)"
                    textAnchor={toX(launch) < 40 ? 'start' : 'middle'}
                  >
                    Launch
                  </text>
                </g>
              )}
            </svg>
            {audits.map(({ kind, report }) => (
              <Marker
                key={report.id}
                x={toX(report.timestamp)}
                y={AUDIT_Y}
                side="top"
                href={report.url}
                tooltip={<AuditTooltip kind={kind} report={report} />}
              >
                <AuditMarker kind={kind} />
              </Marker>
            ))}
            {changes.map((change) => (
              <Marker
                key={change}
                x={toX(change)}
                y={CHANGE_Y}
                side="bottom"
                tooltip={
                  <ChangeTooltip
                    change={change}
                    href={timeline.ossificationHref}
                  />
                }
              >
                <ChangeMarker />
              </Marker>
            ))}
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Legend timeline={timeline} withOther={withOther} />
        {timeline.otherAudits.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              name="audits-other"
              checked={withOther}
              onCheckedChange={(checked) => setWithOther(checked === true)}
            >
              Other matched audits
            </Checkbox>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                Also show the library audits and the reports of other projects
                that matched some of the deployed code. They do not count as the
                project's audits.
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}

/** Centers a 1px line on a device pixel, so it is not blurred over two. */
function snap(x: number) {
  return Math.round(x) + 0.5
}

/**
 * A marker centered on (x, y). Positioned without transforms: a transformed
 * ancestor would become the containing block of the fixed tooltip, which is
 * why the content goes through a portal too.
 */
function Marker({
  x,
  y,
  side,
  href,
  tooltip,
  children,
}: {
  x: number
  y: number
  side: 'top' | 'bottom'
  href?: string
  tooltip: React.ReactNode
  children: React.ReactNode
}) {
  const className = 'absolute flex size-6 items-center justify-center'
  const style = { left: x - 12, top: y - 12 }
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            style={style}
          >
            {children}
          </a>
        ) : (
          <div className={cn(className, 'cursor-default')} style={style}>
            {children}
          </div>
        )}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side={side} className="max-w-72">
          {tooltip}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

function AuditMarker({
  kind,
  className,
}: {
  kind: AuditMarkerKind
  className?: string
}) {
  return (
    <div
      className={cn(
        'size-4 rounded-full border-2 border-positive',
        kind === 'other' ? 'bg-surface-primary' : 'bg-positive',
        className,
      )}
    />
  )
}

function ChangeMarker({ className }: { className?: string }) {
  return (
    <div
      className={cn('size-3.5 rotate-45 rounded-[2px] bg-negative', className)}
    />
  )
}

function AuditTooltip({
  kind,
  report,
}: {
  kind: AuditMarkerKind
  report: AuditsProjectReport | AuditsOtherReport
}) {
  return (
    <div className="flex flex-col text-left">
      <span className="text-secondary text-xs">
        {formatTimestamp(report.timestamp)} · {report.auditor}
      </span>
      <span className="font-bold">{report.title}</span>
      {kind === 'stack' && (
        <span className="text-secondary text-xs">
          Audit of {report.collectionName}, the project's stack.
        </span>
      )}
      {kind === 'other' && (
        <span className="text-secondary text-xs">
          Matched audit of {report.collectionName}, not counted as a project
          audit.
        </span>
      )}
      {report.url && (
        <span className="text-secondary text-xs">
          Click to open the report.
        </span>
      )}
    </div>
  )
}

function ChangeTooltip({
  change,
  href,
}: {
  change: number
  href: string | undefined
}) {
  return (
    <div className="flex flex-col gap-1 text-left">
      <span className="font-bold">Critical upgrade</span>
      <span className="text-secondary text-xs">
        {formatTimestamp(change, { mode: 'datetime' })}
      </span>
      {href && (
        <CustomLink href={href} className="text-xs">
          See the project's ossification
        </CustomLink>
      )}
    </div>
  )
}

function Legend({
  timeline,
  withOther,
}: {
  timeline: AuditsProjectTimeline
  withOther: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-secondary text-xs">
      <span className="flex items-center gap-1.5">
        <AuditMarker kind="own" className="size-3 border" />
        Project audit
      </span>
      {withOther && (
        <span className="flex items-center gap-1.5">
          <AuditMarker kind="other" className="size-3 border" />
          Other matched audit
        </span>
      )}
      {timeline.hasOssification ? (
        <span className="flex items-center gap-1.5">
          <ChangeMarker className="size-2.5" />
          Critical upgrade
        </span>
      ) : (
        <span>Critical upgrades are not tracked for this project.</span>
      )}
      {timeline.launch !== null && (
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full border-2 border-secondary" />
          Launch
        </span>
      )}
    </div>
  )
}
