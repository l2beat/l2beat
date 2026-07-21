import type { Sentiment, TableReadyValue } from '@l2beat/config'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import {
  sentimentToTextColor,
  sentimentToTransparentBgColor,
} from '~/utils/sentiment'
import { CompareChip } from './CompareChip'

export function IntentAttributeRow({
  label,
  left,
  right,
}: {
  label: string
  left: TableReadyValue | undefined
  right: TableReadyValue | undefined
}) {
  return (
    <div className="grid grid-cols-3 items-center gap-3">
      <CompareChip
        className={cn(
          'w-fit max-w-full truncate',
          sentimentClassName(left?.sentiment),
        )}
      >
        {left?.value ?? EM_DASH}
      </CompareChip>
      <span className="text-center font-medium text-label-value-13 text-secondary">
        {label}
      </span>
      <CompareChip
        alignRight
        className={cn(
          'w-fit max-w-full justify-self-end truncate',
          sentimentClassName(right?.sentiment),
        )}
      >
        {right?.value ?? EM_DASH}
      </CompareChip>
    </div>
  )
}

function sentimentClassName(sentiment: Sentiment | undefined) {
  // Neutral values keep the chip's default surface background.
  if (!sentiment || sentiment === 'neutral' || sentiment === 'UnderReview') {
    return undefined
  }
  return cn(
    sentimentToTransparentBgColor(sentiment),
    sentimentToTextColor(sentiment, { vibrant: true }),
  )
}
