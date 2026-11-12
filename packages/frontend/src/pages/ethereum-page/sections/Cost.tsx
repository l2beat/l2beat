import { useMemo } from 'react'
import {
  formatEth,
  formatGwei,
  formatInteger,
  formatUsd,
  formatWei,
} from '../format'
import { useEthereumHead } from '../live/EthereumHeadContext'
import {
  ACTIONS,
  actionCostEth,
  BLOB_BYTES,
  blobFeeEth,
  TRANSFER_GAS,
} from '../metrics'
import { useHistory } from '../state/history'
import { HistoryChart, type Metric } from '../ui/HistoryChart'
import { Rolling } from '../ui/Rolling'
import { Part, Section, Stat } from '../ui/Section'
import { Change, Fig, Story } from '../ui/Story'
import { changeOf, lastTwoWeeks, medianOf, type Weeks } from '../weekly'
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
      'Today so far uses the gas-weighted average base fee, not the median (medians need every block of the day), at the ETH price of the newest block.',
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

/** What it costs to use Ethereum at the head, and how upgrades moved it */
export function Cost({ order }: { order: number }) {
  const { head: block } = useEthereumHead()
  const history = useHistory()
  const weeks = useMemo(() => lastTwoWeeks(history), [history])
  const price = block?.ethPriceUsd

  return (
    <Section
      id="cost"
      order={order}
      title="Cost to use Ethereum"
      story={<CostStory weeks={weeks} />}
      lede="Fees are set per block. The base fee rises when blocks run above the gas target and falls below it; blobs have a fee market of their own. The costs below are at the newest block, in ETH first."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
        <Part title="In the newest block">
          <table className="w-full text-label-value-14">
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

        <Part title="Posting data">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-lg bg-surface-secondary/60 p-4">
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
          <Stat
            className="mt-6"
            label="ETH price"
            cadence="minute"
            value={<Rolling value={price} format={formatUsd} />}
            sub="Every USD figure on the page uses it"
          />
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

function CostStory({ weeks }: { weeks: Weeks | undefined }) {
  if (!weeks) return null
  const { current, previous } = weeks
  const transferEth = (p: { medianBaseFeeGwei: number }) =>
    (p.medianBaseFeeGwei * TRANSFER_GAS) / 1e9
  const eth = medianOf(current, transferEth)
  const usd = medianOf(current, (p) => p.transferCostUsd)
  const floorDays = current.filter((p) => p.medianBlobFeeWei <= 1).length
  return (
    <Story weeks={weeks}>
      On the median day, sending ETH cost <Fig>{formatEth(eth)}</Fig> (
      {formatUsd(usd)}) in base fee,{' '}
      <Change
        change={changeOf(eth, medianOf(previous, transferEth))}
        more="dearer"
        less="cheaper"
      />
      .{' '}
      {floorDays === current.length ? (
        <>
          Blob space sat at its <Fig>1 wei</Fig> floor all week, so rollups paid
          for little beyond the gas of the transaction carrying their blobs.
        </>
      ) : (
        <>
          Blob space sat at its 1 wei floor on{' '}
          <Fig>
            {floorDays} of {current.length} days
          </Fig>
          ; its busiest day's median was{' '}
          <Fig>
            {formatWei(Math.max(...current.map((p) => p.medianBlobFeeWei)))}
          </Fig>{' '}
          per unit of blob gas.
        </>
      )}
    </Story>
  )
}
