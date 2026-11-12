import { useMemo } from 'react'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { formatBlockNumber, formatInteger, formatUsd } from '../format'
import { findSection } from '../risk'
import { useAnchor } from '../state/anchor'
import { type PosterInfo, posterOf, usePosters } from '../state/posters'
import { Part, Section, Stat } from '../ui/Section'

const TOP_POSTERS = 8

/**
 * Who relies on Ethereum: the systems posting blobs, up to the anchored
 * block, the value they secure, and the existing volume and flows section.
 */
export function Relies({
  order,
  entry,
}: {
  order: number
  entry: EthereumProjectPageEntry
}) {
  const flows = findSection(entry, 'InteropFlowsSection')
  // the section keeps its content but gives its id to this wrapper, where
  // old /projects/ethereum#interop-flows links now land
  const flowsItems = useMemo(
    () =>
      flows
        ? [
            {
              ...flows,
              props: { ...flows.props, id: 'interop-volume' as const },
            },
          ]
        : [],
    [flows],
  )

  return (
    <Section
      id="interop-flows"
      order={order}
      title="Who relies on it"
      lede="Rollups post their data to Ethereum as blobs and settle on it, so its security is theirs. These are the systems in the blocks on show, and the value they secure."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        <div className="flex flex-col gap-7">
          <Stat
            size="lg"
            label="Value secured by systems using Ethereum for data"
            cadence="day"
            value={formatUsd(entry.header.tvs)}
            sub="Summed across the L2s and L3s listed on ETHBEAT that use Ethereum for data. Sovereign rollups are not included."
          />
          <div className="flex flex-col gap-2.5">
            <span className="font-medium text-label-value-13 text-secondary">
              {formatInteger(entry.header.usedIn.length)} systems use Ethereum
              for data
            </span>
            <ProjectsUsedIn
              usedIn={entry.header.usedIn}
              className="flex-wrap justify-start"
            />
          </div>
        </div>
        <RecentPosters />
      </div>
      {flowsItems.length > 0 && (
        <div className="mt-6 [&_section]:scroll-mt-48">
          <ProjectDetails
            items={flowsItems}
            nested
            parentSection={String(order)}
          />
        </div>
      )}
    </Section>
  )
}

/** Blobs per poster across the window, up to and including the anchored block */
function RecentPosters() {
  const { head, block } = useAnchor()
  const posters = usePosters()
  const anchorSlot = block?.slot
  const ranking = useMemo(() => {
    if (anchorSlot === undefined) return undefined
    const counts = new Map<string, number>()
    let slots = 0
    for (const b of head.blocks) {
      if (b.slot > anchorSlot) continue
      slots++
      for (const p of b.blobs)
        counts.set(p.posterId, (counts.get(p.posterId) ?? 0) + p.blobs)
    }
    const rows = [...counts.entries()]
      .map(([id, blobs]) => ({ poster: posterOf(posters, id), blobs }))
      .sort((a, b) => b.blobs - a.blobs)
    return { rows, slots, total: rows.reduce((s, r) => s + r.blobs, 0) }
  }, [head.blocks, anchorSlot, posters])

  return (
    <Part title="Posting blobs right now">
      <p className="-mt-2 mb-4 text-label-value-13 text-secondary">
        {ranking && block?.number !== undefined
          ? `${formatInteger(ranking.total)} blobs in the ${ranking.slots} slots up to block ${formatBlockNumber(block.number)}`
          : 'Waiting for blocks'}
      </p>
      <ol className="flex min-h-[288px] flex-col gap-2">
        {ranking?.rows.slice(0, TOP_POSTERS).map((r) => (
          <PosterRow
            key={r.poster.id}
            poster={r.poster}
            blobs={r.blobs}
            share={r.blobs / Math.max(1, ranking.rows[0]?.blobs ?? 1)}
          />
        ))}
        {ranking && ranking.rows.length > TOP_POSTERS && (
          <li className="pt-1 text-label-value-13 text-secondary">
            and {ranking.rows.length - TOP_POSTERS} more, with{' '}
            {formatInteger(
              ranking.rows.slice(TOP_POSTERS).reduce((s, r) => s + r.blobs, 0),
            )}{' '}
            blobs between them
          </li>
        )}
      </ol>
    </Part>
  )
}

function PosterRow({
  poster,
  blobs,
  share,
}: {
  poster: PosterInfo
  blobs: number
  share: number
}) {
  const name = (
    <span className="flex min-w-0 items-center gap-2">
      {poster.iconUrl ? (
        <img
          src={poster.iconUrl}
          alt=""
          className="size-5 shrink-0 rounded-full"
        />
      ) : (
        <span
          className="size-5 shrink-0 rounded-full"
          style={{ background: poster.color }}
        />
      )}
      <span className="truncate font-medium">{poster.name}</span>
    </span>
  )
  return (
    <li className="grid grid-cols-[minmax(0,9rem)_1fr_3ch] items-center gap-3 text-label-value-14">
      {poster.href ? (
        <a href={poster.href} className="min-w-0 hover:underline">
          {name}
        </a>
      ) : (
        name
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-secondary">
        <div
          className="h-full origin-left rounded-full transition-transform duration-500 ease-out"
          style={{ background: poster.color, transform: `scaleX(${share})` }}
        />
      </div>
      <span className="text-right text-secondary tabular-nums">{blobs}</span>
    </li>
  )
}
