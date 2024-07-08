'use client'
import { cn } from '~/utils/cn'
import { type RosetteValue } from '../types'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { useState } from 'react'
import { SentimentText } from '../../sentiment-text'
import { WarningBar } from '../../warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { PizzaRosetteIcon } from './pizza-rosette-icon'
import { UpcomingBadge } from '../../badge/upcoming-badge'
import { PizzaRosetteLabels } from './pizza-rosette-labels'

export interface BigPizzaRosetteProps {
  values: RosetteValue[]
  isUpcoming?: boolean
  isUnderReview?: boolean
  className?: string
}

export interface ContentState {
  risk: RosetteValue
  side: 'top' | 'bottom'
  sideOffset: number
}

export function BigPizzaRosette(props: BigPizzaRosetteProps) {
  const isUnderReview =
    props.isUnderReview ??
    Object.values(props.values).every(
      ({ sentiment }) => sentiment === 'UnderReview',
    )

  const [content, setContent] = useState<ContentState | undefined>(undefined)

  if (isUnderReview || props.isUpcoming) {
    return (
      <div
        data-role="rosette"
        className={cn(
          'relative w-[272px] p-12 text-center font-medium text-xs uppercase leading-tight whitespace-pre',
          props.className,
        )}
      >
        <PizzaRosetteIcon
          values={props.values}
          isUpcoming={props.isUpcoming}
          isUnderReview={isUnderReview}
        />
        {props.isUpcoming && (
          <UpcomingBadge className="absolute top-[130px] left-[90px]" />
        )}
        <PizzaRosetteLabels
          values={props.values}
          content={content}
          containerSize={272}
          textRadius={102}
        />
      </div>
    )
  }

  return (
    <Tooltip>
      <div
        data-role="rosette"
        className={cn('relative w-[272px] p-12', props.className)}
        data-rosette-hover-disabled={isUnderReview || props.isUpcoming}
      >
        <TooltipTrigger>
          <PizzaRosetteIcon
            values={props.values}
            isUpcoming={props.isUpcoming}
            isUnderReview={isUnderReview}
            content={content}
            setContent={setContent}
          />
        </TooltipTrigger>
        <PizzaRosetteLabels
          values={props.values}
          content={content}
          containerSize={138}
          textRadius={102}
        />
      </div>
      {content ? (
        <TooltipContent
          side={content.side}
          sideOffset={content.sideOffset}
          className="w-[300px]"
        >
          <SentimentText
            sentiment={content.risk.sentiment}
            className="mb-2 flex items-center gap-1 font-medium"
          >
            {content.risk.value}
          </SentimentText>
          {content.risk.warning && (
            <WarningBar
              className="mb-2"
              icon={RoundedWarningIcon}
              text={content.risk.warning.value}
              color={
                content.risk.warning.sentiment === 'bad' ? 'red' : 'yellow'
              }
            />
          )}
          <span className="text-xs">{content.risk.description}</span>
        </TooltipContent>
      ) : null}
    </Tooltip>
  )
}
