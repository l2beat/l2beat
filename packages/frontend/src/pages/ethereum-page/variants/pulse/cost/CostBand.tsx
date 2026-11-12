import { useMemo, useState } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { formatTimestamp } from '~/utils/dates'
import { type DailyPoint, UPGRADES } from '../../../live/simulatedHistory'
import type { EthereumHead, HeadBlock } from '../../../live/types'
import { ChartNote } from '../capacity/CapacityBand'
import { HistoryChart } from '../chart/HistoryChart'
import { RANGES, type RangeKey, sliceRange } from '../chart/ranges'
import {
  BLOB_BYTES,
  formatInteger,
  formatSmart,
  formatUsd,
  formatWei,
  toEthAmount,
} from '../format'
import { median } from '../liveMetrics'
import { Band, BigNumber, Segmented } from '../ui/Band'
import { CadenceTag, Explain } from '../ui/Explain'

/**
 * Typical gas for each action: real ones vary with the token and the route,
 * so these are labelled as typical, never as exact
 */
const ACTIONS = [
  {
    key: 'transfer',
    label: 'Send ETH',
    gas: 21_000,
    explainer: 'A plain ETH transfer always uses exactly 21,000 gas.',
  },
  {
    key: 'erc20',
    label: 'Send a token',
    gas: 65_000,
    explainer:
      'An ERC-20 transfer, like sending USDC, uses about 65,000 gas. The exact amount depends on the token contract.',
  },
  {
    key: 'swap',
    label: 'Swap tokens',
    gas: 150_000,
    explainer:
      'A single-hop swap on a decentralized exchange uses about 150,000 gas. Routes through several pools use more.',
  },
] as const

type FeeMetric = 'base' | 'blob' | 'usd'

const FEE_METRICS: Record<
  FeeMetric,
  {
    label: string
    pick: (p: DailyPoint) => number
    format: (v: number) => string
    scale: 'log' | 'linear'
    color: 'brand' | 'ethereum'
  }
> = {
  base: {
    label: 'Transaction fee',
    pick: (p) => p.medianBaseFeeGwei,
    format: (v) => `${formatSmart(v)} gwei`,
    scale: 'log',
    color: 'brand',
  },
  blob: {
    label: 'Blob fee',
    pick: (p) => p.medianBlobFeeWei,
    format: formatWei,
    scale: 'log',
    color: 'ethereum',
  },
  usd: {
    label: 'ETH transfer in USD',
    pick: (p) => p.transferCostUsd,
    format: formatUsd,
    scale: 'linear',
    color: 'brand',
  },
}

const DAY = 86_400
const UPGRADE_WINDOW_DAYS = 30

/** Fees for transactions and for blobs side by side, now and across upgrades */
export function CostBand({
  live,
  history,
}: {
  live: EthereumHead
  history: DailyPoint[]
}) {
  const [metric, setMetric] = useState<FeeMetric>('base')
  const [range, setRange] = useState<RangeKey>('all')
  const head = lastProposed(live.blocks)
  const spec = FEE_METRICS[metric]
  const points = useMemo(
    () =>
      sliceRange(history, range).map((p) => ({
        t: p.timestamp,
        v: spec.pick(p),
      })),
    [history, range, spec],
  )
  const today = todayPoint(metric, live)

  return (
    <Band
      id="cost"
      title="What it costs"
      lead="Two prices, set by the chain itself: gas for transactions and blob space for rollup data. Each rises when blocks are busier than the target and falls when they are quieter."
      deeperLabel="Fee breakdown, formulas and the numbers behind each upgrade"
      deeper={<CostDetail head={head} />}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 md:gap-x-8">
        {ACTIONS.map((action) => (
          <FeeTile
            key={action.key}
            label={action.label}
            explainer={action.explainer}
            eth={
              head
                ? (action.gas * (head.baseFeeGwei + head.priorityFeeGwei)) / 1e9
                : undefined
            }
            price={head?.ethPriceUsd}
          />
        ))}
        <FeeTile
          label="Post a blob"
          explainer="Posting one blob of 128 KiB pays 131,072 blob gas at the blob fee. The transaction carrying the blob also pays normal gas, which is not included here."
          eth={head ? (head.blobBaseFeeWei * BLOB_BYTES) / 1e18 : undefined}
          price={head?.ethPriceUsd}
        />
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Fee"
          value={metric}
          onChange={setMetric}
          options={(Object.keys(FEE_METRICS) as FeeMetric[]).map((value) => ({
            value,
            label: FEE_METRICS[value].label,
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
        kind="bucket"
        scale={spec.scale}
        color={spec.color}
        upgrades={UPGRADES}
        label={`Median ${spec.label.toLowerCase()} per day`}
      />
      {today ? (
        <ChartNote />
      ) : (
        <p className="mt-3 text-paragraph-13 text-secondary">
          Daily medians. Today's blob fee joins once the day is complete.
        </p>
      )}
      <UpgradeSteps history={history} />
    </Band>
  )
}

function FeeTile({
  label,
  explainer,
  eth,
  price,
}: {
  label: string
  explainer: string
  eth: number | undefined
  price: number | undefined
}) {
  const amount = eth === undefined ? undefined : toEthAmount(eth)
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-label-value-14 text-secondary">
        <Explain explainer={explainer}>{label}</Explain>
        <CadenceTag cadence="every block" />
      </div>
      <div className="mt-3">
        <BigNumber
          className="text-[27px] md:text-[44px]"
          value={amount ? amount.value : '—'}
          unit={amount?.unit}
        />
      </div>
      <div className="mt-2 text-paragraph-14 text-secondary tabular-nums">
        {eth !== undefined && price !== undefined ? (
          <>
            ≈ <RollingNumber value={eth * price} format={formatUsd} />
          </>
        ) : (
          ' '
        )}
      </div>
    </div>
  )
}

/** Each upgrade as a before and after, a month either side, so a single odd day cannot make the case */
function UpgradeSteps({ history }: { history: DailyPoint[] }) {
  const steps = useMemo(
    () =>
      UPGRADES.map((upgrade) => {
        const before = history.filter(
          (p) =>
            p.timestamp < upgrade.timestamp &&
            p.timestamp >= upgrade.timestamp - UPGRADE_WINDOW_DAYS * DAY,
        )
        const after = history.filter(
          (p) =>
            p.timestamp >= upgrade.timestamp &&
            p.timestamp < upgrade.timestamp + UPGRADE_WINDOW_DAYS * DAY,
        )
        return {
          upgrade,
          complete: before.length > 0 && after.length >= UPGRADE_WINDOW_DAYS,
          base: [
            median(before.map((p) => p.medianBaseFeeGwei)),
            median(after.map((p) => p.medianBaseFeeGwei)),
          ],
          blobs: [
            median(before.map((p) => p.avgBlobsPerBlock)),
            median(after.map((p) => p.avgBlobsPerBlock)),
          ],
        }
      }),
    [history],
  )
  return (
    <div className="mt-12">
      <h3 className="font-bold text-heading-18">How upgrades changed it</h3>
      <p className="mt-1 text-paragraph-14 text-secondary">
        Medians of the 30 days before each upgrade and the 30 days after.
      </p>
      <ol className="-mx-4 mt-5 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:px-0">
        {steps.map(({ upgrade, complete, base, blobs }) => (
          <li
            key={upgrade.name}
            className="min-w-[15rem] snap-start rounded-2xl border border-divider p-4 md:min-w-0"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-bold text-heading-18">{upgrade.name}</span>
              <span className="text-label-value-13 text-secondary">
                {formatTimestamp(upgrade.timestamp)}
              </span>
            </div>
            <p className="mt-1 min-h-10 text-paragraph-13 text-secondary">
              {upgrade.summary}
            </p>
            {complete ? (
              <dl className="mt-4 space-y-2 text-label-value-14 tabular-nums">
                <Change
                  label="Base fee"
                  from={`${formatSmart(base[0] ?? 0)}`}
                  to={`${formatSmart(base[1] ?? 0)} gwei`}
                />
                <Change
                  label="Blobs per block"
                  from={
                    (blobs[0] ?? 0) === 0 ? 'none' : formatSmart(blobs[0] ?? 0)
                  }
                  to={formatSmart(blobs[1] ?? 0)}
                />
              </dl>
            ) : (
              <p className="mt-4 text-paragraph-13 text-secondary">
                Fewer than 30 days of data on one side.
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

function Change({
  label,
  from,
  to,
}: {
  label: string
  from: string
  to: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-secondary">{label}</dt>
      <dd className="text-right">
        <span className="text-secondary">{from}</span>
        <span className="mx-1.5 text-secondary" aria-label="to">
          ›
        </span>
        <span className="font-bold text-primary">{to}</span>
      </dd>
    </div>
  )
}

function CostDetail({ head }: { head: HeadBlock | undefined }) {
  if (!head) return null
  const tip = head.priorityFeeGwei
  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="min-w-0">
        <h3 className="font-bold text-heading-16">
          At block {head.number === undefined ? '' : formatInteger(head.number)}
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-label-value-14 tabular-nums">
            <thead className="text-secondary">
              <tr className="border-divider border-b">
                <th className="py-2 pr-3 font-medium">Action</th>
                <th className="py-2 pr-3 text-right font-medium">Gas</th>
                <th className="py-2 pr-3 text-right font-medium">Burned</th>
                <th className="py-2 pr-3 text-right font-medium">Tip</th>
                <th className="py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {ACTIONS.map((a) => {
                const burned = (a.gas * head.baseFeeGwei) / 1e9
                const tipEth = (a.gas * tip) / 1e9
                return (
                  <tr key={a.key} className="border-divider border-b">
                    <td className="py-2 pr-3">{a.label}</td>
                    <td className="py-2 pr-3 text-right">
                      {formatInteger(a.gas)}
                    </td>
                    <td className="py-2 pr-3 text-right">{fmtEth(burned)}</td>
                    <td className="py-2 pr-3 text-right">{fmtEth(tipEth)}</td>
                    <td className="py-2 text-right font-bold">
                      {fmtEth(burned + tipEth)}
                    </td>
                  </tr>
                )
              })}
              <tr>
                <td className="py-2 pr-3">Post a blob</td>
                <td className="py-2 pr-3 text-right">
                  {formatInteger(BLOB_BYTES)} blob gas
                </td>
                <td className="py-2 pr-3 text-right">
                  {fmtEth((head.blobBaseFeeWei * BLOB_BYTES) / 1e18)}
                </td>
                <td className="py-2 pr-3 text-right">—</td>
                <td className="py-2 text-right font-bold">
                  {fmtEth((head.blobBaseFeeWei * BLOB_BYTES) / 1e18)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-3 text-paragraph-14 text-secondary">
        <p>
          <span className="font-medium text-primary">
            Cost = gas × (base fee + tip).
          </span>{' '}
          The base fee, {formatSmart(head.baseFeeGwei)} gwei now, is burned. The
          tip, {formatSmart(tip)} gwei here as the newest block's median, goes
          to the validator.
        </p>
        <p>
          <span className="font-medium text-primary">
            Blob cost = 131,072 blob gas × blob fee.
          </span>{' '}
          The blob fee, {formatWei(head.blobBaseFeeWei)} now, is burned too. It
          has its own market, so busy blocks do not make blobs dearer, and the
          other way round.
        </p>
        <p>
          Gas for the token transfer and the swap is typical, not exact. USD
          uses the ETH price at the newest block.
        </p>
      </div>
    </div>
  )
}

function fmtEth(eth: number) {
  const amount = toEthAmount(eth)
  return `${amount.value} ${amount.unit}`
}

function lastProposed(blocks: HeadBlock[]) {
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i]
    if (block?.status === 'proposed') return block
  }
  return undefined
}

/** Today's base fee as the gas-weighted average so far; blob fees are not totalled per day yet */
function todayPoint(metric: FeeMetric, live: EthereumHead) {
  const today = live.today
  if (!today || today.gasUsed === 0) return undefined
  const avgBaseFee = (today.burnedEth * 1e9) / today.gasUsed
  const price = live.head?.ethPriceUsd
  if (metric === 'base') return { t: today.startedAt, v: avgBaseFee }
  if (metric === 'usd' && price)
    return { t: today.startedAt, v: (avgBaseFee * 21_000 * price) / 1e9 }
  return undefined
}
