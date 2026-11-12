import { useRef, useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useReorder } from '~/pages/blobs/components/live-blobs/liveMotion'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { cn } from '~/utils/cn'
import type { EthereumHead } from '../../../live/types'
import { formatPercentage, formatUsd, formatWhole } from '../format'
import type { PosterRow, WindowStats } from '../model'
import { SYSTEMS_ANCHOR } from './anchors'
import { SectionShell } from './SectionShell'

/** Rows before "Show all": the inner and middle orbits, and a few more */
const COLLAPSED_ROWS = 12
const STACKED_ICONS = 14

export function RelianceSection({
  entry,
  live,
  stats,
}: {
  entry: EthereumProjectPageEntry
  live: EthereumHead
  stats: WindowStats
}) {
  const [expanded, setExpanded] = useState(false)
  const rows = expanded ? stats.rows : stats.rows.slice(0, COLLAPSED_ROWS)
  const headSlot = live.head?.slot
  const tableRef = useRef<HTMLTableSectionElement>(null)
  useReorder(tableRef, rows.map((r) => r.poster.id).join())
  const { usedIn } = entry.header

  return (
    <SectionShell
      id={SYSTEMS_ANCHOR}
      order={3}
      title="Who relies on it"
      lede="Rollups and other systems post their data to Ethereum and inherit its guarantees: if Ethereum stops, they stop. These are the ones posting blobs right now, ranked over the last 64 slots and updated every block."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <div className="text-label-value-13 text-secondary">
            Value secured by systems using Ethereum for data
          </div>
          <div className="mt-2 font-bold text-heading-40 tabular-nums">
            {formatUsd(entry.header.tvs)}
          </div>
          <div className="mt-1 text-label-value-12 text-secondary">
            Across {usedIn.length} systems, updated daily
          </div>
        </div>
        <ul className="-space-x-1.5 flex items-center">
          {usedIn.slice(0, STACKED_ICONS).map((project) => (
            <li key={project.id}>
              <a href={project.url} title={project.name}>
                <img
                  src={project.icon}
                  alt={project.name}
                  width={28}
                  height={28}
                  className="size-7 rounded-full bg-surface-primary ring-2 ring-surface-primary"
                />
              </a>
            </li>
          ))}
          {usedIn.length > STACKED_ICONS && (
            <li className="flex size-7 items-center justify-center rounded-full bg-surface-secondary font-medium text-[11px] text-secondary ring-2 ring-surface-primary">
              +{usedIn.length - STACKED_ICONS}
            </li>
          )}
        </ul>
      </div>

      <div className="mt-8 flex items-baseline justify-between gap-4">
        <h3 className="font-bold text-heading-16">Posting blobs now</h3>
        <span className="text-label-value-12 text-secondary">
          last 64 slots, per block
        </span>
      </div>
      <div className="-mx-4 mt-3 overflow-x-auto px-4 md:mx-0 md:px-0">
        <table className="w-full min-w-[560px] border-collapse text-label-value-14">
          <thead>
            <tr className="border-divider border-b text-left text-label-value-12 text-secondary">
              <th className="w-10 py-2 pr-2 font-medium">#</th>
              <th className="py-2 pr-4 font-medium">System</th>
              <th className="w-[34%] py-2 pr-4 font-medium">Share of blobs</th>
              <th className="py-2 pr-4 text-right font-medium">Blobs</th>
              <th className="py-2 pr-4 text-right font-medium">In head</th>
              <th className="py-2 text-right font-medium">Last posted</th>
            </tr>
          </thead>
          <tbody ref={tableRef}>
            {rows.length === 0 &&
              Array.from({ length: 6 }, (_, i) => (
                <tr key={i} className="border-divider border-b">
                  <td colSpan={6} className="py-3">
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))}
            {rows.map((row) => (
              <SystemRow
                key={row.poster.id}
                row={row}
                topShare={stats.rows[0]?.share ?? 1}
                headSlot={headSlot}
              />
            ))}
          </tbody>
        </table>
      </div>
      {stats.rows.length > COLLAPSED_ROWS && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 rounded-md px-2 py-1 font-medium text-label-value-13 text-link underline"
        >
          {expanded
            ? 'Show fewer'
            : `Show all ${stats.rows.length} posting now`}
        </button>
      )}
    </SectionShell>
  )
}

function SystemRow({
  row,
  topShare,
  headSlot,
}: {
  row: PosterRow
  topShare: number
  headSlot: number | undefined
}) {
  const ago = headSlot !== undefined ? headSlot - row.lastSlot : undefined
  const { poster } = row
  return (
    <tr
      data-flip-key={poster.id}
      className="border-divider border-b last:border-none"
    >
      <td className="py-2.5 pr-2 text-secondary tabular-nums">{row.rank}</td>
      <td className="py-2.5 pr-4">
        <div className="flex items-center gap-2.5">
          {poster.iconUrl ? (
            <img
              src={poster.iconUrl}
              alt=""
              width={20}
              height={20}
              className="size-5 shrink-0 rounded-full"
            />
          ) : (
            <span
              aria-hidden
              className={cn(
                'size-5 shrink-0 rounded-full',
                poster.isUnattributed &&
                  'border border-secondary border-dashed bg-surface-secondary',
              )}
              style={
                poster.isUnattributed
                  ? undefined
                  : { backgroundColor: poster.color }
              }
            />
          )}
          {poster.href ? (
            <a
              href={poster.href}
              className="truncate font-medium hover:underline"
            >
              {poster.name}
            </a>
          ) : (
            <span className="truncate font-medium">{poster.name}</span>
          )}
        </div>
      </td>
      <td className="py-2.5 pr-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="h-full origin-left rounded-full transition-transform duration-700 ease-out"
              style={{
                transform: `scaleX(${row.share / topShare})`,
                backgroundColor: poster.isUnattributed
                  ? 'var(--secondary)'
                  : poster.color,
              }}
            />
          </div>
          <span className="w-12 text-right tabular-nums">
            {formatPercentage(row.share, 1)}
          </span>
        </div>
      </td>
      <td className="py-2.5 pr-4 text-right tabular-nums">
        {formatWhole(row.blobs)}
      </td>
      <td className="py-2.5 pr-4 text-right tabular-nums">
        {row.inHead > 0 ? (
          <span className="font-medium">{row.inHead}</span>
        ) : (
          <span className="text-secondary">–</span>
        )}
      </td>
      <td className="py-2.5 text-right text-secondary tabular-nums">
        {ago === undefined
          ? ''
          : ago === 0
            ? 'this block'
            : `${ago} ${ago === 1 ? 'slot' : 'slots'} ago`}
      </td>
    </tr>
  )
}
