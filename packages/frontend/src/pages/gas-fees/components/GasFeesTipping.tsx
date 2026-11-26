import { LiveIndicator } from '~/components/LiveIndicator'
import { NextBlock } from '~/pages/blobs/components/live-blobs/NextBlock'
import type {
  GasFeesPeriod,
  GasFeesTipping as Tipping,
} from '~/server/features/gas-fees/getGasFeesTipping'
import { formatTimestamp } from '~/utils/dates'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { formatMultiple, formatPeriod, usd } from './format'
import { GasFeesPriceOfSpeed } from './GasFeesPriceOfSpeed'
import { GasFeesOvertipping, GasFeesTipPayers } from './GasFeesTipPayers'
import { GasFeesTipTracks } from './GasFeesTipTracks'
import { Label, TextSkeleton } from './parts'
import type { GasFeesWalletIcons } from './types'
import { type LiveTipsStatus, useLiveTips } from './useLiveTips'

/**
 * Everything about tips in one card, and only on Ethereum: L2s are
 * covered by the sections below it
 */
export function GasFeesTipping({
  tipping,
  walletIcons,
}: {
  tipping: Tipping
  walletIcons: GasFeesWalletIcons
}) {
  const live = useLiveTips()
  const { payers, speed } = tipping
  const overtip = payers ? payers.ordinaryUsd - payers.atFastUsd : 0
  const overtipped =
    payers && overtip > 0 ? { usd: overtip, period: payers.period } : undefined
  const range = live.fastRange
  const pending = live.status.kind === 'pending'
  return (
    <div ref={live.ref} className="flex flex-col gap-6">
      <header className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <h2>
            <Label>Tipping on Ethereum{DOT_SEPARATOR}L1 only</Label>
          </h2>
          <LiveStatus status={live.status} />
        </div>
        {/* Without a live read there is no claim to make about the tip now */}
        {(range || overtipped || pending) && (
          <p className="font-bold text-2xl leading-tight tracking-tight md:text-3xl">
            {pending && (
              <>
                <TextSkeleton sizedAs="You can pay up to 00× less by using our estimated tip." />{' '}
                <br className="max-md:hidden" />
              </>
            )}
            {range && (
              <>
                You can pay up to{' '}
                <span className="text-brand-deep">
                  {formatMultiple(range.highest)} less
                </span>{' '}
                by using our estimated tip. <br className="max-md:hidden" />
              </>
            )}
            {overtipped && (
              <>
                {getPeriodOpening(overtipped.period)}, ordinary transactions
                tipped{' '}
                <span className="text-brand-deep">{usd(overtipped.usd)}</span>{' '}
                above {range ? 'it' : 'our estimated fast tip'}.
              </>
            )}
          </p>
        )}
        {pending && (
          <p className="text-sm">
            <TextSkeleton sizedAs="Fast, for the next block: wallets suggest 00× our estimated tip right now." />
          </p>
        )}
        {range && (
          <p className="text-secondary text-sm">
            Fast, for the next block: wallets suggest{' '}
            {range.lowest === range.highest
              ? formatMultiple(range.highest)
              : `${formatMultiple(range.lowest)} to ${formatMultiple(range.highest)}`}{' '}
            our estimated tip right now.
          </p>
        )}
        {/* A total over fewer days than its period reads as more than it is */}
        {payers && payers.period.missingDays > 0 && (
          <p className="text-secondary text-sm">
            Tips: {formatPeriod(payers.period)}.
          </p>
        )}
      </header>

      <GasFeesTipTracks
        rows={live.rows}
        pending={pending}
        wallets={live.wallets}
        walletIcons={walletIcons}
      />

      <div className="grid grid-cols-1 gap-8 border-divider border-t pt-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-0">
        <section className="min-w-0 lg:pr-8">
          <GasFeesPriceOfSpeed speed={speed} />
        </section>
        <aside className="flex flex-col border-divider max-lg:border-t max-lg:pt-6 lg:border-l lg:pl-8">
          <GasFeesOvertipping payers={payers} />
          <div className="mt-6 border-divider border-t pt-6">
            <GasFeesTipPayers payers={payers} />
          </div>
        </aside>
      </div>
    </div>
  )
}

/** The tips are kept for a year, which the backend may not have stored yet */
function getPeriodOpening(period: GasFeesPeriod) {
  return period.days + period.missingDays >= 360
    ? 'Over the year'
    : `Since ${formatTimestamp(period.from)}`
}

function LiveStatus({ status }: { status: LiveTipsStatus }) {
  const isLive = status.kind === 'live'
  return (
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-xs">
      <span className="flex items-center gap-2">
        <LiveIndicator disabled={!isLive} />
        {status.kind === 'none' && 'No estimate right now'}
        {status.kind === 'stale' &&
          `Not live: last read ${formatTimestamp(status.updatedAt, { mode: 'datetime' })}`}
        {(isLive || status.kind === 'pending') && 'Live from Ethereum'}
      </span>
      {isLive && <NextBlock hidden={false} />}
    </span>
  )
}
