import {
  formatEth,
  formatGwei,
  formatInteger,
  formatUsd,
  formatWei,
} from '../format'
import { ACTIONS, actionCostEth, BLOB_BYTES, blobFeeEth } from '../metrics'
import { useAnchor } from '../state/anchor'
import { HistoryChart, type Metric } from '../ui/HistoryChart'
import { Rolling } from '../ui/Rolling'
import { Part, Section, Stat } from '../ui/Section'
import { UpgradeTimeline } from './UpgradeTimeline'

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
      </Part>

      <Part title="The upgrades, fork by fork" className="mt-12">
        <UpgradeTimeline />
      </Part>
    </Section>
  )
}
