import { formatSeconds } from '@l2beat/shared-pure'
import { useCallback, useMemo, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
} from '~/components/table/Table'
import { stickyTableColumnRowProps } from '~/components/table/useStickyTableHeader'
import type { PostedWindow } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import { SLOT_SECONDS, slotStart } from '~/utils/beaconSlots'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { Activity } from './Activity'
import {
  BLOB_KIB,
  formatAverage,
  formatKib,
  formatRate,
  formatWhole,
} from './blocks/format'
import { toRgba } from './color'
import { type Landing, useHeldUntilLanded } from './landings'
import { Pop, RollingNumber, useFlash, useNow, useReorder } from './liveMotion'
import { type LivePoster, UNKNOWN_ID } from './model'
import { useLiveBlobs } from './useLiveBlobs'

interface Props {
  /** Every project that may post, with the stand-in for unknown senders last */
  posters: LivePoster[]
  highlighted: string | undefined
  onSelect: (posterId: string) => void
}

/** In the order `PosterRow` renders its cells */
const COLUMNS: {
  label: string
  align?: 'right'
  tooltip?: string
}[] = [
  { label: '#' },
  { label: 'Name' },
  {
    label: 'Activity',
    tooltip: 'Blobs in every five minutes of the window, newest on the right',
  },
  { label: 'Blobs', align: 'right', tooltip: 'Blobs posted in the window' },
  {
    label: 'Posted',
    align: 'right',
    tooltip:
      'Data posted in the window, counting every blob as its full 128 KiB',
  },
  { label: 'Share', align: 'right', tooltip: 'Of all blobs in the window' },
  {
    label: 'KiB/s',
    align: 'right',
    tooltip: 'Data posted per second, on average over the window',
  },
  { label: 'Batches', align: 'right', tooltip: 'Blob transactions sent' },
  {
    label: 'Per batch',
    align: 'right',
    tooltip: 'Blobs in a batch, on average',
  },
  {
    label: 'Every',
    align: 'right',
    tooltip: 'Time from one batch to the next, on average over the window',
  },
  { label: 'Last batch', align: 'right' },
]

/**
 * Who posted over the last hour, as the belt saw it: the exact numbers behind
 * the colored squares, which nobody can count off a belt that keeps moving.
 * It moves with the belt: a project's row lights up as its batch lands, its
 * numbers count up, and rows slide past each other as the ranking changes.
 */
export function LivePosters({ posters, highlighted, onSelect }: Props) {
  const { data } = useLiveBlobs()
  const hour = data?.window
  const rows = useMemo(() => hour && toRows(hour, posters), [hour, posters])
  // "Last batch" counts up between blocks, not only when they come
  const now = useNow(1000)

  const tableRef = useRef<HTMLDivElement>(null)
  useReorder(tableRef, rows?.map((row) => row.poster.id).join() ?? '')

  if (!hour || !rows) return <PostersSkeleton />
  const seconds = hour.slots * SLOT_SECONDS
  const totalBlobs = rows.reduce((sum, row) => sum + row.blobs, 0)

  return (
    <section aria-label="Who posted blobs in the last hour">
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
                  {COLUMNS.map((column) => (
                    <TableHead
                      key={column.label}
                      align={column.align}
                      tooltip={column.tooltip}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableHeaderRow>
              </TableHeader>
            </>
          }
        >
          <TableBody>
            {rows.map((row, index) => (
              <PosterRow
                key={row.poster.id}
                row={row}
                rank={index + 1}
                seconds={seconds}
                totalBlobs={totalBlobs}
                head={data?.head}
                firstBucket={hour.firstBucket}
                now={now}
                highlighted={highlighted === row.poster.id}
                onSelect={onSelect}
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
  rank,
  seconds,
  totalBlobs,
  head,
  firstBucket,
  now,
  highlighted,
  onSelect,
}: {
  row: Row
  rank: number
  seconds: number
  totalBlobs: number
  /** The newest slot, whose batches are counted in as the belt lands them */
  head: number | undefined
  firstBucket: number
  now: number
  highlighted: boolean
  onSelect: (posterId: string) => void
}) {
  const ref = useRef<HTMLTableRowElement>(null)
  const posterId = row.poster.id
  const isPosters = useCallback(
    (landing: Landing) => landing.posterId === posterId,
    [posterId],
  )
  const { held, arrival } = useHeldUntilLanded(
    head,
    row.lastSlot === head ? row.lastBlobs : 0,
    isPosters,
  )
  const blobs = row.blobs - held
  useFlash(ref, arrival, toRgba(row.poster.color, 0.22))

  return (
    // a plain row, as TableRow keeps its element to itself, and the flash needs it
    <tr
      ref={ref}
      data-flip-key={row.poster.id}
      onClick={() => onSelect(row.poster.id)}
      aria-selected={highlighted}
      className={cn(
        'relative cursor-pointer border-b border-b-divider transition-colors hover:bg-pure-black/5 dark:hover:bg-pure-white/10 md:[&>td]:h-10',
        highlighted && 'bg-pure-black/5 dark:bg-pure-white/10',
      )}
    >
      <TableCell className="text-secondary tabular-nums">{rank}</TableCell>
      <TableCell>
        <PosterName poster={row.poster} />
      </TableCell>
      <TableCell>
        <Activity
          buckets={row.buckets}
          firstBucket={firstBucket}
          color={row.poster.color}
        />
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
        <RollingNumber value={row.blobs / totalBlobs} format={formatPercent} />
      </TableCell>
      <TableCell align="right">
        <RollingNumber
          value={(blobs * BLOB_KIB) / seconds}
          format={formatRate}
        />
      </TableCell>
      <TableCell align="right">
        <RollingNumber value={row.batches} format={formatWhole} />
      </TableCell>
      <TableCell align="right">
        <RollingNumber value={row.blobs / row.batches} format={formatAverage} />
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {/* one batch tells nothing of how often they come */}
        {row.batches > 1 ? formatSeconds(seconds / row.batches) : '–'}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {describeAgo(now - slotStart(row.lastSlot))}
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
function toRows(hour: PostedWindow, posters: LivePoster[]): Row[] {
  const byId = new Map(posters.map((poster) => [poster.id, poster]))
  const rows = new Map<string, Row>()
  for (const posted of hour.posted) {
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

function PosterName({ poster }: { poster: LivePoster }) {
  return (
    <span className="flex items-center gap-2 font-bold">
      {poster.iconUrl ? (
        <img
          src={poster.iconUrl}
          alt=""
          className="size-5 shrink-0 rounded-full"
        />
      ) : (
        <span
          className="size-5 shrink-0 rounded-full"
          style={{ backgroundColor: poster.color }}
        />
      )}
      {/* a phone has room for the name or the numbers, so long names give way */}
      <span className="truncate max-md:max-w-[7rem]">{poster.name}</span>
    </span>
  )
}

function PostersSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
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
