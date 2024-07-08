'use client'

import { cn } from '~/utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { type RosetteValue } from '../types'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { SentimentText } from '../../sentiment-text'
import { WarningBar } from '../../warning-bar'
import { PentagonRosetteLabels } from './pentagon-rosette-labels'
import { PentagonRosetteIcon } from './pentagon-rosette-icon'
import {
  RosetteTooltipContextProvider,
  useRosetteTooltipContext,
} from '../rosette-tooltip-context'
import { UpcomingBadge } from '../../badge/upcoming-badge'

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
    props.isUnderReview ??
    props.values.every((value) => value.sentiment === 'UnderReview')

  if (props.isUpcoming ?? isUnderReview) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center size-[272px] shrink-0',
          props.className,
        )}
      >
        {/* Move tooltip up to have a all Circumcircle radius intersection exactly at the center of div */}
        <PentagonRosetteIcon
          values={props.values}
          isUnderReview={isUnderReview}
          className={cn(
            '-translate-y-[5.28%]',
            props.isUpcoming && 'opacity-30',
          )}
        />
        {props.isUpcoming && (
          <UpcomingBadge className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
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
          {/* Move tooltip up to have a all Circumcircle radius intersection exactly at the center of div */}
          <TooltipTrigger className="-translate-y-[5.28%]">
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
