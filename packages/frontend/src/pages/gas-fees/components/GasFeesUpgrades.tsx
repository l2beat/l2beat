import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import type { GasFeesUsdMetric } from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { formatFee, GAS_FEES_METRIC_LABELS } from './metrics'

interface Props {
  upgrades: GasFeesUpgrade[]
  /** undefined when the page shows gas prices, which Dencun didn't move */
  metric: GasFeesUsdMetric | undefined
  /** The chart's range: upgrades outside it are dimmed */
  range: ChartRange
  highlightedUpgradeId: string | undefined
  setHighlightedUpgradeId: (id: string | undefined) => void
  showWholeHistory: () => void
}

export function GasFeesUpgrades({
  upgrades,
  metric,
  range,
  highlightedUpgradeId,
  setHighlightedUpgradeId,
  showWholeHistory,
}: Props) {
  const [from, to] = range
  const isInRange = (u: GasFeesUpgrade) =>
    u.timestamp !== null &&
    (from === null || u.timestamp >= from) &&
    u.timestamp < to

  return (
    <div className="flex h-full flex-col">
      <h2 className="font-bold text-xl">Ethereum upgrades</h2>
      <ol className="-mx-2 mt-2 min-h-0 flex-1 overflow-y-auto border-divider border-t px-2 py-2">
        {upgrades.map((upgrade) => {
          const inRange = isInRange(upgrade)
          return (
            <li key={upgrade.id}>
              <button
                type="button"
                className={cn(
                  'relative w-full rounded-lg py-2 pr-2 pl-6 text-left transition-colors',
                  'hover:bg-surface-secondary',
                  highlightedUpgradeId === upgrade.id && 'bg-surface-secondary',
                  upgrade.kind === 'next' &&
                    'mb-2 border border-divider border-dashed',
                  upgrade.kind !== 'next' && !inRange && 'opacity-50',
                )}
                onMouseEnter={() => setHighlightedUpgradeId(upgrade.id)}
                onMouseLeave={() => setHighlightedUpgradeId(undefined)}
                onFocus={() => setHighlightedUpgradeId(upgrade.id)}
                onBlur={() => setHighlightedUpgradeId(undefined)}
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
                {upgrade.l2Median && metric && (
                  <Change
                    label={`L2 median ${GAS_FEES_METRIC_LABELS[metric].short.toLowerCase()}, 30 days before → after`}
                    {...upgrade.l2Median[metric]}
                  />
                )}
              </button>
            </li>
          )
        })}
      </ol>
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
  label: string
  before: number
  after: number
}) {
  const change = after / before - 1
  return (
    <div className="mt-1 flex flex-col gap-0.5 text-xs tabular-nums">
      <span className="text-2xs text-secondary">{label}</span>
      <span className="flex items-baseline justify-between gap-2">
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
