import { useMemo, useState } from 'react'
import { formatTimestamp } from '~/utils/dates'
import { useEthereumHead } from '../../../live/EthereumHeadContext'
import type { DailyPoint } from '../../../live/simulatedHistory'
import type { HeadBlock } from '../../../live/types'
import { BLOB_BYTES, median, upgradeImpacts } from '../derive'
import {
  blobFeeUnit,
  fmtBlobFee,
  fmtEth,
  fmtGwei,
  fmtNumber,
  fmtSignedPercent,
  fmtUsd,
} from '../format'
import { usePerMinute } from '../live'
import { HistoryChart } from '../ui/HistoryChart'
import { Instrument, Panel, SectionHead, Segmented } from '../ui/Panel'
import { Ticker } from '../ui/Ticker'
import {
  RANGES,
  type Range,
  sliceRange,
  UPGRADE_MARKERS,
  withToday,
} from './history'

/**
 * What a user pays, per action, at this block. Gas amounts for tokens and
 * swaps vary by contract, so they are labelled as typical, not exact
 */
const ACTIONS = [
  { label: 'ETH transfer', gas: 21_000, note: 'exact' },
  { label: 'ERC-20 transfer', gas: 65_000, note: 'typical' },
  { label: 'Token swap', gas: 150_000, note: 'typical' },
] as const

/** EIP-7623: calldata-heavy transactions pay at least 40 gas per non-zero byte since Pectra */
const CALLDATA_FLOOR_GAS_PER_BYTE = 40

type FeeMetric = 'base' | 'blob' | 'transfer'

export function Cost({ history }: { history: DailyPoint[] }) {
  return (
    <section id="cost" className="scroll-mt-20">
      <SectionHead
        title="Cost to use Ethereum"
        lede="What a transfer, a swap or a blob of rollup data costs at this block, and how each upgrade moved those prices."
      />
      <Instrument className="md:grid-cols-12">
        <RightNow className="md:col-span-5" />
        <FeesAcrossUpgrades history={history} className="md:col-span-7" />
        <UpgradeTable history={history} className="md:col-span-12" />
      </Instrument>
    </section>
  )
}

function RightNow({ className }: { className?: string }) {
  const head = useEthereumHead()
  const [unit, setUnit] = useState<'eth' | 'gwei'>('eth')
  const formatAmount = (eth: number) =>
    unit === 'eth' ? fmtEth(eth) : fmtGweiAmount(eth * 1e9)
  const block = lastProposed(head.blocks)
  const price = usePerMinute(head.head?.ethPriceUsd)
  const gasPrice = block ? block.baseFeeGwei + block.priorityFeeGwei : undefined
  const blobEth = block ? (block.blobBaseFeeWei * BLOB_BYTES) / 1e18 : undefined
  const calldataGas = BLOB_BYTES * CALLDATA_FLOOR_GAS_PER_BYTE
  const rows: {
    label: string
    detail: string
    eth: number | undefined
  }[] = [
    ...ACTIONS.map((a) => ({
      label: a.label,
      detail: `${fmtNumber(a.gas)} gas · ${a.note}`,
      eth: gasPrice === undefined ? undefined : (a.gas * gasPrice) / 1e9,
    })),
    {
      label: '1 blob, 128 KiB',
      detail: `${fmtNumber(BLOB_BYTES)} blob gas · data only`,
      eth: blobEth,
    },
    {
      label: '128 KiB as calldata',
      detail: `${fmtNumber(calldataGas / 1e6, 2)}M gas · calldata floor`,
      eth: gasPrice === undefined ? undefined : (calldataGas * gasPrice) / 1e9,
    },
  ]
  return (
    <Panel
      title="Right now"
      cadence="blk"
      className={className}
      accessory={
        <Segmented
          label="Unit"
          options={[
            { value: 'eth', label: 'ETH' },
            { value: 'gwei', label: 'gwei' },
          ]}
          value={unit}
          onChange={setUnit}
        />
      }
    >
      <div className="border-divider/60 border-b px-3 py-1.5 font-mono text-[10.5px] text-secondary tabular-nums">
        {block
          ? `gas ${fmtGwei(block.baseFeeGwei)} base + ${fmtGwei(block.priorityFeeGwei)} tip gwei · blob gas ${fmtBlobFee(block.blobBaseFeeWei)} ${blobFeeUnit(block.blobBaseFeeWei)}`
          : 'waiting for the first block'}
      </div>
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-divider/60 border-b text-[10.5px] text-secondary">
            <th className="px-3 py-1.5 text-left font-normal">Action</th>
            <th className="px-3 py-1.5 text-right font-normal">
              {unit === 'eth' ? 'ETH' : 'gwei'}
            </th>
            <th className="px-3 py-1.5 text-right font-normal">USD</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-divider/35 border-b last:border-b-0"
            >
              <td className="px-3 py-2">
                <div className="text-primary">{row.label}</div>
                <div className="font-mono text-[10px] text-secondary">
                  {row.detail}
                </div>
              </td>
              <td className="px-3 py-2 text-right text-primary">
                <Ticker value={row.eth} format={formatAmount} />
              </td>
              <td className="px-3 py-2 text-right text-secondary">
                <Ticker
                  value={
                    row.eth === undefined || price === undefined
                      ? undefined
                      : row.eth * price
                  }
                  format={fmtUsd}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-divider/60 border-t px-3 py-2 text-[11px] text-secondary leading-snug">
        Execution actions pay the base fee plus the block's median tip. A blob
        pays blob gas only; the transaction that carries it pays execution gas
        on top.
      </p>
    </Panel>
  )
}

function FeesAcrossUpgrades({
  history,
  className,
}: {
  history: DailyPoint[]
  className?: string
}) {
  const head = useEthereumHead()
  const [metric, setMetric] = useState<FeeMetric>('base')
  const [range, setRange] = useState<Range>('all')
  const [log, setLog] = useState<'log' | 'lin'>('log')
  const points = sliceRange(history, range)
  const proposed = head.blocks.filter((b) => b.status === 'proposed')
  const todayAt = proposed.length > 0 ? head.today?.startedAt : undefined
  const timestamps = withToday(points, todayAt)
  const partial = todayAt !== undefined
  const price = head.head?.ethPriceUsd ?? 0

  const config = {
    base: {
      label: 'Median base fee',
      unit: 'gwei',
      pick: (p: DailyPoint): number | undefined => p.medianBaseFeeGwei,
      today: () => median(proposed.map((b) => b.baseFeeGwei)),
      format: (v: number) => fmtNumber(v, v < 1 ? 2 : v < 10 ? 1 : 0),
      color: 'var(--chart-ethereum)',
    },
    blob: {
      label: 'Median blob base fee',
      unit: 'wei',
      // no blobs before Dencun, so no blob fee either
      pick: (p: DailyPoint) =>
        p.avgBlobsPerBlock === 0 ? undefined : p.medianBlobFeeWei,
      today: () => median(proposed.map((b) => b.blobBaseFeeWei)),
      format: (v: number) => (v >= 1000 ? fmtCompactWei(v) : fmtNumber(v)),
      color: 'var(--chart-fuchsia)',
    },
    transfer: {
      label: 'ETH transfer',
      unit: 'USD',
      pick: (p: DailyPoint): number | undefined => p.transferCostUsd,
      today: () =>
        (median(proposed.map((b) => b.baseFeeGwei)) * 21_000 * price) / 1e9,
      format: (v: number) => fmtUsd(v),
      color: 'var(--chart-ethereum)',
    },
  }[metric]

  const values = [
    ...points.map(config.pick),
    ...(partial ? [config.today()] : []),
  ]

  return (
    <Panel
      title="Fees across upgrades"
      cadence="day"
      className={className}
      accessory={
        <>
          <Segmented
            label="Fee"
            options={[
              { value: 'base', label: 'Base' },
              { value: 'blob', label: 'Blob' },
              { value: 'transfer', label: 'Transfer $' },
            ]}
            value={metric}
            onChange={setMetric}
          />
          <Segmented
            label="Scale"
            options={[
              { value: 'log', label: 'log' },
              { value: 'lin', label: 'lin' },
            ]}
            value={log}
            onChange={setLog}
            className="max-sm:hidden"
          />
          <Segmented
            label="Range"
            options={RANGES}
            value={range}
            onChange={setRange}
          />
        </>
      }
    >
      <div className="px-3 pt-2 pb-2">
        <div className="mb-2 flex items-baseline gap-2 text-[11px] text-secondary">
          <span>
            {config.label}, {config.unit}, daily
          </span>
          {partial && (
            <span className="ml-auto">
              today so far: median of the last 64 blocks
            </span>
          )}
        </div>
        <HistoryChart
          label={`${config.label} per day, ${config.unit}`}
          timestamps={timestamps}
          partial={partial}
          format={config.format}
          height={250}
          log={log === 'log'}
          markers={UPGRADE_MARKERS}
          series={[
            {
              key: metric,
              label: config.label,
              color: config.color,
              mark: 'line',
              values,
            },
          ]}
        />
      </div>
    </Panel>
  )
}

function UpgradeTable({
  history,
  className,
}: {
  history: DailyPoint[]
  className?: string
}) {
  const impacts = useMemo(() => upgradeImpacts(history), [history])
  return (
    <Panel
      title="Upgrade by upgrade"
      cadence="day"
      className={className}
      accessory={
        <span className="text-[10.5px] text-secondary max-sm:hidden">
          Medians of the days either side, up to 30, stopping at the next
          upgrade
        </span>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-[12px]">
          <thead>
            <tr className="border-divider/60 border-b text-[10.5px] text-secondary">
              <th className="px-3 py-1.5 text-left font-normal">Upgrade</th>
              <th className="px-3 py-1.5 text-left font-normal">
                What changed
              </th>
              <th className="px-3 py-1.5 text-right font-normal">
                Base fee, gwei
              </th>
              <th className="px-3 py-1.5 text-right font-normal">
                Blob fee, wei
              </th>
              <th className="px-3 py-1.5 text-right font-normal">
                Blobs/block
              </th>
              <th className="px-3 py-1.5 text-right font-normal">
                ETH transfer
              </th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {impacts.map((u) => (
              <tr
                key={u.name}
                className="border-divider/35 border-b last:border-b-0"
              >
                <td className="whitespace-nowrap px-3 py-2 font-sans">
                  <div className="font-semibold text-primary">{u.name}</div>
                  <div className="text-[10.5px] text-secondary">
                    {formatTimestamp(u.timestamp)} · ±{u.days}d
                  </div>
                </td>
                <td className="px-3 py-2 font-sans text-secondary">
                  {u.summary}
                </td>
                <BeforeAfter
                  before={u.before.baseFeeGwei}
                  after={u.after.baseFeeGwei}
                  format={(v) => fmtNumber(v, v < 1 ? 2 : 1)}
                />
                <BeforeAfter
                  before={
                    u.before.blobsPerBlock === 0
                      ? undefined
                      : u.before.blobFeeWei
                  }
                  after={u.after.blobFeeWei}
                  format={(v) => (v >= 1000 ? fmtCompactWei(v) : fmtNumber(v))}
                />
                <BeforeAfter
                  before={u.before.blobsPerBlock}
                  after={u.after.blobsPerBlock}
                  format={(v) => fmtNumber(v, 1)}
                />
                <BeforeAfter
                  before={u.before.transferCostUsd}
                  after={u.after.transferCostUsd}
                  format={fmtUsd}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function BeforeAfter({
  before,
  after,
  format,
}: {
  before: number | undefined
  after: number
  format: (v: number) => string
}) {
  const change = !before ? undefined : after / before - 1
  return (
    <td className="whitespace-nowrap px-3 py-2 text-right">
      <span className="text-secondary">
        {before === undefined ? '—' : format(before)}
      </span>
      <span className="px-1 text-secondary/60">›</span>
      <span className="text-primary">{format(after)}</span>
      <div className="text-[10px] text-secondary">
        {change === undefined ? 'new' : fmtSignedPercent(change)}
      </div>
    </td>
  )
}

function lastProposed(blocks: HeadBlock[]) {
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i]
    if (b?.status === 'proposed') return b
  }
  return undefined
}

function fmtGweiAmount(gwei: number) {
  if (gwei >= 1000) return fmtNumber(gwei)
  if (gwei >= 1) return fmtNumber(gwei, 2)
  return fmtNumber(gwei, 6)
}

function fmtCompactWei(wei: number) {
  if (wei >= 1e9) return `${fmtNumber(wei / 1e9, 2)}G`
  if (wei >= 1e6) return `${fmtNumber(wei / 1e6, 2)}M`
  return `${fmtNumber(wei / 1e3, 1)}K`
}
