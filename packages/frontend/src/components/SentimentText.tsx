import type { Sentiment } from '@l2beat/config'
import { cn } from '~/utils/cn'
import { sentimentToTextColor } from '~/utils/sentiment'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

interface Props {
  sentiment: Sentiment
  children: string
  className?: string
  description?: string
  vibrant?: boolean
}

export function SentimentText(props: Props) {
  if (props.description) {
    return (
      <Tooltip>
        <TooltipTrigger className={props.className}>
          <SentimentText
            sentiment={props.sentiment}
            vibrant={props.vibrant}
            className={props.className}
          >
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
        sentimentToTextColor(props.sentiment, {
          vibrant: props.vibrant,
        }),
        props.className,
      )}
    >
      {props.children}
    </span>
  )
}
