import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { UnderReviewBadge } from '../badge/UnderReviewBadge'
import { SentimentText } from '../SentimentText'
import type { RosetteValue } from './types'

export function RiskValue(props: RosetteValue) {
  return (
    <div className="font-medium">
      <span className="mb-0.5 block text-secondary text-subtitle-11 uppercase">
        {props.name}
      </span>
      {props.sentiment === 'UnderReview' ? (
        <UnderReviewBadge />
      ) : (
        <div className="flex items-center gap-1">
          <SentimentText
            sentiment={props.sentiment ?? 'neutral'}
            vibrant={true}
            className="font-medium text-label-value-14"
          >
            {props.regular ? `Emergency: ${props.value}` : props.value}
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
      {props.regular && (
        <SentimentText
          sentiment={props.regular.sentiment ?? 'neutral'}
          vibrant={true}
          className="mt-1 block font-medium text-label-value-14"
        >
          {`Regular: ${props.regular.value}`}
        </SentimentText>
      )}
    </div>
  )
}
