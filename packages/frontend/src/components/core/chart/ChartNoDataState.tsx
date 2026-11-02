import { EmptyStateIcon } from '~/icons/EmptyState'
import { cn } from '~/utils/cn'
import { ChartStateMessage, chartStateIconClassName } from './ChartStateMessage'

export function ChartNoDataState({ size }: { size: 'regular' | 'small' }) {
  return (
    <ChartStateMessage
      size={size}
      icon={
        <EmptyStateIcon
          className={cn('max-md:h-7 max-md:w-[25px]', chartStateIconClassName)}
        />
      }
      title="No data"
      description="There's no data for the project and the selected criteria. Please try again later."
    />
  )
}
