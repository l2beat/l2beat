import type { CSSProperties, ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { LiveIndicator } from '~/components/LiveIndicator'
import { useThemeTokens } from '~/hooks/useThemeTokens'
import { ChevronIcon } from '~/icons/Chevron'
import type { LiveBlobs } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import {
  BLOB_KIB,
  describeWindow,
  formatAverage,
  formatKib,
  formatWhole,
} from './blocks/format'
import { mixColors, readableColor } from './color'
import { LIVE_POSTERS_ID } from './LivePosters'
import { anyLanding, useLandedTotal } from './landings'
import { type Arrival, Pop, RollingNumber } from './liveMotion'
import { type BlockLimits, type PosterTotals, UNKNOWN_ID } from './model'
import { NextBlock } from './NextBlock'
import type { LiveStatus } from './useLiveBlobs'

const STATUS_TEXT: Record<LiveStatus, string> = {
  connecting: 'Connecting to Ethereum…',
  live: 'Live from Ethereum',
  reconnecting: 'Reconnecting to Ethereum…',
}

/** Ethereum's own DA page, which the card's heading leads to */
export interface EthereumLink {
  href: string
  iconUrl: string
}

/** Projects named under the strip; the rest are counted */
const NAMED_POSTERS = 4

const formatArrivedKib = (blobs: number) => formatKib(blobs * BLOB_KIB)

/**
 * Ethereum's blob market over the last 24 hours, above the belt: whether it is
 * live, the headline numbers, then the day's blobs as one strip split by who
 * posted them, in the colors the belt uses
 */
export function LiveStats({
  live: data,
  totals,
  status,
  limits,
  ethereum,
}: {
  live: LiveBlobs | undefined
  totals: PosterTotals | undefined
  status: LiveStatus
  limits: BlockLimits
  ethereum: EthereumLink
}) {
  const postedWindow = data?.window
  // the newest block's blobs are counted in as the belt lands them
  const newest = postedWindow?.newestBlobs ?? 0
  const { value: blobs, arrival } = useLandedTotal(
    data?.head,
    totals?.blobs ?? 0,
    newest,
    newest,
    anyLanding,
  )
  const shares = useShares(totals)
  const ready = postedWindow !== undefined && postedWindow.slots > 0
  const projects = shares.filter((share) => share.id !== UNKNOWN_ID).length

  return (
    <div>
      {/* The heading comes first to be read first, and stands right of the
          numbers where there is room */}
      <div className="flex flex-col gap-4 md:flex-row-reverse md:items-start md:justify-between">
        {/* The countdown sits under the heading whatever the status says, so
            the numbers below do not move when it changes */}
        <div className="flex flex-col gap-2">
          <LiveHeading status={status} ethereum={ethereum} />
          {/* Where there is room it stands over the belt instead. Held in
              place until live, or the heading would shift as it comes */}
          <NextBlock hidden={status !== 'live'} className="md:hidden" />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 md:flex md:items-end md:gap-x-8">
          {/* The labels stand from the first paint and only the numbers wait,
              so nothing shifts as they come */}
          <Stat label="Blobs posted" arrival={arrival}>
            {ready ? (
              <RollingNumber value={blobs} format={formatWhole} />
            ) : (
              <NumberSkeleton sizedAs="00,000" />
            )}
          </Stat>
          <Stat label="Data" arrival={arrival} formatArrival={formatArrivedKib}>
            {ready ? (
              <RollingNumber value={blobs * BLOB_KIB} format={formatKib} />
            ) : (
              <NumberSkeleton sizedAs="00.0 GiB" />
            )}
          </Stat>
          <Stat
            label="Per block"
            note={`of ${limits.targetBlobsPerBlock} target`}
          >
            {ready ? (
              <RollingNumber
                value={blobs / Math.max(1, postedWindow.blocks)}
                format={formatAverage}
              />
            ) : (
              // narrow as the number it stands for, or the note wraps on a phone
              <NumberSkeleton sizedAs="00" />
            )}
          </Stat>
        </dl>
      </div>
      {ready ? (
        <>
          <ShareStrip shares={shares} blobs={blobs} projects={projects} />
          <ShareLegend
            shares={shares}
            projects={projects}
            title={`${describeWindow(postedWindow.slots)}, by project`}
          />
        </>
      ) : (
        <SharesSkeleton />
      )}
    </div>
  )
}

/**
 * As big as the number it stands for: `sizedAs` is set unseen in the
 * number's own font, so on a desktop, where the stats stand in a row, the
 * labels beside it do not move when the number comes
 */
function NumberSkeleton({ sizedAs }: { sizedAs: string }) {
  return (
    <span className="relative inline-block">
      <span className="invisible">{sizedAs}</span>
      <Skeleton className="absolute inset-0" />
    </span>
  )
}

/** Rough widths of the legend's title, four names and "+N more" */
const LEGEND_SKELETON_WIDTHS = ['w-28', 'w-24', 'w-20', 'w-24', 'w-28', 'w-12']

/**
 * The strip and its legend, the legend as pieces as wide as what it holds, so
 * it wraps where the real one does: onto a second line on a phone
 */
function SharesSkeleton() {
  return (
    <>
      <Skeleton className="mt-4 h-4 w-full rounded-[3px] md:h-5" />
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {LEGEND_SKELETON_WIDTHS.map((width, i) => (
          <Skeleton key={i} className={cn('h-3 rounded-sm', width)} />
        ))}
      </div>
    </>
  )
}

function Stat({
  label,
  note,
  arrival,
  formatArrival,
  children,
}: {
  label: string
  note?: string
  arrival?: Arrival
  formatArrival?: (amount: number) => string
  children: ReactNode
}) {
  return (
    <div className="min-w-0">
      {/* The pop rises off the label line, where nothing else is in its way,
          right after the label, so it reads as what this number just got */}
      <dt className="font-medium text-label-value-13 text-secondary">
        <span className="relative">
          {label}
          {arrival && (
            <Pop
              arrival={arrival}
              format={formatArrival}
              className="absolute top-0 left-full ml-1.5 whitespace-nowrap"
            />
          )}
        </span>
      </dt>
      <dd className="flex items-baseline gap-1.5">
        <span className="font-bold text-heading-32 leading-none md:text-heading-36">
          {children}
        </span>
        {note && (
          <span className="font-medium text-label-value-13 text-secondary">
            {note}
          </span>
        )}
      </dd>
    </div>
  )
}

function LiveHeading({
  status,
  ethereum,
}: {
  status: LiveStatus
  ethereum: EthereumLink
}) {
  return (
    <div role="status">
      <h2>
        <a
          href={ethereum.href}
          className="group flex items-center gap-2 whitespace-nowrap font-bold text-heading-16"
        >
          <LiveIndicator disabled={status !== 'live'} />
          <img src={ethereum.iconUrl} alt="" className="size-5" />
          <span className="underline-offset-2 group-hover:underline">
            {STATUS_TEXT[status]}
          </span>
          <ChevronIcon
            aria-hidden
            className="-rotate-90 size-2.5 fill-current transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </h2>
    </div>
  )
}

interface PosterShare {
  id: string
  name: string
  /** Of all blobs in the window, 0 to 1 */
  share: number
  /** The poster's color as the belt draws it */
  color: string
}

/** Each poster's share of the day, most blobs first */
function useShares(totals: PosterTotals | undefined): PosterShare[] {
  const { surface } = useThemeTokens()
  if (!totals) return []
  const all = Math.max(1, totals.blobs)
  return totals.posters.map(({ poster, blobs }) => ({
    id: poster.id,
    name: poster.name,
    share: blobs / all,
    color: readableColor(poster.color, surface),
  }))
}

/** A tile like the belt's: its color, lit along the top edge like a gel */
function gel(color: string): CSSProperties {
  return {
    backgroundColor: color,
    boxShadow: `inset 0 1px 0 ${mixColors(color, '#ffffff', 0.45)}`,
  }
}

/**
 * The day's blobs as one strip, a stretch of it per poster. Stretches do not
 * ease to their new size: a block moves them by less than a pixel, and
 * easing `flex-grow` lays the whole strip out again on every frame
 */
function ShareStrip({
  shares,
  blobs,
  projects,
}: {
  shares: PosterShare[]
  blobs: number
  projects: number
}) {
  return (
    <div
      className="mt-4 flex h-4 gap-[2px] overflow-hidden rounded-[3px] md:h-5"
      role="img"
      aria-label={`${formatWhole(blobs)} blobs from ${projects} projects`}
    >
      {shares.map((share) => (
        <div
          key={share.id}
          title={`${share.name} · ${formatPercent(share.share)}`}
          className="h-full min-w-[2px] rounded-[2px]"
          style={{ flexGrow: share.share, flexBasis: 0, ...gel(share.color) }}
        />
      ))}
    </div>
  )
}

function ShareLegend({
  shares,
  projects,
  title,
}: {
  shares: PosterShare[]
  projects: number
  title: string
}) {
  // the unknown share has no name to read, and its gray tells it apart already
  const named = shares
    .filter((share) => share.id !== UNKNOWN_ID)
    .slice(0, NAMED_POSTERS)
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-label-value-12 text-secondary">
      <span className="font-bold text-primary">{title}</span>
      {named.map((share) => (
        <span key={share.id} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[2px]" style={gel(share.color)} />
          {share.name}
          <span className="font-bold text-primary tabular-nums">
            {formatPercent(share.share)}
          </span>
        </span>
      ))}
      {projects > named.length && (
        <a
          href={`#${LIVE_POSTERS_ID}`}
          className="underline decoration-dotted underline-offset-2 hover:text-primary"
        >
          +{projects - named.length} more
        </a>
      )}
    </div>
  )
}
