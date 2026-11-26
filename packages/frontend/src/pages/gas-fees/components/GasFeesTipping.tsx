import type {
  GasFeesTipPayers as TipPayers,
  GasFeesTipping as Tipping,
} from '~/server/features/gas-fees/getGasFeesTipping'
import { GasFeesLive } from './GasFeesLive'
import { GasFeesMethodology } from './GasFeesMethodology'
import { GasFeesPriceOfSpeed } from './GasFeesPriceOfSpeed'
import { GasFeesTipPayers } from './GasFeesTipPayers'
import {
  Colored,
  formatPeriod,
  KeyItem,
  Label,
  NoDataYet,
  percent,
  ShareBar,
  usd,
} from './parts'
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
      <ShareBar
        className="h-11 gap-[3px] rounded-lg font-semibold text-black text-sm tabular-nums"
        parts={parts.map((p) => {
          const labelled = share(p.value) >= NARROWEST_LABELLED
          return {
            key: p.label,
            value: p.value,
            color: p.color,
            // Padding would hold a thin part wider than its share
            className: labelled ? 'px-3' : undefined,
            inside: labelled && usd(p.value),
          }
        })}
      />
      <div className="flex justify-between gap-3 text-xs">
        {parts.map((p) => (
          <KeyItem key={p.label} color={p.color}>
            <span>{p.label}</span>
            <span className="font-medium tabular-nums">
              {share(p.value) < NARROWEST_LABELLED && `${usd(p.value)}, `}
              {percent(share(p.value))}
            </span>
          </KeyItem>
        ))}
      </div>
    </div>
  )
}
