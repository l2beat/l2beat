import { UnixTime } from '@l2beat/shared-pure'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import type { GasFeesSummary } from '~/server/features/gas-fees/getGasFeesSummary'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import type { GasFeesChain } from './types'

export const ETH = 'var(--chart-ethereum)'
export const L2 = 'var(--chart-ethereum-secondary)'
/** One two-column split for the stats and the chart, so their dividers line up. Needs an `@container` ancestor. */
export const SPLIT = {
  grid: 'grid grid-cols-1 gap-6 @3xl:grid-cols-[minmax(0,1fr)_340px] @3xl:gap-0',
  main: 'min-w-0 @3xl:pr-8',
  side: 'border-divider @max-3xl:border-t @3xl:border-l',
  /** Inner padding of the side column, kept off `side` for absolute children */
  sidePad: '@max-3xl:pt-6 @3xl:pl-8',
}

export function Label({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      style={style}
      className={cn(
        'font-semibold text-2xs text-primary uppercase tracking-wider',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** A small (i) that explains the label it follows */
export function Info({
  about,
  children,
}: {
  /** What it explains, for screen readers: the icon has no text */
  about: string
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`About ${about}`}
        className="ml-1.5 inline-flex align-[-1px]"
      >
        <InfoIcon className="size-3 fill-link" />
      </TooltipTrigger>
      <TooltipContent className="max-w-64 font-normal text-xs normal-case tracking-normal">
        {children}
      </TooltipContent>
    </Tooltip>
  )
}

/** Holds the space of what is coming, so nothing moves when it does */
export function TextSkeleton({
  sizedAs,
  className,
}: {
  sizedAs: string
  className?: string
}) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="invisible">{sizedAs}</span>
      <Skeleton className="absolute inset-0" />
    </span>
  )
}

export interface SharePart {
  key: string
  value: number
  color: string
  /** Shown inside the part, which clips it */
  inside?: React.ReactNode
  className?: string
}

/** Parts of a whole side by side, each as wide as its share. A part of zero is left out. */
export function ShareBar({
  parts,
  className,
}: {
  parts: SharePart[]
  className?: string
}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  return (
    <div className={cn('flex overflow-hidden', className)}>
      {parts
        .filter((p) => p.value > 0)
        .map((p) => (
          <span
            key={p.key}
            className={cn(
              'flex min-w-0 items-center overflow-hidden whitespace-nowrap',
              p.className,
            )}
            style={{
              width: `${(p.value / total) * 100}%`,
              backgroundColor: p.color,
            }}
          >
            {p.inside}
          </span>
        ))}
    </div>
  )
}

/** A colour swatch and what it stands for */
export function KeyItem({
  color,
  children,
}: {
  color: string
  children: React.ReactNode
}) {
  return (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <span className="size-2 rounded-xs" style={{ backgroundColor: color }} />
      {children}
    </span>
  )
}

/** The chains whose figures leave days out, and how many */
export function DataGaps({
  summary,
  chains,
  className,
}: {
  summary: GasFeesSummary | undefined
  chains: GasFeesChain[]
  className?: string
}) {
  const nameOf = (id: string) => chains.find((c) => c.id === id)?.name ?? id
  const missingDays =
    summary?.rows
      .filter((row) => row.missingDays > 0)
      .map((row) => `${nameOf(row.id)} ${row.missingDays}`) ?? []
  const noData = summary?.noDataIds.map(nameOf) ?? []
  if (missingDays.length === 0 && noData.length === 0) return null
  return (
    <div
      className={cn('flex flex-col gap-1 text-2xs text-secondary', className)}
    >
      {missingDays.length > 0 && (
        <span>Days without data: {missingDays.join(', ')}</span>
      )}
      {noData.length > 0 && (
        <span>No data in this period: {noData.join(', ')}</span>
      )}
    </div>
  )
}

/** In place of a figure the backend hasn't stored a day for yet */
export function NoDataYet() {
  return <p className="text-secondary text-sm">No data yet.</p>
}

/** A day is stored a few hours after it ends, so the newest is yesterday's or the day before's */
const USUAL_LAG_DAYS = 2

/** Says where the stored fees end, when that is further back than usual */
export function StoredUntil({ lastDay }: { lastDay: number | undefined }) {
  const expected =
    UnixTime.toStartOf(UnixTime.now(), 'day') - USUAL_LAG_DAYS * UnixTime.DAY
  if (lastDay === undefined || lastDay >= expected) return null
  return (
    <p className="font-medium text-sm text-warning">
      Fees are stored up to {formatTimestamp(lastDay)}.
    </p>
  )
}
