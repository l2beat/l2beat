import React from 'react'

import {
  type Sentiment,
  type WarningValueWithSentiment,
} from '@l2beat/shared-pure'
import { RoundedWarningIcon } from '~/icons/rounded-warning-icon'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { SentimentText } from '../../sentiment-text'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { WarningBar } from '../../warning-bar'
import { UnderReviewBadge } from '../../badge/under-review-badge'

interface Risk {
  value: string
  sentiment: Sentiment
  description?: string
  warning?: WarningValueWithSentiment
  secondLine?: string
  secondSentiment?: Sentiment
}

interface Props {
  risk: Risk
}

export function RiskCell({ risk }: Props) {
  if (risk.sentiment === 'UnderReview') {
    return <UnderReviewBadge />
  }

  const trigger = (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <SentimentText sentiment={risk.sentiment}>{risk.value}</SentimentText>
        {risk.warning && (
          <RoundedWarningIcon
            className={cn(
              'size-5',
              sentimentToFillColor(risk.warning.sentiment),
            )}
          />
        )}
      </div>
      {risk.secondLine &&
        (risk.secondSentiment ? (
          <SentimentText
            sentiment={risk.secondSentiment}
            className="block text-xs leading-none"
          >
            {risk.secondLine}
          </SentimentText>
        ) : (
          <span
            className={
              '-mt-1 mb-1 text-2xs text-gray-550 md:m-0 dark:text-gray-500 md:text-xs md:leading-none'
            }
          >
            {risk.secondLine}
          </span>
        ))}
    </div>
  )

  if (risk.description) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>
          {risk.warning && (
            <WarningBar
              className="mb-2"
              text={risk.warning.value}
              icon={RoundedWarningIcon}
              color={risk.warning.sentiment === 'bad' ? 'red' : 'yellow'}
              ignoreMarkdown
            />
          )}
          {!!risk.description ? risk.description : null}
        </TooltipContent>
      </Tooltip>
    )
  }

  return trigger
}
