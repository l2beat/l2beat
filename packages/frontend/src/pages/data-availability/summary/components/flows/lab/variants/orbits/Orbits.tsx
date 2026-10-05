import { formatInteger, formatSeconds, pluralize } from '@l2beat/shared-pure'
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatPosted } from '../../../formatPosted'
import { LabLegend, LegendValue } from '../../BlobLab'
import {
  prepareCanvas,
  useAnimationFrame,
  useElementSize,
  useImages,
  useIsOnScreen,
  usePrefersReducedMotion,
  useThemeTokens,
} from '../../hooks'
import { LabTooltip, PosterTooltipContent } from '../../LabTooltip'
import { DAY_SECONDS, type LabData, type LabPoster } from '../../model'
import { getPlaybackStart } from '../../schedule'
import type { LabVariantProps } from '../../types'
import { createPaint } from './drawing'
import { drawOrrery, scatterStars } from './drawOrrery'
import { EthereumTooltipContent } from './EthereumTooltipContent'
import { createNameStates } from './names'
import { layoutOrrery, placePlanets } from './orrery'
import {
  advanceSimulation,
  createSimulation,
  type Simulation,
} from './simulation'
import { usePointedPlanet } from './usePointedPlanet'

/** Playback seconds per second */
const SPEEDS = [10, 60] as const
type Speed = (typeof SPEEDS)[number]

/**
 * Cadence becomes orbit. Every project circles Ethereum once per batch it
 * sends, so the ones that post often circle close and fast and the rare ones
 * crawl round far out. Each batch falls into Ethereum as a string of blobs.
 */
export function Orbits({
  data,
  batches,
  highlighted,
  onSelect,
}: LabVariantProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)
  const { width, height } = useElementSize(boxRef)
  const tokens = useThemeTokens()
  const reducedMotion = usePrefersReducedMotion()
  const isOnScreen = useIsOnScreen(boxRef)
  const isMoving = isOnScreen && !reducedMotion && width > 0
  const [speed, setSpeed] = useState<Speed>(10)
  const [hasDrawn, setHasDrawn] = useState(false)

  const orrery = useMemo(
    () => layoutOrrery(data.posters, width, height),
    [data.posters, width, height],
  )
  const stars = useMemo(() => scatterStars(orrery), [orrery])
  const images = useImages([
    data.daLayer.iconUrl,
    ...data.posters.map((p) => p.iconUrl),
  ])
  const paint = useMemo(
    () => createPaint(data, tokens, images),
    [data, tokens, images],
  )
  useRedrawOnFontsLoaded()

  const sim = useSimulation(data.posters.length, speed)
  const names = useMemo(
    () => createNameStates(data.posters.length),
    [data.posters.length],
  )
  const highlightedIndex = findPosterIndex(data.posters, highlighted)
  const description = useMemo(() => describeOrrery(data), [data])
  const pointer = usePointedPlanet({
    orrery,
    sim,
    posters: data.posters,
    highlighted,
    onSelect,
    canvasRef,
  })
  const showClock = useClockText(clockRef, data.range[0])

  const renderFrame = (dt: number) => {
    showClock(sim.clock)
    const canvas = canvasRef.current
    if (!canvas || width === 0 || height === 0) return
    const ctx = prepareCanvas(canvas, width, height)
    if (!ctx) return
    advanceSimulation(sim, dt, {
      batches,
      orrery,
      speed,
      isHovering: pointer.hoveredRef.current !== undefined,
    })
    const placed = placePlanets(orrery, sim.clock)
    pointer.track(placed)
    drawOrrery(ctx, {
      orrery,
      sim,
      paint,
      stars,
      placed,
      focus: {
        hovered: pointer.hoveredRef.current,
        highlighted: highlightedIndex,
      },
      isMoving,
      names,
      dt,
    })
    if (!hasDrawn) setHasDrawn(true)
  }

  useAnimationFrame(renderFrame, isMoving)
  // a still picture, redrawn whenever what it shows changes
  useEffect(() => {
    if (!isMoving) renderFrame(0)
  })

  const hoveredPoster =
    pointer.hovered !== undefined ? data.posters[pointer.hovered] : undefined

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="font-medium text-label-value-13 text-secondary">
            {reducedMotion ? 'As of' : 'Replaying'}{' '}
            {/* written by the frame loop, not by React */}
            <span ref={clockRef} className="text-primary tabular-nums" />
          </div>
          <div className="font-medium text-label-value-12 text-secondary/80">
            Batch times estimated from hourly totals
          </div>
        </div>
        {!reducedMotion && <SpeedToggle speed={speed} onChange={setSpeed} />}
      </div>
      <div
        ref={boxRef}
        className="relative aspect-[4/3] w-full md:aspect-[16/10] lg:aspect-auto lg:min-h-0 lg:flex-1"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={description}
          className={cn(
            'absolute inset-0 size-full transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
            // it settles in once there is something drawn on it
            !hasDrawn && 'scale-[0.97] opacity-0',
          )}
          {...pointer.handlers}
        />
        {pointer.pointedAt && (hoveredPoster || pointer.isSunHovered) && (
          <LabTooltip
            x={pointer.pointedAt.x}
            y={pointer.pointedAt.y}
            containerWidth={width}
          >
            {hoveredPoster ? (
              <PosterTooltipContent
                poster={hoveredPoster}
                footer={describeHour(hoveredPoster, sim.clock)}
              />
            ) : (
              <EthereumTooltipContent data={data} />
            )}
          </LabTooltip>
        )}
      </div>
      <LabLegend
        items={[
          <>
            1 orbit ≈ <LegendValue>time between batches</LegendValue>
          </>,
          <>
            Planet size ≈ <LegendValue>data posted</LegendValue>
          </>,
          ...(reducedMotion
            ? []
            : [
                <>
                  1 dot ≈ <LegendValue>1 blob</LegendValue>
                </>,
                <>
                  1 second ≈{' '}
                  <LegendValue>
                    {formatSeconds(speed, { fullUnit: true })}
                  </LegendValue>
                </>,
              ]),
        ]}
      />
    </div>
  )
}

function SpeedToggle({
  speed,
  onChange,
}: {
  speed: Speed
  onChange: (speed: Speed) => void
}) {
  return (
    <div
      role="group"
      aria-label="Playback speed"
      className="flex shrink-0 gap-0.5 rounded-full bg-surface-secondary p-0.5 dark:bg-header-secondary"
    >
      {SPEEDS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === speed}
          aria-label={`${option} times real time`}
          onClick={() => onChange(option)}
          className={cn(
            'rounded-full px-2.5 py-1 font-bold text-label-value-12 tabular-nums transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            option === speed
              ? 'bg-surface-primary text-primary shadow-sm'
              : 'text-secondary hover:text-primary',
          )}
        >
          {option}×
        </button>
      ))}
    </div>
  )
}

/** One simulation for the life of the drawing, so a resize does not restart it */
function useSimulation(posterCount: number, speed: number): Simulation {
  const ref = useRef<Simulation>(undefined)
  if (!ref.current || ref.current.firedAt.length !== posterCount) {
    ref.current = createSimulation(posterCount, getPlaybackStart(), speed)
  }
  return ref.current
}

/**
 * Shows the replayed time in the element. It changes every few frames, too
 * often to render React for, so the text is set on the element directly,
 * and only when the minute shown changes.
 */
function useClockText(
  clockRef: RefObject<HTMLSpanElement | null>,
  dayStart: number,
) {
  const shown = useRef('')
  return (clock: number) => {
    const text = formatReplayTime(dayStart, clock)
    if (!clockRef.current || text === shown.current) return
    shown.current = text
    clockRef.current.textContent = text
  }
}

/** Canvas text is drawn in whatever font has loaded, so draw again once Roboto has */
function useRedrawOnFontsLoaded() {
  const [, setLoaded] = useState(false)
  useEffect(() => {
    let cancelled = false
    void document.fonts?.ready.then(() => {
      if (!cancelled) setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])
}

function findPosterIndex(posters: LabPoster[], id: string | undefined) {
  const index = posters.findIndex((p) => p.id === id)
  return index === -1 ? undefined : index
}

/** "Oct 4, 11:42 UTC": the replayed day, at the time playback has reached */
function formatReplayTime(dayStart: number, clock: number): string {
  const date = new Date((dayStart + secondsIntoDay(clock)) * 1000)
  const day = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
  const time = formatTimeOfDay(date.getUTCHours(), date.getUTCMinutes())
  return `${day}, ${time} UTC`
}

/**
 * What the poster really posted in the hour being replayed. Batch times are
 * made up from these hourly totals, so they are the record to show.
 */
function describeHour(poster: LabPoster, clock: number): string {
  const hourSeconds = DAY_SECONDS / poster.blobsHourly.length
  const hour = Math.floor(secondsIntoDay(clock) / hourSeconds)
  const blobs = Math.round(poster.blobsHourly[hour] ?? 0)
  const from = formatTimeOfDay(Math.floor((hour * hourSeconds) / 3600), 0)
  const to = formatTimeOfDay(
    Math.floor(((hour + 1) * hourSeconds) / 3600) % 24,
    0,
  )
  const amount =
    blobs === 0
      ? 'No blobs'
      : `${formatInteger(blobs)} ${pluralize(blobs, 'blob')}`
  return `${amount} from ${from} to ${to} UTC`
}

/** The playback clock runs on past the day's end, as the day loops */
function secondsIntoDay(clock: number) {
  return ((clock % DAY_SECONDS) + DAY_SECONDS) % DAY_SECONDS
}

function formatTimeOfDay(hours: number, minutes: number) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function describeOrrery(data: LabData): string {
  const byCadence = data.posters.toSorted(
    (a, b) => a.cadence.interval - b.cadence.interval,
  )
  const quickest = byCadence[0]
  const slowest = byCadence.at(-1)
  const largest = data.posters[0]
  if (!quickest || !slowest || !largest) {
    return 'Ethereum, with no projects posting blobs to it'
  }
  return (
    `${data.posters.length} projects circle Ethereum, each once per batch of blobs it sends. ` +
    `${quickest.name} sends one most often, every ${formatSeconds(quickest.cadence.interval)}, and circles closest; ` +
    `${slowest.name} sends one every ${formatSeconds(slowest.cadence.interval)}, farthest out. ` +
    `${largest.name} posted the most, ${formatPosted(largest.posted)}, ${formatPercent(largest.share)} of the day.`
  )
}
