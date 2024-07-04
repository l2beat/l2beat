'use client'
import { cn } from '~/utils/cn'
import { type RosetteValue } from '../types'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { useState } from 'react'
import { SentimentText } from '../../sentiment-text'
import { WarningBar } from '../../warning-bar'
import { RoundedWarningIcon } from '~/icons/rounded-warning-icon'
import { BigRosetteIcon } from './big-rosette-icon'
import { BigRosetteLabels } from './big-rosette-labels'
import { UpcomingBadge } from '../../badge/upcoming-badge'

export interface BigRosetteProps {
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

export function BigRosette(props: BigRosetteProps) {
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
        <BigRosetteIcon
          values={props.values}
          isUpcoming={props.isUpcoming}
          isUnderReview={isUnderReview}
        />
        {props.isUpcoming && (
          <UpcomingBadge className="absolute top-[130px] left-[90px]" />
        )}
        <BigRosetteLabels values={props.values} content={content} />
      </div>
    )
  }

  return (
    <Tooltip>
      <div
        data-role="rosette"
        className={cn(
          'relative w-[272px] p-12 text-center font-medium text-xs uppercase leading-tight whitespace-pre',
          props.className,
        )}
        data-rosette-hover-disabled={isUnderReview || props.isUpcoming}
      >
        <TooltipTrigger>
          <BigRosetteIcon
            values={props.values}
            isUpcoming={props.isUpcoming}
            isUnderReview={isUnderReview}
            content={content}
            setContent={setContent}
          />
        </TooltipTrigger>
        <BigRosetteLabels values={props.values} content={content} />
      </div>
      {content ? (
        <TooltipContent side={content.side} sideOffset={content.sideOffset}>
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
