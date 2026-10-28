import { VerticalSeparator } from '~/components/core/VerticalSeparator'

/** "Show all" / "Hide all" before the legend items; pass as `legendLeading`. */
export function ChartLegendToggleAll({
  showAllSelected,
  onToggleAll,
}: {
  showAllSelected: boolean
  onToggleAll: () => void
}) {
  return (
    <div className="flex shrink-0 items-center">
      <button
        type="button"
        className="w-11 cursor-pointer select-none text-nowrap font-medium text-2xs text-secondary leading-none tracking-[-0.2px] transition-opacity hover:opacity-50"
        onClick={onToggleAll}
      >
        {showAllSelected ? 'Hide' : 'Show'} all
      </button>
      <VerticalSeparator className="mx-2 h-3" />
    </div>
  )
}
