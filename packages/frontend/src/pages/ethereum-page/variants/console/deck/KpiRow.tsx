import type { ReactNode } from 'react'
import type { EthereumHead, HeadBlock } from '../../../live/types'
import { BLOB_BYTES, SLOT_SECONDS, windowStats } from '../derive'
import {
  blobFeeUnit,
  fmtBlobFee,
  fmtBytes,
  fmtEth,
  fmtGwei,
  fmtNumber,
} from '../format'
import { usePerMinute } from '../live'
import { type Cadence, CadenceBadge, Unit } from '../ui/Panel'
import { Sparkline } from '../ui/Sparkline'
import { Ticker } from '../ui/Ticker'

/** One reading per signal, each with the last 64 blocks beside it */
export function KpiRow({ head }: { head: EthereumHead }) {
  const blocks = head.blocks
  const proposed = blocks.filter((b) => b.status === 'proposed')
  const block = head.head
  const last = proposed.at(-1)
  const stats = windowStats(blocks)
  const price = usePerMinute(block?.ethPriceUsd)
  const { limits } = head
  const blobUnit = blobFeeUnit(last?.blobBaseFeeWei ?? 1)
  const maxBytesPerSecond = (limits.maxBlobs * BLOB_BYTES) / SLOT_SECONDS

  return (
    <div className="grid grid-cols-2 gap-px bg-divider sm:grid-cols-4 md:col-span-12 lg:grid-cols-8">
      <Kpi
        label="Base fee"
        cadence="blk"
        value={<Ticker value={last?.baseFeeGwei} format={fmtGwei} />}
        unit="gwei"
        spark={series(proposed, (b) => b.baseFeeGwei)}
        foot={`+ ${last ? fmtGwei(last.priorityFeeGwei) : '—'} tip (median)`}
      />
      <Kpi
        label="Blob base fee"
        cadence="blk"
        value={
          <Ticker
            value={last?.blobBaseFeeWei}
            format={(v) => fmtBlobFee(v, blobUnit)}
          />
        }
        unit={blobUnit}
        spark={series(proposed, (b) => b.blobBaseFeeWei)}
        floor={0}
        foot="per unit of blob gas"
      />
      <Kpi
        label="Gas used"
        cadence="blk"
        value={
          <Ticker
            value={last ? (last.gasUsed / last.gasLimit) * 100 : undefined}
            format={(v) => fmtNumber(v, 1)}
          />
        }
        unit="%"
        spark={series(proposed, (b) => (b.gasUsed / b.gasLimit) * 100)}
        reference={(limits.gasTarget / limits.gasLimit) * 100}
        floor={0}
        foot={`target ${fmtNumber(limits.gasTarget / 1e6)}M of ${fmtNumber(limits.gasLimit / 1e6)}M`}
      />
      <Kpi
        label="Blobs in block"
        cadence="blk"
        value={<Ticker value={last?.blobCount} format={fmtWhole} />}
        unit={`/ ${limits.maxBlobs}`}
        spark={series(proposed, (b) => b.blobCount)}
        reference={limits.targetBlobs}
        floor={0}
        foot={`target ${limits.targetBlobs} · max ${limits.maxBlobs}`}
      />
      <Kpi
        label="Transactions/s"
        cadence="blk"
        value={
          <Ticker
            value={block ? stats.tps : undefined}
            format={(v) => fmtNumber(v, 1)}
          />
        }
        unit="TPS"
        spark={series(blocks, (b) => b.txCount / SLOT_SECONDS)}
        floor={0}
        foot={`${block ? fmtNumber(stats.uops, 1) : '—'} UOPS · 64 blk`}
      />
      <Kpi
        label="Blob data"
        cadence="blk"
        value={
          <Ticker
            value={block ? stats.bytesPerSecond / 1024 : undefined}
            format={(v) => fmtNumber(v, 1)}
          />
        }
        unit="KiB/s"
        spark={series(blocks, (b) => (b.blobCount * BLOB_BYTES) / SLOT_SECONDS)}
        floor={0}
        foot={`max ${fmtBytes(maxBytesPerSecond)}/s`}
      />
      <Kpi
        label="Burned"
        cadence="blk"
        value={<Ticker value={last?.burnedEth} format={fmtEth} />}
        unit="ETH"
        spark={series(proposed, (b) => b.burnedEth)}
        floor={0}
        foot={`${block ? fmtEth(stats.burnedEth) : '—'} in 64 blk`}
      />
      <Kpi
        label="ETH price"
        cadence="1m"
        value={<Ticker value={price} format={fmtPrice} />}
        unit="USD"
        spark={series(blocks, (b) => b.ethPriceUsd)}
        foot="per ETH"
      />
    </div>
  )
}

function Kpi({
  label,
  cadence,
  value,
  unit,
  spark,
  reference,
  floor,
  foot,
}: {
  label: string
  cadence: Cadence
  value: ReactNode
  unit: string
  spark: number[]
  reference?: number
  floor?: number
  foot: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 bg-surface-primary px-3 pt-2 pb-2.5">
      <div className="flex items-center justify-between gap-1.5 text-[11.5px] text-secondary leading-4">
        <span className="truncate">{label}</span>
        <CadenceBadge cadence={cadence} />
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="whitespace-nowrap font-medium text-[19px] text-primary leading-6">
          {value}
          <Unit>{unit}</Unit>
        </span>
        <Sparkline
          values={spark}
          reference={reference}
          floor={floor}
          width={52}
          height={20}
          label={`${label}, last 64 blocks`}
          className="mb-0.5"
        />
      </div>
      <div className="truncate font-mono text-[10px] text-secondary leading-3">
        {foot}
      </div>
    </div>
  )
}

function series(blocks: HeadBlock[], pick: (b: HeadBlock) => number) {
  return blocks.map(pick)
}

function fmtWhole(value: number) {
  return fmtNumber(Math.round(value))
}

/** To the dollar: cents on a per-minute price are noise */
function fmtPrice(value: number) {
  return fmtNumber(Math.round(value))
}
