import { formatActivityCount, UnixTime } from '@l2beat/shared-pure'
import {
  type ComponentProps,
  Fragment,
  type ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartTooltipTitle } from '~/components/core/chart/ChartTooltip'
import { DialogTitle } from '~/components/core/Dialog'
import { Drawer, DrawerContent, DrawerHeader } from '~/components/core/Drawer'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '~/components/core/Popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TooltipFootnote } from '~/components/core/tooltip/TooltipParts'
import { CustomLink } from '~/components/link/CustomLink'
import { useCanHover } from '~/hooks/useCanHover'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { ChevronIcon } from '~/icons/Chevron'
import { CloseIcon } from '~/icons/Close'
import { buildCompareUrl } from '~/pages/layer2s/compare/utils/buildCompareUrl'
import { createDefaultChartConfig } from '~/pages/layer2s/compare/utils/compareChartState'
import { COMPARE_PAGE_PATH } from '~/pages/layer2s/compare/utils/getCompareEntryUrl'
import type {
  ActivityChangeEvent,
  ActivityChangeEventsData,
  ActivityChangeMetric,
  ActivityChangeProject,
} from '~/server/features/layer2s/activity/getActivityChangeEvents'
import {
  ACTIVITY_CHANGE_CATEGORIES,
  BASELINE_DAYS,
} from '~/server/features/layer2s/activity/utils/activityChangeConstants'
import { countPerSecond } from '~/server/features/layer2s/activity/utils/countPerSecond'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'

const CATEGORY_LABELS: Record<ActivityChangeEvent['category'], string> = {
  rollups: 'Rollups',
  validiumsAndOptimiums: 'Validiums & Optimiums',
  others: 'Others',
}

const PIN_SIZE = 20
/**
 * The chart's top margin with pins: their own row above the top y axis
 * label, so they cover neither the plot nor the label.
 */
export const CHANGE_PINS_TOP_MARGIN = PIN_SIZE + 16
/** The chart's bottom margin, which holds the x axis labels. */
const X_AXIS_HEIGHT = 25
const MIN_PIN_SPACING = PIN_SIZE + 6
const PLOT_WIDTH_PER_PIN = 160
const MAX_PINS_HOVER = 6
const MAX_PINS_TOUCH = 3
const MAX_EVENTS_PER_PIN = 3
// A pin names one project only when it explains at least half the change.
const LEADER_MIN_SHARE = 0.5

export function getEventKey(event: ActivityChangeEvent) {
  return `${event.timestamp}:${event.category}`
}

export function getVisibleChangeEvents(
  data: ActivityChangeEventsData | undefined,
  metric: ActivityChangeMetric,
  dataKeys: string[],
): ActivityChangeEvent[] {
  return (data?.events ?? []).filter(
    (e) =>
      e.metric === metric &&
      dataKeys.includes(e.category) &&
      ACTIVITY_CHANGE_CATEGORIES.includes(e.category),
  )
}

interface PinGroup {
  key: string
  /** Strongest first. */
  events: ActivityChangeEvent[]
  x: number
}

/**
 * Logo pins along the top edge of the chart, in its top margin, at
 * the strongest changes. A pin opens the breakdown: a popover where the
 * pointer can hover, a drawer on touch. Rendered inside the chart's plot box,
 * whose width the x axis spans like the milestones under it.
 */
export function ActivityChangePins({
  events,
  projects,
  chartData,
  chartMeta,
}: {
  events: ActivityChangeEvent[]
  projects: Record<string, ActivityChangeProject>
  chartData: { timestamp: number }[] | undefined
  chartMeta: ChartMeta
}) {
  const [openKey, setOpenKey] = useState<string>()
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver({ ref })
  // Undefined while hydrating: render what the server did, the popover.
  const canHover = useCanHover() !== false

  const groups = useMemo(
    () => getPinGroups(events, chartData, width, canHover),
    [events, chartData, width, canHover],
  )
  const openIndex = groups.findIndex((g) => g.key === openKey)
  const openGroup = groups[openIndex]

  const details = (group: PinGroup, index: number) => (
    <ChangeDetails
      events={group.events}
      projects={projects}
      chartMeta={chartMeta}
      position={{ index, count: groups.length }}
      onStep={(direction) => setOpenKey(groups[index + direction]?.key)}
      onClose={() => setOpenKey(undefined)}
      inDrawer={!canHover}
    />
  )

  return (
    <div
      ref={ref}
      data-role="activity-change-pins"
      className="pointer-events-none absolute inset-0 z-10"
    >
      {groups.map((group, index) => {
        const pin = (
          <Pin
            group={group}
            projects={projects}
            chartMeta={chartMeta}
            isOpen={group.key === openKey}
            stemHeight={Math.max(0, (height ?? 0) - PIN_SIZE - X_AXIS_HEIGHT)}
            onOpen={() =>
              setOpenKey(group.key === openKey ? undefined : group.key)
            }
          />
        )
        if (!canHover) return <Fragment key={group.key}>{pin}</Fragment>
        return (
          <Popover
            key={group.key}
            open={group.key === openKey}
            onOpenChange={(open) => !open && setOpenKey(undefined)}
          >
            <PinTooltip group={group} projects={projects} hidden={!!openKey}>
              <PopoverAnchor asChild>{pin}</PopoverAnchor>
            </PinTooltip>
            <PopoverContent
              side="bottom"
              align="center"
              sideOffset={6}
              collisionPadding={16}
              aria-label="Change breakdown"
              className="max-h-(--radix-popover-content-available-height) w-[360px] overflow-y-auto p-4"
            >
              {details(group, index)}
            </PopoverContent>
          </Popover>
        )
      })}
      {!canHover && (
        <Drawer
          open={!!openGroup}
          onOpenChange={(open) => !open && setOpenKey(undefined)}
        >
          <DrawerContent
            className="max-h-[85dvh]"
            contentClassName="flex min-h-0 flex-col pb-0"
          >
            <DrawerHeader className="min-h-0 overflow-y-auto pb-8">
              {openGroup && details(openGroup, openIndex)}
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}

/**
 * Peaks only, strongest first. Pins closer than a pin's width merge before
 * the budget is spent, so overlapping changes share one pin instead of using
 * up slots.
 */
function getPinGroups(
  events: ActivityChangeEvent[],
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
  isOpen,
  stemHeight,
  onOpen,
  onClick,
  ...props
}: ComponentProps<'button'> & {
  group: PinGroup
  projects: Record<string, ActivityChangeProject>
  chartMeta: ChartMeta
  isOpen: boolean
  stemHeight: number
  onOpen: () => void
}) {
  const event = group.events[0] as ActivityChangeEvent
  const color = chartMeta[event.category]?.color
  const logos = getPinProjects(event, projects)

  return (
    <button
      // The popover anchor and the tooltip trigger pass their props and ref here.
      {...props}
      type="button"
      aria-label={[...group.events]
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((e) => getEventLabel(e, projects))
        .join('; ')}
      aria-expanded={isOpen}
      onClick={(e) => {
        onClick?.(e)
        onOpen()
      }}
      className="group/pin pointer-events-auto absolute top-0 cursor-pointer outline-none"
      style={{ left: group.x - PIN_SIZE / 2, width: PIN_SIZE }}
    >
      <span
        className={cn(
          'relative flex items-center justify-center rounded-full border-2 bg-surface-primary',
          'group-focus-visible/pin:ring-2 group-focus-visible/pin:ring-brand',
          isOpen && 'ring-2 ring-primary/20',
        )}
        style={{ width: PIN_SIZE, height: PIN_SIZE, borderColor: color }}
      >
        {logos.length === 1 ? (
          <img
            src={logos[0]?.iconUrl}
            alt=""
            className="size-3.5 rounded-full"
          />
        ) : logos.length > 1 ? (
          <span className="-space-x-1 flex">
            {logos.map((project) => (
              <img
                key={project.slug}
                src={project.iconUrl}
                alt=""
                className="size-2.5 rounded-full"
              />
            ))}
          </span>
        ) : (
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        )}
        {group.events.length > 1 && (
          <span className="-top-1.5 -right-2 absolute flex size-3.5 items-center justify-center rounded-full bg-brand font-bold text-[9px] text-primary-invert">
            {group.events.length}
          </span>
        )}
      </span>
      {/* Down to the x axis, so the pin reads against its day. */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute left-1/2 w-0 border-l border-dashed opacity-0 transition-opacity',
          'group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100',
          isOpen && 'opacity-100',
        )}
        style={{ top: PIN_SIZE, height: stemHeight, borderColor: color }}
      />
    </button>
  )
}

function PinTooltip({
  group,
  projects,
  hidden,
  children,
}: {
  group: PinGroup
  projects: Record<string, ActivityChangeProject>
  hidden: boolean
  children: ReactNode
}) {
  const events = [...group.events].sort((a, b) => a.timestamp - b.timestamp)
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {/* The breakdown replaces the tooltip while it is open. */}
      {!hidden && (
        <TooltipContent side="bottom" className="max-w-64">
          <div className="flex flex-col gap-2">
            {events.map((event) => (
              <div key={getEventKey(event)} className="flex flex-col gap-0.5">
                <ChartTooltipTitle className="whitespace-nowrap">
                  {formatDay(event.timestamp)}
                </ChartTooltipTitle>
                <span className="font-medium text-label-value-14">
                  {CATEGORY_LABELS[event.category]} {formatRelative(event)}
                </span>
                <ActivityChangeSummary event={event} projects={projects} />
              </div>
            ))}
            <TooltipFootnote>Click for the breakdown</TooltipFootnote>
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  )
}

function ChangeDetails({
  events: groupEvents,
  projects,
  chartMeta,
  position,
  onStep,
  onClose,
  inDrawer,
}: {
  events: ActivityChangeEvent[]
  projects: Record<string, ActivityChangeProject>
  chartMeta: ChartMeta
  position: { index: number; count: number }
  onStep: (direction: -1 | 1) => void
  onClose: () => void
  inDrawer: boolean
}) {
  const first = groupEvents[0] as ActivityChangeEvent
  const events = [...groupEvents].sort((a, b) => a.timestamp - b.timestamp)
  const timestamps = events.map((e) => e.timestamp)
  const from = Math.min(...timestamps)
  const to = Math.max(...timestamps)
  // A merged pin can hold changes days apart; then each one shows its date.
  const isOneDay = from === to
  const title = (
    <span className="font-medium text-label-value-14 text-secondary">
      {isOneDay ? formatDay(from) : `${events.length} changes`}
    </span>
  )
  const compareSlugs = [
    ...new Set(
      groupEvents.flatMap((event) =>
        event.contributors
          .filter(([, delta]) => isSameDirection(delta, event))
          .flatMap(([id]) => (projects[id] ? [projects[id].slug] : [])),
      ),
    ),
  ]
  const compareUrl = buildCompareUrl(COMPARE_PAGE_PATH, {
    projects: compareSlugs,
    range: {
      from: from - 45 * UnixTime.DAY,
      to: to + 45 * UnixTime.DAY,
    },
    charts: [
      {
        ...createDefaultChartConfig('activity'),
        activity: { unit: first.metric },
      },
    ],
  })

  return (
    <div className="flex flex-col text-left">
      <div className="flex items-start justify-between gap-2">
        {inDrawer ? <DialogTitle asChild>{title}</DialogTitle> : title}
        <IconButton label="Close" onClick={onClose}>
          <CloseIcon className="size-2.5" />
        </IconButton>
      </div>
      <div className="flex flex-col divide-y divide-divider">
        {events.map((event) => (
          <EventDetails
            key={getEventKey(event)}
            event={event}
            showDate={!isOneDay}
            projects={projects}
            label={chartMeta[event.category]?.label}
            color={chartMeta[event.category]?.color}
          />
        ))}
      </div>
      <TooltipFootnote className="mt-3">
        Pins mark days when a category moved far outside its usual range. Each
        project is compared with its median day over the previous{' '}
        {BASELINE_DAYS} days; the baseline is the sum of those medians. This
        shows where activity changed, not why.
      </TooltipFootnote>
      <div className="mt-3 flex items-center justify-between gap-2 border-divider border-t pt-3">
        {position.count > 1 ? (
          <div className="flex items-center gap-1.5">
            <IconButton
              label="Previous change"
              onClick={() => onStep(-1)}
              disabled={position.index === 0}
            >
              <ChevronIcon className="size-3 rotate-90" />
            </IconButton>
            <span className="text-2xs text-secondary tabular-nums">
              {position.index + 1} of {position.count}
            </span>
            <IconButton
              label="Next change"
              onClick={() => onStep(1)}
              disabled={position.index === position.count - 1}
            >
              <ChevronIcon className="-rotate-90 size-3" />
            </IconButton>
          </div>
        ) : (
          <span />
        )}
        {compareSlugs.length > 0 && (
          <CustomLink href={compareUrl} className="text-xs">
            Compare these projects →
          </CustomLink>
        )}
      </div>
    </div>
  )
}

function EventDetails({
  event,
  showDate,
  projects,
  label,
  color,
}: {
  event: ActivityChangeEvent
  showDate: boolean
  projects: Record<string, ActivityChangeProject>
  label: ReactNode
  color: string | undefined
}) {
  const change = event.observed - event.baseline
  const unit = event.metric === 'uops' ? 'UOPS' : 'TPS'
  return (
    <div className="flex flex-col py-3 first:pt-2">
      {showDate && (
        <span className="mb-1 text-2xs text-secondary">
          {formatDay(event.timestamp)}
        </span>
      )}
      <div className="flex items-center gap-1.5">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-bold text-label-value-15">{label}</span>
        <span className="font-medium text-label-value-14 tabular-nums">
          {formatRelative(event)}
        </span>
      </div>
      <p className="mt-1.5 text-paragraph-14 leading-snug">
        <EventSentence event={event} projects={projects} label={label} />
      </p>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        <Figure
          label="That day"
          value={`${formatActivityCount(countPerSecond(event.observed))} ${unit}`}
        />
        <Figure
          label={`${BASELINE_DAYS}-day baseline`}
          value={formatActivityCount(countPerSecond(event.baseline))}
        />
        <Figure label="Change" value={formatSignedRate(change)} />
      </dl>
      <ul className="mt-3 flex flex-col">
        {event.contributors.map(([projectId, delta]) => {
          const project = projects[projectId]
          return (
            <ContributorRow
              key={projectId}
              label={
                project ? (
                  <a
                    href={`/layer2s/projects/${project.slug}#activity`}
                    className="flex min-w-0 items-center gap-1.5 hover:underline"
                  >
                    <img
                      src={project.iconUrl}
                      alt=""
                      className="size-4 shrink-0 rounded-full"
                    />
                    <span className="truncate">{project.name}</span>
                  </a>
                ) : (
                  projectId
                )
              }
              delta={delta}
              share={formatShare(delta, event)}
            />
          )
        })}
        {event.restCount > 0 && (
          <ContributorRow
            label={
              <span className="text-secondary">
                {event.restCount} other projects
              </span>
            }
            delta={event.restDelta}
            share={undefined}
          />
        )}
      </ul>
    </div>
  )
}

function EventSentence({
  event,
  projects,
  label,
}: {
  event: ActivityChangeEvent
  projects: Record<string, ActivityChangeProject>
  label: ReactNode
}) {
  const isDrop = event.observed < event.baseline
  const word = isDrop ? 'drop' : 'rise'
  const leader = getLeader(event)
  const leaderName =
    leader && (projects[leader.projectId]?.name ?? leader.projectId)
  const ratio = event.baseline > 0 ? event.observed / event.baseline : undefined
  const relative =
    ratio === undefined ? (
      <>rose from no activity in the previous {BASELINE_DAYS} days</>
    ) : ratio >= 3 ? (
      <>
        ran at <strong>{Math.round(ratio)}×</strong> its {BASELINE_DAYS}-day
        baseline
      </>
    ) : (
      <>
        ran{' '}
        <strong>
          {Math.round(Math.abs(ratio - 1) * 100)}% {isDrop ? 'below' : 'above'}
        </strong>{' '}
        its {BASELINE_DAYS}-day baseline
      </>
    )

  return (
    <>
      {label} {relative}.{' '}
      {leader ? (
        isOverWhole(leader.share) ? (
          <>
            <strong>{leaderName}</strong> alone moved more than the whole
            category; other projects moved the other way.
          </>
        ) : leader.share >= 0.95 ? (
          <>
            <strong>{leaderName}</strong> accounts for almost all of the {word}.
          </>
        ) : (
          <>
            <strong>{leaderName}</strong> accounts for{' '}
            <strong>{Math.round(leader.share * 100)}%</strong> of the {word}.
          </>
        )
      ) : (
        <>
          The {word} is spread across{' '}
          {event.contributors.length + event.restCount} projects.
        </>
      )}
    </>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-2xs text-secondary">{label}</dt>
      <dd className="font-bold text-label-value-14 tabular-nums">{value}</dd>
    </div>
  )
}

function ContributorRow({
  label,
  delta,
  share,
}: {
  label: ReactNode
  delta: number
  share: string | undefined
}) {
  return (
    <li className="flex items-center justify-between gap-2 border-divider border-b py-1.5 text-label-value-13 last:border-b-0">
      <div className="min-w-0">{label}</div>
      <span className="flex shrink-0 gap-2 whitespace-nowrap tabular-nums">
        {formatSignedRate(delta)}
        <span className="w-9 text-right text-secondary">{share ?? ''}</span>
      </span>
    </li>
  )
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-secondary hover:bg-surface-tertiary',
        'disabled:cursor-not-allowed disabled:opacity-40',
      )}
    >
      {children}
    </button>
  )
}

/** Who is behind a change and how it compares with the usual level. */
function ActivityChangeSummary({
  event,
  projects,
}: {
  event: ActivityChangeEvent
  projects: Record<string, ActivityChangeProject>
}) {
  const leader = getLeader(event)
  const project = leader && projects[leader.projectId]
  const word = event.observed < event.baseline ? 'drop' : 'rise'
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
      <span>({formatVsBaseline(event)})</span>
    </span>
  )
}

/** The summary under a category that changed, in the chart's hover tooltip. */
export function ActivityChangeTooltipLine({
  event,
  projects,
}: {
  event: ActivityChangeEvent
  projects: Record<string, ActivityChangeProject>
}) {
  return (
    <div className="-mt-1 pl-5">
      <ActivityChangeSummary event={event} projects={projects} />
    </div>
  )
}

/** A text list of the pins for screen readers. */
export function ActivityChangeEventsList({
  events,
  projects,
}: {
  events: ActivityChangeEvent[]
  projects: Record<string, ActivityChangeProject>
}) {
  const peaks = events
    .filter((e) => e.isPeak)
    .sort((a, b) => a.timestamp - b.timestamp)
  if (peaks.length === 0) return null
  return (
    <ul className="sr-only" aria-label="Notable changes (automated)">
      {peaks.map((event) => (
        <li key={getEventKey(event)}>{getEventLabel(event, projects)}</li>
      ))}
    </ul>
  )
}

function getPinProjects(
  event: ActivityChangeEvent,
  projects: Record<string, ActivityChangeProject>,
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
  event: ActivityChangeEvent,
  projects: Record<string, ActivityChangeProject>,
) {
  const leader = getLeader(event)
  const name = leader && (projects[leader.projectId]?.name ?? leader.projectId)
  const direction = event.observed < event.baseline ? 'fell' : 'rose'
  return `${formatDay(event.timestamp).replace(/\s+/g, ' ')}: ${CATEGORY_LABELS[event.category]} ${direction} ${formatRelative(event)} vs ${BASELINE_DAYS}-day baseline${name ? `, mostly ${name}` : ''}`
}

function getLeader(event: ActivityChangeEvent) {
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

function isSameDirection(delta: number, event: ActivityChangeEvent) {
  return Math.sign(delta) === Math.sign(event.observed - event.baseline)
}

function formatDay(timestamp: number) {
  return formatRange(timestamp, timestamp + UnixTime.DAY)
}

function formatShare(delta: number, event: ActivityChangeEvent) {
  if (!isSameDirection(delta, event)) return undefined
  const share = delta / (event.observed - event.baseline)
  if (isOverWhole(share)) return '>100%'
  if (share < 0.01) return '<1%'
  return `${Math.round(share * 100)}%`
}

function formatRelative(event: ActivityChangeEvent) {
  if (event.baseline <= 0) return '▲ from zero'
  const ratio = event.observed / event.baseline
  if (ratio >= 3) return `▲ ${Math.round(ratio)}×`
  const pct = Math.round(Math.abs(ratio - 1) * 100)
  return ratio >= 1 ? `▲ ${pct}%` : `▼ ${pct}%`
}

function formatVsBaseline(event: ActivityChangeEvent) {
  const period = `the previous ${BASELINE_DAYS} days`
  if (event.baseline <= 0) return `up from no activity in ${period}`
  const ratio = event.observed / event.baseline
  if (ratio >= 3) return `${Math.round(ratio)}× its usual level over ${period}`
  const pct = Math.round(Math.abs(ratio - 1) * 100)
  return `${pct}% ${ratio >= 1 ? 'above' : 'below'} its usual level over ${period}`
}

function formatSignedRate(delta: number) {
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : ''
  return `${sign}${formatActivityCount(Math.abs(countPerSecond(delta)))}`
}
