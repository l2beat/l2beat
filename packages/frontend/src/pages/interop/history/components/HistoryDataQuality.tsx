import { formatCurrency, formatInteger, UnixTime } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InteropHistoryData } from '~/server/features/layer2s/interop/history/types'
import { cn } from '~/utils/cn'
import { formatRange, formatTimestamp } from '~/utils/dates'
import type {
  HistoryCappedLane,
  HistoryTokenDay,
} from '../utils/applyHistoryExclusions'
import type { HistoryZeroDay } from '../utils/findZeroDays'
import { getShiftedWindow, type ShiftedWindow } from '../utils/getShiftedWindow'
import { HistoryInfo } from './HistoryInfo'

interface Props {
  data: InteropHistoryData
  /** Indices of the points in the chosen range. */
  range: [number, number]
  cappedLanes: HistoryCappedLane[]
  tokenDays: HistoryTokenDay[]
  zeroDays: HistoryZeroDay[]
}

type Cell = { className: string; title: string } | undefined

export function HistoryDataQuality({
  data,
  range,
  cappedLanes,
  tokenDays,
  zeroDays,
}: Props) {
  const [first, last] = range
  const points = data.points.slice(first, last + 1)
  const name = (id: string) =>
    data.protocols.find((p) => p.id === id)?.name ?? id
  const end = (i: number) => {
    const point = data.points[i]
    return point?.snapshot ?? point?.timestamp ?? 0
  }
  /** From the start of one point's 24 hours to the end of another's. */
  const span = (from: number, to: number) =>
    formatRange(end(from) - UnixTime.DAY, end(to))
  const label = (i: number) => span(i, i)

  const cappedAt = groupBy(cappedLanes, (l) => l.point)
  const tokenDaysAt = groupBy(tokenDays, (t) => t.point)
  const zeroDaysAt = groupBy(zeroDays, (z) => z.point)

  const missing = points.filter((p) => p.snapshot === null).length
  const shifted = points.filter(
    (p) => p.snapshot !== null && p.snapshot !== p.timestamp,
  ).length
  const example = points
    .map((_, k) => getShiftedWindow(data.points, first + k))
    .find((w) => w?.uncovered && w.doubled)
  const blocked = points.filter((p) => p.isBlocked).length
  const carried = points.filter((p) => p.carriedLanes > 0).length

  const strips: {
    title: string
    info: ReactNode
    summary: string
    cell: (i: number) => Cell
  }[] = [
    {
      title: 'Snapshots',
      info: <SnapshotsInfo example={example} />,
      summary: `${missing} missing, ${shifted} shifted window, ${blocked} blocked`,
      cell: (i) => {
        const p = data.points[i]
        if (!p) return undefined
        if (p.snapshot === null) {
          return { className: 'bg-negative', title: `${label(i)}: no snapshot` }
        }
        if (p.isBlocked) {
          return { className: 'bg-negative/50', title: `${label(i)}: blocked` }
        }
        const window = getShiftedWindow(data.points, i)
        if (window) {
          return {
            className: 'bg-warning',
            title: `Shifted window: ${describeShiftedWindow(window)}`,
          }
        }
        return { className: 'bg-chart-ethereum/60', title: label(i) }
      },
    },
    {
      title: 'Carried or partial lanes',
      info: (
        <>
          When a chain's syncers lag, its lanes in that snapshot are copied from
          the last good snapshot (carried) or computed from what had synced so
          far (partial, which undercounts). Since 20 Oct 2026 this replaced
          skipping the whole snapshot.
        </>
      ),
      summary: `${carried} points with lanes copied from older snapshots`,
      cell: (i) => {
        const p = data.points[i]
        if (!p || (p.carriedLanes === 0 && p.partialLanes === 0))
          return undefined
        return {
          className: 'bg-warning',
          title: `${label(i)}: ${p.carriedLanes} carried, ${p.partialLanes} partial`,
        }
      },
    },
    {
      title: 'Lanes over the cap',
      info: (
        <>
          Lane-days over the lane cap. They leave volume and flows only when
          excluded on the right.
        </>
      ),
      summary: `${cappedAt.size} points, ${formatCurrency(
        cappedLanes.reduce((sum, l) => sum + l.volume, 0),
        'usd',
      )}`,
      cell: (i) => {
        const at = cappedAt.get(i)
        if (!at) return undefined
        return {
          className: 'bg-negative',
          title: `${label(i)}: ${at.map((l) => `${name(l.id)} ${l.srcChain} → ${l.dstChain} ${formatCurrency(l.volume, 'usd')}`).join(', ')}`,
        }
      },
    },
    {
      title: 'Unusual token days',
      info: (
        <>
          A token-day far above its usual level on a protocol. It could be a
          price error or a real whale move. It leaves volume and flows only when
          excluded on the right.
        </>
      ),
      summary: `${tokenDaysAt.size} points, ${formatCurrency(
        tokenDays.reduce((sum, t) => sum + t.volume, 0),
        'usd',
      )}`,
      cell: (i) => {
        const at = tokenDaysAt.get(i)
        if (!at) return undefined
        return {
          className: 'bg-warning',
          title: `${label(i)}: ${at.map((t) => `${t.token} on ${name(t.id)} ${formatCurrency(t.volume, 'usd')}`).join(', ')}`,
        }
      },
    },
    {
      title: 'Zero days',
      info: (
        <>
          A usually active protocol with no transfers at all. An indexer outage
          is stored like this, as a day with no rows, but so is a paused bridge
          or a renamed plugin, so it is only marked.
        </>
      ),
      summary: `${zeroDaysAt.size} points`,
      cell: (i) => {
        const at = zeroDaysAt.get(i)
        if (!at) return undefined
        return {
          className: 'bg-secondary',
          title: `${label(i)}: ${at.map((z) => `${name(z.id)}, usually ${formatInteger(z.usual)}`).join(', ')}`,
        }
      },
    },
  ]

  const zeroDayRuns = toRuns(zeroDays)

  return (
    <PrimaryCard className="flex flex-col gap-5">
      <h2 className="font-bold text-heading-20">
        Where the data is wrong or missing
      </h2>
      <div className="flex flex-col gap-3">
        {strips.map((strip) => (
          <div key={strip.title}>
            <div className="flex items-baseline justify-between gap-2 text-label-value-13">
              <span className="font-bold">
                {strip.title}
                <HistoryInfo>{strip.info}</HistoryInfo>
              </span>
              <span className="text-secondary">{strip.summary}</span>
            </div>
            <div className="mt-1 flex h-4 gap-px">
              {points.map((_, k) => {
                const i = first + k
                const cell = strip.cell(i)
                return (
                  <div
                    key={i}
                    title={cell?.title}
                    className={cn(
                      'min-w-px flex-1 rounded-[1px]',
                      cell?.className ?? 'bg-surface-secondary',
                    )}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <TableSection title="Lanes over the cap" empty="None.">
          {cappedLanes.length > 0 && (
            <Table
              head={[
                'Day',
                'Protocol',
                'Lane',
                'Top token',
                'Volume',
                'Status',
              ]}
              rows={cappedLanes.map((l) => [
                label(l.point),
                name(l.id),
                `${l.srcChain} → ${l.dstChain}`,
                l.token,
                formatCurrency(l.volume, 'usd'),
                l.excluded ? 'Excluded' : 'Shown',
              ])}
              numeric={[4]}
            />
          )}
        </TableSection>
        <TableSection title="Unusual token days" empty="None.">
          {tokenDays.length > 0 && (
            <Table
              head={[
                'Day',
                'Protocol',
                'Token',
                'Lanes',
                'Volume',
                'Usual',
                'Status',
              ]}
              rows={tokenDays.map((t) => [
                label(t.point),
                name(t.id),
                t.token,
                t.lanes.length === 1
                  ? `${t.lanes[0]?.srcChain} → ${t.lanes[0]?.dstChain}`
                  : `${t.lanes.length} lanes`,
                formatCurrency(t.volume, 'usd'),
                formatCurrency(t.baseline, 'usd'),
                t.excluded ? 'Excluded' : 'Shown',
              ])}
              numeric={[4, 5]}
            />
          )}
        </TableSection>
        <TableSection title="Zero days" empty="None.">
          {zeroDayRuns.length > 0 && (
            <Table
              head={['Protocol', 'When', 'Usual transfers']}
              rows={zeroDayRuns.map((run) => [
                name(run.id),
                span(run.from, run.to),
                formatInteger(run.usual),
              ])}
              numeric={[2]}
            />
          )}
        </TableSection>
      </div>
    </PrimaryCard>
  )
}

function Table({
  head,
  rows,
  numeric,
}: {
  head: string[]
  rows: string[][]
  numeric: number[]
}) {
  return (
    <div className="mt-2 max-h-96 overflow-auto">
      <table className="w-full text-label-value-13">
        <thead className="sticky top-0 bg-surface-primary">
          <tr className="border-divider border-b">
            {head.map((h, k) => (
              <th
                key={h}
                className={cn(
                  'whitespace-nowrap py-2 pr-3 font-medium text-secondary',
                  numeric.includes(k) ? 'text-right' : 'text-left',
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-divider border-b last:border-0">
              {row.map((value, k) => (
                <td
                  key={k}
                  className={cn(
                    'whitespace-nowrap py-1.5 pr-3',
                    numeric.includes(k) && 'text-right tabular-nums',
                  )}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function groupBy<T>(items: T[], key: (item: T) => number) {
  const map = new Map<number, T[]>()
  for (const item of items) {
    const k = key(item)
    map.set(k, [...(map.get(k) ?? []), item])
  }
  return map
}

/** Consecutive zero days of one protocol, as one row. */
function toRuns(zeroDays: HistoryZeroDay[]) {
  const sorted = [...zeroDays].sort(
    (a, b) => a.id.localeCompare(b.id) || a.point - b.point,
  )
  const runs: { id: string; from: number; to: number; usual: number }[] = []
  for (const zeroDay of sorted) {
    const run = runs.at(-1)
    if (run && run.id === zeroDay.id && run.to === zeroDay.point - 1) {
      run.to = zeroDay.point
      run.usual = Math.max(run.usual, zeroDay.usual)
    } else {
      runs.push({
        id: zeroDay.id,
        from: zeroDay.point,
        to: zeroDay.point,
        usual: zeroDay.usual,
      })
    }
  }
  return runs.sort((a, b) => b.from - a.from)
}

function TableSection({
  title,
  empty,
  children,
}: {
  title: string
  empty: string
  children: ReactNode
}) {
  return (
    <div>
      <h3 className="font-bold text-heading-16">{title}</h3>
      {children || (
        <p className="mt-2 text-label-value-14 text-secondary">{empty}</p>
      )}
    </div>
  )
}

function SnapshotsInfo({ example }: { example: ShiftedWindow | undefined }) {
  return (
    <div className="flex flex-col gap-2">
      <p>
        Every hour a snapshot sums the 24 hours before it. After 14 days only
        each day's earliest snapshot is kept, normally the one at 00:00 UTC,
        which covers the day before.
      </p>
      <p>
        <span className="font-bold text-negative">Missing</span>: the day has no
        snapshot at all, for any protocol or chain.
      </p>
      <p>
        <span className="font-bold text-warning-text">Shifted window</span>: the
        00:00 snapshot is missing, so the day keeps a later one. Its 24 hours no
        longer line up with the days around it: some hours are in no point and
        some are in two. A single point is still a real 24 hours, but sums over
        several days are off.
        {example && <> For example, {describeShiftedWindow(example)}</>}
      </p>
      <p>
        <span className="font-bold">Blocked</span>: the promotion rules rejected
        the snapshot, so the site never served it.
      </p>
    </div>
  )
}

export function describeShiftedWindow(window: ShiftedWindow) {
  const parts = [
    `the snapshot at ${formatTimestamp(window.snapshot, { mode: 'datetime' })} covers ${formatHours(...window.covers)}.`,
  ]
  if (window.uncovered) {
    parts.push(`No point covers ${formatHours(...window.uncovered)}.`)
  }
  if (window.doubled) {
    parts.push(`${formatHours(...window.doubled)} is counted twice.`)
  }
  return parts.join(' ')
}

/** Like `formatRange`, but keeps the hours when the range crosses midnight. */
function formatHours(from: number, to: number) {
  return UnixTime.toStartOf(UnixTime(from), 'day') ===
    UnixTime.toStartOf(UnixTime(to - 1), 'day')
    ? formatRange(from, to)
    : `${formatTimestamp(from, { mode: 'datetime' })} — ${formatTimestamp(to, { mode: 'datetime' })}`
}
