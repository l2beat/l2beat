import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import type { EthereumHead } from '../../../live/types'
import {
  formatCompact,
  formatDuration,
  formatGwei,
  formatRate,
  formatUsd,
  formatWeiFee,
  formatWhole,
} from '../format'
import { HUD_WIDTH } from '../map/hudLayout'
import { costOfGas, SLOT_SECONDS, type WindowStats } from '../model'

/**
 * The pulse numbers, set around the map rather than in cards: on wide
 * screens three down each side, on narrower ones a grid under it
 */
export function Hud({
  live,
  stats,
}: {
  live: EthereumHead
  stats: WindowStats
}) {
  const { head, limits } = live
  const ready = head !== undefined
  const proposed = head?.status === 'proposed' ? head : undefined
  const blobFee = formatWeiFee(proposed?.blobBaseFeeWei ?? 0)
  const behind =
    head && live.finalizedSlot !== undefined
      ? head.slot - live.finalizedSlot
      : undefined

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-divider border-t pt-5 md:grid-cols-3 lg:contents">
      <HudColumn side="left">
        <HudItem
          className="order-1"
          label="Blobs in block"
          cadence="per block"
          swatch={
            <BlobSwatch
              colors={stats.rows.slice(0, 3).map((r) => r.poster.color)}
            />
          }
          ready={ready}
          value={
            <>
              <RollingNumber value={head?.blobCount ?? 0} format={whole} />
              <Unit>/ {limits.maxBlobs}</Unit>
            </>
          }
          detail={`Outer ring, target ${limits.targetBlobs}`}
        />
        <HudItem
          className="order-3"
          label="Blob base fee"
          cadence="per block"
          ready={ready}
          value={
            <>
              <RollingNumber
                value={proposed?.blobBaseFeeWei ?? 0}
                format={blobFee.unit === 'wei' ? whole : weiAsGwei}
              />
              <Unit>{blobFee.unit}</Unit>
            </>
          }
          detail={
            (proposed?.blobBaseFeeWei ?? 0) <= 1
              ? 'At its 1 wei floor'
              : 'Above the floor: blobs in demand'
          }
        />
        <HudItem
          className="order-5"
          label="Transactions"
          cadence="64-slot average"
          ready={ready}
          value={
            <>
              <RollingNumber value={stats.tps} format={formatRate} />
              <Unit>TPS</Unit>
            </>
          }
          detail={`${formatRate(stats.uops)} UOPS`}
        />
      </HudColumn>
      <HudColumn side="right">
        <HudItem
          className="order-2"
          label="Gas used"
          cadence="per block"
          swatch={<GasSwatch />}
          ready={ready}
          value={
            <>
              <RollingNumber
                value={
                  proposed ? (proposed.gasUsed / proposed.gasLimit) * 100 : 0
                }
                format={percent}
              />
              <Unit>%</Unit>
            </>
          }
          detail={`Middle ring, ${formatCompact(proposed?.gasUsed ?? 0)} of ${formatCompact(limits.gasLimit)}`}
        />
        <HudItem
          className="order-4"
          label="Base fee"
          cadence="per block"
          ready={ready}
          value={
            <>
              <RollingNumber
                value={proposed?.baseFeeGwei ?? 0}
                format={formatGwei}
              />
              <Unit>gwei</Unit>
            </>
          }
          detail={
            proposed
              ? `Sending ETH costs ${formatUsd(costOfGas(21_000, proposed).usd)}`
              : 'No block in this slot'
          }
        />
        <HudItem
          className="order-6"
          label="Finalized block"
          cadence="per epoch"
          ready={ready && live.finalizedBlock !== undefined}
          value={
            <RollingNumber value={live.finalizedBlock ?? 0} format={whole} />
          }
          detail={
            behind !== undefined
              ? `${formatDuration(behind * SLOT_SECONDS)} (${behind} slots) behind`
              : ''
          }
        />
      </HudColumn>
    </div>
  )
}

function HudColumn({
  side,
  children,
}: {
  side: 'left' | 'right'
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'contents lg:pointer-events-none lg:absolute lg:inset-y-0 lg:flex lg:flex-col lg:justify-between lg:py-4',
        side === 'left' ? 'lg:left-0' : 'lg:right-0',
      )}
      style={{ ['--hud-width' as string]: `${HUD_WIDTH}px` }}
    >
      {children}
    </div>
  )
}

function HudItem({
  label,
  cadence,
  value,
  detail,
  swatch,
  ready,
  className,
}: {
  label: string
  cadence: string
  value: ReactNode
  detail: string
  swatch?: ReactNode
  ready: boolean
  className?: string
}) {
  return (
    <div className={cn('min-w-0 lg:order-none lg:w-(--hud-width)', className)}>
      <div className="flex items-center gap-1.5 text-label-value-13 text-secondary">
        {swatch}
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1 font-bold text-[26px] leading-none tracking-tight">
        {ready ? value : <Skeleton className="h-[26px] w-24" />}
      </div>
      <div className="mt-1.5 text-label-value-12 text-secondary leading-snug">
        {ready ? detail : <Skeleton className="h-3 w-28" />}
      </div>
      <div className="mt-1 text-[11px] text-secondary/70 leading-none">
        {cadence}
      </div>
    </div>
  )
}

function Unit({ children }: { children: ReactNode }) {
  return (
    <span className="font-medium text-label-value-15 text-secondary tracking-normal">
      {children}
    </span>
  )
}

/** The outer ring in small: arcs in the colors of the systems posting most */
function BlobSwatch({ colors }: { colors: string[] }) {
  const stops = colors
    .map((color, i) => `${color} ${i * 22}% ${(i + 1) * 22}%`)
    .join(', ')
  return (
    <span
      aria-hidden
      className="size-2.5 rounded-full"
      style={{
        background: `conic-gradient(${stops ? `${stops}, ` : ''}var(--surface-tertiary) ${colors.length * 22}%)`,
      }}
    />
  )
}

function GasSwatch() {
  return (
    <span aria-hidden className="size-2.5 rounded-full bg-(--chart-ethereum)" />
  )
}

function whole(value: number) {
  return formatWhole(value)
}

function percent(value: number) {
  return value.toFixed(0)
}

function weiAsGwei(value: number) {
  return formatGwei(value / 1e9)
}
