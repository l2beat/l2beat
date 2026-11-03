import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import type { GasFeesMetric } from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { formatFee, GAS_FEES_METRIC_LABELS } from './metrics'

interface Props {
  upgrades: GasFeesUpgrade[]
  metric: GasFeesMetric
  /** The chart's range: upgrades outside it are dimmed */
  range: ChartRange
  markedUpgradeId: string | undefined
  setMarkedUpgradeId: (id: string | undefined) => void
  showWholeHistory: () => void
}

export function GasFeesUpgrades({
  upgrades,
  metric,
  range,
  markedUpgradeId,
  setMarkedUpgradeId,
  showWholeHistory,
}: Props) {
  const [from, to] = range
  const isInRange = (u: GasFeesUpgrade) =>
    u.timestamp !== null &&
    (from === null || u.timestamp >= from) &&
    u.timestamp < to

  return (
    // Out of flow on desktop, so the timeline takes the left column's height
    // instead of setting it
    <div className="flex h-full flex-col lg:absolute lg:inset-0 lg:px-6 lg:py-5">
      <h2 className="font-bold text-xl">What changed</h2>
      <p className="text-secondary text-xs">
        Ethereum upgrades and gas limit raises, newest first
      </p>
      <div className="mt-2 flex justify-between border-divider border-b pb-2 font-medium text-2xs text-secondary">
        <span>{GAS_FEES_METRIC_LABELS[metric].short} on Ethereum</span>
        <span>30 days before → after</span>
      </div>
      <ol className="-mx-2 min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {upgrades.map((upgrade) => {
          const inRange = isInRange(upgrade)
          return (
            <li key={upgrade.id}>
              <button
                type="button"
                className={cn(
                  'relative w-full rounded-lg py-2 pr-2 pl-6 text-left transition-colors',
                  'hover:bg-surface-secondary',
                  markedUpgradeId === upgrade.id && 'bg-surface-secondary',
                  upgrade.kind === 'next' &&
                    'mb-2 border border-divider border-dashed',
                  upgrade.kind !== 'next' && !inRange && 'opacity-50',
                )}
                onMouseEnter={() => setMarkedUpgradeId(upgrade.id)}
                onMouseLeave={() => setMarkedUpgradeId(undefined)}
                onFocus={() => setMarkedUpgradeId(upgrade.id)}
                onBlur={() => setMarkedUpgradeId(undefined)}
                onClick={() => {
                  if (upgrade.timestamp !== null && !inRange) showWholeHistory()
                }}
              >
                <TimelineDot kind={upgrade.kind} />
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      'font-bold',
                      upgrade.kind === 'gasLimit' ? 'text-sm' : 'text-base',
                    )}
                  >
                    {upgrade.title}
                  </span>
                  {upgrade.timestamp === null ? (
                    <span className="rounded border border-brand px-1 font-bold text-3xs text-brand uppercase">
                      Next
                    </span>
                  ) : (
                    <span className="whitespace-nowrap text-2xs text-secondary">
                      {formatTimestamp(upgrade.timestamp)}
                    </span>
                  )}
                </div>
                {upgrade.kind !== 'gasLimit' && (
                  <p className="text-secondary text-xs">{upgrade.summary}</p>
                )}
                {upgrade.timestamp === null && (
                  <p className="mt-1 text-2xs text-secondary">
                    No date set yet
                  </p>
                )}
                {upgrade.ethereum && (
                  <Change
                    label={upgrade.l2Median ? 'Ethereum' : undefined}
                    {...upgrade.ethereum[metric]}
                  />
                )}
                {upgrade.l2Median && (
                  <Change label="L2 median" {...upgrade.l2Median[metric]} />
                )}
              </button>
            </li>
          )
        })}
      </ol>
      <p className="border-divider border-t pt-2 text-2xs text-secondary">
        Fees in USD also move with demand and the ETH price, so not every change
        is the upgrade's doing. Hover an item to see its window on the chart.
      </p>
    </div>
  )
}

function TimelineDot({ kind }: { kind: GasFeesUpgrade['kind'] }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute top-[13px] left-2 size-2 rounded-full',
        kind === 'upgrade' && 'bg-brand',
        kind === 'gasLimit' && 'border border-secondary bg-surface-primary',
        kind === 'next' && 'border border-brand border-dashed',
      )}
    />
  )
}

function Change({
  label,
  before,
  after,
}: {
  label?: string
  before: number
  after: number
}) {
  const change = after / before - 1
  return (
    <div className="mt-1 flex items-baseline justify-between gap-2 text-xs tabular-nums">
      <span className="text-secondary">{label}</span>
      <span className="flex items-baseline gap-2">
        <span className="text-secondary">
          {formatFee(before)} →{' '}
          <span className="text-primary">{formatFee(after)}</span>
        </span>
        <span
          className={cn(
            'w-14 text-right font-medium',
            change < 0 ? 'text-positive' : 'text-negative',
          )}
        >
          {change < 0 ? '▼' : '▲'} {Math.abs(Math.round(change * 100))}%
        </span>
      </span>
    </div>
  )
}
