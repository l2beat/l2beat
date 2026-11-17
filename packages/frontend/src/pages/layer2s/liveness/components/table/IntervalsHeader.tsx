import type { LivenessTimeRange } from '~/server/features/layer2s/liveness/types'
import { useLivenessTimeRangeContext } from '../LivenessTimeRangeContext'

interface Props {
  average?: boolean
}

export function IntervalsHeader({ average }: Props) {
  const { timeRange } = useLivenessTimeRangeContext()

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
