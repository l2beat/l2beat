import { useMemo, useState } from 'react'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import {
  formatBlobsPerBlock,
  formatBytes,
  formatBytesPerSecond,
  formatCount,
  formatInteger,
  formatPercent,
} from '../format'
import { useEthereumHead } from '../live/EthereumHeadContext'
import { BLOB_BYTES, elapsedToday } from '../metrics'
import { useHistory } from '../state/history'
import { type PosterInfo, posterOf, usePosters } from '../state/posters'
import { HistoryChart, type Metric } from '../ui/HistoryChart'
import { BlobMeter } from '../ui/Meters'
import { Part, Section, Segmented } from '../ui/Section'
import { Change, Fig, Story } from '../ui/Story'
import {
  blocksOf,
  changeOf,
  lastTwoWeeks,
  type PosterShare,
  posterShares,
  sumOf,
  type Weeks,
} from '../weekly'

const TOP_POSTERS = 8

const DATA_METRICS: Metric[] = [
  {
    id: 'blobs',
    label: 'Blobs per block',
    pick: (p) => p.avgBlobsPerBlock,
    today: (t) => (t.blocks > 0 ? t.blobs / t.blocks : undefined),
    format: formatBlobsPerBlock,
    kind: 'bucket',
  },
  {
    id: 'data',
    label: 'Data per second',
    pick: (p) => p.dataPerSecond,
    today: (t) =>
      t.slots > 0 ? (t.blobs * BLOB_BYTES) / elapsedToday(t) : undefined,
    format: formatBytesPerSecond,
    kind: 'bucket',
  },
]

/**
 * Blobs: the data rollups post to Ethereum, who posts it and how much. The
 * anchor keeps the old Throughput section's id, so its links land here.
 */
export function Blobs({ order }: { order: number }) {
  const history = useHistory()
  const posters = usePosters()
  const weeks = useMemo(() => lastTwoWeeks(history), [history])
  const shares = useMemo(
    () => (weeks ? posterShares(weeks.current, [...posters.values()]) : []),
    [weeks, posters],
  )

  return (
    <Section
      id="throughput"
      order={order}
      title="Blobs"
      story={<BlobsStory weeks={weeks} shares={shares} />}
      lede="Rollups post their data to Ethereum as blobs, so anyone can rebuild their state from it. Each block has a blob target the blob fee steers towards, and a hard limit."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        <WhoPosts shares={shares} />
        <Part title="Blob data, day by day">
          <HistoryChart metrics={DATA_METRICS} withUpgrades />
        </Part>
      </div>
      <NewestBlock />
    </Section>
  )
}

function BlobsStory({
  weeks,
  shares,
}: {
  weeks: Weeks | undefined
  shares: PosterShare[]
}) {
  const { limits } = useEthereumHead()
  const posters = usePosters()
  if (!weeks) return null
  const { current, previous } = weeks
  const blobs = sumOf(current, (p) => p.blobs)
  const perBlock = blobs / sumOf(current, blocksOf)
  const [first, second] = shares
    .filter((s) => posterOf(posters, s.posterId).href)
    .slice(0, 2)
  return (
    <Story weeks={weeks}>
      Rollups posted <Fig>{formatCount(blobs)} blobs</Fig>,{' '}
      <Fig>{formatBytes(blobs * BLOB_BYTES)}</Fig> of data,{' '}
      <Change
        change={changeOf(
          blobs,
          sumOf(previous, (p) => p.blobs),
        )}
      />
      . Blocks carried <Fig>{formatBlobsPerBlock(perBlock)}</Fig> blobs on
      average, against a target of {limits.targetBlobs}.
      {first && second && (
        <>
          {' '}
          <Fig>{posterOf(posters, first.posterId).name}</Fig> posted{' '}
          <Fig>{formatPercent(first.share)}</Fig> of them,{' '}
          <Fig>{posterOf(posters, second.posterId).name}</Fig>{' '}
          <Fig>{formatPercent(second.share)}</Fig>.
        </>
      )}
    </Story>
  )
}

type Window = 'week' | 'live'

const WINDOWS = [
  { id: 'week', label: 'Past 7 days' },
  { id: 'live', label: 'Last 64 slots' },
] as const

/** Who posts blobs: the week's shares, or the slots on the chain above, live */
function WhoPosts({ shares }: { shares: PosterShare[] }) {
  const [window, setWindow] = useState<Window>('week')
  const live = useLiveShares()
  const rows = window === 'week' ? shares : live
  const top = rows[0]?.blobs ?? 1

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-heading-18">Who posts them</h3>
        <Segmented
          label="Window"
          options={WINDOWS}
          value={window}
          onChange={setWindow}
        />
      </div>
      <ol className="flex min-h-[288px] flex-col gap-2">
        {rows.slice(0, TOP_POSTERS).map((r) => (
          <PosterRow
            key={r.posterId}
            posterId={r.posterId}
            blobs={r.blobs}
            share={r.share}
            width={r.blobs / Math.max(1, top)}
          />
        ))}
        {rows.length > TOP_POSTERS && (
          <li className="pt-1 text-label-value-13 text-secondary">
            and {rows.length - TOP_POSTERS} more, with{' '}
            {formatPercent(
              rows.slice(TOP_POSTERS).reduce((s, r) => s + r.share, 0),
            )}{' '}
            between them
          </li>
        )}
      </ol>
    </div>
  )
}

function useLiveShares(): PosterShare[] {
  const { blocks } = useEthereumHead()
  return useMemo(() => {
    const counts = new Map<string, number>()
    for (const b of blocks)
      for (const p of b.blobs)
        counts.set(p.posterId, (counts.get(p.posterId) ?? 0) + p.blobs)
    const total = [...counts.values()].reduce((s, n) => s + n, 0)
    return [...counts.entries()]
      .map(([posterId, blobs]) => ({
        posterId,
        blobs,
        share: total === 0 ? 0 : blobs / total,
      }))
      .sort((a, b) => b.blobs - a.blobs)
  }, [blocks])
}

function PosterRow({
  posterId,
  blobs,
  share,
  width,
}: {
  posterId: string
  blobs: number
  share: number
  width: number
}) {
  const poster = posterOf(usePosters(), posterId)
  return (
    <li className="grid grid-cols-[minmax(0,9rem)_1fr_5ch] items-center gap-3 text-label-value-14">
      <PosterName poster={poster} />
      <div
        className="h-2.5 overflow-hidden rounded-full bg-surface-secondary"
        title={`${formatInteger(blobs)} blobs`}
      >
        <div
          className="h-full origin-left rounded-full transition-transform duration-500 ease-out"
          style={{ background: poster.color, transform: `scaleX(${width})` }}
        />
      </div>
      <span className="text-right text-secondary tabular-nums">
        {formatPercent(share)}
      </span>
    </li>
  )
}

function PosterName({ poster }: { poster: PosterInfo }) {
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
  return poster.href ? (
    <a href={poster.href} className="min-w-0 hover:underline">
      {name}
    </a>
  ) : (
    name
  )
}

/**
 * The newest block's blobs, coloured by poster with the names beside them.
 * The full live view stays on the blobs page.
 */
function NewestBlock() {
  const { head: block, limits } = useEthereumHead()
  const posters = usePosters()
  return (
    <div className="mt-10 rounded-lg bg-surface-secondary/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-medium text-label-value-13 text-secondary">
          In the newest block: {block ? block.blobCount : '—'} blobs of{' '}
          {limits.targetBlobs} target, {limits.maxBlobs} max
        </span>
        <a
          href="/blobs"
          className="flex shrink-0 items-center gap-1 font-medium text-label-value-13 text-link hover:underline"
        >
          Live blobs
          <ArrowRightIcon className="size-3 fill-current" />
        </a>
      </div>
      <BlobMeter
        block={block}
        target={limits.targetBlobs}
        max={limits.maxBlobs}
        byPoster
      />
      <ul className="mt-3 flex min-h-6 flex-wrap gap-x-4 gap-y-1.5 text-label-value-13">
        {block?.blobs.map((p) => {
          const poster = posterOf(posters, p.posterId)
          return (
            <li key={p.posterId} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-[2px]"
                style={{ background: poster.color }}
              />
              <span>{poster.name}</span>
              <span className="text-secondary tabular-nums">{p.blobs}</span>
            </li>
          )
        })}
        {block && block.blobs.length === 0 && (
          <li className="text-secondary">No blobs in this block</li>
        )}
      </ul>
    </div>
  )
}
