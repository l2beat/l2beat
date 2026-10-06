import {
  Fragment,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  useElementSize,
  useImages,
  useIsOnScreen,
  usePrefersReducedMotion,
  useThemeTokens,
} from '../hooks'
import { LandingsContext } from '../landings'
import { type BlockLimits, type LivePoster, UNKNOWN_ID } from '../model'
import { PointerTooltip } from '../PointerTooltip'
import type { BlobBatch, ChainBlock, PosterIndexOf } from './beaconChain'
import { paintLayers } from './beltLayers'
import { layoutBelt } from './beltLayout'
import { paletteFor } from './beltPalette'
import { type BeltScene, findBatch } from './beltScene'
import { formatAverage, formatBlobCount, formatWhole } from './format'
import { BATCH_STAGGER } from './motion'
import { roundIcons } from './roundIcons'
import { RECENT_BLOCKS, useBeaconChain } from './useBeaconChain'
import { useBelt } from './useBelt'

interface Props {
  /** Every project that may post, with the stand-in for unknown senders last */
  posters: LivePoster[]
  limits: BlockLimits
  /** Poster picked in the list or on the belt. The others step back */
  highlighted: string | undefined
  /** Picks a poster, or lets it go when it was picked already */
  onSelect: (posterId: string) => void
  /** Drawn between the belt and its legend, as the hour behind the belt */
  history?: ReactNode
}

/**
 * Ethereum's blob market, live, as a conveyor of 12-second blocks. Each
 * block's blobs drop into the loading bay as Ethereum makes it, sorted by the
 * rollup that sent them, and every block shows the room it left against the
 * target and the maximum.
 */
export function LiveBlocks({
  posters,
  limits,
  highlighted,
  onSelect,
  history,
}: Props) {
  const beltRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const size = useElementSize(beltRef)
  const tokens = useThemeTokens()
  const onScreen = useIsOnScreen(beltRef)
  const reducedMotion = usePrefersReducedMotion()
  const { maxBlobsPerBlock, targetBlobsPerBlock } = limits

  const posterIndexOf = useMemo(() => createPosterIndexOf(posters), [posters])
  // the belt drops what the chain brings in, and the chain is followed only
  // while the belt is seen, so each needs the other: a ref breaks the circle
  const dropBlock = useRef<(block: ChainBlock) => void>(() => {})
  const announceLandings = useAnnounceLandings(posters, reducedMotion)
  const { chain, version } = useBeaconChain({
    posterIndexOf,
    enabled: onScreen,
    onFreshBlock: (block) => {
      dropBlock.current(block)
      announceLandings(block)
    },
  })

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

  // a new scene for every block that comes, as blocks change in place
  // biome-ignore lint/correctness/useExhaustiveDependencies: `version` counts the blocks
  const scene = useMemo<BeltScene | undefined>(
    () =>
      layout &&
      layers && {
        layout,
        palette,
        layers,
        posters,
        blocks: chain.blocks,
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
      chain.blocks,
      icons,
      highlightedIndex,
      targetBlobsPerBlock,
      maxBlobsPerBlock,
      version,
    ],
  )

  const belt = useBelt({
    canvasRef,
    scene,
    progressNow: chain.progressNow,
    still: reducedMotion,
    onScreen,
    onClickBatch: (key) => {
      const found = findBatch(chain.blocks, key)
      const poster = found && posters[found.batch.posterIndex]
      if (poster) onSelect(poster.id)
    },
  })
  dropBlock.current = belt.dropBlock
  const hovered = belt.hover && findBatch(chain.blocks, belt.hover.key)
  const hoveredPoster = hovered && posters[hovered.batch.posterIndex]

  // for screen readers; recomputed as blocks come in, which `version` counts
  // biome-ignore lint/correctness/useExhaustiveDependencies: blocks change in place
  const average = useMemo(() => averageBlobs(chain.blocks), [chain, version])

  return (
    <div className="flex flex-col gap-3">
      {/* Just tall enough for a full rack with its caption and numbers: at
          its largest, 21 rows of 21 px, so nothing is left empty above it */}
      <div
        ref={beltRef}
        className="relative h-[24rem] md:h-[34rem]"
        {...belt.handlers}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={describeForScreenReaders(limits, average)}
          className="absolute inset-0 size-full"
        />
        {belt.hover && hovered && hoveredPoster && (
          <BatchTooltip
            x={belt.hover.x}
            y={belt.hover.y}
            containerWidth={size.width}
            containerHeight={size.height}
          >
            <BatchTooltipContent
              poster={hoveredPoster}
              batch={hovered.batch}
              slot={hovered.slot}
              blockNumber={hovered.blockNumber}
            />
          </BatchTooltip>
        )}
      </div>

      {history}

      <Legend
        items={[
          <>
            1 square = <LegendValue>1 blob</LegendValue>
          </>,
          <>
            1 column = <LegendValue>1 block</LegendValue>
          </>,
          'Live from the Ethereum beacon chain',
        ]}
      />
    </div>
  )
}

/** About how long a tile takes from the chute to the rack */
const LAND_AFTER = 0.35

/**
 * Tells the numbers around the belt when each batch of a new block comes to
 * rest, so they count up with it rather than ahead of it
 */
function useAnnounceLandings(posters: LivePoster[], still: boolean) {
  const landings = useContext(LandingsContext)
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())
  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const timer of pending) clearTimeout(timer)
    }
  }, [])
  return (block: ChainBlock) => {
    if (!landings || block.status !== 'proposed') return
    block.batches.forEach((batch, index) => {
      const poster = posters[batch.posterIndex]
      if (!poster) return
      const landsIn = still ? 0 : index * BATCH_STAGGER + LAND_AFTER
      const timer = setTimeout(() => {
        timers.current.delete(timer)
        landings.emit({
          posterId: poster.id,
          blobs: batch.blobs,
          slot: block.slot,
        })
      }, landsIn * 1000)
      timers.current.add(timer)
    })
  }
}

/** Batches point into the posters; ones no project claims, to the stand-in */
function createPosterIndexOf(posters: LivePoster[]): PosterIndexOf {
  const indexById = new Map(posters.map((poster, i) => [poster.id, i]))
  const unknown = indexById.get(UNKNOWN_ID) ?? posters.length - 1
  return (projectId) => indexById.get(projectId ?? UNKNOWN_ID) ?? unknown
}

/** Blobs per block over the blocks known, up to the last `RECENT_BLOCKS` */
function averageBlobs(blocks: ReadonlyMap<number, ChainBlock>) {
  const proposed = [...blocks.values()]
    .filter((block) => block.status === 'proposed')
    .sort((a, b) => b.slot - a.slot)
    .slice(0, RECENT_BLOCKS)
  if (proposed.length === 0) return undefined
  const blobs = proposed
    .flatMap((block) => block.batches)
    .reduce((sum, batch) => sum + batch.blobs, 0)
  return { blobsPerBlock: blobs / proposed.length, blocks: proposed.length }
}

type Average = ReturnType<typeof averageBlobs>

/** PointerTooltip's distance from the pointer, which it keeps to itself */
const TOOLTIP_GAP = 14

/**
 * PointerTooltip, moved above the pointer where below it would run off the
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
      <PointerTooltip
        x={x}
        y={fitsBelow ? y : y - height - 2 * TOOLTIP_GAP}
        containerWidth={containerWidth}
      >
        {children}
      </PointerTooltip>
    </div>
  )
}

function BatchTooltipContent({
  poster,
  batch,
  slot,
  blockNumber,
}: {
  poster: LivePoster
  batch: BlobBatch
  slot: number
  blockNumber: number
}) {
  const rows: [string, string][] = [
    ['Batch', formatBlobCount(batch.blobs)],
    ['Slot', formatWhole(slot)],
    ['Block', formatWhole(blockNumber)],
  ]
  // an inbox nobody claims is the one clue to who sent it
  if (poster.id === UNKNOWN_ID) rows.push(['Sent to', shortAddress(batch.to)])
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 font-bold text-label-value-14">
        {poster.iconUrl && (
          <img src={poster.iconUrl} alt="" className="size-4 rounded-full" />
        )}
        {poster.name}
      </div>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex justify-between gap-4 text-label-value-13"
        >
          <span className="text-secondary">{label}</span>
          <span className="tabular-nums">{value}</span>
        </div>
      ))}
    </div>
  )
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

/**
 * How to read the belt, under it. One line where it fits; on a phone, one
 * item per line, as wrapped separators would start lines.
 */
function Legend({ items }: { items: ReactNode[] }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-2 font-medium text-label-value-12 text-secondary max-md:hidden">
        {items.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="text-tertiary">|</span>}
            <span>{item}</span>
          </Fragment>
        ))}
      </div>
      <div className="space-y-1 text-center font-medium text-label-value-14 text-secondary md:hidden">
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    </>
  )
}

/** A value in the legend, in the brand color like the hub's legend */
function LegendValue({ children }: { children: ReactNode }) {
  return <span className="font-bold text-brand">{children}</span>
}

function describeForScreenReaders(limits: BlockLimits, average: Average) {
  const sentences = [
    `Ethereum blocks as they are made, live, each with room for ${limits.maxBlobsPerBlock} blobs.`,
  ]
  if (average) {
    sentences.push(
      `The last ${average.blocks} carried ${formatAverage(average.blobsPerBlock)} blobs on average, against a target of ${limits.targetBlobsPerBlock}.`,
    )
  }
  return sentences.join(' ')
}
