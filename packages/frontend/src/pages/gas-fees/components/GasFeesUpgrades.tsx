import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'

interface Props {
  upgrades: GasFeesUpgrade[]
  /** The chart's range: upgrades outside it are dimmed */
  range: ChartRange
  highlightedUpgradeId: string | undefined
  setHighlightedUpgradeId: (id: string | undefined) => void
  /** Clicked in the list: marked on the chart until clicked again */
  selectedUpgradeId: string | undefined
  setSelectedUpgradeId: (id: string | undefined) => void
  showWholeHistory: () => void
}

export function GasFeesUpgrades({
  upgrades,
  range,
  highlightedUpgradeId,
  setHighlightedUpgradeId,
  selectedUpgradeId,
  setSelectedUpgradeId,
  showWholeHistory,
}: Props) {
  const [from, to] = range
  const isInRange = (u: GasFeesUpgrade) =>
    u.timestamp !== null &&
    (from === null || u.timestamp >= from) &&
    u.timestamp < to

  return (
    <div className="flex h-full flex-col">
      <h3 className="border-divider border-b pb-3 font-bold text-lg">
        Ethereum upgrades
      </h3>
      {/* Wider than the column by each item's padding, so the dots and dates
          line up with the column's edges and the figures above */}
      <ol className="-mx-2 min-h-0 flex-1 overflow-y-auto py-2">
        {upgrades.map((upgrade) => {
          const inRange = isInRange(upgrade)
          const isSelected = selectedUpgradeId === upgrade.id
          return (
            <li key={upgrade.id}>
              <button
                type="button"
                className={cn(
                  'relative w-full rounded-lg py-2 pr-2 pl-6 text-left transition-colors',
                  'hover:bg-surface-secondary',
                  highlightedUpgradeId === upgrade.id && 'bg-surface-secondary',
                  isSelected &&
                    'bg-brand/10 ring-1 ring-brand/40 ring-inset hover:bg-brand/15',
                  upgrade.timestamp === null && 'cursor-default',
                  upgrade.kind === 'next' &&
                    'mb-2 border border-divider border-dashed',
                  upgrade.kind !== 'next' && !inRange && 'opacity-50',
                )}
                onMouseEnter={() => setHighlightedUpgradeId(upgrade.id)}
                onMouseLeave={() => setHighlightedUpgradeId(undefined)}
                onFocus={() => setHighlightedUpgradeId(upgrade.id)}
                onBlur={() => setHighlightedUpgradeId(undefined)}
                aria-pressed={
                  upgrade.timestamp === null ? undefined : isSelected
                }
                onClick={() => {
                  // Not out yet: nothing to mark on the chart
                  if (upgrade.timestamp === null) return
                  if (isSelected) {
                    setSelectedUpgradeId(undefined)
                    return
                  }
                  setSelectedUpgradeId(upgrade.id)
                  if (!inRange) showWholeHistory()
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
                    <span className="rounded border border-brand px-1 font-bold text-3xs text-primary uppercase">
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
