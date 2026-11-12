import { formatTimestamp } from '~/utils/dates'
import type { BlockLimits, HeadBlock } from '../../../live/types'
import {
  formatGas,
  formatInteger,
  formatPercent,
  formatSmart,
  formatWei,
  shortHash,
} from '../format'

const TOOLTIP_WIDTH = 236

/** What one beat was: follows the pointer, or the finger on a phone */
export function BeatTooltip({
  block,
  limits,
  x,
  width,
  replaced,
}: {
  block: HeadBlock
  limits: BlockLimits
  x: number
  width: number
  /** What the slot held before a recent reorg rewrote it */
  replaced: HeadBlock | undefined
}) {
  const left = Math.min(
    Math.max(0, x - TOOLTIP_WIDTH / 2),
    width - TOOLTIP_WIDTH,
  )
  return (
    <div
      className="pointer-events-none absolute bottom-full z-10 mb-2 rounded-lg border border-divider bg-surface-primary p-3 text-xs shadow-popover"
      style={{ left, width: TOOLTIP_WIDTH }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-bold text-primary">
          {block.number === undefined
            ? 'No block'
            : `Block ${formatInteger(block.number)}`}
        </span>
        <span className="text-secondary tabular-nums">
          {formatTimestamp(block.timestamp, { mode: 'time' })}
        </span>
      </div>
      <div className="mt-0.5 text-secondary tabular-nums">
        Slot {formatInteger(block.slot)}
        {block.hash && ` · ${shortHash(block.hash)}`}
      </div>
      {block.status === 'missed' ? (
        <p className="mt-2 text-secondary">
          The validator chosen for this slot did not propose a block, so the
          chain skipped it. Nothing was lost; the next slot carried on.
        </p>
      ) : (
        <dl className="mt-2 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 tabular-nums">
          <Row
            label="Space used"
            value={`${formatPercent(block.gasUsed / block.gasLimit)} · ${formatGas(block.gasUsed)} gas`}
            dot="bg-brand"
          />
          <Row
            label="Blobs"
            value={`${block.blobCount} of ${limits.maxBlobs}`}
            dot="bg-chart-ethereum"
          />
          <Row label="Transactions" value={formatInteger(block.txCount)} />
          <Row
            label="Base fee"
            value={`${formatSmart(block.baseFeeGwei)} gwei`}
          />
          <Row label="Blob fee" value={formatWei(block.blobBaseFeeWei)} />
        </dl>
      )}
      {replaced && (
        <p className="mt-2 border-divider border-t pt-2 text-secondary">
          {replaced.status === 'missed'
            ? 'A reorg filled this slot, which had no block before.'
            : `Replaced ${shortHash(replaced.hash)}, which had ${replaced.blobCount} blobs and ${formatInteger(replaced.txCount)} transactions.`}
        </p>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  dot,
}: {
  label: string
  value: string
  dot?: string
}) {
  return (
    <>
      <dt className="flex items-center gap-1.5 whitespace-nowrap text-secondary">
        {dot && <span className={`size-1.5 rounded-full ${dot}`} />}
        {label}
      </dt>
      <dd className="text-right font-medium text-primary">{value}</dd>
    </>
  )
}
