import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import type { LivenessTimeRange } from '~/server/features/scaling/liveness/types'
import { useLivenessTimeRangeContext } from '../LivenessTimeRangeContext'

interface Props {
  average?: boolean
}

export function IntervalsHeader({ average }: Props) {
  const isClient = useIsClient()
  const { timeRange } = useLivenessTimeRangeContext()

  if (!isClient) {
    return <Skeleton className="mb-[5px] h-[19px] w-[225px]" />
  }

  return (
    <span>
      {rangeToLabel(timeRange)}
      {average ? ' average' : ''} intervals
    </span>
  )
}

function rangeToLabel(range: LivenessTimeRange) {
  switch (range) {
    case '30d':
      return '30-day'
    case '90d':
      return '90-day'
    case 'max':
      return 'All-time'
  }
}
