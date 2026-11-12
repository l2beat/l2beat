import { type PointerEvent, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import { HEAD_WINDOW } from '../../../live/simulatedHead'
import type { BlockLimits, HeadBlock } from '../../../live/types'
import { blobFeeUnit, fmtBlobFee, fmtGwei, fmtNumber } from '../format'
import { Panel } from '../ui/Panel'

const W = 640

/**
 * Each fee over the last 64 blocks, above the demand that drives it. Fee and
 * demand get a strip each instead of sharing an axis: when blocks run above
 * target, the line above climbs, and the reader sees cause and effect lined up
 */
export function FeeMarket({
  blocks,
  limits,
  className,
}: {
  blocks: HeadBlock[]
  limits: BlockLimits
  className?: string
}) {
  const [hover, setHover] = useState<number>()
  const hovered = hover === undefined ? undefined : blocks[hover]
  return (
    <Panel
      title="Fee market"
      cadence="blk"
      className={className}
      accessory={
        <span className="font-mono text-[10.5px] text-secondary tabular-nums">
          {hovered
            ? `slot ${fmtNumber(hovered.slot)}`
            : `last ${HEAD_WINDOW} blocks`}
        </span>
      }
      bodyClassName="flex flex-col"
    >
      <Market
        title="Execution"
        fee={{
          values: blocks.map((b) =>
            b.status === 'proposed' ? b.baseFeeGwei : undefined,
          ),
          label: 'Base fee',
          format: (v) => `${fmtGwei(v)} gwei`,
          color: 'var(--chart-ethereum)',
        }}
        demand={{
          values: blocks.map((b) => b.gasUsed / b.gasLimit),
          target: limits.gasTarget / limits.gasLimit,
          max: 1,
          label: 'Gas used',
          format: (v) => `${Math.round(v * 100)}%`,
          targetLabel: 'target 50%',
        }}
        hover={hover}
        setHover={setHover}
      />
      <Market
        title="Blobs"
        fee={{
          values: blocks.map((b) =>
            b.status === 'proposed' ? b.blobBaseFeeWei : undefined,
          ),
          label: 'Blob base fee',
          format: (v) => `${fmtBlobFee(v)} ${blobFeeUnit(v)}`,
          color: 'var(--chart-fuchsia)',
        }}
        demand={{
          values: blocks.map((b) => b.blobCount / limits.maxBlobs),
          target: limits.targetBlobs / limits.maxBlobs,
          max: 1,
          label: 'Blobs',
          format: (v) =>
            `${Math.round(v * limits.maxBlobs)} of ${limits.maxBlobs}`,
          targetLabel: `target ${limits.targetBlobs}`,
        }}
        hover={hover}
        setHover={setHover}
        className="border-divider/60 border-t"
      />
    </Panel>
  )
}

interface FeeSeries {
  values: (number | undefined)[]
  label: string
  format: (v: number) => string
  color: string
}

interface DemandSeries {
  /** Share of the block's limit */
  values: number[]
  target: number
  max: number
  label: string
  format: (v: number) => string
  targetLabel: string
}

function Market({
  title,
  fee,
  demand,
  hover,
  setHover,
  className,
}: {
  title: string
  fee: FeeSeries
  demand: DemandSeries
  hover: number | undefined
  setHover: (i: number | undefined) => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const n = Math.max(demand.values.length, HEAD_WINDOW)
  const slotW = W / n
  const x = (i: number) => (i + 0.5) * slotW
  const defined = fee.values.filter((v): v is number => v !== undefined)
  const lo = Math.min(...defined, Number.POSITIVE_INFINITY)
  const hi = Math.max(...defined, Number.NEGATIVE_INFINITY)
  const pad = (hi - lo) * 0.15 || hi * 0.1 || 1
  const yFee = (v: number) => 46 - ((v - (lo - pad)) / (hi - lo + pad * 2)) * 40
  const yDemand = (share: number) => 92 - share * 38
  const shownIndex = hover ?? demand.values.length - 1
  const shownFee = fee.values[shownIndex]
  const shownDemand = demand.values[shownIndex]

  let line = ''
  fee.values.forEach((v, i) => {
    if (v === undefined) return
    line += `${line === '' ? 'M' : 'L'}${x(i)},${yFee(v)} `
  })

  function onMove(event: PointerEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const i = Math.floor(((event.clientX - rect.left) / rect.width) * n)
    setHover(i >= 0 && i < demand.values.length ? i : undefined)
  }

  return (
    <div className={cn('flex flex-1 flex-col px-3 pt-2 pb-2', className)}>
      <div className="flex items-baseline gap-2 text-[11px]">
        <span className="font-semibold text-primary">{title}</span>
        <span className="flex items-center gap-1 text-secondary">
          <span
            className="inline-block h-0.5 w-2.5 rounded-full"
            style={{ background: fee.color }}
          />
          {fee.label}
        </span>
        <span className="ml-auto font-mono text-primary tabular-nums">
          {shownFee === undefined ? 'missed' : fee.format(shownFee)}
        </span>
        <span className="w-16 text-right font-mono text-secondary tabular-nums">
          {shownDemand === undefined ? '' : demand.format(shownDemand)}
        </span>
      </div>
      <div
        ref={ref}
        className="relative mt-1 h-[72px] min-h-[64px] flex-1"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(undefined)}
      >
        <svg
          viewBox={`0 0 ${W} 96`}
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          role="img"
          aria-label={`${fee.label} and ${demand.label.toLowerCase()} over the last ${n} blocks`}
        >
          {demand.values.map((share, i) => (
            <rect
              key={i}
              x={i * slotW + slotW * 0.14}
              width={slotW * 0.72}
              y={yDemand(Math.min(share, demand.max))}
              height={Math.max(0.6, 92 - yDemand(Math.min(share, demand.max)))}
              // above target is what pushes the fee up, so it is drawn in ink
              fill={
                share > demand.target ? 'var(--primary)' : 'var(--secondary)'
              }
              fillOpacity={
                hover === i ? 0.9 : share > demand.target ? 0.55 : 0.28
              }
            />
          ))}
          <line
            x1={0}
            x2={W}
            y1={yDemand(demand.target)}
            y2={yDemand(demand.target)}
            stroke="var(--primary)"
            strokeOpacity={0.55}
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={0}
            x2={W}
            y1={yDemand(demand.max)}
            y2={yDemand(demand.max)}
            stroke="var(--chart-grid)"
            strokeOpacity={0.6}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={line}
            fill="none"
            stroke={fee.color}
            strokeWidth={1.75}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {hover !== undefined && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={0}
              y2={96}
              stroke="var(--primary)"
              strokeOpacity={0.35}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        <span
          className="-translate-y-full pointer-events-none absolute right-0 rounded-[2px] bg-surface-primary/85 px-0.5 font-mono text-[9.5px] text-secondary leading-3"
          style={{ top: `${(yDemand(demand.target) / 96) * 100}%` }}
        >
          {demand.targetLabel}
        </span>
      </div>
    </div>
  )
}
