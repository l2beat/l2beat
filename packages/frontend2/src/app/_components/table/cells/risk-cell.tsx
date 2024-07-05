import React from 'react'

import {
  type Sentiment,
  type WarningValueWithSentiment,
} from '@l2beat/shared-pure'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { SentimentText } from '../../sentiment-text'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'

interface Risk {
  value: string
  sentiment: Sentiment
  description?: string
  warning?: WarningValueWithSentiment
}

interface Props {
  risk: Risk
}

export function RiskCell({ risk }: Props) {
  const trigger = (
    <div className="flex items-center gap-1">
      <SentimentText sentiment={risk.sentiment}>{risk.value}</SentimentText>
      {risk.warning && (
        <RoundedWarningIcon
          className={cn('size-5', sentimentToFillColor(risk.warning.sentiment))}
        />
      )}
    </div>
  )

  if (risk.description) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>
          {!!risk.description ? risk.description : null}
        </TooltipContent>
      </Tooltip>
    )
  }

  return trigger
}
