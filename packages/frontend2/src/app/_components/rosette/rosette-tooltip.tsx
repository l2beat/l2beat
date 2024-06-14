import React from 'react'
import { RoundedWarningIcon } from '~/icons/rounded-warning-icon'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { UnderReviewBadge } from '../badge/under-review-badge'
import { SentimentText } from '../sentiment-text'
import { MediumRosette } from './rosette'
import { type RosetteValue } from './types'

export interface RosetteTooltipProps {
  values: RosetteValue[]
}

export function RosetteTooltip({ values }: RosetteTooltipProps) {
  const isUnderReview = values.every(
    (value) => value.sentiment === 'UnderReview',
  )

  if (isUnderReview) {
    return (
      <div className="w-[300px]">
        <div className="mb-4">
          <span className="font-bold text-base">Risk analysis</span> is{' '}
          <UnderReviewBadge />
        </div>

        <p>
          Projects under review might present uncompleted information & data.
          <br />
          L2BEAT Team is working to research & validate content before
          publishing.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <span className="font-bold text-base">
        <span className="mr-2">Risk analysis</span>
      </span>
      <div className="flex items-center gap-6">
        <div>
          <MediumRosette values={values} />
        </div>
        <div className="flex flex-col gap-4">
          {values.map((value) => (
            <RiskValueComponent key={value.name} {...value} />
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskValueComponent({ name, value, sentiment, warning }: RosetteValue) {
  return (
    <div className="font-medium">
      <span className="mb-1 block text-[10px] uppercase">{name}</span>
      {sentiment === 'UnderReview' ? (
        <UnderReviewBadge />
      ) : (
        <div className="flex items-center gap-1 text-base">
          <SentimentText sentiment={sentiment}>{value}</SentimentText>
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
