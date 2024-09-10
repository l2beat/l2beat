import { type Sentiment } from '@l2beat/shared-pure'

import { cn } from '~/utils/cn'
import { sentimentToTextColor } from '~/utils/sentiment'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/tooltip'

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
