import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { TodaySoFar } from '../../../live/types'
import {
  formatBlobsPerBlock,
  formatBytes,
  formatBytesPerSecond,
  formatGasPerSecond,
  formatInteger,
  formatPerSecond,
} from '../format'
import { BLOB_BYTES, blockMetrics, SLOT_SECONDS } from '../metrics'
import { useAnchor } from '../state/anchor'
import { posterOf, usePosters } from '../state/posters'
import { HistoryChart, type Metric } from '../ui/HistoryChart'
import { BlobMeter } from '../ui/Meters'
import { Rolling } from '../ui/Rolling'
import { Part, Section, Stat } from '../ui/Section'

const elapsed = (t: TodaySoFar) => t.slots * SLOT_SECONDS

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
      t.slots > 0 ? (t.blobs * BLOB_BYTES) / elapsed(t) : undefined,
    format: formatBytesPerSecond,
    kind: 'bucket',
  },
]

const EXECUTION_METRICS: Metric[] = [
  {
    id: 'tps',
    label: 'Transactions per second',
    pick: (p) => p.tps,
    today: (t) => (t.slots > 0 ? t.txs / elapsed(t) : undefined),
    format: formatPerSecond,
    kind: 'bucket',
  },
  {
    id: 'gas',
    label: 'Gas per second',
    pick: (p) => p.gasPerSecond,
    today: (t) => (t.slots > 0 ? t.gasUsed / elapsed(t) : undefined),
    format: formatGasPerSecond,
    kind: 'bucket',
  },
]

/** How much Ethereum carries: blob data for rollups, and its own execution */
export function Capacity({ order }: { order: number }) {
  const { block, head, today } = useAnchor()
  const metrics = block && blockMetrics(block)
  const limits = head.limits

  return (
    <Section
      id="capacity"
      order={order}
      title="Capacity"
      lede="Every block carries two things: blobs, the data rollups post so anyone can rebuild their state, and the execution of Ethereum's own transactions. Both have a target the fees steer towards and a hard limit."
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
        <Part id="throughput" title="Data for rollups">
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Stat
              label="Data in this block"
              cadence="block"
              value={
                <Rolling value={metrics?.dataBytes} format={formatBytes} />
              }
              sub={
                block &&
                `${block.blobCount} blobs of 128 KiB, ${limits.targetBlobs} target`
              }
            />
            <Stat
              label="Data throughput"
              cadence="block"
              value={
                <Rolling
                  value={metrics?.dataPerSecond}
                  format={formatBytesPerSecond}
                />
              }
              sub="This block's data over its 12-second slot"
            />
          </div>
          <BlobsInBlock />
          <div className="mt-8">
            <HistoryChart metrics={DATA_METRICS} withUpgrades />
          </div>
        </Part>

        <Part id="activity" title="Execution">
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Stat
              label="Gas per second"
              cadence="block"
              value={
                <Rolling
                  value={metrics?.gasPerSecond}
                  format={formatGasPerSecond}
                />
              }
              sub={
                block &&
                `Limit ${formatGasPerSecond(limits.gasLimit / SLOT_SECONDS)}`
              }
            />
            <Stat
              label="Transactions per second"
              cadence="block"
              value={<Rolling value={metrics?.tps} format={formatPerSecond} />}
              sub={
                <>
                  <Rolling value={metrics?.uops} format={formatPerSecond} />{' '}
                  user operations per second
                </>
              }
            />
            <Stat
              label="Transactions today"
              cadence="block"
              value={<Rolling value={today?.txs} format={formatInteger} />}
              sub="Since 00:00 UTC, up to this block"
            />
            <Stat
              label="Blocks today"
              cadence="block"
              value={<Rolling value={today?.blocks} format={formatInteger} />}
              sub={today && `${formatInteger(today.missed)} slots missed`}
            />
          </div>
          <div className="mt-8">
            <HistoryChart metrics={EXECUTION_METRICS} />
          </div>
        </Part>
      </div>
    </Section>
  )
}

/**
 * Who filled this block's blobs. The full live view stays on the blobs page;
 * this is the one block the page is anchored to.
 */
function BlobsInBlock() {
  const { block, head } = useAnchor()
  const posters = usePosters()
  const limits = head.limits
  return (
    <div className="mt-6 rounded-lg bg-surface-secondary/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-medium text-label-value-13 text-secondary">
          Who posted this block's blobs
        </span>
        <a
          href="/blobs"
          className="flex items-center gap-1 font-medium text-label-value-13 text-link hover:underline"
        >
          Live blobs
          <ArrowRightIcon className="size-3 fill-current" />
        </a>
      </div>
      <BlobMeter
        block={block}
        target={limits.targetBlobs}
        max={limits.maxBlobs}
      />
      <ul className="mt-3 flex min-h-12 flex-wrap gap-x-4 gap-y-1.5 text-label-value-13">
        {block?.blobs.map((p) => {
          const poster = posterOf(posters, p.posterId)
          return (
            <li key={p.posterId} className="flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-[2px]"
                style={{ background: poster.color }}
              />
              {poster.iconUrl && (
                <img
                  src={poster.iconUrl}
                  alt=""
                  className="size-4 rounded-full"
                />
              )}
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
