import type { GasFeesWallet } from '@l2beat/database'
import { useRef } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { Logo } from '~/components/Logo'
import { EM_DASH } from '~/consts/characters'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { cn } from '~/utils/cn'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { formatFee, formatGwei, formatMultiple } from './format'
import { GasFeesMethodology } from './GasFeesMethodology'
import { type DecadeDomain, DecadeGrid, getDecades, logShare } from './logScale'
import { Label, TextSkeleton } from './parts'
import {
  BandStrip,
  Gwei,
  OURS,
  OVER,
  RollingGwei,
  WalletIcon,
} from './tipParts'
import type { GasFeesWalletIcons } from './types'
import type { TipTierRow, WalletSuggestion } from './useLiveTips'

/** Seven powers of ten, from a millionth of a gwei to 10 */
const TRACK: DecadeDomain = { lo: -6, hi: 1 }
const toX = (gwei: number) => logShare(gwei, TRACK) * 100

/** The tier, then its track, then how far above ours the wallets sit. On phones the track goes under. */
const ROW_GRID =
  'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 md:grid-cols-[180px_minmax(0,1fr)_120px]'

/** One log scale track per tier: our estimate and each wallet's suggestion as chips at their gwei */
export function GasFeesTipTracks({
  rows,
  pending,
  wallets,
  walletIcons,
}: {
  rows: TipTierRow[]
  pending: boolean
  /** The wallets with a read, for the key */
  wallets: GasFeesWallet[]
  walletIcons: GasFeesWalletIcons
}) {
  return (
    <div className="flex flex-col">
      <div className={cn(ROW_GRID, 'gap-y-2 pb-2 text-xs')}>
        <Label className="whitespace-nowrap">
          Tier{DOT_SEPARATOR}tip in gwei
        </Label>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 max-md:order-3 max-md:col-span-2">
          <TrackKey wallets={wallets} walletIcons={walletIcons} />
          <GasFeesMethodology />
        </div>
        <Label className="text-right">Wallets suggest</Label>
      </div>
      {rows.map((row) => (
        <div
          key={row.key}
          className={cn(ROW_GRID, 'border-divider border-t py-2')}
        >
          <div className="flex flex-col items-start gap-1 max-md:pt-1">
            <span className="flex flex-col">
              <span className="font-bold text-sm leading-tight">
                {row.name}
              </span>
              <span className="text-2xs text-secondary">{row.promise}</span>
            </span>
            <span className="font-bold text-2xl leading-none tracking-tight">
              {row.gwei !== undefined ? (
                <RollingGwei value={row.gwei} />
              ) : pending ? (
                <TextSkeleton sizedAs="0.0000" />
              ) : (
                EM_DASH
              )}
            </span>
            <span className="text-2xs text-secondary tabular-nums">
              {row.usd !== undefined
                ? `+${formatFee(row.usd)} per transfer`
                : pending && <TextSkeleton sizedAs="+$0.000 per transfer" />}
            </span>
          </div>
          <Track
            row={row}
            walletIcons={walletIcons}
            className="max-md:order-3 max-md:col-span-2"
          />
          <HighestSuggestion row={row} pending={pending} />
        </div>
      ))}
      <div className="grid grid-cols-1 gap-x-6 border-divider border-t pt-1 md:grid-cols-[180px_minmax(0,1fr)_120px]">
        <span className="text-2xs text-secondary max-md:hidden">
          gwei, log scale
        </span>
        <TrackAxis />
      </div>
    </div>
  )
}

interface Chip {
  key: string
  gwei: number
  usd: number | undefined
  /** A wallet's suggestion, or our estimate when undefined */
  wallet: WalletSuggestion | undefined
}

interface PlacedChip extends Chip {
  /** Above the line or below it */
  lane: number
  /** Where the chip's middle sits and where its tip does, in pixels */
  center: number
  x: number
}

const CHIP_GAP = 4
/** Padding and the icon, plus a digit's width for each character */
const chipWidth = (gwei: number) => 38 + formatGwei(gwei).length * 7.7

/**
 * From the right, where the wallets crowd against the edge: each chip takes
 * the lane that moves it least without overlapping the chip after it
 */
function placeChips(row: TipTierRow, width: number): PlacedChip[] {
  const usdPerGwei =
    row.usd !== undefined && row.gwei ? row.usd / row.gwei : undefined
  const chips: Chip[] = row.wallets.map((wallet) => ({
    key: wallet.name,
    gwei: wallet.gwei,
    usd: usdPerGwei === undefined ? undefined : wallet.gwei * usdPerGwei,
    wallet,
  }))
  if (row.gwei !== undefined) {
    chips.push({ key: 'ours', gwei: row.gwei, usd: row.usd, wallet: undefined })
  }
  chips.sort((a, b) => b.gwei - a.gwei)
  const starts = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  return chips.map((chip) => {
    const size = chipWidth(chip.gwei)
    const x = (toX(chip.gwei) / 100) * width
    const options = starts.map((start, lane) => {
      const center = Math.max(
        Math.min(x, start - CHIP_GAP - size / 2, width - size / 2),
        size / 2,
      )
      const overlap = Math.max(0, center + size / 2 - (start - CHIP_GAP))
      return { lane, center, cost: overlap * 1000 + Math.abs(center - x) }
    })
    const { lane, center } = options.reduce((a, b) => (b.cost < a.cost ? b : a))
    starts[lane] = center - size / 2
    return { ...chip, lane, center, x }
  })
}

function Track({
  row,
  walletIcons,
  className,
}: {
  row: TipTierRow
  walletIcons: GasFeesWalletIcons
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref })
  const placed = width ? placeChips(row, width) : []
  const top = row.highest
  const tier = row.name.toLowerCase()

  return (
    <div ref={ref} className={cn('relative h-[84px]', className)}>
      <DecadeGrid domain={TRACK} />
      <BandStrip
        toX={toX}
        className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-[3px] opacity-45"
      />
      {/* From our estimate up to the highest suggestion */}
      {row.gwei !== undefined && top && top.gwei > row.gwei && (
        <span
          className="-translate-y-1/2 absolute top-1/2 h-2.5 rounded-full"
          style={{
            left: `${toX(row.gwei)}%`,
            width: `${toX(top.gwei) - toX(row.gwei)}%`,
            background: `linear-gradient(90deg, color-mix(in oklab, ${OVER} 10%, transparent), color-mix(in oklab, ${OVER} 70%, transparent))`,
          }}
        />
      )}
      {placed
        .filter((chip) => chip.wallet)
        .map((chip) => (
          <span
            key={chip.key}
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-2 rounded-full ring-2 ring-surface-primary"
            style={{ left: chip.x, background: OVER }}
          />
        ))}
      {placed.map((chip) => (
        <Tooltip key={chip.key}>
          <TooltipTrigger
            className={cn(
              '-translate-x-1/2 absolute flex h-6 items-center gap-1 rounded-full py-0.5 pr-2 pl-1 font-bold text-xs tabular-nums',
              chip.wallet
                ? 'border border-divider bg-surface-primary'
                : 'bg-primary text-primary-invert',
              chip.lane === 0 ? 'top-0.5' : 'bottom-0.5',
            )}
            style={{ left: chip.center }}
          >
            {chip.wallet ? (
              <WalletIcon
                src={walletIcons[chip.wallet.name]}
                className="rounded-full"
              />
            ) : (
              <Logo
                small
                animated={false}
                aria-hidden
                className="mt-0 h-4 w-[18px]"
              />
            )}
            <Gwei
              value={chip.gwei}
              zerosClassName={chip.wallet ? 'opacity-50' : 'opacity-60'}
            />
          </TooltipTrigger>
          <TooltipContent className="flex flex-col gap-0.5 text-xs">
            <span className="font-bold">
              {chip.wallet
                ? `${chip.wallet.name}${DOT_SEPARATOR}“${chip.wallet.option}”`
                : `Our estimated ${tier} tip`}
            </span>
            <span className="tabular-nums">
              {formatGwei(chip.gwei)} gwei
              {chip.usd !== undefined &&
                `, adds ${formatFee(chip.usd)} to a transfer`}
            </span>
            {chip.wallet?.multiple !== undefined && (
              <span className="text-secondary tabular-nums">
                {formatMultiple(chip.wallet.multiple)} our estimated {tier} tip
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      ))}
      {row.gwei !== undefined && (
        <span
          className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-4 rounded-full ring-[3px] ring-surface-primary transition-[left] duration-700 motion-reduce:transition-none"
          style={{ left: `${toX(row.gwei)}%`, background: OURS }}
        />
      )}
    </div>
  )
}

/** The highest suggestion as a multiple of our estimate, and what it adds to a transfer on top of ours */
function HighestSuggestion({
  row,
  pending,
}: {
  row: TipTierRow
  pending: boolean
}) {
  const top = row.highest
  const extra =
    top && row.gwei && row.usd !== undefined
      ? ((top.gwei - row.gwei) / row.gwei) * row.usd
      : undefined
  return (
    <div className="flex flex-col items-end gap-0.5 text-right">
      {top?.multiple !== undefined ? (
        <span className="whitespace-nowrap font-bold text-lg tabular-nums leading-none tracking-tight">
          <span className="font-normal text-secondary text-xs">up to </span>
          {/* Fast is the headline's number */}
          <span className={cn(row.key === 'fast' && 'text-brand-deep')}>
            {formatMultiple(top.multiple)}
          </span>
        </span>
      ) : pending ? (
        <TextSkeleton sizedAs="up to 00×" className="text-lg" />
      ) : (
        <span className="text-secondary">{EM_DASH}</span>
      )}
      {extra !== undefined && extra > 0 && (
        <span className="whitespace-nowrap text-2xs text-secondary tabular-nums">
          +{formatFee(extra)} per transfer
        </span>
      )}
    </div>
  )
}

function TrackKey({
  wallets,
  walletIcons,
}: {
  wallets: GasFeesWallet[]
  walletIcons: GasFeesWalletIcons
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="flex items-center gap-1.5">
        <Logo small animated={false} aria-hidden className="mt-0 h-3.5 w-4" />
        Our estimated tip
      </span>
      {wallets.map((wallet) => (
        <span key={wallet} className="flex items-center gap-1.5">
          <WalletIcon src={walletIcons[wallet]} className="size-3.5" />
          {wallet}
        </span>
      ))}
      {wallets.length > 0 && (
        <span className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-5 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${OVER})`,
            }}
          />
          Above our estimate
        </span>
      )}
    </div>
  )
}

/** Powers of ten under the tracks, every other one on phones */
function TrackAxis() {
  return (
    <div className="relative h-5">
      {getDecades(TRACK).map((power) => (
        <span
          key={power}
          className={cn(
            'absolute top-0.5 text-2xs text-secondary',
            power === TRACK.hi
              ? '-translate-x-full'
              : power !== TRACK.lo && '-translate-x-1/2',
            power % 2 !== 0 && power !== TRACK.hi && 'max-md:hidden',
          )}
          style={{ left: `${toX(10 ** power)}%` }}
        >
          <Gwei value={10 ** power} zerosClassName="opacity-50" />
        </span>
      ))}
    </div>
  )
}
