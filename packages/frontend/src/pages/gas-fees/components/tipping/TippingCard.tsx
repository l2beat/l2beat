import type { GasFeesWallet } from '@l2beat/database'
import { useRef } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { DayPeriod } from '~/server/features/gas-fees/days'
import type { GasFeesTipping } from '~/server/features/gas-fees/tipping/getGasFeesTipping'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import {
  formatDate,
  formatDays,
  formatRatio,
  formatUsd,
  pluralDays,
} from '../../utils/format'
import { Eyebrow } from '../Eyebrow'
import { LiveStatus } from './LiveStatus'
import { PriceOfSpeedSection } from './PriceOfSpeedSection'
import { TipPayersSection } from './TipPayersSection'
import { TipTiers } from './TipTiers'
import { type LiveTips, useLiveTips } from './useLiveTips'

export function TippingCard({
  tipping,
  walletIcons,
}: {
  tipping: GasFeesTipping
  walletIcons: Record<GasFeesWallet, string>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const live = useLiveTips(ref)
  const { payers } = tipping
  const overtipped = payers ? payers.ordinaryUsd - payers.atFastTipUsd : 0
  const fastSpread = live.status === 'live' ? getFastSpread(live) : undefined

  return (
    <PrimaryCard>
      <div ref={ref} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Eyebrow>Tipping on Ethereum{DOT_SEPARATOR}L1 only</Eyebrow>
          <LiveStatus live={live} />
        </div>
        {/* Without a live read there is no claim to make about the tip now */}
        {(fastSpread || (payers && overtipped > 0)) && (
          <h2 className="font-bold text-2xl leading-tight md:text-3xl">
            {fastSpread && (
              <span className="lg:block">
                You can pay up to{' '}
                <span className="text-brand-deep">{fastSpread.most} less</span>{' '}
                by using our estimated tip.{' '}
              </span>
            )}
            {payers && overtipped > 0 && (
              <span className="lg:block">
                {getPeriodOpening(payers.period)}, ordinary transactions tipped{' '}
                <span className="text-brand-deep">{formatUsd(overtipped)}</span>{' '}
                above {fastSpread ? 'it' : 'our estimated fast tip'}.
              </span>
            )}
          </h2>
        )}
        {fastSpread && (
          <p className="text-secondary text-sm">
            Fast, for the next block: wallets suggest{' '}
            {fastSpread.least === fastSpread.most
              ? fastSpread.most
              : `${fastSpread.least} to ${fastSpread.most}`}{' '}
            our estimated tip right now.
          </p>
        )}
        {/* A total over fewer days than its period reads as more than it is */}
        {payers && payers.period.missingDays > 0 && (
          <p className="text-secondary text-sm">
            Tips: {formatDays(payers.period.from, payers.period.to)}, without{' '}
            {pluralDays(payers.period.missingDays)} of incomplete data.
          </p>
        )}
        <LiveTiers live={live} walletIcons={walletIcons} />
        <div className="grid gap-8 border-divider border-t pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-8">
          <div className="lg:border-divider lg:border-r lg:pr-8">
            <PriceOfSpeedSection speed={tipping.speed} />
          </div>
          <TipPayersSection payers={payers} />
        </div>
      </div>
    </PrimaryCard>
  )
}

function LiveTiers({
  live,
  walletIcons,
}: {
  live: LiveTips
  walletIcons: Record<GasFeesWallet, string>
}) {
  if (live.status === 'loading') {
    return (
      <div
        aria-hidden
        className="h-[400px] animate-pulse rounded-lg bg-surface-secondary"
      />
    )
  }
  if (live.status !== 'live') return null
  return (
    <TipTiers
      tips={live.estimate.tips}
      wallets={live.wallets}
      ethUsd={live.estimate.ethUsd}
      walletIcons={walletIcons}
    />
  )
}

/** The tips are kept for a year, which may not be stored in full yet */
function getPeriodOpening(period: DayPeriod) {
  return period.days + period.missingDays >= 360
    ? 'Over the year'
    : `Since ${formatDate(period.from)}`
}

/** Wallets' fast suggestions over our fast tip, lowest and highest */
function getFastSpread(live: Extract<LiveTips, { status: 'live' }>) {
  const ours = live.estimate.tips.fast
  const ratios = live.wallets
    .filter((w) => w.tier === 'fast')
    .map((w) => w.tipGwei / ours)
    .filter((r) => Number.isFinite(r) && r > 0)
  // "Up to N× less" needs a wallet above ours
  if (!(Math.max(...ratios) > 1)) return undefined
  return {
    least: formatRatio(Math.min(...ratios)),
    most: formatRatio(Math.max(...ratios)),
  }
}
