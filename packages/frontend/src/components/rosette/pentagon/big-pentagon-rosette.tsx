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
import { WarningBar, sentimentToWarningBarColor } from '../../warning-bar'
import {
  RosetteTooltipContextProvider,
  useRosetteTooltipContext,
} from '../rosette-tooltip-context'
import type { RosetteValue } from '../types'
import { PentagonRosetteIcon } from './pentagon-rosette-icon'
import { PentagonRosetteLabels } from './pentagon-rosette-labels'

export interface BigPentagonRosetteProps {
  values: RosetteValue[]
  isUpcoming?: boolean
  isUnderReview?: boolean
  hasNoBridge?: boolean
  className?: string
}

export function BigPentagonRosette(props: BigPentagonRosetteProps) {
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
        <PentagonRosetteIcon
          values={props.values}
          isUnderReview={isUnderReview}
          hasNoBridge={props.hasNoBridge}
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
            'relative flex size-[272px] shrink-0 items-center justify-center',
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
  const selectedRisk = context?.selectedRisk
  if (!selectedRisk) return null

  return (
    <TooltipContent side="bottom" className="w-[300px]">
      <SentimentText
        sentiment={selectedRisk.sentiment ?? 'neutral'}
        className="mb-2 flex items-center gap-1 font-medium"
      >
        {selectedRisk.value}
      </SentimentText>
      {selectedRisk.warning && (
        <WarningBar
          className="mb-2"
          icon={RoundedWarningIcon}
          text={selectedRisk.warning.value}
          color={sentimentToWarningBarColor(selectedRisk.warning.sentiment)}
        />
      )}
      <span className="text-xs">{selectedRisk.description}</span>
    </TooltipContent>
  )
}
