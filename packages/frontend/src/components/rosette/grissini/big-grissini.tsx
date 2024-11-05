'use client'

import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { UpcomingBadge } from '../../badge/upcoming-badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import { SentimentText } from '../../sentiment-text'
import { WarningBar } from '../../warning-bar'
import {
  RosetteTooltipContextProvider,
  useRosetteTooltipContext,
} from '../rosette-tooltip-context'
import { type RosetteValue } from '../types'
import { GrissiniIcon } from './grissini-icon'

export interface BigGrissiniProps {
  values: RosetteValue[]
  isUpcoming?: boolean
  isUnderReview?: boolean
  hasNoBridge?: boolean
  className?: string
}

export interface ContentState {
  risk: RosetteValue
  side: 'top' | 'bottom'
  sideOffset: number
}

export function BigGrissiniRosette(props: BigGrissiniProps) {
  const isUnderReview =
    !!props.isUnderReview ||
    props.values.some((value) => value.sentiment === 'UnderReview')

  if (!!props.isUpcoming || isUnderReview || !!props.hasNoBridge) {
    return (
      <div
        className={cn(
          'relative flex size-[272px] shrink-0 items-center justify-center',
          props.className,
        )}
      >
        <GrissiniIcon
          values={props.values}
          hasNoBridge={props.hasNoBridge}
          className={cn(props.isUpcoming && 'opacity-30')}
        />
        {props.isUpcoming && (
          <UpcomingBadge className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
    )
  }

  return (
    <RosetteTooltipContextProvider>
      <Tooltip>
        <div
          className={cn(
            'relative flex size-[272px] shrink-0 items-center justify-center',
            props.className,
          )}
        >
          <TooltipTrigger>
            <GrissiniIcon
              values={props.values}
              hasNoBridge={props.hasNoBridge}
            />
          </TooltipTrigger>
        </div>
        <GrissiniTooltipContent />
      </Tooltip>
    </RosetteTooltipContextProvider>
  )
}

function GrissiniTooltipContent() {
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
