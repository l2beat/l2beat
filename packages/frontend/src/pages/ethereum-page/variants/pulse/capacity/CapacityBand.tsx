import { useMemo, useState } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { formatTimestamp } from '~/utils/dates'
import { type DailyPoint, UPGRADES } from '../../../live/simulatedHistory'
import type { EthereumHead } from '../../../live/types'
import { HistoryChart } from '../chart/HistoryChart'
import { dayStats, RANGES, type RangeKey, sliceRange } from '../chart/ranges'
import {
  formatBytesPerSecond,
  formatFixed,
  formatGas,
  formatInteger,
  formatSmart,
  formatWei,
} from '../format'
import { getTodayRates, getWindowRates } from '../liveMetrics'
import { Band, BigNumber, Segmented, Stat } from '../ui/Band'
import { CadenceTag, Explain } from '../ui/Explain'
import { BlobStrip } from './BlobStrip'

type Metric = 'data' | 'blobs' | 'tps' | 'gas'

interface MetricSpec {
  label: string
  pick: (p: DailyPoint) => number
  format: (v: number) => string
  color: 'brand' | 'ethereum'
}

const METRICS: Record<Metric, MetricSpec> = {
  data: {
    label: 'Data',
    pick: (p) => p.dataPerSecond,
    format: formatBytesPerSecond,
    color: 'ethereum',
  },
  blobs: {
    label: 'Blobs per block',
    pick: (p) => p.avgBlobsPerBlock,
    format: (v) => formatFixed(v, 1),
    color: 'ethereum',
  },
  tps: {
    label: 'Transactions',
    pick: (p) => p.tps,
    format: (v) => `${formatFixed(v, 1)} tx/s`,
    color: 'brand',
  },
  gas: {
    label: 'Gas',
    pick: (p) => p.gasPerSecond,
    format: (v) => `${formatGas(v)}/s`,
    color: 'brand',
  },
}

const formatKb = (v: number) => formatInteger(v / 1000)
const formatOne = (v: number) => formatFixed(v, 1)
const formatMgas = (v: number) => formatFixed(v / 1e6, 2)

/** What Ethereum carries: rollup data in blobs and its own transactions in gas */
export function CapacityBand({
  live,
  history,
  posters,
}: {
  live: EthereumHead
  history: DailyPoint[]
  posters: Map<string, BlobPoster>
}) {
  const [metric, setMetric] = useState<Metric>('data')
  const [range, setRange] = useState<RangeKey>('1y')
  const rates = getWindowRates(live.blocks)
  const todayRates = getTodayRates(live.today)
  const spec = METRICS[metric]
  const points = useMemo(
    () =>
      sliceRange(history, range).map((p) => ({
        t: p.timestamp,
        v: spec.pick(p),
      })),
    [history, range, spec],
  )
  const todayValue = todayRates && pickToday(metric, todayRates)
  const today =
    live.today && todayValue !== undefined
      ? { t: live.today.startedAt, v: todayValue }
      : undefined
  const dataStats = useMemo(
    () => dayStats(history, (p) => p.dataPerSecond),
    [history],
  )
  const { limits } = live

  return (
    <Band
      id="throughput"
      title="What it carries"
      lead={
        <>
          Every 12 seconds Ethereum makes room for {limits.maxBlobs} blobs of
          rollup data and {formatGas(limits.gasLimit)} gas of its own
          transactions. The rollups built on it fill the blobs; everyone else
          shares the gas.
        </>
      }
      deeperLabel="Recent blocks, daily averages and how we count"
      deeper={<CapacityDetail live={live} history={history} />}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 md:gap-x-8">
        <Stat
          label={
            <Explain explainer="Bytes of blob data per second, averaged over the last 64 slots. Each blob is 128 KiB.">
              Data for rollups
            </Explain>
          }
          cadence={<CadenceTag cadence="last 64 blocks" />}
          sub={`30-day average ${formatBytesPerSecond(dataStats.month)}`}
        >
          <BigNumber
            className="md:text-[44px]"
            value={
              rates ? (
                <RollingNumber value={rates.bytesPerSecond} format={formatKb} />
              ) : (
                '—'
              )
            }
            unit="KB/s"
          />
        </Stat>
        <Stat
          label={
            <Explain explainer="How many blobs blocks carry, on average over the last 64 slots, against the target the blob fee steers toward.">
              Blobs per block
            </Explain>
          }
          cadence={<CadenceTag cadence="last 64 blocks" />}
          sub={`target ${limits.targetBlobs}, max ${limits.maxBlobs}`}
        >
          <BigNumber
            className="md:text-[44px]"
            value={
              rates ? (
                <RollingNumber value={rates.blobsPerBlock} format={formatOne} />
              ) : (
                '—'
              )
            }
            unit={`/ ${limits.targetBlobs}`}
          />
        </Stat>
        <Stat
          label={
            <Explain explainer="Gas is how Ethereum measures computation. Gas per second is how much work its own transactions asked of it, over the last 64 slots.">
              Gas per second
            </Explain>
          }
          cadence={<CadenceTag cadence="last 64 blocks" />}
          sub={`target ${formatGas(limits.gasTarget / 12)}/s`}
        >
          <BigNumber
            className="md:text-[44px]"
            value={
              rates ? (
                <RollingNumber value={rates.gasPerSecond} format={formatMgas} />
              ) : (
                '—'
              )
            }
            unit="Mgas/s"
          />
        </Stat>
        <div id="activity" className="scroll-mt-20">
          <Stat
            label={
              <Explain explainer="Transactions per second on Ethereum itself, and user operations, which also count each action inside a smart account bundle.">
                Transactions
              </Explain>
            }
            cadence={<CadenceTag cadence="last 64 blocks" />}
            sub={rates ? `${formatOne(rates.uops)} user operations/s` : ' '}
          >
            <BigNumber
              className="md:text-[44px]"
              value={
                rates ? (
                  <RollingNumber value={rates.tps} format={formatOne} />
                ) : (
                  '—'
                )
              }
              unit="tx/s"
            />
          </Stat>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Metric"
          value={metric}
          onChange={setMetric}
          options={Object.entries(METRICS).map(([value, m]) => ({
            value: value as Metric,
            label: m.label,
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
        color={spec.color}
        upgrades={UPGRADES}
        label={`${spec.label} per day, with today so far`}
      />
      <ChartNote />

      <div className="mt-12 rounded-2xl bg-surface-secondary/40 p-4 md:p-6 dark:bg-surface-secondary/25">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h3 className="font-bold text-heading-18">The last 64 blocks</h3>
            <p className="mt-1 text-paragraph-14 text-secondary">
              Each column is a block, each colour a system posting its data.
            </p>
          </div>
          <a
            href="/blobs"
            className="font-medium text-label-value-15 text-link underline decoration-link-stroke underline-offset-4 hover:decoration-link"
          >
            Watch every blob land
          </a>
        </div>
        <div className="mt-5">
          <BlobStrip blocks={live.blocks} limits={limits} posters={posters} />
        </div>
      </div>
    </Band>
  )
}

function pickToday(
  metric: Metric,
  rates: NonNullable<ReturnType<typeof getTodayRates>>,
) {
  switch (metric) {
    case 'data':
      return rates.bytesPerSecond
    case 'blobs':
      return rates.blobsPerBlock
    case 'tps':
      return rates.tps
    case 'gas':
      return rates.gasPerSecond
  }
}

export function ChartNote() {
  return (
    <p className="mt-3 flex items-center gap-2 text-paragraph-13 text-secondary">
      <svg width="22" height="10" aria-hidden className="shrink-0">
        <path
          d="M0 5H14"
          className="stroke-secondary"
          strokeDasharray="3 3"
          strokeWidth={1.5}
        />
        <circle
          cx={17}
          cy={5}
          r={3.5}
          className="fill-surface-primary stroke-secondary"
          strokeWidth={1.5}
        />
      </svg>
      Today so far, still filling. Averages use complete days only.
    </p>
  )
}

function CapacityDetail({
  live,
  history,
}: {
  live: EthereumHead
  history: DailyPoint[]
}) {
  const rows = useMemo(
    () =>
      (Object.keys(METRICS) as Metric[]).map((key) => ({
        key,
        spec: METRICS[key],
        stats: dayStats(history, METRICS[key].pick),
      })),
    [history],
  )
  const recent = live.blocks.slice(-10).reverse()
  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="min-w-0">
        <h3 className="font-bold text-heading-16">Latest blocks</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-label-value-14 tabular-nums">
            <thead className="text-secondary">
              <tr className="border-divider border-b">
                <th className="py-2 pr-3 font-medium">Block</th>
                <th className="py-2 pr-3 font-medium">Time</th>
                <th className="py-2 pr-3 text-right font-medium">Gas used</th>
                <th className="py-2 pr-3 text-right font-medium">Blobs</th>
                <th className="py-2 pr-3 text-right font-medium">Txs</th>
                <th className="py-2 pr-3 text-right font-medium">Base fee</th>
                <th className="py-2 text-right font-medium">Blob fee</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr
                  key={`${b.slot}-${b.hash ?? ''}`}
                  className="border-divider border-b last:border-0"
                >
                  <td className="py-2 pr-3 font-medium">
                    {b.number === undefined ? (
                      <span className="text-secondary">Missed slot</span>
                    ) : (
                      formatInteger(b.number)
                    )}
                  </td>
                  <td className="py-2 pr-3 text-secondary">
                    {formatTimestamp(b.timestamp, { mode: 'time' })}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {formatGas(b.gasUsed)}
                  </td>
                  <td className="py-2 pr-3 text-right">{b.blobCount}</td>
                  <td className="py-2 pr-3 text-right">
                    {formatInteger(b.txCount)}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {b.status === 'missed'
                      ? '—'
                      : `${formatSmart(b.baseFeeGwei)} gwei`}
                  </td>
                  <td className="py-2 text-right">
                    {b.status === 'missed' ? '—' : formatWei(b.blobBaseFeeWei)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-heading-16">Complete days</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-label-value-14 tabular-nums">
            <thead className="text-secondary">
              <tr className="border-divider border-b">
                <th className="py-2 pr-3 font-medium" />
                <th className="py-2 pr-3 text-right font-medium">Yesterday</th>
                <th className="py-2 pr-3 text-right font-medium">30 days</th>
                <th className="py-2 text-right font-medium">Record</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ key, spec, stats }) => (
                <tr key={key} className="border-divider border-b last:border-0">
                  <td className="py-2 pr-3 text-secondary">{spec.label}</td>
                  <td className="py-2 pr-3 text-right">
                    {spec.format(stats.yesterday)}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {spec.format(stats.month)}
                  </td>
                  <td
                    className="py-2 text-right"
                    title={formatTimestamp(stats.record.t)}
                  >
                    {spec.format(stats.record.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 space-y-2 text-paragraph-14 text-secondary">
          <p>
            Data counts the full 128 KiB of every blob, padding included, since
            that is the space a rollup pays for and every node stores.
          </p>
          <p>
            Live rates average the last 64 slots, missed slots included. Daily
            values are averages over UTC days; the record is the highest
            complete day in the last three years.
          </p>
        </div>
      </div>
    </div>
  )
}
