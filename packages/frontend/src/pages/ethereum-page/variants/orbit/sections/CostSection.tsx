import { useMemo, useState } from 'react'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { formatTimestamp } from '~/utils/dates'
import { type DailyPoint, UPGRADES } from '../../../live/simulatedHistory'
import type { EthereumHead } from '../../../live/types'
import {
  formatEth,
  formatGwei,
  formatRate,
  formatUsd,
  formatWeiFee,
} from '../format'
import {
  ACTIONS,
  BLOB_BYTES,
  costOfBlob,
  costOfGas,
  median,
  type RangeId,
  sliceRange,
} from '../model'
import { COST_ANCHOR } from './anchors'
import { HistoryChart } from './HistoryChart'
import { ChartBlock, RangeTabs, SectionShell } from './SectionShell'

/** Days either side of an upgrade the before/after medians cover */
const UPGRADE_WINDOW_DAYS = 30
const DAY = 86_400

export function CostSection({
  live,
  history,
}: {
  live: EthereumHead
  history: DailyPoint[]
}) {
  const [range, setRange] = useState<RangeId>('all')
  const head = live.head?.status === 'proposed' ? live.head : undefined
  const latest = useMemo(
    () => [...live.blocks].reverse().find((b) => b.status === 'proposed'),
    [live.blocks],
  )
  const block = head ?? latest
  const shown = useMemo(() => sliceRange(history, range), [history, range])
  const baseFeePoints = useMemo(
    () => shown.map((d) => ({ t: d.timestamp, v: d.medianBaseFeeGwei })),
    [shown],
  )
  const todayBaseFee = useMemo(() => {
    const today = live.today
    if (!today) return undefined
    const fees = live.blocks
      .filter((b) => b.status === 'proposed' && b.timestamp >= today.startedAt)
      .map((b) => b.baseFeeGwei)
    if (fees.length === 0) return undefined
    return {
      t: today.startedAt,
      v: median(fees),
      until: today.startedAt + today.slots * 12,
    }
  }, [live.blocks, live.today])
  const upgrades = useMemo(() => getUpgradeEffects(history), [history])
  const blobFee = formatWeiFee(block?.blobBaseFeeWei ?? 0)

  return (
    <SectionShell
      id={COST_ANCHOR}
      order={2}
      title="What they pay"
      lede="Execution and blob space are two markets with two fees. Each moves every block with demand: up when the block before was over target, down when under. Costs here are at the head block's fees."
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-bold text-heading-16">Execution</h3>
            <span className="text-label-value-12 text-secondary">
              base fee{' '}
              <span className="font-medium text-primary tabular-nums">
                {block ? `${formatGwei(block.baseFeeGwei)} gwei` : '—'}
              </span>{' '}
              + tip, per block
            </span>
          </div>
          <ul className="mt-3 divide-y divide-divider border-divider border-y">
            {ACTIONS.map((action) => {
              const cost = block && costOfGas(action.gas, block)
              return (
                <CostRow
                  key={action.id}
                  name={action.name}
                  note={action.note}
                  eth={cost?.eth}
                  usd={cost?.usd}
                />
              )
            })}
          </ul>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-bold text-heading-16">Blob space</h3>
            <span className="text-label-value-12 text-secondary">
              blob base fee{' '}
              <span className="font-medium text-primary tabular-nums">
                {block ? `${blobFee.value} ${blobFee.unit}` : '—'}
              </span>
              , per block
            </span>
          </div>
          <ul className="mt-3 divide-y divide-divider border-divider border-y">
            <CostRow
              name="One blob, 128 KiB"
              note={`${BLOB_BYTES.toLocaleString('en-US')} blob gas`}
              eth={block && costOfBlob(block).eth}
              usd={block && costOfBlob(block).usd}
            />
            <CostRow
              name="A full block of blobs"
              note={`${live.limits.maxBlobs} blobs`}
              eth={block && costOfBlob(block).eth * live.limits.maxBlobs}
              usd={block && costOfBlob(block).usd * live.limits.maxBlobs}
            />
          </ul>
          <p className="mt-3 text-label-value-12 text-secondary leading-snug">
            Blob space only. The transaction carrying a blob also pays execution
            gas, usually far more than the blob itself while the blob fee sits
            near its floor.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-bold text-heading-16">
          How upgrades changed the fees
        </h3>
        <RangeTabs value={range} onChange={setRange} label="History range" />
      </div>
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ChartBlock title="Median base fee, daily" summary="gwei, log scale">
          <HistoryChart
            label="Median Ethereum base fee per day, with upgrades marked"
            points={baseFeePoints}
            today={todayBaseFee}
            format={formatGwei}
            color="var(--chart-ethereum)"
            scale="log"
            markers={UPGRADES.map((u) => ({ t: u.timestamp, label: u.name }))}
            height={240}
          />
        </ChartBlock>
        <UpgradeTable upgrades={upgrades} />
      </div>
    </SectionShell>
  )
}

function CostRow({
  name,
  note,
  eth,
  usd,
}: {
  name: string
  note: string
  eth: number | undefined
  usd: number | undefined
}) {
  const unit = unitFor(eth ?? 0)
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="font-medium text-label-value-15">{name}</div>
        <div className="mt-1 text-label-value-12 text-secondary">{note}</div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-bold text-label-value-16 tabular-nums">
          {eth === undefined ? (
            '—'
          ) : (
            <>
              <RollingNumber
                value={eth / ETH_UNITS[unit]}
                format={unit === 'ETH' ? formatEth : formatRate}
              />{' '}
              <span className="font-medium text-secondary">{unit}</span>
            </>
          )}
        </div>
        <div className="mt-1 text-label-value-12 text-secondary tabular-nums">
          {usd === undefined ? '' : formatUsd(usd)}
        </div>
      </div>
    </li>
  )
}

const ETH_UNITS = { ETH: 1, gwei: 1e-9, wei: 1e-18 } as const

/** A blob at the 1 wei floor costs 1.3e-13 ETH: in wei it reads as a number */
function unitFor(eth: number): keyof typeof ETH_UNITS {
  if (eth === 0 || eth >= 1e-6) return 'ETH'
  if (eth >= 1e-12) return 'gwei'
  return 'wei'
}

interface UpgradeEffect {
  name: string
  timestamp: number
  summary: string
  before: number
  after: number
}

/** Median base fee a month either side: complete days only, so today never skews it */
function getUpgradeEffects(history: DailyPoint[]): UpgradeEffect[] {
  return UPGRADES.map((upgrade) => {
    const window = UPGRADE_WINDOW_DAYS * DAY
    const before = history.filter(
      (d) =>
        d.timestamp < upgrade.timestamp &&
        d.timestamp >= upgrade.timestamp - window,
    )
    const after = history.filter(
      (d) =>
        d.timestamp >= upgrade.timestamp &&
        d.timestamp < upgrade.timestamp + window,
    )
    return {
      ...upgrade,
      before: median(before.map((d) => d.medianBaseFeeGwei)),
      after: median(after.map((d) => d.medianBaseFeeGwei)),
    }
  }).filter((u) => u.before > 0 && u.after > 0)
}

function UpgradeTable({ upgrades }: { upgrades: UpgradeEffect[] }) {
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h4 className="font-bold text-heading-16">Before and after</h4>
        <span className="text-label-value-12 text-secondary">
          median base fee, {UPGRADE_WINDOW_DAYS} days each side
        </span>
      </div>
      <ol className="divide-y divide-divider border-divider border-y">
        {upgrades.map((u) => {
          const change = u.after / u.before - 1
          return (
            <li key={u.name} className="py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold text-label-value-15">{u.name}</span>
                <span className="text-label-value-12 text-secondary">
                  {formatTimestamp(u.timestamp)}
                </span>
              </div>
              <div className="mt-1.5 text-label-value-12 text-secondary leading-snug">
                {u.summary}
              </div>
              <div className="mt-2 flex items-baseline gap-2 text-label-value-14 tabular-nums">
                <span>{formatGwei(u.before)}</span>
                <span className="text-secondary">to</span>
                <span className="font-medium">{formatGwei(u.after)} gwei</span>
                <span className="ml-auto font-medium text-secondary">
                  {change > 0 ? '+' : ''}
                  {(change * 100).toFixed(0)}%
                </span>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-label-value-12 text-secondary leading-snug">
        Fees also follow demand, so a change around an upgrade is not all the
        upgrade's doing.
      </p>
    </div>
  )
}
