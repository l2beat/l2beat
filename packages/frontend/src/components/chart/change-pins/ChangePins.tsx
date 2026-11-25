import { UnixTime } from '@l2beat/shared-pure'
import { type ComponentProps, type ReactNode, useMemo, useRef } from 'react'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartTooltipTitle } from '~/components/core/chart/ChartTooltip'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { useCanHover } from '~/hooks/useCanHover'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { CHANGE_CATEGORIES } from '~/server/features/utils/changeEventConstants'
import type {
  ChangeEvent,
  ChangeEventsData,
  ChangeProject,
} from '~/server/features/utils/changeEvents'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'
import type { ChangeFormat } from './formats'

const CATEGORY_LABELS: Record<ChangeEvent['category'], string> = {
  rollups: 'Rollups',
  validiumsAndOptimiums: 'Validiums & Optimiums',
  others: 'Others',
}

const PIN_SIZE = 16
/**
 * The chart's top margin with pins: their own row above the top y axis
 * label, so they cover neither the plot nor the label.
 */
export const CHANGE_PINS_TOP_MARGIN = PIN_SIZE + 14
/** The chart's bottom margin, which holds the x axis labels. */
const X_AXIS_HEIGHT = 25
// How far each stacked logo sits from the one before it.
const LOGO_STEP = 11
const MIN_PIN_SPACING = getPinWidth(2) + 6
const PLOT_WIDTH_PER_PIN = 160
const MAX_PINS_HOVER = 6
const MAX_PINS_TOUCH = 3
const MAX_EVENTS_PER_PIN = 3
// A pin names one project only when it explains at least half the change.
const LEADER_MIN_SHARE = 0.5
// The breakdown lists a project only when it drove a tenth of the change.
const DRIVER_MIN_SHARE = 0.1

export function getEventKey(event: ChangeEvent) {
  return `${event.timestamp}:${event.category}`
}

export function getVisibleChangeEvents<M extends string>(
  data: ChangeEventsData<M> | undefined,
  metric: M,
  dataKeys: string[],
): ChangeEvent<M>[] {
  return (data?.events ?? []).filter(
    (e) =>
      e.metric === metric &&
      dataKeys.includes(e.category) &&
      CHANGE_CATEGORIES.includes(e.category),
  )
}

interface PinGroup {
  key: string
  /** Strongest first. */
  events: ChangeEvent[]
  x: number
}

/**
 * Logo pins along the top edge of the chart, in its top margin, at the
 * strongest changes. Each pin's tooltip is the change's breakdown; on touch a
 * tap opens it. Rendered inside the chart's plot box, whose width the x axis
 * spans like the milestones under it.
 */
export function ChangePins({
  events,
  projects,
  chartData,
  chartMeta,
  format,
}: {
  events: ChangeEvent[]
  projects: Record<string, ChangeProject>
  chartData: { timestamp: number }[] | undefined
  chartMeta: ChartMeta
  format: ChangeFormat
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver({ ref })
  // Undefined while hydrating: render what the server did, as for a mouse.
  const canHover = useCanHover() !== false

  const groups = useMemo(
    () => getPinGroups(events, chartData, width, canHover),
    [events, chartData, width, canHover],
  )

  return (
    <div
      ref={ref}
      data-role="change-pins"
      className="pointer-events-none absolute inset-0 z-10"
    >
      {groups.map((group) => (
        <Tooltip key={group.key} delayDuration={0}>
          <TooltipTrigger asChild>
            <Pin
              group={group}
              projects={projects}
              chartMeta={chartMeta}
              format={format}
              stemHeight={Math.max(0, (height ?? 0) - PIN_SIZE - X_AXIS_HEIGHT)}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-[328px]">
            <ChangeBreakdown
              events={group.events}
              projects={projects}
              chartMeta={chartMeta}
              format={format}
            />
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

/**
 * Peaks only, strongest first. Pins closer than a pin's width merge before
 * the budget is spent, so overlapping changes share one pin instead of using
 * up slots.
 */
function getPinGroups(
  events: ChangeEvent[],
  chartData: { timestamp: number }[] | undefined,
  width: number | undefined,
  canHover: boolean,
): PinGroup[] {
  if (!chartData || chartData.length < 2 || !width) return []
  const indexByTimestamp = new Map(chartData.map((p, i) => [p.timestamp, i]))
  const budget = Math.min(
    canHover ? MAX_PINS_HOVER : MAX_PINS_TOUCH,
    Math.max(1, Math.floor(width / PLOT_WIDTH_PER_PIN)),
  )

  const result: PinGroup[] = []
  const peaks = events.filter((e) => e.isPeak).sort((a, b) => b.score - a.score)
  for (const event of peaks) {
    const index = indexByTimestamp.get(event.timestamp)
    if (index === undefined) continue
    const x = (index / (chartData.length - 1)) * width
    const near = result.find((g) => Math.abs(g.x - x) < MIN_PIN_SPACING)
    if (near) {
      near.events.push(event)
      continue
    }
    result.push({ key: getEventKey(event), events: [event], x })
  }

  // A pin only carries changes strong enough to have earned a pin of their
  // own; on long ranges one pin's width spans weeks of weaker changes.
  const shown = result.slice(0, budget)
  const minScore = shown.at(-1)?.events[0]?.score ?? 0
  for (const group of shown) {
    group.events = group.events
      .filter((e, i) => i === 0 || e.score >= minScore)
      .slice(0, MAX_EVENTS_PER_PIN)
  }
  return shown.sort((a, b) => a.x - b.x)
}

function Pin({
  group,
  projects,
  chartMeta,
  format,
  stemHeight,
  ...props
}: ComponentProps<'button'> & {
  group: PinGroup
  projects: Record<string, ChangeProject>
  chartMeta: ChartMeta
  format: ChangeFormat
  stemHeight: number
}) {
  const event = group.events[0] as ChangeEvent
  const color = chartMeta[event.category]?.color
  const logos = getPinProjects(event, projects)
  const width = getPinWidth(logos.length)

  return (
    <button
      // The tooltip trigger passes its props, ref and open state here.
      {...props}
      type="button"
      aria-label={[...group.events]
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((e) => getEventLabel(e, projects, format))
        .join('; ')}
      className="group/pin pointer-events-auto absolute top-0 cursor-pointer outline-none"
      style={{ left: group.x - width / 2, width }}
    >
      {/* Down to the x axis, so the pin stands on its day. */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute left-1/2 w-0 border-l border-dashed opacity-30 transition-opacity',
          'group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100 group-data-[state=open]/pin:opacity-100',
        )}
        style={{ top: PIN_SIZE, height: stemHeight, borderColor: color }}
      />
      {/* Context for the chart, not an alert: quiet until pointed at. The
          logos overlap like an avatar stack when there are two. */}
      <span
        className={cn(
          'relative flex items-center rounded-full opacity-60 saturate-50 transition-[opacity,filter]',
          'group-hover/pin:opacity-100 group-hover/pin:saturate-100',
          'group-focus-visible/pin:opacity-100 group-focus-visible/pin:ring-2 group-focus-visible/pin:ring-brand group-focus-visible/pin:saturate-100',
          'group-data-[state=open]/pin:opacity-100 group-data-[state=open]/pin:saturate-100',
        )}
        style={{ width, height: PIN_SIZE }}
      >
        {logos.length > 0 ? (
          logos.map((project, i) => (
            <img
              key={project.slug}
              src={project.iconUrl}
              alt=""
              // A thin outline keeps dark logos visible on a dark chart.
              className="relative size-4 shrink-0 rounded-full bg-surface-primary ring-1 ring-divider"
              style={{ marginLeft: i > 0 ? LOGO_STEP - PIN_SIZE : 0 }}
            />
          ))
        ) : (
          <span
            className="mx-auto size-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        {group.events.length > 1 && (
          <span className="-top-1 -right-1.5 absolute flex size-3 items-center justify-center rounded-full bg-surface-secondary font-bold text-[8px] text-secondary">
            {group.events.length}
          </span>
        )}
      </span>
    </button>
  )
}

/** One logo, widened by a step for each logo stacked after it. */
function getPinWidth(logoCount: number) {
  return PIN_SIZE + Math.max(0, logoCount - 1) * LOGO_STEP
}

/** The date, then each change on it with the projects that drove it. */
function ChangeBreakdown({
  events: groupEvents,
  projects,
  chartMeta,
  format,
}: {
  events: ChangeEvent[]
  projects: Record<string, ChangeProject>
  chartMeta: ChartMeta
  format: ChangeFormat
}) {
  const events = [...groupEvents].sort((a, b) => a.timestamp - b.timestamp)
  const timestamps = events.map((e) => e.timestamp)
  const from = Math.min(...timestamps)
  const to = Math.max(...timestamps)
  // A merged pin can hold changes days apart; then each one shows its date.
  const isOneDay = from === to

  return (
    <div className="flex flex-col text-left">
      <ChartTooltipTitle>
        {formatRange(from, to + UnixTime.DAY)}
      </ChartTooltipTitle>
      <div className="flex flex-col divide-y divide-divider">
        {events.map((event) => (
          <EventDetails
            key={getEventKey(event)}
            event={event}
            showDate={!isOneDay}
            projects={projects}
            format={format}
            label={chartMeta[event.category]?.label}
            color={chartMeta[event.category]?.color}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * The category's change, then only the projects that drove it; the rest
 * sum into one row.
 */
function EventDetails({
  event,
  showDate,
  projects,
  format,
  label,
  color,
}: {
  event: ChangeEvent
  showDate: boolean
  projects: Record<string, ChangeProject>
  format: ChangeFormat
  label: ReactNode
  color: string | undefined
}) {
  const drivers = getDrivers(event)
  const others = event.contributors.filter((c) => !drivers.includes(c))
  const otherCount = event.restCount + others.length
  const otherDelta =
    event.restDelta + others.reduce((sum, [, delta]) => sum + delta, 0)

  return (
    <div className="flex flex-col py-2.5 first:pt-1 last:pb-0">
      {showDate && (
        <span className="mb-1 text-2xs text-secondary">
          {formatDay(event.timestamp)}
        </span>
      )}
      <div className="flex items-baseline gap-1.5">
        {/* As wide as the project icons, so the name lines up with theirs. */}
        <span className="flex w-4 shrink-0 justify-center self-center">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
        </span>
        <span className="font-bold text-label-value-15">{label}</span>
        <span
          className={cn(
            'font-medium text-label-value-14 tabular-nums',
            getChangeColor(event),
          )}
        >
          {formatRelative(event)}
        </span>
      </div>
      <p className="mt-1 pl-5.5 text-label-value-13 text-secondary tabular-nums">
        {format.levels(event)}
      </p>
      {/* One grid for all rows, so the values line up and the share sits
          right after them, as wide as its widest entry. */}
      <ul className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-2">
        {drivers.map(([projectId, delta]) => {
          const project = projects[projectId]
          return (
            <ContributorRow
              key={projectId}
              label={
                project ? (
                  <a
                    href={`/layer2s/projects/${project.slug}#${format.section}`}
                    className="flex min-w-0 items-baseline gap-1.5 hover:underline"
                  >
                    <img
                      src={project.iconUrl}
                      alt=""
                      className="size-4 shrink-0 self-center rounded-full"
                    />
                    <span className="truncate">{project.name}</span>
                  </a>
                ) : (
                  projectId
                )
              }
              delta={format.delta(delta)}
              share={formatShare(delta, event)}
            />
          )
        })}
        {otherCount > 0 && (
          <ContributorRow
            label={
              <span className="pl-5.5 text-secondary">
                {drivers.length === 0
                  ? `Spread across ${otherCount} projects`
                  : `${otherCount} other ${otherCount === 1 ? 'project' : 'projects'}`}
              </span>
            }
            delta={format.delta(otherDelta)}
            share={undefined}
            muted
          />
        )}
      </ul>
    </div>
  )
}

function ContributorRow({
  label,
  delta,
  share,
  muted,
}: {
  label: ReactNode
  delta: string
  share: string | undefined
  /** The leftover row, quieter than the projects that drove the change. */
  muted?: boolean
}) {
  return (
    <li className="col-span-3 grid grid-cols-subgrid items-baseline py-0.5 text-label-value-13">
      <div className="min-w-0">{label}</div>
      <span
        className={cn(
          'whitespace-nowrap text-right tabular-nums',
          muted ? 'text-secondary' : 'font-medium',
        )}
      >
        {delta}
      </span>
      <span className="whitespace-nowrap text-right text-2xs text-secondary tabular-nums">
        {share ?? ''}
      </span>
    </li>
  )
}

/** Who is behind a change and how it compares with the usual level. */
function ChangeSummary({
  event,
  projects,
  format,
}: {
  event: ChangeEvent
  projects: Record<string, ChangeProject>
  format: ChangeFormat
}) {
  const leader = getLeader(event)
  const project = leader && projects[leader.projectId]
  const word = getChangeWord(event)
  return (
    <span className="flex flex-col gap-0.5 text-paragraph-12 text-secondary">
      {project && leader ? (
        <span className="flex items-center gap-1">
          <img
            src={project.iconUrl}
            alt=""
            className="size-3 shrink-0 rounded-full"
          />
          <span>
            <span className="font-medium text-primary">{project.name}</span>
            {isOverWhole(leader.share)
              ? ` alone moved more than the whole ${word}`
              : ` accounts for ${Math.round(leader.share * 100)}% of the ${word}`}
          </span>
        </span>
      ) : (
        <span>
          The {word} is spread across{' '}
          {event.contributors.length + event.restCount} projects
        </span>
      )}
      <span>({format.vsBaseline(event)})</span>
    </span>
  )
}

/** The summary under a category that changed, in the chart's hover tooltip. */
export function ChangeTooltipLine({
  event,
  projects,
  format,
}: {
  event: ChangeEvent
  projects: Record<string, ChangeProject>
  format: ChangeFormat
}) {
  return (
    <div className="-mt-1 pl-5">
      <ChangeSummary event={event} projects={projects} format={format} />
    </div>
  )
}

/** A text list of the pins for screen readers. */
export function ChangeEventsList({
  events,
  projects,
  format,
}: {
  events: ChangeEvent[]
  projects: Record<string, ChangeProject>
  format: ChangeFormat
}) {
  const peaks = events
    .filter((e) => e.isPeak)
    .sort((a, b) => a.timestamp - b.timestamp)
  if (peaks.length === 0) return null
  return (
    <ul className="sr-only" aria-label="Notable changes (automated)">
      {peaks.map((event) => (
        <li key={getEventKey(event)}>
          {getEventLabel(event, projects, format)}
        </li>
      ))}
    </ul>
  )
}

function getPinProjects(
  event: ChangeEvent,
  projects: Record<string, ChangeProject>,
) {
  const leader = getLeader(event)
  const ids = leader
    ? [leader.projectId]
    : event.contributors
        .filter(([, delta]) => isSameDirection(delta, event))
        .slice(0, 2)
        .map(([id]) => id)
  return ids.flatMap((id) => (projects[id] ? [projects[id]] : []))
}

function getEventLabel(
  event: ChangeEvent,
  projects: Record<string, ChangeProject>,
  format: ChangeFormat,
) {
  const leader = getLeader(event)
  const name = leader && (projects[leader.projectId]?.name ?? leader.projectId)
  const date = formatDay(event.timestamp).replace(/\s+/g, ' ')
  return `${date}: ${CATEGORY_LABELS[event.category]} ${format.vsBaseline(event)}${name ? `, mostly ${name}` : ''}`
}

function getLeader(event: ChangeEvent) {
  const change = event.observed - event.baseline
  const top = event.contributors[0]
  if (!top || change === 0) return undefined
  const share = top[1] / change
  return share >= LEADER_MIN_SHARE ? { projectId: top[0], share } : undefined
}

/** Above 100% by more than rounding: others moved the opposite way. */
function isOverWhole(share: number) {
  return share > 1.005
}

function getChangeWord(event: ChangeEvent) {
  return event.observed < event.baseline ? 'drop' : 'rise'
}

/** The listed projects that moved with the change and drove enough of it. */
function getDrivers(event: ChangeEvent) {
  const change = event.observed - event.baseline
  return event.contributors.filter(
    ([, delta]) => change !== 0 && delta / change >= DRIVER_MIN_SHARE,
  )
}

function isSameDirection(delta: number, event: ChangeEvent) {
  return Math.sign(delta) === Math.sign(event.observed - event.baseline)
}

function formatDay(timestamp: number) {
  return formatRange(timestamp, timestamp + UnixTime.DAY)
}

/** A driver's part of the change, e.g. "91% of rise". */
function formatShare(delta: number, event: ChangeEvent) {
  const share = delta / (event.observed - event.baseline)
  const value = isOverWhole(share) ? '>100%' : `${Math.round(share * 100)}%`
  return `${value} of ${getChangeWord(event)}`
}

/**
 * Signed like the tables' changes, "+8%" or "−8%". Past 3× a multiple reads
 * better than a four-digit percentage, and only a rise gets there.
 */
function formatRelative(event: ChangeEvent) {
  if (event.baseline <= 0) return 'up from zero'
  const ratio = event.observed / event.baseline
  if (ratio >= 3) return `${Math.round(ratio)}×`
  const pct = Math.round(Math.abs(ratio - 1) * 100)
  if (pct === 0) return '0%'
  return `${ratio > 1 ? '+' : '−'}${pct}%`
}

/** The tables' colours: green up, red down, grey when it rounds to 0%. */
function getChangeColor(event: ChangeEvent) {
  const pct = Math.round(Math.abs(event.observed / event.baseline - 1) * 100)
  if (event.baseline > 0 && pct === 0) return 'text-secondary'
  return event.observed > event.baseline ? 'text-positive' : 'text-negative'
}
