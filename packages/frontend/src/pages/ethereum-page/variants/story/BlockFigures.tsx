import type { ReactNode } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import type { BlockLimits, EthereumHead } from '../../live/types'
import { TYPE, ValueSlot } from './Article'
import type { WindowStats } from './facts'
import {
  formatGas,
  formatGwei,
  formatInteger,
  formatRate,
  formatWei,
} from './format'

/**
 * The newest block as a row of figures, the facts behind the lede: how full
 * it is for blobs and for gas against the target the fee market steers to,
 * and what each costs. Every figure is per block, at the head.
 */
export function BlockFigures({
  head,
  window,
}: {
  head: EthereumHead
  window: WindowStats | undefined
}) {
  const block = head.head?.status === 'proposed' ? head.head : undefined
  const limits = head.limits
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-divider bg-divider sm:grid-cols-3 lg:grid-cols-5">
      <Cell
        label="Blobs in this block"
        value={
          block && (
            <RollingNumber value={block.blobCount} format={formatInteger} />
          )
        }
        unit={`of ${limits.targetBlobs} target`}
        gauge={block && <BlobPips count={block.blobCount} limits={limits} />}
      />
      <Cell
        label="Blob base fee"
        value={
          block && (
            <RollingNumber
              value={block.blobBaseFeeWei}
              format={formatWeiAmount}
            />
          )
        }
        unit={block ? weiUnit(block.blobBaseFeeWei) : 'wei'}
        footer={
          block &&
          (block.blobCount > limits.targetBlobs
            ? 'Over target, so rising'
            : 'At or under target, so falling or flat')
        }
      />
      <Cell
        label="Gas used"
        value={
          block && <RollingNumber value={block.gasUsed} format={formatGas} />
        }
        unit={`of ${formatGas(limits.gasLimit)} limit`}
        gauge={block && <GasBar used={block.gasUsed} limits={limits} />}
      />
      <Cell
        label="Base fee"
        value={
          block && (
            <RollingNumber
              value={block.baseFeeGwei}
              format={formatGweiAmount}
            />
          )
        }
        unit="gwei"
        footer={
          block &&
          (block.gasUsed > limits.gasTarget
            ? 'Over target, so rising'
            : 'Under target, so falling')
        }
      />
      <Cell
        className="max-lg:col-span-2"
        label="Transactions per second"
        value={
          window && (
            <RollingNumber
              value={window.txs / window.seconds}
              format={formatRate}
            />
          )
        }
        unit="TPS"
        footer={
          window &&
          `${formatRate(window.uops / window.seconds)} user operations/s, over the last ${Math.round(window.seconds / 60)} min`
        }
      />
    </div>
  )
}

function Cell({
  label,
  value,
  unit,
  gauge,
  footer,
  className,
}: {
  label: string
  value: ReactNode
  unit: string
  gauge?: ReactNode
  footer?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-h-[7.5rem] flex-col bg-surface-primary p-4',
        className,
      )}
    >
      <span className={TYPE.label}>{label}</span>
      <span className="mt-2.5 flex items-baseline gap-1.5">
        <span className={TYPE.figure}>{value ?? <ValueSlot chars={3} />}</span>
        <span className="text-[13px] text-secondary">{unit}</span>
      </span>
      <span className="mt-auto pt-3">
        {gauge ?? (footer && <span className={TYPE.note}>{footer}</span>)}
      </span>
    </div>
  )
}

/** One pip per blob the block may hold; the gap marks where the target ends */
function BlobPips({ count, limits }: { count: number; limits: BlockLimits }) {
  return (
    <span className="flex gap-[2px]" aria-hidden>
      {Array.from({ length: limits.maxBlobs }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-2.5 flex-1 rounded-[1px] transition-colors duration-500',
            i < count ? 'bg-chart-ethereum' : 'bg-surface-secondary',
            i === limits.targetBlobs && 'ml-1.5',
          )}
        />
      ))}
    </span>
  )
}

function GasBar({ used, limits }: { used: number; limits: BlockLimits }) {
  const target = limits.gasTarget / limits.gasLimit
  return (
    <span
      className="relative block h-2.5 overflow-hidden rounded-[1px] bg-surface-secondary"
      aria-hidden
    >
      <span
        className="absolute inset-y-0 left-0 w-full origin-left bg-chart-ethereum transition-transform duration-700 ease-out-quint"
        style={{ transform: `scaleX(${used / limits.gasLimit})` }}
      />
      <span
        className="absolute inset-y-[-2px] w-[2px] bg-primary"
        style={{ left: `${target * 100}%` }}
      />
    </span>
  )
}

function formatGweiAmount(value: number) {
  return formatGwei(value).replace(' gwei', '')
}

function formatWeiAmount(value: number) {
  return formatWei(value).replace(/ (wei|gwei)$/, '')
}

function weiUnit(value: number) {
  return formatWei(value).endsWith('gwei') ? 'gwei' : 'wei'
}
