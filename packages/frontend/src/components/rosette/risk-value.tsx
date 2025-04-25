import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { UnderReviewBadge } from '../badge/under-review-badge'
import { SentimentText } from '../sentiment-text'
import type { RosetteValue } from './types'

export function RiskValue(props: RosetteValue) {
  return (
    <div className="font-medium">
      <span className="subtitle-10 mb-0.5 block uppercase">{props.name}</span>
      {props.sentiment === 'UnderReview' ? (
        <UnderReviewBadge />
      ) : (
        <div className="flex items-center gap-1">
          <SentimentText
            sentiment={props.sentiment ?? 'neutral'}
            vibrant={true}
            className="label-value-15-medium"
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
