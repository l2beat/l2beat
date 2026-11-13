import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
import { GasFeesMethodology } from '../../GasFeesMethodology'
import { formatFee } from '../../metrics'
import { Label } from '../../parts'
import {
  LiveStatus,
  multiple,
  OVER_TEXT,
  RollingGwei,
  TextSkeleton,
  TIPS,
  type TierRow,
  usdM,
  useTips,
} from './shared'
import { Track, TrackAxis, TrackLegend } from './tracks'

/** What ordinary transactions tipped above our fast tip over the period */
export const OVERTIP = TIPS.ordinaryUsd - TIPS.atFastUsd

/** The footnotes of the blocks below the tracks, the same in every spin */
export const NOTES = {
  ordinary:
    'Ordinary means a tip under 2.5 gwei. Higher tips buy a place near the front of the block, which our estimated fast tip doesn’t aim for, so they don’t count.',
  speed:
    'Seconds until you can be 99% sure you’re in, against the cost of an ERC-20 transfer.',
  curve:
    'Each dot is the transactions in one narrow tip range. Each block you miss adds 12 seconds.',
}

/**
 * B2's headline and tracks, shared by B2 and its spins (B2A–B2C), which only
 * differ in what comes below
 */
export function B2Frame({ children }: { children: React.ReactNode }) {
  const tips = useTips()
  return (
    <div ref={tips.ref} className="flex flex-col gap-6">
      <header className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <h2>
            <Label>Tipping on Ethereum · L1 only</Label>
          </h2>
          <LiveStatus status={tips.status} />
        </div>
        <p className="font-bold text-2xl leading-tight tracking-tight md:text-3xl">
          {tips.fastMax && tips.fastMax > 1 ? (
            <>
              You can pay up to{' '}
              <span style={{ color: OVER_TEXT }}>
                {multiple(tips.fastMax)} less
              </span>{' '}
              by using our estimated tip.
            </>
          ) : (
            <>Our estimated fast tip gets you into the next block.</>
          )}{' '}
          <br className="max-md:hidden" />
          Over the year, ordinary transactions tipped{' '}
          <span style={{ color: OVER_TEXT }}>{usdM(OVERTIP)}</span> above it.
        </p>
        {tips.fastMax && tips.fastMax > 1 && tips.fastMin && (
          <p className="text-secondary text-sm">
            Fast, for the next block: wallets suggest{' '}
            {tips.fastMin === tips.fastMax
              ? multiple(tips.fastMax)
              : `${multiple(tips.fastMin)} to ${multiple(tips.fastMax)}`}{' '}
            our estimated tip right now.
          </p>
        )}
      </header>

      <Tracks rows={tips.rows} />

      {children}
    </div>
  )
}

/** A small (i) that explains a label */
export function Info({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn('ml-1.5 inline-flex align-[-1px]', className)}
      >
        <InfoIcon className="size-3 fill-current" />
      </TooltipTrigger>
      <TooltipContent className="max-w-64 text-xs normal-case tracking-normal">
        {children}
      </TooltipContent>
    </Tooltip>
  )
}

/** Label, then the track, then how far above ours the wallets sit; on phones the track goes under */
const ROW_GRID =
  'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 md:grid-cols-[180px_minmax(0,1fr)_120px]'

function Tracks({ rows }: { rows: TierRow[] }) {
  return (
    <div className="flex flex-col">
      <div className={cn(ROW_GRID, 'gap-y-2 pb-2')}>
        <span className="whitespace-nowrap text-secondary text-xs">
          Tier · gwei · $ per transfer
        </span>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 max-md:order-3 max-md:col-span-2">
          <TrackLegend />
          <GasFeesMethodology />
        </div>
        <span className="text-right text-secondary text-xs">
          Wallets suggest
        </span>
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
            <span className="flex flex-col items-start gap-1">
              <span className="font-bold text-2xl leading-none tracking-tight">
                {row.gwei === undefined ? (
                  <TextSkeleton sizedAs="0.0000" />
                ) : (
                  <RollingGwei value={row.gwei} />
                )}
              </span>
              <span className="text-2xs text-secondary tabular-nums">
                {row.usd === undefined ? (
                  <TextSkeleton sizedAs="$0.000" />
                ) : (
                  formatFee(row.usd)
                )}
              </span>
            </span>
          </div>
          <Track
            row={row}
            height={72}
            className="max-md:order-3 max-md:col-span-2"
          />
          <Above row={row} />
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

/**
 * The highest wallet suggestion as a multiple of our estimated tip, and what
 * it adds to a transfer. Fast is pink, as it is the headline's number
 */
function Above({ row }: { row: TierRow }) {
  const top = row.wallets
    .filter((w) => w.multiple !== undefined && w.gwei !== undefined)
    .sort((a, b) => (b.multiple ?? 0) - (a.multiple ?? 0))[0]
  const extra =
    top?.gwei !== undefined && row.gwei && row.usd !== undefined
      ? ((top.gwei - row.gwei) / row.gwei) * row.usd
      : undefined
  return (
    <div className="flex flex-col items-end gap-0.5 text-right">
      {top?.multiple === undefined ? (
        <TextSkeleton sizedAs="up to 00×" className="text-lg" />
      ) : (
        <span className="whitespace-nowrap font-bold text-lg tabular-nums leading-none tracking-tight">
          <span className="font-normal text-secondary text-xs">up to </span>
          <span style={row.key === 'fast' ? { color: OVER_TEXT } : undefined}>
            {multiple(top.multiple)}
          </span>
        </span>
      )}
      {extra !== undefined && extra > 0 && (
        <span className="whitespace-nowrap text-2xs text-secondary tabular-nums">
          +{formatFee(extra)} per transfer
        </span>
      )}
    </div>
  )
}
