import { useMemo, useState } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import type { DailyPoint } from '../../../live/simulatedHistory'
import type { EthereumHead } from '../../../live/types'
import {
  formatCompact,
  formatEth,
  formatPercentage,
  formatUsd,
  formatWhole,
} from '../format'
import { average, type RangeId, SLOT_SECONDS, sliceRange } from '../model'
import { ECONOMICS_ANCHOR } from './anchors'
import { HistoryChart } from './HistoryChart'
import { ChartBlock, LiveStat, RangeTabs, SectionShell } from './SectionShell'

export function EconomicsSection({
  entry,
  live,
  history,
}: {
  entry: EthereumProjectPageEntry
  live: EthereumHead
  history: DailyPoint[]
}) {
  const [range, setRange] = useState<RangeId>('1y')
  const { today, supplyEth, stakedEth, activeValidators } = live
  const ready = supplyEth !== undefined
  const price = live.head?.ethPriceUsd
  const shown = useMemo(() => sliceRange(history, range), [history, range])
  const supplyPoints = useMemo(
    () => shown.map((d) => ({ t: d.timestamp, v: d.supplyEth })),
    [shown],
  )
  const todaySupply =
    today && supplyEth !== undefined
      ? {
          t: today.startedAt,
          v: supplyEth,
          until: today.startedAt + today.slots * SLOT_SECONDS,
        }
      : undefined
  const net = today ? today.issuedEth - today.burnedEth : 0
  const last30 = history.slice(-30)
  const yearlyNet = average(last30.map((d) => d.issuedEth - d.burnedEth)) * 365

  return (
    <SectionShell
      id={ECONOMICS_ANCHOR}
      order={4}
      title="The asset securing it all"
      lede="ETH pays for every block above, and staked ETH is what an attacker would have to put at risk. Supply moves with every block; staking moves once per epoch."
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4">
        <LiveStat
          className="col-span-2 md:col-span-1"
          label="Supply"
          ready={ready}
          value={<RollingNumber value={supplyEth ?? 0} format={wholeEth} />}
          unit="ETH"
          detail={
            price
              ? `${formatUsd((supplyEth ?? 0) * price)} at ${formatUsd(price)}`
              : undefined
          }
          cadence="per block, price per minute"
        />
        <LiveStat
          label="Staked"
          ready={stakedEth !== undefined}
          value={<RollingNumber value={stakedEth ?? 0} format={compactEth} />}
          unit="ETH"
          detail={
            stakedEth !== undefined && supplyEth
              ? `${formatPercentage(stakedEth / supplyEth, 1)} of supply`
              : undefined
          }
          cadence="per epoch"
        />
        <LiveStat
          label="Active validators"
          ready={activeValidators !== undefined}
          value={
            <RollingNumber value={activeValidators ?? 0} format={formatWhole} />
          }
          detail={
            stakedEth !== undefined && activeValidators
              ? `${formatEth(stakedEth / activeValidators)} ETH each on average`
              : undefined
          }
          cadence="per epoch"
        />
        <LiveStat
          label="Economic security"
          ready
          value={
            entry.header.economicSecurity !== undefined
              ? formatUsd(entry.header.economicSecurity)
              : 'Not measured'
          }
          detail="Slashable in a data withholding attack: 2/3 of the stake"
          cadence="daily"
        />
      </div>

      <div className="mt-8 grid gap-8 border-divider border-t pt-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-bold text-heading-16">Today so far</h3>
            <span className="text-label-value-12 text-secondary">
              since 00:00 UTC, per block
            </span>
          </div>
          <FlowBars issued={today?.issuedEth} burned={today?.burnedEth} />
          <div className="mt-4 flex items-baseline justify-between gap-4 border-divider border-t pt-3">
            <span className="text-label-value-14 text-secondary">
              Net change
            </span>
            <span className="font-bold text-label-value-18 tabular-nums">
              {today ? (
                <>
                  {net >= 0 ? '+' : '−'}
                  <RollingNumber value={Math.abs(net)} format={formatEth} /> ETH
                </>
              ) : (
                '—'
              )}
            </span>
          </div>
          <p className="mt-3 text-label-value-12 text-secondary leading-snug">
            At the last 30 complete days' pace, supply changes by{' '}
            {yearlyNet >= 0 ? '+' : '−'}
            {formatCompact(Math.abs(yearlyNet))} ETH a year. The base fee is
            burned; issuance pays validators.
          </p>
        </div>
        <ChartBlock
          title="Supply"
          summary={
            <RangeTabs value={range} onChange={setRange} label="Supply range" />
          }
        >
          <HistoryChart
            label="ETH supply per day"
            points={supplyPoints}
            today={todaySupply}
            format={millionsOfEth}
            color="var(--chart-ethereum)"
            zeroBased={false}
          />
        </ChartBlock>
      </div>
    </SectionShell>
  )
}

function FlowBars({
  issued,
  burned,
}: {
  issued: number | undefined
  burned: number | undefined
}) {
  const max = Math.max(issued ?? 0, burned ?? 0, 1e-9)
  const bars = [
    { label: 'Issued', value: issued, color: 'var(--chart-ethereum)' },
    { label: 'Burned', value: burned, color: 'var(--brand)' },
  ]
  return (
    <div className="mt-4 flex flex-col gap-4">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex items-baseline justify-between gap-4 text-label-value-14">
            <span className="text-secondary">{bar.label}</span>
            <span className="font-medium tabular-nums">
              {bar.value === undefined ? (
                '—'
              ) : (
                <>
                  <RollingNumber value={bar.value} format={formatEth} /> ETH
                </>
              )}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="h-full origin-left rounded-full transition-transform duration-700 ease-out"
              style={{
                backgroundColor: bar.color,
                transform: `scaleX(${(bar.value ?? 0) / max})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function wholeEth(value: number) {
  return formatWhole(value)
}

function compactEth(value: number) {
  return formatCompact(value)
}

/** Supply moves by tenths of a million in a year: "122M" twice on the axis says nothing */
function millionsOfEth(value: number) {
  return `${(value / 1e6).toFixed(2)}M`
}
