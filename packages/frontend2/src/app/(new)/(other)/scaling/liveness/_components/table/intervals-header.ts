import { type LivenessTimeRange } from '~/server/features/liveness/types'
import { useLivenessTimeRangeContext } from '../liveness-time-range-context'

interface Props {
  average?: boolean
}

export function IntervalsHeader({ average }: Props) {
  const { timeRange } = useLivenessTimeRangeContext()
  return `${rangeToLabel(timeRange)}${average ? ' average' : ''} intervals`
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
