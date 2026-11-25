import type {
  GasFeesTipPayers as TipPayers,
  GasFeesTipping as Tipping,
} from '~/server/features/gas-fees/getGasFeesTipping'
import { GasFeesLive } from './GasFeesLive'
import { GasFeesMethodology } from './GasFeesMethodology'
import { GasFeesPriceOfSpeed } from './GasFeesPriceOfSpeed'
import { Colored } from './GasFeesStats'
import { GasFeesTipPayers } from './GasFeesTipPayers'
import { formatPeriod, Label, NoDataYet } from './parts'
import type { GasFeesWalletIcons } from './types'

const FAST = 'var(--chart-stacked-blue)'
const OVER = 'var(--chart-stacked-pink)'
/** The chart pink is too light for text on a light background */
const OVER_TEXT = 'var(--brand)'

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
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-xl md:text-2xl">Tipping on Ethereum</h2>
        <Label>Ethereum L1 only</Label>
        <p className="mt-1 text-secondary text-sm">
          A tip is the part of a fee you choose, on top of the base fee the
          network sets.
        </p>
      </div>
      <GasFeesLive
        walletIcons={walletIcons}
        estimateAction={<GasFeesMethodology />}
      />
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 border-divider border-t pt-6 lg:grid-cols-2">
        <GasFeesOvertipping payers={tipping.payers} />
        <div className="border-divider max-lg:border-t max-lg:pt-6 lg:border-l lg:pl-10">
          <GasFeesTipPayers payers={tipping.payers} />
        </div>
      </div>
      <div className="border-divider border-t pt-6">
        <GasFeesPriceOfSpeed speed={tipping.speed} />
      </div>
    </div>
  )
}

function GasFeesOvertipping({ payers }: { payers: TipPayers | undefined }) {
  if (!payers) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">Overtipping</h3>
        <NoDataYet />
      </div>
    )
  }
  const over = payers.ordinaryUsd - payers.atFastUsd
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">Overtipping</h3>
        <p className="font-bold text-xl leading-tight tracking-tight md:text-2xl">
          Ordinary transactions tipped {usd(payers.ordinaryUsd)}.{' '}
          <Colored color={OVER_TEXT}>{usd(over)}</Colored> of it was above our
          fast tip.
        </p>
        <p className="text-secondary text-xs">
          {formatPeriod(payers.period)}. Ordinary means a tip under 2.5 gwei.
          Higher tips land near the front of the block much more often, which
          our fast tip doesn’t aim for, so they don’t count as overtipping.
        </p>
      </div>
      <SplitBar
        parts={[
          {
            label: 'Up to our fast tip',
            value: payers.atFastUsd,
            color: FAST,
          },
          { label: 'Above it', value: over, color: OVER },
        ]}
      />
    </div>
  )
}

/** A narrower part can't hold its amount, which then goes in the key */
const NARROWEST_LABELLED = 0.22

/** One whole, its parts labelled inside and keyed below */
function SplitBar({
  parts,
}: {
  parts: { label: string; value: number; color: string }[]
}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  const share = (value: number) => (total > 0 ? value / total : 0)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-11 gap-[3px] overflow-hidden rounded-lg font-semibold text-black text-sm tabular-nums">
        {parts.map((p) => (
          <span
            key={p.label}
            className="flex items-center overflow-hidden whitespace-nowrap px-3"
            style={{
              width: `${share(p.value) * 100}%`,
              backgroundColor: p.color,
            }}
          >
            {share(p.value) >= NARROWEST_LABELLED && usd(p.value)}
          </span>
        ))}
      </div>
      <div className="flex justify-between gap-3 text-xs">
        {parts.map((p) => (
          <span
            key={p.label}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <span
              className="size-2 rounded-xs"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-secondary">{p.label}</span>
            <span className="font-medium tabular-nums">
              {share(p.value) < NARROWEST_LABELLED && `${usd(p.value)}, `}
              {Math.round(share(p.value) * 100)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** "$52M", or "$1.2M" and "$340K" while only some days are stored */
function usd(value: number) {
  return `$${Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumSignificantDigits: value >= 1e7 ? 2 : 3,
  }).format(value)}`
}
