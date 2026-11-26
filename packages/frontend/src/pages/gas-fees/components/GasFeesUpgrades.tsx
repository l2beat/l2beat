import { useMemo } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import { ChevronIcon } from '~/icons/Chevron'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import type { ChartRange } from '~/utils/range/range'
import type { UpgradeSelection } from './useUpgradeSelection'

interface Props {
  upgrades: GasFeesUpgrade[]
  /** The chart's range: stepping to an upgrade outside it shows the whole history */
  range: ChartRange
  selection: UpgradeSelection
  showWholeHistory: () => void
}

/**
 * Under the plot: the upgrade hovered or picked on it, described, with
 * arrows to step through them all. The next upgrade when none is picked.
 */
export function GasFeesUpgrades({
  upgrades,
  range,
  selection,
  showWholeHistory,
}: Props) {
  // Oldest first, so the arrows read left to right like the chart
  const dated = useMemo(
    () =>
      upgrades
        .filter((u) => u.timestamp !== null)
        .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0)),
    [upgrades],
  )
  const [from, to] = range
  const isInRange = (u: GasFeesUpgrade) =>
    u.timestamp !== null &&
    (from === null || u.timestamp >= from) &&
    u.timestamp < to
  const shown =
    upgrades.find((u) => u.id === selection.highlightedId) ??
    upgrades.find((u) => u.id === selection.selectedId) ??
    upgrades.find((u) => u.timestamp === null)
  const selectedIndex = dated.findIndex((u) => selection.isSelected(u.id))
  const outOfRange = dated.filter((u) => !isInRange(u)).length

  const step = (by: number) => {
    // With none picked, the first step back lands on the latest
    const start = selectedIndex === -1 ? dated.length : selectedIndex
    const target = dated[Math.min(dated.length - 1, Math.max(0, start + by))]
    if (!target) return
    selection.select(target.id)
    if (!isInRange(target)) showWholeHistory()
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-surface-secondary px-3 py-2.5 md:flex-nowrap">
      <div className="flex shrink-0 items-center gap-1">
        <StepButton
          label="Earlier upgrade"
          direction="left"
          disabled={selectedIndex === 0 || dated.length === 0}
          onClick={() => step(-1)}
        />
        <StepButton
          label="Later upgrade"
          direction="right"
          disabled={selectedIndex === -1 || selectedIndex === dated.length - 1}
          onClick={() => step(1)}
        />
      </div>
      <div className="min-w-0 flex-1 basis-60">
        {shown && (
          <p className="text-xs leading-snug">
            <span
              className={cn(
                'mr-1.5 inline-block size-2 rounded-full align-[1px]',
                shown.kind === 'upgrade' && 'bg-brand',
                shown.kind === 'gasLimit' && 'border border-secondary',
                shown.kind === 'next' && 'border border-brand border-dashed',
              )}
            />
            <CustomLink href={shown.url} className="font-bold text-sm">
              {shown.title}
            </CustomLink>
            <span className="mx-1.5">
              {shown.timestamp === null
                ? 'next, no date set yet'
                : formatTimestamp(shown.timestamp)}
            </span>
            <span className="text-secondary">{shown.summary}</span>
          </p>
        )}
      </div>
      {outOfRange > 0 && (
        <button
          type="button"
          onClick={showWholeHistory}
          className="shrink-0 whitespace-nowrap font-medium text-2xs text-link underline decoration-dotted underline-offset-2 hover:text-blue-550"
        >
          {outOfRange} earlier {outOfRange === 1 ? 'upgrade' : 'upgrades'}
          {DOT_SEPARATOR}show all
        </button>
      )}
    </div>
  )
}

function StepButton({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string
  direction: 'left' | 'right'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-md bg-surface-primary hover:bg-surface-tertiary disabled:opacity-40"
    >
      <ChevronIcon
        className={cn(
          'size-3 fill-current',
          direction === 'left' ? 'rotate-90' : '-rotate-90',
        )}
      />
    </button>
  )
}
