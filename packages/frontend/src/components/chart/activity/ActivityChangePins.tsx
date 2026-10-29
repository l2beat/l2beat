import { formatActivityCount, UnixTime } from '@l2beat/shared-pure'
import { useMemo, useRef } from 'react'
import { usePlotArea, useXAxisScale, useYAxisScale } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import { DialogTitle } from '~/components/core/Dialog'
import { Drawer, DrawerContent, DrawerHeader } from '~/components/core/Drawer'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
} from '~/components/core/Popover'
import { CustomLink } from '~/components/link/CustomLink'
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

const PIN_RADIUS = 12
const PIN_OFFSET = 30
const MIN_PIN_SPACING = 28
const PLOT_WIDTH_PER_PIN = 160
const MAX_PINS_DESKTOP = 6
const MAX_PINS_MOBILE = 3
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
  events: ActivityChangeEvent[]
  x: number
  y: number
  pointY: number
  isDrop: boolean
}

/**
 * Logo pins drawn inside the chart's SVG, plus the popover (desktop) or
 * drawer (mobile) they open. The open event lives in the parent so a click
 * on the chart can open it too.
 */
export function ActivityChangePins({
  events,
  data,
  chartData,
  chartMeta,
  isDesktop,
  openKey,
  setOpenKey,
}: {
  events: ActivityChangeEvent[]
  data: ActivityChangeEventsData | undefined
  chartData: Record<string, number | null>[] | undefined
  chartMeta: ChartMeta
  isDesktop: boolean
  openKey: string | undefined
  setOpenKey: (key: string | undefined) => void
}) {
  const xScale = useXAxisScale()
  const yScale = useYAxisScale()
  const plotArea = usePlotArea()
  const layerRef = useRef<SVGGElement>(null)
  // Keyboard users get focus moved into the details and back to the pin;
  // mouse users keep the chart under the pointer.
  const openedWithKeyboardRef = useRef(false)
  const lastOpenedPinKeyRef = useRef<string>(undefined)

  const locate = useMemo(() => {
    const byTimestamp = new Map(chartData?.map((p) => [p.timestamp, p]))
    return (event: ActivityChangeEvent) => {
      const value = byTimestamp.get(event.timestamp)?.[event.category] ?? null
      const x = xScale?.(event.timestamp)
      const y = value === null ? undefined : yScale?.(value)
      if (x === undefined || y === undefined) return undefined
      return { x, y }
    }
  }, [chartData, xScale, yScale])

  const groups = useMemo(() => {
    if (!plotArea || !xScale || !yScale) return []
    const budget = Math.min(
      isDesktop ? MAX_PINS_DESKTOP : MAX_PINS_MOBILE,
      Math.max(1, Math.floor(plotArea.width / PLOT_WIDTH_PER_PIN)),
    )
    const located = [...events]
      .sort((a, b) => b.score - a.score)
      .flatMap((event) => {
        const point = locate(event)
        return point ? [{ event, ...point }] : []
      })

    // Merge first, then spend the budget, so overlapping events share one
    // pin instead of using up slots. Strongest first, so a merged pin sits
    // on its biggest change and the groups come out in ranking order.
    const result: PinGroup[] = []
    for (const { event, x, y } of located) {
      const isDrop = event.observed < event.baseline
      const near = result.find((g) => Math.abs(g.x - x) < MIN_PIN_SPACING)
      if (near) {
        near.events.push(event)
        continue
      }
      const top = plotArea.y + PIN_RADIUS + 1
      const bottom = plotArea.y + plotArea.height - PIN_RADIUS - 1
      const pinY = isDrop
        ? Math.min(y + PIN_OFFSET, bottom)
        : Math.max(y - PIN_OFFSET, top)
      result.push({ events: [event], x, y: pinY, pointY: y, isDrop })
    }
    // A pin only carries events strong enough to have earned a pin of their
    // own; on long ranges one pin's width spans weeks of weaker changes.
    const shown = result.slice(0, budget)
    const minScore = shown.at(-1)?.events[0]?.score ?? 0
    for (const group of shown) {
      group.events = group.events
        .filter((e, i) => i === 0 || e.score >= minScore)
        .slice(0, MAX_EVENTS_PER_PIN)
    }
    return shown.sort((a, b) => a.x - b.x)
  }, [events, plotArea, xScale, yScale, locate, isDesktop])

  const openGroupIndex = groups.findIndex((g) =>
    g.events.some((e) => getEventKey(e) === openKey),
  )
  const openEvent = events.find((e) => getEventKey(e) === openKey)
  const openGroup: PinGroup | undefined =
    groups[openGroupIndex] ??
    (openEvent && {
      events: [openEvent],
      ...(() => {
        const point = locate(openEvent)
        return {
          x: point?.x ?? 0,
          y: point?.y ?? 0,
          pointY: point?.y ?? 0,
        }
      })(),
      isDrop: openEvent.observed < openEvent.baseline,
    })

  const anchor = useMemo(
    () => ({
      current: {
        getBoundingClientRect: () => {
          const svg = layerRef.current?.ownerSVGElement
          const rect = svg?.getBoundingClientRect()
          const x = (rect?.left ?? 0) + (openGroup?.x ?? 0)
          const y = (rect?.top ?? 0) + (openGroup?.y ?? 0)
          return DOMRect.fromRect({
            x: x - PIN_RADIUS,
            y: y - PIN_RADIUS,
            width: PIN_RADIUS * 2,
            height: PIN_RADIUS * 2,
          })
        },
      },
    }),
    [openGroup?.x, openGroup?.y],
  )

  const step = (direction: -1 | 1) => {
    const next = groups[openGroupIndex + direction]?.events[0]
    if (!next) return
    lastOpenedPinKeyRef.current = getEventKey(next)
    setOpenKey(getEventKey(next))
  }

  const details = openGroup && (
    <ChangeDetails
      group={openGroup}
      projects={data?.projects ?? {}}
      chartMeta={chartMeta}
      position={
        openGroupIndex === -1
          ? undefined
          : { index: openGroupIndex, count: groups.length }
      }
      onStep={step}
      onClose={() => setOpenKey(undefined)}
      inDrawer={!isDesktop}
    />
  )

  return (
    <g ref={layerRef} data-role="activity-change-pins">
      {groups.map((group) => (
        <Pin
          key={getEventKey(group.events[0] as ActivityChangeEvent)}
          group={group}
          projects={data?.projects ?? {}}
          chartMeta={chartMeta}
          isOpen={group === groups[openGroupIndex]}
          onOpen={(withKeyboard) => {
            const key = getEventKey(group.events[0] as ActivityChangeEvent)
            openedWithKeyboardRef.current = withKeyboard
            lastOpenedPinKeyRef.current = key
            setOpenKey(key)
          }}
        />
      ))}
      {isDesktop ? (
        <Popover
          open={!!openGroup}
          onOpenChange={(open) => !open && setOpenKey(undefined)}
        >
          <PopoverAnchor virtualRef={anchor} />
          {/* Without a portal the content would render inside the chart's SVG */}
          <PopoverPortal>
            <PopoverContent
              side="right"
              align="start"
              sideOffset={10}
              collisionPadding={16}
              aria-label="Change breakdown"
              className="max-h-(--radix-popover-content-available-height) w-[360px] overflow-y-auto p-4"
              onOpenAutoFocus={(e) => {
                if (!openedWithKeyboardRef.current) e.preventDefault()
              }}
              onCloseAutoFocus={(e) => {
                e.preventDefault()
                if (!openedWithKeyboardRef.current) return
                openedWithKeyboardRef.current = false
                layerRef.current
                  ?.querySelector<SVGGElement>(
                    `[data-key="${lastOpenedPinKeyRef.current}"]`,
                  )
                  ?.focus()
              }}
            >
              {details}
            </PopoverContent>
          </PopoverPortal>
        </Popover>
      ) : (
        <Drawer
          open={!!openGroup}
          onOpenChange={(open) => !open && setOpenKey(undefined)}
        >
          <DrawerContent
            className="max-h-[85dvh]"
            contentClassName="flex min-h-0 flex-col pb-0"
          >
            <DrawerHeader className="min-h-0 overflow-y-auto pb-8">
              {details}
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )}
    </g>
  )
}

function Pin({
  group,
  projects,
  chartMeta,
  isOpen,
  onOpen,
}: {
  group: PinGroup
  projects: Record<string, ActivityChangeProject>
  chartMeta: ChartMeta
  isOpen: boolean
  onOpen: (withKeyboard: boolean) => void
}) {
  const event = group.events[0] as ActivityChangeEvent
  const color = chartMeta[event.category]?.color
  const leader = getLeader(event)
  const logos = (
    leader
      ? [leader.projectId]
      : event.contributors
          .filter(([, delta]) => isSameDirection(delta, event))
          .slice(0, 2)
          .map(([id]) => id)
  ).flatMap((id) => (projects[id] ? [projects[id]] : []))
  const clipId = `change-pin-clip-${event.timestamp}-${event.category}`
  const stemFrom = group.isDrop ? group.y - PIN_RADIUS : group.y + PIN_RADIUS

  return (
    <g
      role="button"
      tabIndex={0}
      data-key={getEventKey(event)}
      aria-label={[...group.events]
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((e) => getEventLabel(e, projects))
        .join('; ')}
      className="cursor-pointer outline-none [&:focus-visible>circle.ring]:stroke-[3.5px]"
      onClick={(e) => {
        e.stopPropagation()
        onOpen(false)
      }}
      onMouseMove={(e) => {
        // The pin covers several days; show the tooltip for the pin's own
        // day by replaying the move at the pin's x for Recharts to read.
        e.stopPropagation()
        const svg = e.currentTarget.ownerSVGElement
        if (!svg) return
        svg.dispatchEvent(
          new MouseEvent('mousemove', {
            bubbles: true,
            clientX: svg.getBoundingClientRect().left + group.x,
            clientY: e.clientY,
          }),
        )
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(true)
        }
      }}
    >
      <line
        x1={group.x}
        x2={group.x}
        y1={group.pointY}
        y2={stemFrom}
        strokeDasharray="2 2"
        strokeWidth={1.5}
        style={{ stroke: color }}
      />
      <circle cx={group.x} cy={group.pointY} r={3} style={{ fill: color }} />
      <defs>
        <clipPath id={clipId}>
          <circle cx={0} cy={0} r={PIN_RADIUS - 3} />
        </clipPath>
        <clipPath id={`${clipId}-small`}>
          <circle cx={0} cy={0} r={6.5} />
        </clipPath>
      </defs>
      <circle
        className="ring"
        cx={group.x}
        cy={group.y}
        r={PIN_RADIUS + (isOpen ? 2 : 0)}
        strokeWidth={2}
        style={{ stroke: color, fill: 'var(--surface-primary)' }}
      />
      {logos.map((project, i) => {
        const size = logos.length > 1 ? 13 : (PIN_RADIUS - 3) * 2
        const dx = logos.length > 1 ? (i === 0 ? -4 : 4) : 0
        return (
          <g
            key={project.slug}
            transform={`translate(${group.x + dx} ${group.y})`}
            clipPath={`url(#${clipId}${logos.length > 1 ? '-small' : ''})`}
          >
            <image
              href={project.iconUrl}
              x={-size / 2}
              y={-size / 2}
              width={size}
              height={size}
            />
          </g>
        )
      })}
      {group.events.length > 1 && (
        <g
          transform={`translate(${group.x + PIN_RADIUS - 1} ${group.y - PIN_RADIUS + 1})`}
        >
          <circle r={7} className="fill-brand" />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-primary-invert font-bold text-[9px]"
          >
            {group.events.length}
          </text>
        </g>
      )}
    </g>
  )
}

function ChangeDetails({
  group,
  projects,
  chartMeta,
  position,
  onStep,
  onClose,
  inDrawer,
}: {
  group: PinGroup
  projects: Record<string, ActivityChangeProject>
  chartMeta: ChartMeta
  position: { index: number; count: number } | undefined
  onStep: (direction: -1 | 1) => void
  onClose: () => void
  inDrawer: boolean
}) {
  const first = group.events[0] as ActivityChangeEvent
  const events = [...group.events].sort((a, b) => a.timestamp - b.timestamp)
  const timestamps = events.map((e) => e.timestamp)
  const from = Math.min(...timestamps)
  const to = Math.max(...timestamps)
  // A merged pin can hold events days apart; then each one shows its date.
  const isOneDay = from === to
  const title = (
    <span className="font-medium text-label-value-14 text-secondary">
      {isOneDay
        ? formatRange(from, from + UnixTime.DAY)
        : `${events.length} changes`}
    </span>
  )
  const compareSlugs = [
    ...new Set(
      group.events.flatMap((event) =>
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
      <p className="mt-3 text-2xs text-secondary leading-snug">
        Each project is compared with its own previous {BASELINE_DAYS} days.
        This shows where activity changed, not why.
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 border-divider border-t pt-3">
        {position && position.count > 1 ? (
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
  label: React.ReactNode
  color: string | undefined
}) {
  const change = event.observed - event.baseline
  const unit = event.metric === 'uops' ? 'UOPS' : 'TPS'
  return (
    <div className="flex flex-col py-3 first:pt-2">
      {showDate && (
        <span className="mb-1 text-2xs text-secondary">
          {formatRange(event.timestamp, event.timestamp + UnixTime.DAY)}
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
                    href={`/scaling/projects/${project.slug}#activity`}
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
  label: React.ReactNode
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
  label: React.ReactNode
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
  children: React.ReactNode
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

/** One line for the hover tooltip under a category that changed that day. */
export function ActivityChangeTooltipLine({
  event,
  projects,
  showHint,
}: {
  event: ActivityChangeEvent
  projects: Record<string, ActivityChangeProject>
  showHint: boolean
}) {
  const leader = getLeader(event)
  const project = leader && projects[leader.projectId]
  const word = event.observed < event.baseline ? 'drop' : 'rise'
  return (
    <div className="-mt-1 flex flex-col pl-5 text-2xs text-secondary">
      <span>
        {formatRelative(event)} vs {BASELINE_DAYS}-day baseline
      </span>
      {project && leader && (
        <span className="flex items-center gap-1">
          <img src={project.iconUrl} alt="" className="size-3 rounded-full" />
          <span>
            <span className="font-medium text-primary">{project.name}</span>
            {isOverWhole(leader.share)
              ? `: more than the whole ${word}`
              : `: ${Math.round(leader.share * 100)}% of the ${word}`}
          </span>
        </span>
      )}
      {showHint && <span className="text-brand">Click for the breakdown</span>}
    </div>
  )
}

/** A text list of the pins for screen readers and keyboard users. */
export function ActivityChangeEventsList({
  events,
  projects,
}: {
  events: ActivityChangeEvent[]
  projects: Record<string, ActivityChangeProject>
}) {
  if (events.length === 0) return null
  return (
    <ul className="sr-only" aria-label="Notable changes (automated)">
      {[...events]
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((event) => (
          <li key={getEventKey(event)}>{getEventLabel(event, projects)}</li>
        ))}
    </ul>
  )
}

function getEventLabel(
  event: ActivityChangeEvent,
  projects: Record<string, ActivityChangeProject>,
) {
  const leader = getLeader(event)
  const name = leader && (projects[leader.projectId]?.name ?? leader.projectId)
  const date = formatRange(
    event.timestamp,
    event.timestamp + UnixTime.DAY,
  ).replace(/\s+/g, ' ')
  const direction = event.observed < event.baseline ? 'fell' : 'rose'
  return `${date}: ${CATEGORY_LABELS[event.category]} ${direction} ${formatRelative(event)} vs ${BASELINE_DAYS}-day baseline${name ? `, mostly ${name}` : ''}`
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

function formatSignedRate(delta: number) {
  const sign = delta > 0 ? '+' : delta < 0 ? '−' : ''
  return `${sign}${formatActivityCount(Math.abs(countPerSecond(delta)))}`
}
