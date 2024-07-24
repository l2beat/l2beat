'use client'

import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { UpcomingBadge } from '../../badge/upcoming-badge'
import { SentimentText } from '../../sentiment-text'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { WarningBar } from '../../warning-bar'
import {
  RosetteTooltipContextProvider,
  useRosetteTooltipContext,
} from '../rosette-tooltip-context'
import { type RosetteValue } from '../types'
import { PentagonRosetteIcon } from './pentagon-rosette-icon'
import { PentagonRosetteLabels } from './pentagon-rosette-labels'

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
  const isUnderReview =
    !!props.isUnderReview ||
    props.values.some((value) => value.sentiment === 'UnderReview')

  if (!!props.isUpcoming || isUnderReview) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center size-[272px] shrink-0',
          props.className,
        )}
      >
        <PentagonRosetteIcon
          values={props.values}
          isUnderReview={isUnderReview}
          className={cn(props.isUpcoming && 'opacity-30')}
        />
        {props.isUpcoming && (
          <UpcomingBadge className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        <PentagonRosetteLabels
          values={props.values}
          containerSize={272}
          textRadius={96}
        />
      </div>
    )
  }

  return (
    <RosetteTooltipContextProvider>
      <Tooltip>
        <div
          className={cn(
            'relative flex items-center justify-center size-[272px] shrink-0',
            props.className,
          )}
        >
          <TooltipTrigger>
            <PentagonRosetteIcon
              values={props.values}
              isUnderReview={props.isUnderReview}
              className={cn(props.isUpcoming && 'opacity-30')}
            />
          </TooltipTrigger>
          <PentagonRosetteLabels
            values={props.values}
            containerSize={272}
            textRadius={96}
          />
        </div>
        <RosetteTooltipContent />
      </Tooltip>
    </RosetteTooltipContextProvider>
  )
}

function RosetteTooltipContent() {
  const context = useRosetteTooltipContext()
  const content = context?.content
  if (!content) return null

  return (
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
          color={content.risk.warning.sentiment === 'bad' ? 'red' : 'yellow'}
        />
      )}
      <span className="text-xs">{content.risk.description}</span>
    </TooltipContent>
  )
}
