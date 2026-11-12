import { useMemo } from 'react'
import { formatTimestamp } from '~/utils/dates'
import { type DailyPoint, UPGRADES } from '../../../live/simulatedHistory'
import {
  formatBlobsPerBlock,
  formatEth,
  formatGwei,
  formatInteger,
  formatUsd,
  formatWei,
} from '../format'
import {
  ACTIONS,
  actionCostEth,
  BLOB_BYTES,
  blobFeeEth,
  median,
} from '../metrics'
import { useAnchor } from '../state/anchor'
import { useHistory } from '../state/history'
import { HistoryChart, type Metric } from '../ui/HistoryChart'
import { Rolling } from '../ui/Rolling'
import { CadenceMark, Part, Section, Stat } from '../ui/Section'

const DAY = 86_400
/** Long enough to smooth out a busy day, short enough to stay near the upgrade */
const COMPARE_DAYS = 30

const FEE_METRICS: Metric[] = [
  {
    id: 'transfer',
    label: 'Sending ETH, USD',
    pick: (p) => p.transferCostUsd,
    today: (t, block) => {
      if (t.gasUsed <= 0) return undefined
      const avgBaseFee = (t.burnedEth * 1e9) / t.gasUsed
      return (avgBaseFee * 21_000 * block.ethPriceUsd) / 1e9
    },
    format: formatUsd,
    kind: 'bucket',
    scale: 'log',
    todayNote:
      'Today so far uses the gas-weighted average base fee, not the median (medians need every block of the day), at the ETH price of the block on show.',
  },
  {
    id: 'base-fee',
    label: 'Median base fee',
    pick: (p) => p.medianBaseFeeGwei,
    today: (t) => (t.gasUsed > 0 ? (t.burnedEth * 1e9) / t.gasUsed : undefined),
    format: formatGwei,
    kind: 'bucket',
    scale: 'log',
    todayNote:
      'Today so far is the gas-weighted average base fee, not the median: medians need every block of the day.',
  },
  {
    id: 'blob-fee',
    label: 'Median blob fee',
    pick: (p) => p.medianBlobFeeWei,
    format: formatWei,
    kind: 'bucket',
    scale: 'log',
  },
]

/** What it costs to use Ethereum, at the anchored block, and how upgrades moved it */
export function Cost({ order }: { order: number }) {
  const { block } = useAnchor()
  const price = block?.ethPriceUsd

  return (
    <Section
      id="cost"
      order={order}
      title="Cost to use Ethereum"
      lede="Fees are set per block. The base fee rises when blocks run above the gas target and falls below it; blobs have a fee market of their own. These are the costs in the block on show, at its own ETH price."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
        <Part title="Execution fees">
          <Stat
            label="Base fee plus median tip"
            cadence="block"
            value={
              <Rolling
                value={block && block.baseFeeGwei + block.priorityFeeGwei}
                format={formatGwei}
              />
            }
          />
          <table className="mt-5 w-full text-label-value-14">
            <thead>
              <tr className="border-divider border-b text-left text-label-value-12 text-secondary">
                <th className="pb-2 font-medium">Action</th>
                <th className="pb-2 text-right font-medium">Gas</th>
                <th className="pb-2 text-right font-medium">In ETH</th>
                <th className="pb-2 text-right font-medium">In USD</th>
              </tr>
            </thead>
            <tbody>
              {ACTIONS.map((a) => {
                const eth = block && actionCostEth(block, a.gas)
                return (
                  <tr
                    key={a.id}
                    className="border-divider border-b last:border-0"
                  >
                    <td className="py-3 font-medium">{a.name}</td>
                    <td className="py-3 text-right text-secondary tabular-nums">
                      {formatInteger(a.gas)}
                    </td>
                    <td className="py-3 text-right font-bold">
                      <Rolling value={eth} format={formatEth} />
                    </td>
                    <td className="py-3 text-right text-secondary">
                      <Rolling
                        value={
                          eth !== undefined && price ? eth * price : undefined
                        }
                        format={formatUsd}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="mt-3 text-label-value-12 text-secondary leading-snug">
            Gas amounts are typical, not exact: a token transfer to a new holder
            and a single-hop Uniswap swap. The tip is the block's median.
          </p>
        </Part>

        <Part title="Blob fees">
          <Stat
            label="Blob base fee"
            cadence="block"
            value={<Rolling value={block?.blobBaseFeeWei} format={formatWei} />}
            sub="Per unit of blob gas. It rises while blocks carry more blobs than the target and falls while they carry fewer."
          />
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 rounded-lg bg-surface-secondary/60 p-4">
            <Stat
              label="One blob, 128 KiB"
              cadence="block"
              value={
                <Rolling
                  value={block && blobFeeEth(block)}
                  format={formatEth}
                />
              }
              sub={
                block && price
                  ? `${formatUsd(blobFeeEth(block) * price)}, blob fee only`
                  : undefined
              }
            />
            <Stat
              label="Per MiB of data"
              cadence="block"
              value={
                <Rolling
                  value={
                    block && (blobFeeEth(block) * 1024 * 1024) / BLOB_BYTES
                  }
                  format={formatEth}
                />
              }
              sub="Plus the carrying transaction's gas"
            />
          </div>
        </Part>
      </div>

      <Part title="Fees across upgrades" className="mt-12">
        <HistoryChart
          metrics={FEE_METRICS}
          defaultRange="all"
          withUpgrades
          height={240}
        />
        <UpgradeTable />
      </Part>
    </Section>
  )
}

/**
 * Each upgrade's effect as medians of the 30 complete days either side:
 * long enough that one busy day doesn't make the case
 */
function UpgradeTable() {
  const history = useHistory()
  const rows = useMemo(
    () => UPGRADES.map((u) => compare(history, u.timestamp)),
    [history],
  )
  return (
    <div className="-mx-4 mt-8 overflow-x-auto px-4 md:mx-0 md:px-0">
      <table className="w-full min-w-[560px] text-label-value-14">
        <thead>
          <tr className="border-divider border-b text-left text-label-value-12 text-secondary">
            <th className="pb-2 font-medium">Upgrade</th>
            <th className="pb-2 font-medium">What changed</th>
            <th className="pb-2 text-right font-medium">
              <span className="inline-flex items-center gap-2">
                Sending ETH <CadenceMark cadence="day" />
              </span>
            </th>
            <th className="pb-2 text-right font-medium">Blobs per block</th>
          </tr>
        </thead>
        <tbody>
          {UPGRADES.map((u, i) => {
            const row = rows[i]
            return (
              <tr
                key={u.name}
                className="border-divider border-b align-top last:border-0"
              >
                <td className="py-3 pr-4">
                  <div className="font-bold">{u.name}</div>
                  <div className="text-label-value-12 text-secondary">
                    {formatTimestamp(u.timestamp)}
                  </div>
                </td>
                <td className="py-3 pr-4 text-paragraph-14 text-secondary">
                  {u.summary}
                </td>
                <td className="py-3 text-right tabular-nums">
                  <BeforeAfter row={row?.transfer} format={formatUsd} />
                </td>
                <td className="py-3 text-right tabular-nums">
                  <BeforeAfter row={row?.blobs} format={formatBlobsPerBlock} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="mt-3 text-label-value-12 text-secondary">
        Medians of the {COMPARE_DAYS} complete days before and after each
        upgrade.
      </p>
    </div>
  )
}

function BeforeAfter({
  row,
  format,
}: {
  row: { before: number | undefined; after: number | undefined } | undefined
  format: (v: number) => string
}) {
  if (!row || row.before === undefined || row.after === undefined) {
    return <span className="text-secondary">Not enough days yet</span>
  }
  return (
    <span className="whitespace-nowrap">
      <span className="text-secondary">{format(row.before)}</span>
      <span className="px-1.5 text-secondary">to</span>
      <span className="font-bold">{format(row.after)}</span>
    </span>
  )
}

function compare(history: DailyPoint[], at: number) {
  const before = history.filter(
    (p) => p.timestamp < at && p.timestamp >= at - COMPARE_DAYS * DAY,
  )
  const after = history.filter(
    (p) => p.timestamp >= at && p.timestamp < at + COMPARE_DAYS * DAY,
  )
  const enough = (days: DailyPoint[]) => days.length >= COMPARE_DAYS * 0.8
  return {
    transfer: {
      before: enough(before)
        ? median(before.map((p) => p.transferCostUsd))
        : undefined,
      after: enough(after)
        ? median(after.map((p) => p.transferCostUsd))
        : undefined,
    },
    blobs: {
      before: enough(before)
        ? median(before.map((p) => p.avgBlobsPerBlock))
        : undefined,
      after: enough(after)
        ? median(after.map((p) => p.avgBlobsPerBlock))
        : undefined,
    },
  }
}
