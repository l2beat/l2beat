import { formatInteger, formatSeconds } from '@l2beat/shared-pure'
import { type PointerEvent, useMemo, useRef, useState } from 'react'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatBlobs } from '../../../daFlowsUnit'
import { formatPosted } from '../../../formatPosted'
import { LabLegend, LegendValue } from '../../BlobLab'
import {
  useElementSize,
  useIsOnScreen,
  usePrefersReducedMotion,
  useThemeTokens,
} from '../../hooks'
import { LabTooltip, PosterTooltipContent } from '../../LabTooltip'
import { DAY_SECONDS, type LabData } from '../../model'
import { getPlaybackStart } from '../../schedule'
import type { LabVariantProps } from '../../types'
import { buildFaucets, type Faucet, type FaucetSet, OTHERS_ID } from './faucets'
import { type DripHighlight, type DripLayout, TIME_SCALE } from './scene'
import { useDripScene } from './useDripScene'

/**
 * Every project is a blob of goo hanging over Ethereum. While it gathers its
 * next batch the blob swells; when the batch is sent a drop pinches off and
 * falls into Ethereum's pool. Big slow drops and quick small drips show at a
 * glance how much each project posts and how often.
 */
export function Drip({
  data,
  batches,
  highlighted,
  onSelect,
}: LabVariantProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const gooRef = useRef<HTMLDivElement>(null)
  const buoyRef = useRef<HTMLDivElement>(null)
  const size = useElementSize(boxRef)
  const onScreen = useIsOnScreen(boxRef)
  const reduced = usePrefersReducedMotion()
  const tokens = useThemeTokens()

  const isPhone = size.width > 0 && size.width < PHONE_WIDTH
  const faucetSet = useMemo(
    () =>
      buildFaucets(data, batches, isPhone ? PHONE_FAUCETS : DESKTOP_FAUCETS),
    [data, batches, isPhone],
  )
  const { faucets } = faucetSet
  const layout = useMemo(
    () =>
      size.width > 0 && size.height > 0
        ? getLayout(size.width, size.height, faucets.length)
        : undefined,
    [size.width, size.height, faucets.length],
  )
  const highlight = useMemo(
    () => toHighlight(highlighted, data, faucetSet),
    [highlighted, data, faucetSet],
  )

  const sceneRef = useDripScene({
    goo: gooRef,
    buoy: buoyRef,
    faucetSet,
    batches,
    layout,
    tokens,
    highlight,
    onScreen,
    reduced,
  })

  const [hover, setHover] = useState<Hover>()
  const lastPointer = useRef<{ x: number; y: number; time: number }>(undefined)

  const replayedHour = () => {
    const clock = sceneRef.current?.clock ?? getPlaybackStart()
    return Math.floor((clock % DAY_SECONDS) / 3600)
  }

  // a pointer dragged through the pool leaves a wake
  const stirPool = (x: number, y: number, time: number) => {
    const scene = sceneRef.current
    const last = lastPointer.current
    lastPointer.current = { x, y, time }
    if (!scene || !last || reduced) return
    const seconds = (time - last.time) / 1000
    const surface = scene.layout.poolTop + scene.wave.heightAt(x)
    if (seconds <= 0 || seconds > 0.1 || y < surface - 8 || y > surface + 28)
      return
    const speed = Math.hypot(x - last.x, y - last.y) / seconds
    scene.stir(x, Math.min(speed * 0.1, 120))
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!layout) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - box.left
    const y = event.clientY - box.top
    stirPool(x, y, event.timeStamp)
    const faucet = faucetAt(layout, x, y)
    if (faucet === undefined) {
      setHover(undefined)
      return
    }
    // the blob jiggles as the pointer reaches it
    if (hover?.faucet !== faucet) sceneRef.current?.poke(faucet, 5)
    setHover({ faucet, x, y, hour: replayedHour() })
  }

  const select = (faucet: number) => {
    const id = faucets[faucet]?.id
    if (!id) return
    sceneRef.current?.poke(faucet, 14)
    onSelect(id)
  }

  const hovered = hover ? faucets[hover.faucet] : undefined

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={boxRef}
        className={cn(
          'relative h-[30rem] select-none md:h-[34rem] lg:h-auto lg:min-h-0 lg:flex-1',
          hover && 'cursor-pointer',
        )}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          setHover(undefined)
          lastPointer.current = undefined
        }}
        onClick={(event) => {
          if (!layout) return
          const box = event.currentTarget.getBoundingClientRect()
          const faucet = faucetAt(
            layout,
            event.clientX - box.left,
            event.clientY - box.top,
          )
          if (faucet !== undefined) select(faucet)
        }}
      >
        {layout && (
          <div
            className="absolute inset-x-0 h-px bg-divider"
            style={{ top: layout.railY - 0.5 }}
          />
        )}
        <div
          ref={gooRef}
          role="img"
          aria-label={describe(data)}
          className="absolute inset-0"
        />
        {layout && (
          <>
            <PoolLabel data={data} layout={layout} />
            <div
              ref={buoyRef}
              className="pointer-events-none absolute top-0 left-0 will-change-transform"
              style={{
                transform: `translate(${layout.buoyX}px, ${layout.poolTop}px)`,
              }}
            >
              <img
                src={data.daLayer.iconUrl}
                alt=""
                className="-translate-x-1/2 -translate-y-1/2 size-6 max-w-none"
              />
            </div>
            {faucets.map((faucet, i) => (
              <FaucetButton
                key={faucet.id}
                faucet={faucet}
                x={layout.faucetXs[i] ?? 0}
                y={layout.railY}
                dimmed={highlight !== undefined && highlight.faucet !== i}
                pressed={
                  highlight?.faucet === i && highlight.posterIndex === undefined
                }
                onClick={() => select(i)}
                onFocus={() =>
                  setHover({
                    faucet: i,
                    x: layout.faucetXs[i] ?? 0,
                    y: layout.railY + layout.iconRadius,
                    hour: replayedHour(),
                  })
                }
                onBlur={() => setHover(undefined)}
              />
            ))}
          </>
        )}
        {hover && hovered && (
          <LabTooltip x={hover.x} y={hover.y} containerWidth={size.width}>
            <PosterTooltipContent
              poster={hovered.poster}
              footer={<FaucetFooter faucet={hovered} hour={hover.hour} />}
            />
          </LabTooltip>
        )}
      </div>
      <div className="mt-3">
        <LabLegend
          items={[
            <>
              1 drop ≈ <LegendValue>1 batch</LegendValue>
            </>,
            <>
              Drop size ≈ <LegendValue>blobs in the batch</LegendValue>
            </>,
            <>
              1 second ≈{' '}
              <LegendValue>
                {formatSeconds(TIME_SCALE, { fullUnit: true })}
              </LegendValue>
            </>,
            'Batch timing simulated from hourly totals',
          ]}
        />
      </div>
    </div>
  )
}

interface Hover {
  faucet: number
  /** Where the tooltip goes, inside the drawing */
  x: number
  y: number
  /** Hour of the replayed day, for the tooltip's numbers */
  hour: number
}

const PHONE_WIDTH = 560
const DESKTOP_FAUCETS = 12
const PHONE_FAUCETS = 6

function FaucetButton({
  faucet,
  x,
  y,
  dimmed,
  pressed,
  onClick,
  onFocus,
  onBlur,
}: {
  faucet: Faucet
  x: number
  y: number
  dimmed: boolean
  pressed: boolean
  onClick: () => void
  onFocus: () => void
  onBlur: () => void
}) {
  const { poster } = faucet
  return (
    <>
      <span
        className={cn(
          '-translate-x-1/2 pointer-events-none absolute font-medium text-label-value-12 text-secondary tabular-nums transition-opacity duration-300',
          dimmed && 'opacity-30',
        )}
        style={{ left: x, top: y - 34 }}
      >
        {formatPercent(poster.share)}
      </span>
      <button
        type="button"
        aria-pressed={pressed}
        aria-label={`${poster.name}: ${formatPosted(poster.posted)}, ${formatPercent(poster.share)} of the day`}
        onClick={(event) => {
          event.stopPropagation()
          onClick()
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 absolute flex size-8 items-center justify-center rounded-full transition-opacity duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          dimmed && 'opacity-30',
        )}
        style={{ left: x, top: y }}
      >
        {faucet.isOthers ? (
          <span className="flex size-6 items-center justify-center rounded-full bg-surface-primary font-bold text-[10px] text-secondary tabular-nums leading-none">
            +{faucet.members.length}
          </span>
        ) : poster.iconUrl ? (
          <img
            src={poster.iconUrl}
            alt=""
            className="size-6 rounded-full bg-surface-primary"
          />
        ) : (
          <span className="size-6 rounded-full bg-surface-primary" />
        )}
      </button>
    </>
  )
}

/** The day's total, inside the pool it was poured into */
function PoolLabel({ data, layout }: { data: LabData; layout: DripLayout }) {
  return (
    <div
      className="-translate-x-1/2 pointer-events-none absolute text-center text-pure-white"
      style={{ left: layout.buoyX, top: layout.poolTop + 34 }}
    >
      <div className="font-bold text-label-value-15">{data.daLayer.name}</div>
      <div className="mt-1.5 font-medium text-label-value-13 tabular-nums opacity-85">
        {formatPosted(data.totalPosted)} in the day
      </div>
    </div>
  )
}

/** What the tooltip adds for the faucet: the replayed hour, or who shares it */
function FaucetFooter({ faucet, hour }: { faucet: Faucet; hour: number }) {
  if (faucet.isOthers) {
    const named = faucet.members.slice(0, 3).map((p) => p.name)
    const more = faucet.members.length - named.length
    return (
      <>
        {named.join(', ')}
        {more > 0 && ` and ${more} more`}
      </>
    )
  }
  const blobs = faucet.poster.blobsHourly[hour] ?? 0
  return (
    <>
      {formatInteger(Math.round(blobs))} blobs from {formatHour(hour)} to{' '}
      {formatHour(hour + 1)} UTC
    </>
  )
}

function getLayout(
  width: number,
  height: number,
  faucetCount: number,
): DripLayout {
  const phone = width < PHONE_WIDTH
  const spacing = width / Math.max(faucetCount, 1)
  const blobRadius = Math.min(Math.max(spacing * 0.12, 4.6), 9)
  return {
    width,
    height,
    railY: phone ? 48 : 56,
    poolTop: Math.round(height * 0.7),
    poolReach: blobRadius * 3.5,
    poolLip: phone ? 7 : 9,
    faucetXs: Array.from(
      { length: faucetCount },
      (_, i) => (i + 0.5) * spacing,
    ),
    iconRadius: 12,
    blobRadius,
    nubRadius: blobRadius * 0.6,
    // between two faucets, so no drop lands on it
    buoyX: faucetCount % 2 === 1 ? width / 2 + spacing / 2 : width / 2,
    buoyRadius: phone ? 13 : 15,
  }
}

/** The faucet whose icon or hanging blob is under the pointer */
function faucetAt(layout: DripLayout, x: number, y: number) {
  const spacing = layout.width / layout.faucetXs.length
  const bottom = layout.railY + layout.iconRadius + layout.blobRadius * 6 + 16
  if (y < layout.railY - 24 || y > bottom) return undefined
  const index = Math.floor(x / spacing)
  return index >= 0 && index < layout.faucetXs.length ? index : undefined
}

function toHighlight(
  highlighted: string | undefined,
  data: LabData,
  { faucets, faucetOfPoster }: FaucetSet,
): DripHighlight | undefined {
  if (highlighted === undefined) return undefined
  if (highlighted === OTHERS_ID) {
    const faucet = faucets.findIndex((f) => f.isOthers)
    return faucet >= 0 ? { faucet } : undefined
  }
  const posterIndex = data.posters.findIndex((p) => p.id === highlighted)
  if (posterIndex < 0) return undefined
  const faucet = faucetOfPoster[posterIndex] ?? -1
  return faucets[faucet]?.isOthers ? { faucet, posterIndex } : { faucet }
}

function describe(data: LabData): string {
  const [first, second, third] = data.posters
  if (!first) return 'No blobs were posted in the day.'
  const parts = [
    `Blobs dripping into Ethereum, replayed from the past day: ${formatPosted(data.totalPosted)} from ${data.posters.length} projects.`,
    `${first.name} posts the most, ${formatPercent(first.share)} of it, about ${formatBlobs(first.cadence.blobsPerBatch)} every ${formatSeconds(first.cadence.interval)}.`,
  ]
  if (second) {
    parts.push(
      `${second.name} follows with ${formatPercent(second.share)}${third ? `, then ${third.name} with ${formatPercent(third.share)}` : ''}.`,
    )
  }
  parts.push('Big drops are big batches.')
  return parts.join(' ')
}

function formatHour(hour: number) {
  return `${String(hour % 24).padStart(2, '0')}:00`
}
