import type { GasFeesTier, GasFeesWallet } from '@l2beat/database'
import { Logo } from '~/components/Logo'
import { tipToUsd } from '~/server/features/gas-fees/chains'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { formatRatio, formatUsd } from '../../utils/format'
import { type LogScale, logScaleOf } from '../../utils/logScale'
import { DecadeAxis, formatDecade } from '../DecadeAxis'
import { Eyebrow } from '../Eyebrow'
import { CountingGwei } from './CountingGwei'
import { MethodologyDialog } from './MethodologyDialog'
import { TipTrack, type WalletMark } from './TipTrack'

const TIERS: { tier: GasFeesTier; name: string; promise: string }[] = [
  { tier: 'slow', name: 'Slow', promise: '95% within 1 minute' },
  { tier: 'medium', name: 'Medium', promise: '95% within 2 blocks' },
  { tier: 'fast', name: 'Fast', promise: '95% next block' },
]
/** The track spans 0.000001 to 10 gwei, and grows upward for a higher tip */
const TRACK_FLOOR = -6
const TRACK_TOP_GWEI = 10

const ROW_GRID = 'lg:grid lg:grid-cols-[180px_minmax(0,1fr)_120px] lg:gap-x-6'

export function TipTiers({
  tips,
  wallets,
  ethUsd,
  walletIcons,
}: {
  tips: Record<GasFeesTier, number>
  wallets: { wallet: GasFeesWallet; tier: GasFeesTier; tipGwei: number }[]
  ethUsd: number
  walletIcons: Record<GasFeesWallet, string>
}) {
  const scale = logScaleOf(
    [TRACK_TOP_GWEI, ...Object.values(tips), ...wallets.map((w) => w.tipGwei)],
    TRACK_FLOOR,
  )
  const walletNames = [...new Set(wallets.map((w) => w.wallet))]
  return (
    <div>
      <div
        className={`${ROW_GRID} flex flex-wrap items-center gap-x-4 gap-y-2 border-divider border-b pb-2`}
      >
        <Eyebrow className="whitespace-nowrap">
          Tier{DOT_SEPARATOR}tip in gwei
        </Eyebrow>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-label-value-14">
          <span className="flex items-center gap-1.5">
            <Logo small animated={false} className="h-3.5 w-4" />
            Our estimated tip
          </span>
          {walletNames.map((wallet) => (
            <span key={wallet} className="flex items-center gap-1.5">
              <img src={walletIcons[wallet]} alt="" className="size-3.5" />
              {wallet}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-5 rounded-full bg-linear-to-r from-brand/20 to-brand" />
            Above our estimate
          </span>
          <MethodologyDialog className="lg:ml-auto" />
        </div>
        <Eyebrow className="max-lg:hidden lg:justify-self-end">
          Wallets suggest
        </Eyebrow>
      </div>
      {TIERS.map(({ tier, name, promise }) => {
        const ours = tips[tier]
        const marks: WalletMark[] = wallets
          .filter((w) => w.tier === tier)
          .map((w) => ({ ...w, iconUrl: walletIcons[w.wallet] }))
        const highest = Math.max(...marks.map((m) => m.tipGwei))
        return (
          <div
            key={tier}
            className={`${ROW_GRID} grid grid-cols-[1fr_auto] items-center gap-x-4 border-divider border-b py-2`}
          >
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight">{name}</span>
              <span className="text-2xs text-secondary">{promise}</span>
              <span className="mt-1">
                <CountingGwei value={ours} />
              </span>
              <span className="text-2xs text-secondary">
                +{formatUsd(tipToUsd(ours, ethUsd))} per transfer
              </span>
            </div>
            <div className="col-span-2 row-start-2 lg:col-span-1 lg:row-start-auto">
              <TipTrack
                tierName={name}
                ours={ours}
                wallets={marks}
                ethUsd={ethUsd}
                scale={scale}
              />
            </div>
            <div className="col-start-2 row-start-1 flex flex-col items-end text-right lg:col-start-auto lg:row-start-auto">
              {highest > ours && ours > 0 && (
                <>
                  <span className="text-secondary text-xs">
                    up to{' '}
                    <span
                      className={
                        tier === 'fast'
                          ? 'font-bold text-brand-deep text-lg'
                          : 'font-bold text-lg text-primary'
                      }
                    >
                      {formatRatio(highest / ours)}
                    </span>
                  </span>
                  <span className="text-2xs text-secondary">
                    +{formatUsd(tipToUsd(highest - ours, ethUsd))} per transfer
                  </span>
                </>
              )}
            </div>
          </div>
        )
      })}
      <TrackAxis scale={scale} />
    </div>
  )
}

function TrackAxis({ scale }: { scale: LogScale }) {
  return (
    <div
      className={`${ROW_GRID} flex items-start pt-1 text-2xs text-secondary`}
    >
      <span className="max-lg:hidden">gwei, log scale</span>
      <DecadeAxis scale={scale} format={formatDecade} />
    </div>
  )
}
