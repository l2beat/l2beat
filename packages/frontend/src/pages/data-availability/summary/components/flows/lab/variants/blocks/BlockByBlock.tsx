import { formatSeconds } from '@l2beat/shared-pure'
import {
  type ReactNode,
  type Ref,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { LabLegend, LegendValue } from '../../BlobLab'
import {
  useElementSize,
  useImages,
  useIsOnScreen,
  usePrefersReducedMotion,
  useThemeTokens,
} from '../../hooks'
import { LabTooltip, PosterTooltipContent } from '../../LabTooltip'
import { type LabData, SLOT_SECONDS, SLOTS_PER_DAY } from '../../model'
import { getPlaybackStart } from '../../schedule'
import type { LabVariantProps } from '../../types'
import { paintLayers } from './beltLayers'
import { layoutBelt } from './beltLayout'
import { paletteFor } from './beltPalette'
import type { BeltScene } from './beltScene'
import {
  averageBlobsBefore,
  readBatchKey,
  slotNumberOf,
  sortIntoBlocks,
} from './dayBlocks'
import { formatAverage, formatBlobCount, formatSlot } from './format'
import { roundIcons } from './roundIcons'
import { TIME_SCALE, useBelt } from './useBelt'

/** The live meter averages this many of the latest sealed blocks */
const RECENT_BLOCKS = 50

/**
 * Ethereum's blob market as a conveyor of 12-second blocks. Rollups' batches
 * drop into the block being built, and every block shows the room it leaves:
 * the day replayed carried a few blobs a block against a target of 14.
 */
export function BlockByBlock({
  data,
  batches,
  highlighted,
  onSelect,
}: LabVariantProps) {
  const beltRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const meterRef = useRef<MeterHandle>(null)
  const size = useElementSize(beltRef)
  const tokens = useThemeTokens()
  const onScreen = useIsOnScreen(beltRef)
  const reducedMotion = usePrefersReducedMotion()
  // follows the motion setting until someone presses play or pause
  const [pausedByUser, setPausedByUser] = useState<boolean>()
  const playing = !(pausedByUser ?? reducedMotion)

  const [startTime] = useState(getPlaybackStart)
  const { posters, maxBlobsPerBlock, targetBlobsPerBlock } = data
  const blocks = useMemo(
    () => sortIntoBlocks(batches, data.range[0]),
    [batches, data.range],
  )
  const layout = useMemo(
    () =>
      size.width > 0 && size.height > 0
        ? layoutBelt(
            size.width,
            size.height,
            maxBlobsPerBlock,
            targetBlobsPerBlock,
          )
        : undefined,
    [size, maxBlobsPerBlock, targetBlobsPerBlock],
  )
  const palette = useMemo(() => paletteFor(tokens, posters), [tokens, posters])
  const layers = useMemo(
    () => layout && paintLayers(layout, palette, targetBlobsPerBlock),
    [layout, palette, targetBlobsPerBlock],
  )
  const images = useImages(posters.map((poster) => poster.iconUrl))
  const iconSize = layout?.iconSize ?? 0
  const icons = useMemo(
    () => roundIcons(posters, images, iconSize),
    [posters, images, iconSize],
  )
  const highlightedIndex = useMemo(() => {
    const index = posters.findIndex((poster) => poster.id === highlighted)
    return index >= 0 ? index : undefined
  }, [posters, highlighted])

  const scene = useMemo<BeltScene | undefined>(
    () =>
      layout &&
      layers && {
        layout,
        palette,
        layers,
        posters,
        batches,
        blocks,
        icons,
        highlighted: highlightedIndex,
        targetBlobs: targetBlobsPerBlock,
        maxBlobs: maxBlobsPerBlock,
      },
    [
      layout,
      palette,
      layers,
      posters,
      batches,
      blocks,
      icons,
      highlightedIndex,
      targetBlobsPerBlock,
      maxBlobsPerBlock,
    ],
  )

  const describeBatch = useCallback(
    (key: number) => {
      const { block, batchIndex } = readBatchKey(blocks, key)
      const batch = batches[batchIndex]
      const poster = batch && posters[batch.posterIndex]
      if (!batch || !poster) return undefined
      return { poster, blobs: batch.blobs, slot: slotNumberOf(blocks, block) }
    },
    [blocks, batches, posters],
  )

  const belt = useBelt({
    canvasRef,
    scene,
    startTime,
    playing,
    onScreen,
    onBlockChange: (block) =>
      meterRef.current?.show(averageBlobsBefore(blocks, block, RECENT_BLOCKS)),
    onClickBatch: (key) => {
      const batch = describeBatch(key)
      if (batch) onSelect(batch.poster.id)
    },
  })
  const hovered = belt.hover && describeBatch(belt.hover.key)

  const startBlock = Math.floor(startTime / SLOT_SECONDS)
  return (
    // Fills the cell beside the list; below it, the cell takes its height
    // from the variant, so a flex basis of 0 would collapse the belt
    <div className="flex h-[36rem] min-h-0 flex-col gap-4 md:h-[40rem] lg:h-auto lg:flex-1">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <Headline data={data} />
        <div className="flex items-center gap-3">
          <RecentFillMeter
            ref={meterRef}
            initial={averageBlobsBefore(blocks, startBlock, RECENT_BLOCKS)}
            target={targetBlobsPerBlock}
            max={maxBlobsPerBlock}
          />
          <PlayPauseButton
            playing={playing}
            onToggle={() => setPausedByUser(playing)}
          />
        </div>
      </div>

      <div ref={beltRef} className="relative min-h-0 flex-1" {...belt.handlers}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={describeForScreenReaders(data)}
          className="absolute inset-0 size-full"
        />
        {belt.hover && hovered && (
          <BatchTooltip
            x={belt.hover.x}
            y={belt.hover.y}
            containerWidth={size.width}
            containerHeight={size.height}
          >
            <PosterTooltipContent
              poster={hovered.poster}
              footer={`Batch of ${formatBlobCount(hovered.blobs)} in slot ${formatSlot(hovered.slot)}`}
            />
          </BatchTooltip>
        )}
      </div>

      <LabLegend
        items={[
          <>
            1 square ≈ <LegendValue>1 blob</LegendValue>
          </>,
          <>
            1 column ≈ <LegendValue>1 block</LegendValue>
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
  )
}

/** LabTooltip's distance from the pointer, which it keeps to itself */
const TOOLTIP_GAP = 14

/**
 * LabTooltip, moved above the pointer where below it would run off the
 * belt. Tiles sit low in their racks, so that is where most hovers are.
 */
function BatchTooltip({
  x,
  y,
  containerWidth,
  containerHeight,
  children,
}: {
  x: number
  y: number
  containerWidth: number
  containerHeight: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  // measured before paint, so it never shows in the wrong place first
  useLayoutEffect(() => {
    const tooltip = ref.current?.firstElementChild
    if (tooltip instanceof HTMLElement) setHeight(tooltip.offsetHeight)
  })
  const fitsBelow = y + TOOLTIP_GAP + height <= containerHeight
  return (
    <div ref={ref}>
      <LabTooltip
        x={x}
        y={fitsBelow ? y : y - height - 2 * TOOLTIP_GAP}
        containerWidth={containerWidth}
      >
        {children}
      </LabTooltip>
    </div>
  )
}

function Headline({ data }: { data: LabData }) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline gap-2">
        <span className="font-bold text-heading-32">
          {formatAverage(data.totalBlobs / SLOTS_PER_DAY)}
        </span>
        <span className="font-bold text-heading-18">blobs per block</span>
      </div>
      <p className="mt-1.5 font-medium text-paragraph-14 text-secondary">
        on average yesterday, against a target of {data.targetBlobsPerBlock} and
        a maximum of {data.maxBlobsPerBlock}
      </p>
    </div>
  )
}

interface MeterHandle {
  show: (average: number) => void
}

const CELL = 6
const CELL_GAP = 2

/**
 * How full the latest blocks were, as a rack on its side: one cell a blob of
 * room, filled to the average, with the target marked. It changes once a
 * block, so it is set straight on its elements instead of by a render.
 */
function RecentFillMeter({
  ref,
  initial,
  target,
  max,
}: {
  ref: Ref<MeterHandle>
  initial: number
  target: number
  max: number
}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const fillWidth = (average: number) => {
    const blobs = Math.min(average, max)
    const whole = Math.floor(blobs)
    return whole * (CELL + CELL_GAP) + (blobs - whole) * CELL
  }
  const describe = (average: number) =>
    `${formatAverage(average)} blobs per block, against a target of ${target}`
  useImperativeHandle(ref, () => ({
    show(average) {
      const text = formatAverage(average)
      const value = valueRef.current
      if (!value || value.textContent === text) return
      value.textContent = text
      fillRef.current?.style.setProperty('width', `${fillWidth(average)}px`)
      elementRef.current?.setAttribute('aria-valuenow', text)
      elementRef.current?.setAttribute('aria-valuetext', describe(average))
    },
  }))

  const width = max * (CELL + CELL_GAP) - CELL_GAP
  return (
    <div
      ref={elementRef}
      role="meter"
      aria-label={`Blobs per block over the last ${RECENT_BLOCKS} blocks`}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Number(formatAverage(initial))}
      aria-valuetext={describe(initial)}
      style={{ width }}
    >
      <div className="flex items-baseline justify-between gap-3 font-medium text-label-value-12 text-secondary">
        <span>Last {RECENT_BLOCKS} blocks</span>
        <span>
          <span
            ref={valueRef}
            className="font-bold text-label-value-14 text-primary tabular-nums"
          >
            {formatAverage(initial)}
          </span>{' '}
          avg
        </span>
      </div>
      <div className="relative mt-2 h-1.5">
        <MeterCells count={max} className="bg-primary/10" />
        <div
          ref={fillRef}
          className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-500 ease-out"
          style={{ width: fillWidth(initial) }}
        >
          <MeterCells count={max} className="bg-primary/70" />
        </div>
        <div
          className="-inset-y-1 absolute w-px bg-primary"
          style={{ left: target * (CELL + CELL_GAP) - CELL_GAP / 2 - 0.5 }}
        />
      </div>
    </div>
  )
}

function MeterCells({
  count,
  className,
}: {
  count: number
  className: string
}) {
  return (
    <div className="absolute inset-y-0 left-0 flex" style={{ gap: CELL_GAP }}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn('h-full shrink-0 rounded-[1px]', className)}
          style={{ width: CELL }}
        />
      ))}
    </div>
  )
}

function PlayPauseButton({
  playing,
  onToggle,
}: {
  playing: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Pause the blocks' : 'Play the blocks'}
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-primary transition-colors hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:bg-header-secondary"
    >
      <svg
        viewBox="0 0 12 12"
        className="size-3"
        fill="currentColor"
        aria-hidden="true"
      >
        {playing ? (
          <>
            <rect x="2" y="1.5" width="3" height="9" rx="0.8" />
            <rect x="7" y="1.5" width="3" height="9" rx="0.8" />
          </>
        ) : (
          <path d="M3.2 1.9v8.2c0 .5.5.8.9.5l6.6-4.1a.6.6 0 0 0 0-1L4.1 1.4c-.4-.3-.9 0-.9.5Z" />
        )}
      </svg>
    </button>
  )
}

function describeForScreenReaders(data: LabData): string {
  const [first, second] = data.posters
  const perBlock = formatAverage(data.totalBlobs / SLOTS_PER_DAY)
  const sentences = [
    `Ethereum blocks passing one by one, each with room for ${data.maxBlobsPerBlock} blobs.`,
    `Yesterday they carried ${perBlock} blobs on average, against a target of ${data.targetBlobsPerBlock}.`,
  ]
  if (first && second) {
    sentences.push(
      `${first.name} posted the most, ${formatPercent(first.share)} of blobs, then ${second.name} with ${formatPercent(second.share)}.`,
    )
  }
  return sentences.join(' ')
}
