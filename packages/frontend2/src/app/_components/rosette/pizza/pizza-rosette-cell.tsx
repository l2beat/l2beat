import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { type RosetteValue } from '../types'
import { PizzaRosetteIcon } from './pizza-rosette-icon'
import { UnderReviewBadge } from '../../badge/under-review-badge'
import { SentimentText } from '../../sentiment-text'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { sentimentToFillColor } from '~/utils/sentiment'
import { cn } from '~/utils/cn'
import { PizzaRosetteLabels } from './pizza-rosette-labels'

export interface PizzaRosetteCellProps {
  values: RosetteValue[]
  isUnderReview?: boolean
}

export function PizzaRosetteCell(props: PizzaRosetteCellProps) {
  const isUnderReview =
    props.isUnderReview ??
    props.values.every((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center justify-center size-full">
        <PizzaRosetteIcon
          values={props.values}
          className="size-6 md:size-8"
          isUnderReview={isUnderReview}
          background={false}
        />
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PizzaRosetteTooltip
          values={props.values}
          isUnderReview={isUnderReview}
        />
      </TooltipContent>
    </Tooltip>
  )
}

function PizzaRosetteTooltip({ values, isUnderReview }: PizzaRosetteCellProps) {
  if (isUnderReview) {
    return (
      <div className="w-[300px]">
        <div className="mb-4">
          <span className="font-bold text-base">Risk analysis</span> is{' '}
          <UnderReviewBadge />
        </div>

        <p className="text-wrap">
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
        <div className="relative size-[200px] flex items-center justify-center">
          <PizzaRosetteIcon
            values={values}
            className="scale-75"
            isUnderReview={isUnderReview}
          />
          <PizzaRosetteLabels
            values={values}
            containerSize={200}
            textRadius={76}
            size="small"
          />
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
