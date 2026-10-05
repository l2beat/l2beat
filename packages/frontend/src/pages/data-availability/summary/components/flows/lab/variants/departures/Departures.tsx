import { formatSeconds } from '@l2beat/shared-pure'
import {
  type PointerEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatPosted } from '../../../formatPosted'
import { LabLegend, LegendValue } from '../../BlobLab'
import {
  useAnimationFrame,
  useElementSize,
  useIsOnScreen,
  usePrefersReducedMotion,
} from '../../hooks'
import { LabTooltip, PosterTooltipContent } from '../../LabTooltip'
import type { LabData, LabPoster } from '../../model'
import { getPlaybackStart } from '../../schedule'
import type { LabVariantProps } from '../../types'
import { Board } from './Board'
import { useBoardRows } from './boardRows'
import { layoutBoard } from './layout'
import { BoardMotion } from './SplitFlap'
import {
  describeBatch,
  getDepartures,
  groupBatchesByPoster,
  pickShown,
} from './timetable'

/**
 * Ethereum as a terminal and every rollup as a scheduled departure. A
 * split-flap board shows each one's next batch: when it goes, how many blobs
 * it carries, how often it leaves and how much it sent over the day. It plays
 * yesterday at this hour in real time, so something leaves every few seconds.
 */
export function Departures({
  data,
  batches,
  highlighted,
  onSelect,
}: LabVariantProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const { width } = useElementSize(rootRef)
  const isOnScreen = useIsOnScreen(rootRef)
  const reducedMotion = usePrefersReducedMotion()
  const layout = useMemo(
    () => (width > 0 ? layoutBoard(width) : undefined),
    [width],
  )

  const now = usePlaybackSecond(isOnScreen)
  const schedules = useMemo(
    () => groupBatchesByPoster(batches, data.posters.length),
    [batches, data.posters.length],
  )
  const departures = useMemo(
    () => getDepartures(data.posters, schedules, now),
    [data.posters, schedules, now],
  )
  // a layer with only a few posters gets a board of only that many rows
  const rowCount = Math.min(layout?.rows ?? 0, departures.length)
  const shown = useMemo(
    () => pickShown(departures, rowCount, highlighted),
    [departures, rowCount, highlighted],
  )
  const rows = useBoardRows(shown, rowCount)

  const [pointer, setPointer] = useState<Pointer>()
  const onHover = useCallback(
    (posterId: string | undefined, event: PointerEvent) => {
      const root = rootRef.current
      const isTouch = event.pointerType === 'touch'
      // a finger leaves as soon as it lifts, so a tapped row keeps its
      // tooltip for as long as it stays picked
      if (isTouch && posterId === undefined) return
      if (posterId === undefined || !root) {
        setPointer(undefined)
        return
      }
      setPointer({ id: posterId, isTouch, ...placeTooltip(root, event) })
    },
    [],
  )
  const hovered =
    pointer && (!pointer.isTouch || pointer.id === highlighted)
      ? departures.find((d) => d.poster.id === pointer.id)
      : undefined
  const summary = useMemo(() => describeBoard(data), [data])

  return (
    <div ref={rootRef} className="relative flex min-h-0 flex-1 flex-col gap-4">
      {layout && (
        <BoardMotion.Provider value={!reducedMotion}>
          <Board
            layout={layout}
            rows={rows}
            rowCount={rowCount}
            now={now}
            dayStart={data.range[0]}
            highlighted={highlighted}
            summary={summary}
            onSelect={onSelect}
            onHover={onHover}
          />
        </BoardMotion.Provider>
      )}
      <LabLegend
        items={[
          <>
            <LegendValue>Real time</LegendValue>, replaying yesterday at this
            hour
          </>,
          'Batch times and sizes are simulated from hourly totals and average cadence',
        ]}
      />
      {pointer && hovered && (
        <LabTooltip x={pointer.x} y={pointer.y} containerWidth={width}>
          <PosterTooltipContent
            poster={hovered.poster}
            footer={describeBatch(hovered, data.range[0])}
          />
        </LabTooltip>
      )}
    </div>
  )
}

interface Pointer {
  id: string
  /** Inside the variant's box */
  x: number
  y: number
  isTouch: boolean
}

// LabTooltip's own measures: how far it keeps from its point, how wide it
// gets, and past which share of the width it opens to the left
const TOOLTIP_GAP = 14
const TOOLTIP_WIDTH = 260
const TOOLTIP_FLIP = 0.6
const BELOW_ROW = 4

/**
 * Where the tooltip goes. A mouse leads it around. A finger would cover it,
 * so after a tap it goes under the row instead, kept inside the board.
 */
function placeTooltip(root: HTMLElement, event: PointerEvent) {
  const box = root.getBoundingClientRect()
  const x = event.clientX - box.left
  if (event.pointerType !== 'touch') return { x, y: event.clientY - box.top }
  const row = event.currentTarget.getBoundingClientRect()
  const left = Math.max(
    0,
    Math.min(
      x - TOOLTIP_WIDTH / 2,
      box.width - TOOLTIP_WIDTH,
      box.width * TOOLTIP_FLIP,
    ),
  )
  return {
    x: left - TOOLTIP_GAP,
    y: row.bottom - box.top + BELOW_ROW - TOOLTIP_GAP,
  }
}

/**
 * The whole second of playback, ticking with the reader's clock. Playback
 * starts at the time of day it is now and runs at real speed, so it always
 * replays the same moment of yesterday, also after a pause off screen.
 */
function usePlaybackSecond(running: boolean): number {
  const [origin] = useState(() => ({
    start: getPlaybackStart(),
    at: Date.now(),
  }))
  const read = () => Math.floor(origin.start + (Date.now() - origin.at) / 1000)
  const [second, setSecond] = useState(read)
  useAnimationFrame(() => {
    const now = read()
    if (now !== second) setSecond(now)
  }, running)
  return second
}

function describeBoard(data: LabData): string {
  const [largest] = data.posters
  const mostFrequent = data.posters.reduce<LabPoster | undefined>(
    (best, poster) =>
      !best || poster.cadence.interval < best.cadence.interval ? poster : best,
    undefined,
  )
  const parts = [
    'A departure board of blob batches to Ethereum, replaying yesterday at this hour in real time.',
    `${data.posters.length} rollups posted ${formatPosted(data.totalPosted)} in the day.`,
  ]
  if (largest) {
    parts.push(
      `${largest.name} posts the most, ${formatPercent(largest.share)} of it.`,
    )
  }
  if (mostFrequent) {
    parts.push(
      `${mostFrequent.name} leaves most often, a batch every ${formatSeconds(mostFrequent.cadence.interval)}.`,
    )
  }
  return parts.join(' ')
}
