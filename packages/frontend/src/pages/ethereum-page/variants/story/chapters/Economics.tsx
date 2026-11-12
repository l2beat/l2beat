import { type ReactNode, useMemo } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { type DailyPoint, UPGRADES } from '../../../live/simulatedHistory'
import type { EthereumHead } from '../../../live/types'
import { Chapter, Figure, Para, Ref, Strong, TYPE, ValueSlot } from '../Article'
import { mean } from '../facts'
import { formatEthAmount, formatInteger, formatPercentage } from '../format'
import type { ChartSeries } from '../StoryChart'
import { StoryChart } from '../StoryChart'
import type { TodayPoint } from '../today'

/**
 * Chapter 4: the asset. Today's burn and issuance are running totals since
 * 00:00 UTC, so the claim says "so far"; staking moves once an epoch.
 */
export function Economics({
  history,
  head,
  today,
  from,
  to,
}: {
  history: DailyPoint[]
  head: EthereumHead
  today: TodayPoint | undefined
  from: number
  to: number
}) {
  const facts = useMemo(() => {
    const last30 = history.slice(-30)
    const first = last30[0]
    const last = last30.at(-1)
    const yearly =
      first && last
        ? ((last.supplyEth - first.supplyEth) / first.supplyEth) *
          (365 / (last30.length - 1))
        : 0
    return {
      yearly,
      burned30: mean(last30, (p) => p.burnedEth),
      issued30: mean(last30, (p) => p.issuedEth),
    }
  }, [history])
  const series = useMemo<ChartSeries[]>(
    () => [
      {
        id: 'issued',
        label: 'Issued',
        tone: 'ethereum',
        points: history.map((p) => ({ t: p.timestamp, v: p.issuedEth })),
      },
      {
        id: 'burned',
        label: 'Burned',
        tone: 'orange',
        points: history.map((p) => ({ t: p.timestamp, v: p.burnedEth })),
      },
    ],
    [history],
  )
  const withTodayPoints = today
    ? series.map((s) => ({
        ...s,
        today: {
          t: today.t,
          v: s.id === 'issued' ? today.issuedEth : today.burnedEth,
        },
      }))
    : series

  const net = today ? today.issuedEth - today.burnedEth : undefined
  const stakedShare =
    head.stakedEth !== undefined && head.supplyEth !== undefined
      ? head.stakedEth / head.supplyEth
      : undefined

  return (
    <Chapter
      id="economics"
      order={4}
      claim={
        today && net !== undefined ? (
          <>
            Since midnight UTC, Ethereum issued{' '}
            <RollingNumber value={today.issuedEth} format={formatEthAmount} />{' '}
            ETH and burned{' '}
            <RollingNumber value={today.burnedEth} format={formatEthAmount} />,
            so supply {net >= 0 ? 'grew' : 'shrank'} by{' '}
            <RollingNumber value={Math.abs(net)} format={formatEthAmount} /> ETH
          </>
        ) : (
          <>
            Since midnight UTC, Ethereum issued <ValueSlot chars={5} /> ETH and
            burned <ValueSlot chars={4} />, so supply grew by{' '}
            <ValueSlot chars={5} /> ETH
          </>
        )
      }
      standfirst={
        <>
          New ETH pays the validators who secure the chain; the base fee of
          every transaction is burned. Over the last 30 days that netted to{' '}
          {facts.yearly >= 0 ? 'growth' : 'a fall'} of{' '}
          <Strong>{formatPercentage(Math.abs(facts.yearly))}</Strong> a year.
          <Ref id="issuance" />
        </>
      }
    >
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-divider border-y py-6 md:grid-cols-4">
        <Fact
          label="Supply"
          cadence="per block"
          value={
            head.supplyEth !== undefined ? (
              <RollingNumber value={head.supplyEth} format={formatInteger} />
            ) : undefined
          }
          unit="ETH"
        />
        <Fact
          label="Staked"
          cadence="per epoch"
          value={
            head.stakedEth !== undefined ? (
              <RollingNumber value={head.stakedEth} format={formatInteger} />
            ) : undefined
          }
          unit="ETH"
        />
        <Fact
          label="Share staked"
          cadence="per epoch"
          value={
            stakedShare !== undefined ? (
              <RollingNumber value={stakedShare} format={formatPercentage} />
            ) : undefined
          }
        />
        <Fact
          label="Active validators"
          cadence="per epoch"
          value={
            head.activeValidators !== undefined ? (
              <RollingNumber
                value={head.activeValidators}
                format={formatInteger}
              />
            ) : undefined
          }
        />
      </dl>

      <Para
        className="mt-10"
        note={
          <>
            An <Strong>epoch</Strong> is 32 slots, about 6.4 minutes. Staking
            balances and the validator set change once per epoch, so those
            figures move less often than the rest.
          </>
        }
      >
        Over the last 30 complete days Ethereum issued{' '}
        <Strong>{formatInteger(facts.issued30)} ETH</Strong> a day and burned{' '}
        <Strong>{formatInteger(facts.burned30)}</Strong>. The burn is every base
        fee paid, for gas and for blobs, so it falls with fees. Issuance depends
        on how much is staked, and barely moves.
      </Para>

      <Figure
        caption={`ETH issued and burned per day. Today's marks are running totals, ${today?.hoursIn ?? 0} hours into the day, so they sit low until midnight.`}
      >
        <div className="mb-3 flex gap-5 text-[13px]">
          <Legend color="var(--chart-ethereum)" label="Issued" />
          <Legend color="var(--chart-orange)" label="Burned" />
        </div>
        <StoryChart
          series={withTodayPoints}
          from={from}
          to={to}
          format={(v) => `${formatInteger(v)} ETH`}
          upgrades={UPGRADES}
          label="ETH issued and burned per day since 2023"
        />
      </Figure>
    </Chapter>
  )
}

function Fact({
  label,
  cadence,
  value,
  unit,
}: {
  label: string
  cadence: string
  value: ReactNode
  unit?: string
}) {
  return (
    <div>
      <dt className={TYPE.label}>
        {label} <span className="text-[11px] opacity-75">{cadence}</span>
      </dt>
      <dd className="mt-2 flex items-baseline gap-1.5">
        <span className={TYPE.figure}>{value ?? <ValueSlot chars={6} />}</span>
        {unit && <span className="text-[13px] text-secondary">{unit}</span>}
      </dd>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-0.5 w-4 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
