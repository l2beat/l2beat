import { Skeleton } from '~/components/core/skeleton'
import { formatRange } from '~/utils/dates'

interface Props {
  range: [number, number] | undefined
}

export function EcosystemChartTimeRange({ range }: Props) {
  if (!range) {
    return <Skeleton className="my-[3px] h-[14px] w-44" />
  }

  return (
    <p className="text-xs font-medium text-secondary">
      {formatRange(...range)}
    </p>
  )
}
