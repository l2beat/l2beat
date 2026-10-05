import { formatSeconds } from '@l2beat/shared-pure'
import { type CSSProperties, memo, type PointerEvent, useContext } from 'react'
import { cn } from '~/utils/cn'
import { formatBlobs } from '../../../daFlowsUnit'
import { formatPosted } from '../../../formatPosted'
import type { BoardRow } from './boardRows'
import {
  type BoardColumn,
  type BoardLayout,
  iconGap,
  type TileSize,
} from './layout'
import { BoardMotion, FlapText } from './SplitFlap'
import {
  type Departure,
  describeBatch,
  formatCargo,
  formatDayTotal,
  formatEvery,
  formatStatus,
  formatTimeDigits,
  toBoardName,
} from './timetable'

interface BoardProps {
  layout: BoardLayout
  rows: BoardRow[]
  /** Rows the board is tall enough for */
  rowCount: number
  now: number
  dayStart: number
  highlighted: string | undefined
  /** What the board shows, for those who cannot see it */
  summary: string
  onSelect: (posterId: string) => void
  onHover: (posterId: string | undefined, event: PointerEvent) => void
}

/**
 * The board itself: a dark panel with a clock in its header and a row per
 * departure. It is a thing standing on the card, so it is dark in either
 * theme.
 */
export const Board = memo(function Board({
  layout,
  rows,
  rowCount,
  now,
  dayStart,
  highlighted,
  summary,
  onSelect,
  onHover,
}: BoardProps) {
  return (
    <div
      // isolated, so the rows' stacking stays under the tooltip
      className="isolate rounded-[14px] bg-[linear-gradient(180deg,#25272d,#17181c)] p-1.5 shadow-[0_1px_2px_rgba(10,11,14,0.25),0_18px_40px_-18px_rgba(10,11,14,0.6)] ring-1 ring-black/70 dark:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] dark:ring-white/[0.07]"
      style={tileVariables(layout.tile)}
    >
      <div className="text-(length:--tile-font) overflow-hidden rounded-[9px] bg-[#0e0f12] pb-3 font-bold font-mono text-[#f3f1ea] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
        <BoardHeader
          layout={layout}
          now={now}
          dayStart={dayStart}
          summary={summary}
        />
        <ColumnHeadings layout={layout} />
        <ol
          aria-label="Next batches"
          // rows slide in and out of sight past the top and bottom edges
          className="relative overflow-y-clip"
          style={{ height: rowCount * layout.rowHeight }}
        >
          {rows
            // kept in one order, so rows only ever move on screen, never in
            // the document, where a move would cut their transition short
            .toSorted(
              (a, b) => a.departure.poster.rank - b.departure.poster.rank,
            )
            .map((row) => (
              <Row
                key={row.departure.poster.id}
                row={row}
                layout={layout}
                dayStart={dayStart}
                isSelected={highlighted === row.departure.poster.id}
                isDimmed={
                  highlighted !== undefined &&
                  highlighted !== row.departure.poster.id
                }
                onSelect={onSelect}
                onHover={onHover}
              />
            ))}
        </ol>
      </div>
    </div>
  )
})

function BoardHeader({
  layout,
  now,
  dayStart,
  summary,
}: {
  layout: BoardLayout
  now: number
  dayStart: number
  summary: string
}) {
  const isFull = layout.mode === 'full'
  return (
    <div
      role="img"
      aria-label={summary}
      className={cn(
        'flex justify-between gap-4 font-roboto',
        isFull ? 'items-center pt-5 pb-5' : 'items-start pt-4 pb-4',
      )}
      style={{ paddingInline: layout.paddingX }}
    >
      <div className="min-w-0">
        <div
          className={cn(
            'font-bold text-[#f3f1ea]',
            isFull ? 'text-heading-24' : 'text-heading-20',
          )}
        >
          Departures
        </div>
        <div className="mt-1.5 font-medium text-[#9b9ea6] text-paragraph-14">
          Blob batches to Ethereum, replaying yesterday at this hour
        </div>
      </div>
      <div
        className="flex shrink-0 flex-col items-end gap-1.5"
        style={tileVariables(layout.clockTile)}
      >
        <FlapText
          value={formatTimeDigits(now, dayStart, true)}
          length={6}
          colonsAfter={TIME_COLONS}
          className="text-(length:--tile-font)"
        />
        <span className="font-medium text-[#9b9ea6] text-label-value-12">
          Local time
        </span>
      </div>
    </div>
  )
}

const TIME_COLONS = [1, 3]
const SHORT_TIME_COLONS = [1]

function ColumnHeadings({ layout }: { layout: BoardLayout }) {
  return (
    <div
      aria-hidden
      className="grid justify-between border-white/[0.08] border-b pb-2 font-medium font-roboto text-[#8b8f99] text-label-value-12"
      style={{
        gridTemplateColumns: gridColumns(layout),
        paddingInline: layout.paddingX,
      }}
    >
      {layout.columns.map((column) => (
        <span
          key={column.id}
          className={column.align === 'right' ? 'text-right' : undefined}
        >
          {column.label}
        </span>
      ))}
    </div>
  )
}

interface RowProps {
  row: BoardRow
  layout: BoardLayout
  dayStart: number
  isSelected: boolean
  isDimmed: boolean
  onSelect: (posterId: string) => void
  onHover: (posterId: string | undefined, event: PointerEvent) => void
}

const Row = memo(function Row({
  row,
  layout,
  dayStart,
  isSelected,
  isDimmed,
  onSelect,
  onHover,
}: RowProps) {
  const moves = useContext(BoardMotion)
  const { departure, slot, leaving } = row
  const { poster } = departure
  const y = slot * layout.rowHeight
  return (
    <li
      className={cn(
        'absolute inset-x-0 top-0 z-(--row-z) [transform:translate3d(0,var(--row-y),0)] hover:z-60',
        leaving ? 'opacity-0' : 'opacity-100',
        moves &&
          'starting:opacity-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] starting:[transform:translate3d(0,var(--enter-y),0)]',
      )}
      style={
        {
          '--row-y': `${y}px`,
          '--enter-y': `${y + layout.rowHeight * 0.5}px`,
          // a row moving down the board passes over the rows moving up to
          // make room for it, and one leaving goes under them all
          '--row-z': leaving ? 0 : slot + 1,
          height: layout.rowHeight,
          pointerEvents: leaving ? 'none' : undefined,
        } as CSSProperties
      }
    >
      <button
        type="button"
        // on its way out, a row is no longer there to pick
        tabIndex={leaving ? -1 : undefined}
        aria-hidden={leaving || undefined}
        aria-pressed={isSelected}
        aria-label={describeRow(departure, dayStart)}
        onClick={() => onSelect(poster.id)}
        // a tap does not move, so the tooltip is set on the way down too
        onPointerDown={(event) => onHover(poster.id, event)}
        onPointerMove={(event) => onHover(poster.id, event)}
        onPointerLeave={(event) => onHover(undefined, event)}
        className={cn(
          'relative grid h-full w-full cursor-pointer items-center justify-between bg-[#0e0f12] text-left',
          // the shadow falls on the row below, which covers it unless this
          // row is lifted or passing over it
          'shadow-[inset_0_-1px_0_rgba(255,255,255,0.035),0_8px_14px_-6px_rgba(0,0,0,0.9)]',
          'hover:-translate-y-px transition-[translate,background-color] duration-150 ease-out hover:bg-[#15161a]',
          'outline-none focus-visible:ring-2 focus-visible:ring-[#f3f1ea]/60 focus-visible:ring-inset',
          isSelected && 'bg-[#15161a]',
        )}
        style={{
          gridTemplateColumns: gridColumns(layout),
          paddingInline: layout.paddingX,
        }}
      >
        {isSelected && (
          // in the margin before the tiles, however narrow it is
          <span
            className="absolute inset-y-2 w-[3px] rounded-full bg-[#f5b301] shadow-[0_0_10px_rgba(245,179,1,0.55)]"
            style={{ left: Math.round(layout.paddingX / 2) - 1 }}
          />
        )}
        {layout.columns.map((column) => (
          <span
            key={column.id}
            className={cn(
              'flex min-w-0 transition-opacity duration-200',
              column.align === 'right' && 'justify-end',
              isDimmed && 'opacity-45',
            )}
          >
            <Cell
              column={column}
              row={row}
              layout={layout}
              dayStart={dayStart}
            />
          </span>
        ))}
      </button>
    </li>
  )
})

// the tiles of a row turn in left to right, a column after another
const COLUMN_DELAYS = {
  time: 0,
  rollup: 60,
  cargo: 180,
  every: 240,
  total: 300,
  status: 360,
}

function Cell({
  column,
  row,
  layout,
  dayStart,
}: {
  column: BoardColumn
  row: BoardRow
  layout: BoardLayout
  dayStart: number
}) {
  const { departure } = row
  const { poster } = departure
  const delay = row.enterDelay + COLUMN_DELAYS[column.id]
  switch (column.id) {
    case 'time':
      return (
        <FlapText
          value={formatTimeDigits(
            departure.second,
            dayStart,
            layout.withSeconds,
          )}
          length={column.length}
          colonsAfter={layout.withSeconds ? TIME_COLONS : SHORT_TIME_COLONS}
          delay={delay}
        />
      )
    case 'rollup':
      return (
        <span
          className="flex min-w-0 items-center"
          style={{ gap: iconGap(layout.tile) }}
        >
          <RollupIcon url={poster.iconUrl} size={layout.iconSize} />
          <span className="flex min-w-0 flex-col gap-1.5">
            <FlapText
              value={toBoardName(poster.name, column.length)}
              length={column.length}
              delay={delay}
            />
            {layout.mode === 'compact' && (
              // this batch's cargo, then how often batches go on average
              <span className="truncate font-medium font-roboto text-[#9b9ea6] text-label-value-12 tabular-nums">
                {formatBlobs(departure.blobs)} · every{' '}
                {formatSeconds(poster.cadence.interval)}
              </span>
            )}
          </span>
        </span>
      )
    case 'cargo':
      return (
        <FlapText
          value={formatCargo(departure.blobs)}
          length={column.length}
          delay={delay}
        />
      )
    case 'every':
      return (
        <FlapText
          value={formatEvery(poster.cadence.interval, poster.cadenceMeasured)}
          length={column.length}
          delay={delay}
        />
      )
    case 'total':
      return (
        <FlapText
          value={formatDayTotal(poster.posted)}
          length={column.length}
          align="right"
          delay={delay}
        />
      )
    case 'status': {
      const status = formatStatus(departure.status)
      return (
        <FlapText
          value={status.text}
          length={column.length}
          tone={status.tone}
          blink={departure.status.kind === 'departed'}
          delay={delay}
        />
      )
    }
  }
}

function RollupIcon({ url, size }: { url: string | undefined; size: number }) {
  return url ? (
    <img
      src={url}
      alt=""
      className="shrink-0 rounded-full ring-1 ring-white/15"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      className="shrink-0 rounded-full bg-white/10"
      style={{ width: size, height: size }}
    />
  )
}

function describeRow(departure: Departure, dayStart: number): string {
  const { poster } = departure
  return `${poster.name}. ${describeBatch(departure, dayStart)}. Sends ${formatBlobs(poster.cadence.blobsPerBatch)} every ${formatSeconds(poster.cadence.interval)}, ${formatPosted(poster.posted)} in the day.`
}

// every row is its own grid, so the columns line up only on fixed widths
function gridColumns(layout: BoardLayout): string {
  return layout.columns.map((column) => `${column.width}px`).join(' ')
}

function tileVariables(tile: TileSize): CSSProperties {
  return {
    '--tile-w': `${tile.width}px`,
    '--tile-h': `${tile.height}px`,
    '--tile-gap': `${tile.gap}px`,
    '--tile-font': `${tile.font}px`,
    '--colon-w': `${tile.colon}px`,
  } as CSSProperties
}
