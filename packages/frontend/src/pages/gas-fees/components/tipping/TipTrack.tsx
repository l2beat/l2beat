import type { GasFeesWallet } from '@l2beat/database'
import { useRef } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { Logo } from '~/components/Logo'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { TIP_BANDS } from '~/server/features/gas-fees/tipping/toTipPayers'
import { cn } from '~/utils/cn'
import { formatGwei, formatUsd } from '../../utils/format'
import { type LogScale, logPosition } from '../../utils/logScale'
import { DecadeLines } from '../DecadeAxis'
import { placeChips } from './placeChips'
import { TIP_BAND_STYLE } from './tipBands'

export interface WalletMark {
  wallet: GasFeesWallet
  tipGwei: number
  iconUrl: string
}

const CHIP_HEIGHT = 22
/** A chip's icon and padding, then 8 px a digit and 4 px a point */
const chipWidth = (text: string) =>
  32 + text.replace('.', '').length * 8 + (text.includes('.') ? 4 : 0)

/**
 * One tier on the shared log scale: our estimate, each wallet's suggestion and
 * a bar from ours to the highest, chips above and below the line
 */
export function TipTrack({
  tierName,
  ours,
  wallets,
  usdPerGwei,
  scale,
}: {
  tierName: string
  ours: number
  wallets: WalletMark[]
  usdPerGwei: number
  scale: LogScale
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { width = 0 } = useResizeObserver({ ref })
  const highest = Math.max(ours, ...wallets.map((w) => w.tipGwei))
  // A tip under the track's floor, or of zero, sits at its start
  const at = (gwei: number) =>
    Math.min(1, Math.max(0, logPosition(scale, gwei)))
  const x = (gwei: number) => at(gwei) * width
  const ourText = formatGwei(ours)
  const chips = placeChips(
    [
      { key: 'ours', x: x(ours), width: chipWidth(ourText) },
      ...wallets.map((w) => ({
        key: w.wallet,
        x: x(w.tipGwei),
        width: chipWidth(formatGwei(w.tipGwei)),
      })),
    ],
    width,
  )
  const chipOf = (key: string) => chips.find((c) => c.key === key)

  return (
    <div ref={ref} className="relative h-[84px] w-full">
      <DecadeLines scale={scale} className="border-dashed" />
      <BandStrip scale={scale} />
      {highest > ours && (
        <div
          className="-translate-y-1/2 absolute top-1/2 h-1.5 rounded-full bg-linear-to-r from-brand/20 to-brand"
          style={{
            left: `${at(ours) * 100}%`,
            width: `${(at(highest) - at(ours)) * 100}%`,
          }}
        />
      )}
      {wallets.map((w) => (
        <Dot
          key={w.wallet}
          at={at(w.tipGwei)}
          className="size-2.5 border-2 border-surface-primary bg-brand"
        />
      ))}
      <Dot at={at(ours)} className="size-3.5 bg-primary" />
      {width > 0 && (
        <>
          <Chip
            placement={chipOf('ours')}
            className="bg-primary text-surface-primary"
            icon={<Logo small animated={false} className="h-3.5 w-4" />}
            text={ourText}
            tooltip={`Our estimated ${tierName.toLowerCase()} tip: ${ourText} gwei, +${formatUsd(ours * usdPerGwei)} per ERC-20 transfer`}
          />
          {wallets.map((w) => (
            <Chip
              key={w.wallet}
              placement={chipOf(w.wallet)}
              className="border border-divider bg-surface-primary text-primary"
              icon={<img src={w.iconUrl} alt="" className="size-3.5" />}
              text={formatGwei(w.tipGwei)}
              tooltip={`${w.wallet} suggests ${formatGwei(w.tipGwei)} gwei for ${tierName.toLowerCase()}, +${formatUsd(w.tipGwei * usdPerGwei)} per ERC-20 transfer`}
            />
          ))}
        </>
      )}
    </div>
  )
}

/** The three tip bands, a thin strip along the line */
function BandStrip({ scale }: { scale: LogScale }) {
  const low = 10 ** scale.min
  return (
    <div className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-0.5">
      {TIP_BANDS.map((band) => {
        const { fromGwei, toGwei, color } = TIP_BAND_STYLE[band]
        const from = logPosition(scale, Math.max(fromGwei, low))
        const to = logPosition(scale, toGwei)
        return (
          <div
            key={band}
            className="absolute inset-y-0 opacity-50"
            style={{
              left: `${from * 100}%`,
              width: `${(to - from) * 100}%`,
              backgroundColor: color,
            }}
          />
        )
      })}
    </div>
  )
}

function Dot({ at, className }: { at: number; className: string }) {
  return (
    <div
      className={cn(
        '-translate-x-1/2 -translate-y-1/2 absolute top-1/2 rounded-full',
        className,
      )}
      style={{ left: `${at * 100}%` }}
    />
  )
}

function Chip({
  placement,
  icon,
  text,
  tooltip,
  className,
}: {
  placement: { lane: 'above' | 'below'; left: number } | undefined
  icon: React.ReactNode
  text: string
  tooltip: string
  className: string
}) {
  if (!placement) return null
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'absolute flex items-center gap-1 rounded-full px-1.5 font-semibold text-xs tabular-nums',
          className,
        )}
        style={{
          left: placement.left,
          height: CHIP_HEIGHT,
          top: placement.lane === 'above' ? 8 : undefined,
          bottom: placement.lane === 'below' ? 8 : undefined,
        }}
      >
        {icon}
        {text}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
