'use client'

import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { type RosetteValue } from '../types'
import { useState } from 'react'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { SentimentText } from '../../sentiment-text'
import { WarningBar } from '../../warning-bar'
import { PentagonRosetteLabels } from './pentagon-rosette-labels'
import { PentagonRosetteIcon } from './pentagon-rosette-icon'

export interface BigPentagonRosetteProps {
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

export function BigPentagonRosette(props: BigPentagonRosetteProps) {
  const [content, setContent] = useState<ContentState>()

  return (
    <Tooltip>
      <div
        data-role="rosette"
        className={cn(
          'relative flex items-center justify-center size-[272px]',
          props.className,
        )}
      >
        {/* Move tooltip up to have a all Circumcircle radius intersection exactly at the center of div */}
        <TooltipTrigger className="-translate-y-[10px]">
          <PentagonRosetteIcon
            values={props.values}
            isUpcoming={props.isUpcoming}
            isUnderReview={props.isUnderReview}
            content={content}
            setContent={setContent}
          />
        </TooltipTrigger>
        <PentagonRosetteLabels
          values={props.values}
          content={content}
          containerSize={272}
          textRadius={96}
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
