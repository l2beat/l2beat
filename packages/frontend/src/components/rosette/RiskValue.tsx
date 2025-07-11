import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { UnderReviewBadge } from '../badge/UnderReviewBadge'
import { SentimentText } from '../SentimentText'
import type { RosetteValue } from './types'

export function RiskValue(props: RosetteValue) {
  return (
    <div className="font-medium">
      <span className="mb-0.5 block text-subtitle-10 uppercase">
        {props.name}
      </span>
      {props.sentiment === 'UnderReview' ? (
        <UnderReviewBadge />
      ) : (
        <div className="flex items-center gap-1">
          <SentimentText
            sentiment={props.sentiment ?? 'neutral'}
            vibrant={true}
            className="font-medium text-label-value-15"
          >
            {props.value}
          </SentimentText>
          {props.warning && (
            <RoundedWarningIcon
              className={cn(
                'size-4',
                sentimentToFillColor(props.warning.sentiment),
              )}
            />
          )}
        </div>
      )}
    </div>
  )
}
