import { formatSeconds, SLOT_SECONDS } from '@l2beat/shared-pure'
import { memo, useCallback, useRef, useState } from 'react'
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
import { useInterval } from '~/hooks/useInterval'
import type { LiveBlobs } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
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
import { anyLanding, type Landing, useLandedTotal } from './landings'
import {
  FLASH_CLASS_NAME,
  Pop,
  RollingNumber,
  useFlash,
  useReorder,
} from './liveMotion'
import type { LivePoster, PosterTotal, PosterTotals } from './model'

interface Props {
  live: LiveBlobs | undefined
  totals: PosterTotals | undefined
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
    label: 'Interval',
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
export function LivePosters({ live: data, totals }: Props) {
  const postedWindow = data?.window
  const rows = totals?.posters
  const head = data?.head
  // the belt's colors, so a project reads the same here as on the belt
  const { surface } = useThemeTokens()
  const newest = postedWindow?.newestBlobs ?? 0
  const { value: totalBlobs } = useLandedTotal(
    head,
    totals?.blobs ?? 0,
    newest,
    newest,
    anyLanding,
  )

  const tableRef = useRef<HTMLDivElement>(null)
  useReorder(tableRef, rows?.map((row) => row.poster.id).join() ?? '')

  if (!postedWindow || !rows) return <PostersSkeleton />
  const seconds = postedWindow.slots * SLOT_SECONDS

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
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

/**
 * Rendered again only when what it shows changes, not with the clock: the
 * ages tick in cells of their own
 */
const PosterRow = memo(function PosterRow({
  row,
  color,
  rank,
  seconds,
  totalBlobs,
  head,
  firstBucket,
  newestBlobs,
}: {
  row: PosterTotal
  /** The poster's color, made to stand out from the card */
  color: string
  rank: number
  seconds: number
  /** Of all posters, as landed so far */
  totalBlobs: number
  /** The newest slot, whose batches are counted in as the belt lands them */
  head: number | undefined
  firstBucket: number
  /** All the newest block brought, which the belt is landing */
  newestBlobs: number
}) {
  const ref = useRef<HTMLTableRowElement>(null)
  const posterId = row.poster.id
  const isPosters = useCallback(
    (landing: Landing) => landing.posterId === posterId,
    [posterId],
  )
  const {
    value: blobs,
    arrival,
    landing,
  } = useLandedTotal(
    head,
    row.blobs,
    row.lastSlot === head ? row.lastBlobs : 0,
    newestBlobs,
    isPosters,
  )
  // the batches wait with the blobs, so no column runs ahead of the belt
  const batches = useHeldWhile(landing, row.batches)
  useFlash(ref, arrival, color)

  return (
    // a plain row, as TableRow keeps its element to itself, and the flash needs it
    <tr
      ref={ref}
      data-flip-key={row.poster.id}
      className={cn(
        'relative border-b border-b-divider md:[&>td]:h-10',
        FLASH_CLASS_NAME,
      )}
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
        {row.poster.href ? (
          <TableLink href={row.poster.href} className="md:ml-0 md:pl-1.5">
            <PosterName poster={row.poster} />
          </TableLink>
        ) : (
          // as far in as a linked name, which its hover box pads
          <PosterName poster={row.poster} className="md:pl-1.5" />
        )}
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
        <RollingNumber value={batches} format={formatWhole} />
      </TableCell>
      <TableCell align="right">
        <RollingNumber value={blobs / batches} format={formatAverage} />
      </TableCell>
      <TableCell align="right">
        <RollingNumber
          value={blobs / Math.max(1, totalBlobs)}
          format={formatPercent}
        />
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {/* one batch tells nothing of how often they come */}
        {batches > 1 ? formatSeconds(seconds / batches) : '–'}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        <LastBatchAgo lastSlot={row.lastSlot} />
      </TableCell>
    </tr>
  )
})

/**
 * How long since a poster's last batch, counting up between blocks, not only
 * when they come, and alone in the row to render every second. On the
 * chain's clock, as the belt is: a device clock a minute off would age every
 * batch a minute, or make the newest "just now"
 */
function LastBatchAgo({ lastSlot }: { lastSlot: number }) {
  const clock = useChainClock()
  const [, rerender] = useState(0)
  useInterval(() => rerender((tick) => tick + 1), 1000)
  return describeAgo((clock.progressNow() - lastSlot) * SLOT_SECONDS)
}

/** `value` as it was before `holding` began, while it lasts */
function useHeldWhile<T>(holding: boolean, value: T) {
  const held = useRef(value)
  if (!holding) held.current = value
  return held.current
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

function PosterName({
  poster,
  className,
}: {
  poster: LivePoster
  className?: string
}) {
  return (
    // a phone has room for the name or the numbers, so long names give way
    <span
      className={cn('block truncate font-bold max-md:max-w-[7rem]', className)}
    >
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
    className: cn(
      getRowClassNamesWithoutOpacity(null),
      FLASH_CLASS_NAME,
      className,
    ),
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
