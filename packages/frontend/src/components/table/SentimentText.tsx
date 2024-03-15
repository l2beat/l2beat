import { Sentiment } from '@l2beat/shared-pure'
import React from 'react'

import { cn } from '../../utils/cn'
import { sentimentToTextColor } from '../../utils/risks/color'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

interface Props {
  sentiment: Sentiment
  children: string
  className?: string
  description?: string
}

export function SentimentText(props: Props) {
  if (props.description) {
    return (
      <Tooltip>
        <TooltipTrigger className={props.className}>
          <SentimentText sentiment={props.sentiment}>
            {props.children}
          </SentimentText>
        </TooltipTrigger>
        <TooltipContent>{props.description}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <span
      className={cn(
        'font-medium',
        sentimentToTextColor(props.sentiment),
        props.className,
      )}
    >
      {props.children}
    </span>
  )
}
