import { useMemo, useState } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { type DailyPoint, UPGRADES } from '../../../live/simulatedHistory'
import type { EthereumHead } from '../../../live/types'
import { ChartNote } from '../capacity/CapacityBand'
import { HistoryChart } from '../chart/HistoryChart'
import { RANGES, type RangeKey, sliceRange } from '../chart/ranges'
import {
  formatCompact,
  formatFixed,
  formatInteger,
  formatPercent,
  formatPrice,
  formatUsd,
} from '../format'
import { Band, BigNumber, Segmented, Stat } from '../ui/Band'
import { CadenceTag, Explain } from '../ui/Explain'

type Metric = 'supply' | 'staked' | 'burned'

const METRICS: Record<
  Metric,
  {
    label: string
    pick: (p: DailyPoint) => number
    format: (v: number) => string
    kind: 'bucket' | 'snapshot'
    scale: 'fit' | 'linear'
  }
> = {
  supply: {
    label: 'Supply',
    pick: (p) => p.supplyEth,
    format: (v) => `${formatCompact(v, 3)} ETH`,
    kind: 'snapshot',
    scale: 'fit',
  },
  staked: {
    label: 'Staked',
    pick: (p) => p.stakedEth,
    format: (v) => `${formatCompact(v, 2)} ETH`,
    kind: 'snapshot',
    scale: 'fit',
  },
  burned: {
    label: 'Burned per day',
    pick: (p) => p.burnedEth,
    format: (v) => `${formatCompact(v, 1)} ETH`,
    kind: 'bucket',
    scale: 'linear',
  },
}

const formatSupply = (v: number) => formatFixed(v, 2)
const formatTodayEth = (v: number) => formatFixed(v, 2)
const formatWhole = (v: number) => formatInteger(v)

/** The asset: how much exists, how much is locked up securing the chain, and what flows in and out today */
export function EconomicsBand({
  live,
  history,
}: {
  live: EthereumHead
  history: DailyPoint[]
}) {
  const [metric, setMetric] = useState<Metric>('supply')
  const [range, setRange] = useState<RangeKey>('1y')
  const spec = METRICS[metric]
  const points = useMemo(
    () =>
      sliceRange(history, range).map((p) => ({
        t: p.timestamp,
        v: spec.pick(p),
      })),
    [history, range, spec],
  )
  const today = todayPoint(metric, live)
  const { supplyEth, stakedEth, activeValidators } = live
  const price = live.head?.ethPriceUsd

  return (
    <Band
      id="economics"
      title="The asset"
      lead="ETH pays every fee and is staked to secure the chain. Validators earn new ETH for their work, and every base fee and blob fee is burned, so supply moves both ways."
      deeperLabel="The last seven days, and where these numbers come from"
      deeper={<EconomicsDetail history={history} />}
    >
      <div className="grid gap-x-8 gap-y-10 lg:grid-cols-[1.25fr_1fr]">
        <Stat
          label={
            <Explain explainer="All ETH in existence, updated with every block's issuance and burn.">
              ETH in existence
            </Explain>
          }
          cadence={<CadenceTag cadence="every block" />}
          sub={
            price && supplyEth
              ? `Worth ${formatUsd(price * supplyEth)} at today's price`
              : ' '
          }
        >
          <BigNumber
            className="text-[34px] md:text-[56px]"
            value={
              supplyEth === undefined ? (
                '—'
              ) : (
                <RollingNumber value={supplyEth} format={formatSupply} />
              )
            }
            unit="ETH"
          />
        </Stat>
        <TodayBalance live={live} />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-8">
        <Stat
          label={
            <Explain explainer="ETH locked by validators as collateral. Misbehaving costs them part of it, which is what makes attacking Ethereum expensive.">
              Staked
            </Explain>
          }
          cadence={<CadenceTag cadence="every epoch" />}
          sub={
            stakedEth !== undefined && supplyEth
              ? `${formatPercent(stakedEth / supplyEth, 1)} of all ETH`
              : ' '
          }
        >
          <BigNumber
            className="md:text-[44px]"
            value={
              stakedEth === undefined ? '—' : `${formatCompact(stakedEth, 2)}`
            }
            unit="ETH"
          />
        </Stat>
        <Stat
          label={
            <Explain explainer="Validators currently taking part in consensus. An epoch is 32 slots, about 6.4 minutes; the set changes only at its boundary.">
              Active validators
            </Explain>
          }
          cadence={<CadenceTag cadence="every epoch" />}
        >
          <BigNumber
            className="md:text-[44px]"
            value={
              activeValidators === undefined ? (
                '—'
              ) : (
                <RollingNumber value={activeValidators} format={formatWhole} />
              )
            }
          />
        </Stat>
        <Stat
          label="ETH price"
          cadence={<CadenceTag cadence="every minute" />}
          className="max-md:col-span-2"
        >
          <BigNumber
            className="md:text-[44px]"
            value={
              price === undefined ? (
                '—'
              ) : (
                <RollingNumber value={price} format={formatPrice} />
              )
            }
          />
        </Stat>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Metric"
          value={metric}
          onChange={setMetric}
          options={(Object.keys(METRICS) as Metric[]).map((value) => ({
            value,
            label: METRICS[value].label,
          }))}
        />
        <Segmented
          label="Range"
          value={range}
          onChange={setRange}
          options={RANGES}
        />
      </div>
      <HistoryChart
        className="mt-6"
        points={points}
        today={today}
        format={spec.format}
        kind={spec.kind}
        scale={spec.scale}
        color={metric === 'burned' ? 'brand' : 'ethereum'}
        upgrades={UPGRADES}
        label={`${spec.label} by day`}
      />
      <ChartNote />
    </Band>
  )
}

/** Issued against burned since midnight: the one comparison that says which way supply is going today */
function TodayBalance({ live }: { live: EthereumHead }) {
  const today = live.today
  const issued = today?.issuedEth ?? 0
  const burned = today?.burnedEth ?? 0
  const net = issued - burned
  const max = Math.max(issued, burned, 1e-9)
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-label-value-14 text-secondary">
        <Explain explainer="Since 00:00 UTC. Issued is the consensus rewards paid to validators; burned is every base fee and blob fee paid.">
          Today so far
        </Explain>
        <CadenceTag cadence="every block" />
      </div>
      <div className="mt-4 space-y-3">
        <BalanceRow
          label="Issued"
          value={issued}
          share={issued / max}
          className="bg-chart-ethereum"
          sign="+"
        />
        <BalanceRow
          label="Burned"
          value={burned}
          share={burned / max}
          className="bg-brand"
          sign="−"
        />
      </div>
      <div className="mt-4 text-paragraph-15 text-secondary tabular-nums">
        {today ? (
          <>
            Net{' '}
            <span
              className={cn(
                'font-bold',
                net > 0 ? 'text-primary' : 'text-positive',
              )}
            >
              {net >= 0 ? '+' : '−'}
              <RollingNumber value={Math.abs(net)} format={formatTodayEth} />{' '}
              ETH
            </span>
            : supply is {net > 0 ? 'growing' : 'shrinking'} today
          </>
        ) : (
          ' '
        )}
      </div>
    </div>
  )
}

function BalanceRow({
  label,
  value,
  share,
  className,
  sign,
}: {
  label: string
  value: number
  share: number
  className: string
  sign: string
}) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr_7.5rem] items-center gap-3">
      <span className="text-label-value-14 text-secondary">{label}</span>
      <span className="h-3 overflow-hidden rounded-full bg-surface-secondary/60">
        <span
          className={cn(
            'block h-full origin-left rounded-full transition-transform duration-700',
            className,
          )}
          style={{ transform: `scaleX(${share})` }}
        />
      </span>
      <span className="text-right font-medium text-label-value-15 tabular-nums">
        {sign}
        <RollingNumber value={value} format={formatTodayEth} /> ETH
      </span>
    </div>
  )
}

function EconomicsDetail({ history }: { history: DailyPoint[] }) {
  const week = history.slice(-7).reverse()
  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-label-value-14 tabular-nums">
          <thead className="text-secondary">
            <tr className="border-divider border-b">
              <th className="py-2 pr-3 font-medium">Day</th>
              <th className="py-2 pr-3 text-right font-medium">Issued</th>
              <th className="py-2 pr-3 text-right font-medium">Burned</th>
              <th className="py-2 pr-3 text-right font-medium">Net</th>
              <th className="py-2 text-right font-medium">Supply at end</th>
            </tr>
          </thead>
          <tbody>
            {week.map((d) => {
              const net = d.issuedEth - d.burnedEth
              return (
                <tr
                  key={d.timestamp}
                  className="border-divider border-b last:border-0"
                >
                  <td className="py-2 pr-3">{formatTimestamp(d.timestamp)}</td>
                  <td className="py-2 pr-3 text-right">
                    +{formatInteger(d.issuedEth)}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    −{formatInteger(d.burnedEth)}
                  </td>
                  <td
                    className={cn(
                      'py-2 pr-3 text-right font-medium',
                      net < 0 && 'text-positive',
                    )}
                  >
                    {net >= 0 ? '+' : '−'}
                    {formatInteger(Math.abs(net))}
                  </td>
                  <td className="py-2 text-right">
                    {formatInteger(d.supplyEth)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 text-paragraph-14 text-secondary">
        <p>
          Issuance counts consensus-layer rewards as they are credited each
          slot. It depends on how much ETH is staked, not on how busy the chain
          is.
        </p>
        <p>
          Burn counts base fees and blob fees. Tips go to validators and are not
          burned, so they are left out of both.
        </p>
        <p>
          Staked ETH and the validator set change only at epoch boundaries,
          every 32 slots.
        </p>
      </div>
    </div>
  )
}

function todayPoint(metric: Metric, live: EthereumHead) {
  const t = live.today?.startedAt
  if (t === undefined) return undefined
  if (metric === 'supply' && live.supplyEth !== undefined)
    return { t, v: live.supplyEth }
  if (metric === 'staked' && live.stakedEth !== undefined)
    return { t, v: live.stakedEth }
  if (metric === 'burned' && live.today) return { t, v: live.today.burnedEth }
  return undefined
}
