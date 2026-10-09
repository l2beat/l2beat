import { formatSeconds, SLOT_SECONDS } from '@l2beat/shared-pure'
import { useCallback, useMemo, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { BasicTableHeaderDividerRow } from '~/components/table/BasicTable'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
} from '~/components/table/Table'
import { TableLink } from '~/components/table/TableLink'
import { stickyTableColumnRowProps } from '~/components/table/useStickyTableHeader'
import {
  getLeftPinnedCellStyles,
  PINNED_CELL_ATTRIBUTE,
} from '~/components/table/utils/commonPinningStyles'
import { getRowClassNamesWithoutOpacity } from '~/components/table/utils/rowType'
import type { PostedWindow } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import { BUCKET_SLOTS } from '~/server/features/data-availability/live-blobs/liveBlobsSlots'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { Activity } from './Activity'
import {
  BLOB_KIB,
  formatAverage,
  formatKib,
  formatWhole,
} from './blocks/format'
import { useChainClock } from './chainClock'
import { readableColor } from './color'
import { useThemeTokens } from './hooks'
import { type Landing, useLandedTotal } from './landings'
import { Pop, RollingNumber, useFlash, useReorder, useTick } from './liveMotion'
import { type LivePoster, UNKNOWN_ID } from './model'
import { useLiveBlobs } from './useLiveBlobs'

interface Props {
  /** Every project that may post, with the stand-in for unknown senders last */
  posters: LivePoster[]
}

/**
 * # and the logo stay in view on a phone, as the name and numbers scroll
 * under them; the name would take most of a narrow screen
 */
const PINNED_COLUMNS = 2
/** Where the logo sticks until the sticky header measures the # column */
const RANK_WIDTH = 32

/** In the order `PosterRow` renders its cells */
const COLUMNS: {
  label: string
  align?: 'right'
  tooltip?: string
}[] = [
  { label: '#' },
  { label: '' },
  { label: 'Name' },
  {
    label: 'Activity',
    tooltip: `Blobs in every ${(BUCKET_SLOTS * SLOT_SECONDS) / 60} minutes of the window, newest on the right`,
  },
  { label: 'Blobs', align: 'right', tooltip: 'Blobs posted in the window' },
  {
    label: 'Posted',
    align: 'right',
    tooltip:
      'Data posted in the window, counting every blob as its full 128 KiB',
  },
  { label: 'Batches', align: 'right', tooltip: 'Blob transactions sent' },
  {
    label: 'Per batch',
    align: 'right',
    tooltip: 'Blobs in a batch, on average',
  },
  { label: 'Share', align: 'right', tooltip: 'Of all blobs in the window' },
  {
    label: 'Every',
    align: 'right',
    tooltip: 'Time from one batch to the next, on average over the window',
  },
  { label: 'Last batch', align: 'right' },
]

/** The legend's "+N more" links here, to the projects it leaves out */
export const LIVE_POSTERS_ID = 'live-posters'

/**
 * Who posted over the last 24 hours: the exact numbers behind
 * the colored squares, which nobody can count off a belt that keeps moving.
 * It moves with the belt: a project's row lights up as its batch lands, its
 * numbers count up, and rows slide past each other as the ranking changes.
 */
export function LivePosters({ posters }: Props) {
  const { data } = useLiveBlobs()
  const postedWindow = data?.window
  const rows = useMemo(
    () => postedWindow && toRows(postedWindow, posters),
    [postedWindow, posters],
  )
  // "Last batch" is told on the chain's clock, as the belt is: a device clock
  // a minute off would age every batch a minute, or make the newest "just now"
  const clock = useChainClock()
  const head = data?.head
  // and counts up between blocks, not only when they come
  useTick(1000)
  const progress = clock.progressNow()
  // the belt's colors, so a project reads the same here as on the belt
  const { surface } = useThemeTokens()

  const tableRef = useRef<HTMLDivElement>(null)
  useReorder(tableRef, rows?.map((row) => row.poster.id).join() ?? '')

  if (!postedWindow || !rows) return <PostersSkeleton />
  const seconds = postedWindow.slots * SLOT_SECONDS
  const totalBlobs = rows.reduce((sum, row) => sum + row.blobs, 0)

  return (
    <section
      id={LIVE_POSTERS_ID}
      aria-label="Who posted blobs in the last 24 hours"
    >
      <div ref={tableRef}>
        <Table
          stickyHeader
          header={
            <>
              {/* one per column: the pinned header copy takes its widths
                  from these */}
              <colgroup>
                {COLUMNS.map((column) => (
                  <col key={column.label} />
                ))}
              </colgroup>
              <TableHeader>
                <TableHeaderRow {...stickyTableColumnRowProps}>
                  {COLUMNS.map((column, index) => (
                    <TableHead
                      key={column.label}
                      align={column.align}
                      tooltip={column.tooltip}
                      {...pinnedCellProps(index)}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableHeaderRow>
                <BasicTableHeaderDividerRow />
              </TableHeader>
            </>
          }
        >
          <TableBody>
            {rows.map((row, index) => (
              <PosterRow
                key={row.poster.id}
                row={row}
                color={readableColor(row.poster.color, surface)}
                rank={index + 1}
                seconds={seconds}
                totalBlobs={totalBlobs}
                head={head}
                firstBucket={postedWindow.firstBucket}
                newestBlobs={postedWindow.newestBlobs}
                progress={progress}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

function PosterRow({
  row,
  color,
  rank,
  seconds,
  totalBlobs,
  head,
  firstBucket,
  newestBlobs,
  progress,
}: {
  row: Row
  /** The poster's color, made to stand out from the card */
  color: string
  rank: number
  seconds: number
  totalBlobs: number
  /** The newest slot, whose batches are counted in as the belt lands them */
  head: number | undefined
  firstBucket: number
  /** All the newest block brought, which the belt is landing */
  newestBlobs: number
  /** Slots since genesis now, with how far into the current one */
  progress: number
}) {
  const ref = useRef<HTMLTableRowElement>(null)
  const posterId = row.poster.id
  const isPosters = useCallback(
    (landing: Landing) => landing.posterId === posterId,
    [posterId],
  )
  const { value: blobs, arrival } = useLandedTotal(
    head,
    row.blobs,
    row.lastSlot === head ? row.lastBlobs : 0,
    newestBlobs,
    isPosters,
  )
  useFlash(ref, arrival, color)

  return (
    // a plain row, as TableRow keeps its element to itself, and the flash needs it
    <tr
      ref={ref}
      data-flip-key={row.poster.id}
      className="relative border-b border-b-divider md:[&>td]:h-10"
    >
      <TableCell {...pinnedCellProps(0, 'text-secondary tabular-nums')}>
        {rank}
      </TableCell>
      {/* sovereign chains and unknown senders have no page, so no link */}
      <TableCell {...pinnedCellProps(1, 'w-0 pr-1.5')}>
        {/* a bare link, as in other tables: the cell hugs the logo, so a
            hover box would not fit it */}
        {row.poster.href ? (
          <a href={row.poster.href}>
            <PosterLogo poster={row.poster} />
          </a>
        ) : (
          <PosterLogo poster={row.poster} />
        )}
      </TableCell>
      <TableCell>
        {/* the hover box stays in its own cell: reaching left under the
            pinned logo, it would be cut by the logo's fade */}
        <TableLink href={row.poster.href} className="md:ml-0 md:pl-1.5">
          <PosterName poster={row.poster} />
        </TableLink>
      </TableCell>
      <TableCell>
        {/* to the project's long-run chart, for those who want more than a day */}
        <TableLink
          href={row.poster.href && `${row.poster.href}#data-posted`}
          aria-label={`${row.poster.name} data posted`}
        >
          <Activity
            buckets={row.buckets}
            firstBucket={firstBucket}
            color={color}
          />
        </TableLink>
      </TableCell>
      <TableCell align="right" className="font-bold">
        <span className="relative">
          <RollingNumber value={blobs} format={formatWhole} />
          {/* beside the number rather than above it, so it stays in its own
              row and never rises under the header pinned over the first */}
          <Pop
            arrival={arrival}
            className="absolute inset-y-0 right-full mr-1.5 flex items-center text-label-value-12"
          />
        </span>
      </TableCell>
      <TableCell align="right">
        <RollingNumber value={blobs * BLOB_KIB} format={formatKib} />
      </TableCell>
      <TableCell align="right">
        <RollingNumber value={row.batches} format={formatWhole} />
      </TableCell>
      <TableCell align="right">
        <RollingNumber value={row.blobs / row.batches} format={formatAverage} />
      </TableCell>
      <TableCell align="right">
        <RollingNumber value={row.blobs / totalBlobs} format={formatPercent} />
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {/* one batch tells nothing of how often they come */}
        {row.batches > 1 ? formatSeconds(seconds / row.batches) : '–'}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {describeAgo((progress - row.lastSlot) * SLOT_SECONDS)}
      </TableCell>
    </tr>
  )
}

interface Row {
  poster: LivePoster
  blobs: number
  batches: number
  lastSlot: number
  lastBlobs: number
  buckets: number[]
}

/**
 * One row per poster, most blobs first. A project the page does not know of
 * is counted as unknown, as the belt draws it
 */
function toRows(postedWindow: PostedWindow, posters: LivePoster[]): Row[] {
  const byId = new Map(posters.map((poster) => [poster.id, poster]))
  const rows = new Map<string, Row>()
  for (const posted of postedWindow.posted) {
    const poster =
      byId.get(posted.projectId ?? UNKNOWN_ID) ?? byId.get(UNKNOWN_ID)
    if (!poster) continue
    const row = rows.get(poster.id)
    if (!row) {
      rows.set(poster.id, { poster, ...posted, buckets: [...posted.buckets] })
      continue
    }
    row.blobs += posted.blobs
    row.batches += posted.batches
    posted.buckets.forEach((blobs, i) => {
      row.buckets[i] = (row.buckets[i] ?? 0) + blobs
    })
    if (posted.lastSlot > row.lastSlot) {
      row.lastSlot = posted.lastSlot
      row.lastBlobs = posted.lastBlobs
    } else if (posted.lastSlot === row.lastSlot) {
      row.lastBlobs += posted.lastBlobs
    }
  }
  return [...rows.values()].sort((a, b) => b.blobs - a.blobs)
}

function PosterLogo({ poster }: { poster: LivePoster }) {
  if (poster.iconUrl) {
    return (
      <img
        src={poster.iconUrl}
        alt={`${poster.name} logo`}
        className="block size-5 min-w-5 rounded-full"
      />
    )
  }
  return (
    <span
      className="block size-5 min-w-5 rounded-full"
      style={{ backgroundColor: poster.color }}
    />
  )
}

function PosterName({ poster }: { poster: LivePoster }) {
  return (
    // a phone has room for the name or the numbers, so long names give way
    <span className="block truncate font-bold max-md:max-w-[7rem]">
      {poster.name}
    </span>
  )
}

/**
 * Sticks a cell of the first `PINNED_COLUMNS` to the left, on the card's color
 * so what scrolls under it does not show through
 */
function pinnedCellProps(index: number, className?: string) {
  if (index >= PINNED_COLUMNS) return { className }
  return {
    style: getLeftPinnedCellStyles(
      index,
      index * RANK_WIDTH,
      index === PINNED_COLUMNS - 1,
    ),
    className: cn(getRowClassNamesWithoutOpacity(null), className),
    [PINNED_CELL_ATTRIBUTE]: '',
  }
}

/**
 * About as many projects as post in a day, so the page below moves little
 * when the real rows come
 */
const SKELETON_ROWS = 36

/** The header's height and the rows' height, under their dividers */
function PostersSkeleton() {
  return (
    <div className="pb-3">
      <div className="flex h-[42px] items-center border-b border-b-divider">
        <Skeleton className="h-3 w-full rounded-sm" />
      </div>
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <div
          key={i}
          className="flex h-10 items-center border-b border-b-divider"
        >
          <Skeleton className="h-5 w-full" />
        </div>
      ))}
    </div>
  )
}

/** 36s ago, or "just now" */
function describeAgo(seconds: number) {
  const whole = Math.floor(seconds)
  if (whole <= 1) return 'just now'
  return `${formatSeconds(whole)} ago`
}
