import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { UnderReviewBadge } from '../badge/under-review-badge'
import { SentimentText } from '../sentiment-text'
import { type RosetteValue } from './types'

export function RiskValue({ name, value, sentiment, warning }: RosetteValue) {
  return (
    <div className="font-medium">
      <span className="mb-1 block text-[10px] uppercase">{name}</span>
      {sentiment === 'UnderReview' ? (
        <UnderReviewBadge />
      ) : (
        <div className="flex items-center gap-1 text-base">
          <SentimentText sentiment={sentiment} vibrant={true}>
            {value}
          </SentimentText>
          {warning && (
            <RoundedWarningIcon
              className={cn('size-5', sentimentToFillColor(warning.sentiment))}
            />
          )}
        </div>
      )}
    </div>
  )
}
