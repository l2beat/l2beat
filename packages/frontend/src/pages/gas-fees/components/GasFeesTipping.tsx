import { GasFeesLive } from './GasFeesLive'
import { GasFeesMethodology } from './GasFeesMethodology'
import { GasFeesPriceOfSpeed } from './GasFeesPriceOfSpeed'
import { Colored, Label } from './GasFeesStats'
import { GasFeesTipPayers } from './GasFeesTipPayers'
import mock from './pageMock.json'

const FAST = 'var(--chart-stacked-blue)'
const OVER = 'var(--chart-stacked-pink)'
/** The chart pink is too light for text on a light background */
const OVER_TEXT = 'var(--brand)'

/**
 * Everything about tips in one card, and only on Ethereum: L2s are
 * covered by the sections below it
 */
export function GasFeesTipping() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-xl md:text-2xl">Tipping on Ethereum</h2>
        <Label>Ethereum L1 only</Label>
      </div>
      <GasFeesLive action={<GasFeesMethodology />} />
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 border-divider border-t pt-6 lg:grid-cols-2">
        <GasFeesTipsSummary />
        <div className="border-divider max-lg:border-t max-lg:pt-6 lg:border-l lg:pl-10">
          <GasFeesTipPayers />
        </div>
      </div>
      <div className="border-divider border-t pt-6">
        <GasFeesPriceOfSpeed />
      </div>
    </div>
  )
}

export function GasFeesTipsSummary() {
  const { tips } = mock
  const over = tips.ordinaryUsd - tips.atFastUsd
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">Overtipping</h3>
        <p className="font-bold text-xl leading-tight tracking-tight md:text-2xl">
          Ordinary transactions tipped {usd(tips.ordinaryUsd)}.{' '}
          <Colored color={OVER_TEXT}>{usd(over)}</Colored> of it was above our
          fast tip.
        </p>
        <p className="text-secondary text-xs">
          {mock.period}. Ordinary means a tip under 2.5 gwei. Higher tips land
          near the front of the block much more often, which our fast tip
          doesn’t aim for, so they don’t count as overtipping.
        </p>
      </div>
      <SplitBar
        parts={[
          {
            label: 'Up to our fast tip',
            value: tips.atFastUsd,
            color: FAST,
          },
          { label: 'Above it', value: over, color: OVER },
        ]}
      />
    </div>
  )
}

/** One whole, its parts labelled inside and keyed below */
function SplitBar({
  parts,
}: {
  parts: { label: string; value: number; color: string }[]
}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-11 gap-[3px] overflow-hidden rounded-lg font-semibold text-black text-sm tabular-nums">
        {parts.map((p) => (
          <span
            key={p.label}
            className="flex items-center overflow-hidden whitespace-nowrap px-3"
            style={{
              width: `${total > 0 ? (p.value / total) * 100 : 0}%`,
              backgroundColor: p.color,
            }}
          >
            {usd(p.value)}
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
              {Math.round(total > 0 ? (p.value / total) * 100 : 0)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

function usd(value: number) {
  return `$${Math.round(value / 1e6)}M`
}
