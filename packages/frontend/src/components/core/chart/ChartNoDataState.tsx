import { EmptyStateIcon } from '~/icons/EmptyState'
import { ChartStateMessage, chartStateIconClassName } from './ChartStateMessage'

export function ChartNoDataState({ size }: { size: 'regular' | 'small' }) {
  return (
    <ChartStateMessage
      size={size}
      icon={<EmptyStateIcon className={chartStateIconClassName} />}
      title="No data"
      description="There's no data for the project and the selected criteria. Please try again later."
    />
  )
}
