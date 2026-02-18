import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { ChartLegend, ChartLegendContent } from './Chart'

interface ChartLegendToggleAllProps {
  showAllSelected: boolean
  onToggleAll: () => void
}

export function ChartLegendToggleAll({
  showAllSelected,
  onToggleAll,
}: ChartLegendToggleAllProps) {
  return (
    <ChartLegend
      content={
        <ChartLegendContent>
          <div className="flex shrink-0 items-center">
            <button
              className="w-11 cursor-pointer select-none text-nowrap font-medium text-2xs text-secondary leading-none tracking-[-0.2px] transition-opacity hover:opacity-50 [&>svg]:text-secondary"
              onClick={onToggleAll}
            >
              {showAllSelected ? 'Hide' : 'Show'} all
            </button>
            <VerticalSeparator className="mx-2 h-3" />
          </div>
        </ChartLegendContent>
      }
    />
  )
}
