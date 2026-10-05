import { formatSeconds } from '@l2beat/shared-pure'
import {
  type MouseEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { LabLegend, LegendValue } from '../../BlobLab'
import {
  useElementSize,
  useIsOnScreen,
  usePrefersReducedMotion,
  useThemeTokens,
} from '../../hooks'
import { LabTooltip, PosterTooltipContent } from '../../LabTooltip'
import {
  type LabData,
  type LabPoster,
  SLOT_SECONDS,
  SLOTS_PER_DAY,
} from '../../model'
import type { LabVariantProps } from '../../types'
import { LABEL_FONT, VALUE_FONT } from './draw'
import { HOUR_SECONDS, type HourSummary } from './pour'
import { buildScene, formatPerBlock, formatTimeOfDay } from './scene'
import { type Hit, type Phase, usePour } from './usePour'

/**
 * Yesterday's blobs poured into Ethereum like colored sand. The diamond holds
 * exactly a day of blocks at the blob maximum, so how high the sand stands,
 * against the target line, is how full Ethereum's blob space was; and as the
 * day pours hour by hour, the layers keep who posted when.
 */
export function Strata({ data, highlighted, onSelect }: LabVariantProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)
  const { width, height } = useElementSize(boxRef)
  const tokens = useThemeTokens()
  const reducedMotion = usePrefersReducedMotion()
  const onScreen = useIsOnScreen(boxRef)
  const fontsReady = useFontsReady()

  const scene = useMemo(
    () =>
      fontsReady
        ? buildScene({
            data,
            width,
            height,
            density: Math.min(window.devicePixelRatio || 1, 2),
            measure: measureText,
          })
        : undefined,
    [data, width, height, fontsReady],
  )

  const [hover, setHover] = useState<Hover>()
  const { phase, pourAgain, hitTest } = usePour({
    data,
    scene,
    canvasRef,
    clockRef,
    tokens,
    onScreen,
    reducedMotion,
    highlightedPoster: data.posters.findIndex((p) => p.id === highlighted),
    hoveredHit: hover?.hit,
  })

  const pointAt = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return { x, y, hit: hitTest(x, y) }
  }
  const onPointerMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const { x, y, hit } = pointAt(event)
    setHover((current) =>
      hit
        ? {
            x,
            y,
            hit: current && isSameHit(current.hit, hit) ? current.hit : hit,
          }
        : undefined,
    )
  }
  // the grain whose tooltip is showing, as a click lands a fraction of a
  // pixel off the last move, which on 2px grains can be the next grain
  const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const hit = hover?.hit ?? pointAt(event).hit
    if (hit?.kind !== 'grain' || !scene) return
    const poster = data.posters[scene.plan.poster[hit.grain] ?? -1]
    if (poster) onSelect(poster.id)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <StrataHeader
        data={data}
        phase={phase}
        clockRef={clockRef}
        canPourAgain={!reducedMotion}
        onPourAgain={pourAgain}
      />
      <div
        ref={boxRef}
        className="relative min-h-0 flex-1 max-lg:h-[28rem] max-lg:flex-none md:max-lg:h-[36rem]"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={describe(data)}
          className={cn(
            'absolute inset-0 size-full touch-pan-y',
            hover?.hit.kind === 'grain' && 'cursor-pointer',
          )}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHover(undefined)}
          onClick={onClick}
        />
        {hover && scene && (
          <LabTooltip x={hover.x} y={hover.y} containerWidth={width}>
            {hover.hit.kind === 'grain' ? (
              <GrainTooltip
                data={data}
                posterIndex={scene.plan.poster[hover.hit.grain] ?? -1}
                hour={scene.plan.hour[hover.hit.grain] ?? 0}
              />
            ) : (
              <HourTooltip
                data={data}
                summary={scene.hourSummaries[hover.hit.hour]}
                picked={data.posters.find((p) => p.id === highlighted)}
              />
            )}
          </LabTooltip>
        )}
      </div>
      <StrataLegend
        blobsPerGrain={scene?.plan.blobsPerGrain}
        maxBlobsPerBlock={data.maxBlobsPerBlock}
        moving={!reducedMotion}
      />
    </div>
  )
}

interface Hover {
  /** Pointer, in CSS px of the drawing */
  x: number
  y: number
  hit: Hit
}

/** What a grain and a layer stand for, and how fast the day pours */
function StrataLegend({
  blobsPerGrain,
  maxBlobsPerBlock,
  moving,
}: {
  blobsPerGrain: number | undefined
  maxBlobsPerBlock: number
  /** Without motion there is no pace to tell */
  moving: boolean
}) {
  const items = [
    <>
      1 grain ≈{' '}
      <LegendValue>
        {blobsPerGrain === undefined ? '…' : `${blobsPerGrain} blobs`}
      </LegendValue>
    </>,
    <>
      1 layer ≈ <LegendValue>1 hour</LegendValue>, a band per project
    </>,
  ]
  if (moving) {
    items.push(
      <>
        1 second ≈{' '}
        <LegendValue>
          {formatSeconds(3600 / HOUR_SECONDS, { fullUnit: true })}
        </LegendValue>
      </>,
    )
  }
  items.push(
    <>
      Full diamond ={' '}
      <LegendValue>a day at {maxBlobsPerBlock} blobs per block</LegendValue>
    </>,
  )
  return <LabLegend items={items} />
}

/** The clock while the day pours, what it came to once it has */
function StrataHeader({
  data,
  phase,
  clockRef,
  canPourAgain,
  onPourAgain,
}: {
  data: LabData
  phase: Phase
  clockRef: RefObject<HTMLSpanElement | null>
  canPourAgain: boolean
  onPourAgain: () => void
}) {
  const ofTarget = data.totalBlobs / (data.targetBlobsPerBlock * SLOTS_PER_DAY)
  if (phase === 'done') {
    return (
      <div className="fade-in flex h-12 animate-in flex-col items-center justify-center gap-1.5 text-center duration-500">
        <div className="font-bold text-heading-18">
          Yesterday filled{' '}
          <span className="text-brand">{formatWholePercent(ofTarget)}</span> of
          the target
        </div>
        <div className="flex items-center gap-2 font-medium text-label-value-13 text-secondary">
          <span className="tabular-nums">
            {formatCount(data.totalBlobs)} blobs,{' '}
            {formatPerBlock(data.totalBlobs / SLOTS_PER_DAY)} per block
          </span>
          {canPourAgain && (
            <button
              type="button"
              onClick={onPourAgain}
              className="rounded-full bg-surface-secondary px-2 py-0.5 font-bold text-label-value-12 text-primary transition-colors hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Pour again
            </button>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="flex h-12 flex-col items-center justify-center gap-1.5 text-center">
      <div className="font-bold text-heading-18 tabular-nums">
        <span ref={clockRef}>00:00</span> UTC
      </div>
      <div className="font-medium text-label-value-13 text-secondary">
        Replaying yesterday, {formatDay(data.range[0])}
      </div>
    </div>
  )
}

function GrainTooltip({
  data,
  posterIndex,
  hour,
}: {
  data: LabData
  posterIndex: number
  hour: number
}) {
  const poster = data.posters[posterIndex]
  if (!poster) return null
  return (
    <PosterTooltipContent
      poster={poster}
      footer={`Poured between ${formatTimeOfDay(data.range[0], hour)} and ${formatTimeOfDay(data.range[0], hour + 1)} UTC`}
    />
  )
}

/** What an hour held, its largest posters, and the picked one wherever it ranks */
function HourTooltip({
  data,
  summary,
  picked,
}: {
  data: LabData
  summary: HourSummary | undefined
  picked: LabPoster | undefined
}) {
  if (!summary) return null
  const slotsPerHour = 3600 / SLOT_SECONDS
  const rows = [...summary.top]
  if (picked && !rows.includes(picked)) rows.push(picked)
  return (
    <div className="space-y-1.5">
      <div className="font-bold text-label-value-14 tabular-nums">
        {formatTimeOfDay(data.range[0], summary.hour)} to{' '}
        {formatTimeOfDay(data.range[0], summary.hour + 1)} UTC
      </div>
      <div className="flex justify-between gap-4 text-label-value-13">
        <span className="text-secondary">Posted</span>
        <span className="tabular-nums">
          {formatCount(summary.blobs)} blobs{' '}
          <span className="text-secondary">
            {formatPerBlock(summary.blobs / slotsPerHour)} per block
          </span>
        </span>
      </div>
      <div className="space-y-1 border-divider border-t pt-1.5">
        {rows.map((poster) => (
          <div
            key={poster.id}
            className={cn(
              'flex items-center justify-between gap-4 text-label-value-13',
              poster === picked && 'font-bold',
            )}
          >
            <span className="flex items-center gap-1.5">
              {poster.iconUrl && (
                <img
                  src={poster.iconUrl}
                  alt=""
                  className="size-4 rounded-full"
                />
              )}
              {poster.name}
            </span>
            <span className="tabular-nums">
              {formatPercent(
                (poster.blobsHourly[summary.hour] ?? 0) / summary.blobs,
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Roboto has to be in before labels are measured, or they would not fit */
function useFontsReady(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let cancelled = false
    const fonts = [LABEL_FONT, VALUE_FONT].map((font) =>
      document.fonts.load(font),
    )
    void Promise.allSettled(fonts).then(() => !cancelled && setReady(true))
    return () => {
      cancelled = true
    }
  }, [])
  return ready
}

let measuring: CanvasRenderingContext2D | null | undefined
function measureText(text: string, bold: boolean): number {
  measuring ??= document.createElement('canvas').getContext('2d')
  if (!measuring) return text.length * 7
  measuring.font = bold ? LABEL_FONT : VALUE_FONT
  return measuring.measureText(text).width
}

function isSameHit(a: Hit, b: Hit): boolean {
  if (a.kind === 'grain' && b.kind === 'grain') return a.grain === b.grain
  if (a.kind === 'hour' && b.kind === 'hour') return a.hour === b.hour
  return false
}

function describe(data: LabData): string {
  const capacity = data.maxBlobsPerBlock * SLOTS_PER_DAY
  const target = data.targetBlobsPerBlock * SLOTS_PER_DAY
  const top = data.posters
    .slice(0, 3)
    .map((p) => `${p.name} ${formatWholePercent(p.share)}`)
  return (
    `Yesterday's ${formatCount(data.totalBlobs)} blobs poured, hour by hour, ` +
    'into an Ethereum diamond that holds a day of blocks at the maximum of ' +
    `${data.maxBlobsPerBlock} blobs. They fill ${formatWholePercent(data.totalBlobs / capacity)} of it, ` +
    `${formatWholePercent(data.totalBlobs / target)} of the target of ` +
    `${data.targetBlobsPerBlock} blobs per block. Largest posters: ${top.join(', ')}.`
  )
}

function formatDay(dayStart: number): string {
  return new Date(dayStart * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}

function formatCount(value: number): string {
  return Math.round(value).toLocaleString('en-US')
}

function formatWholePercent(share: number): string {
  return `${Math.round(share * 100)}%`
}
