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
import { PizzaRosetteLabels } from '../pizza/pizza-rosette-labels'
import type { RosetteValueTuple } from './individual-rosette-icon'
import { IndividualPizzaRosetteIcon } from './individual-rosette-icon'
import {
  IndividualRosetteTooltipContextProvider,
  useIndividualRosetteTooltipContext,
} from './individual-rosette-tooltip-context'

export interface Props {
  l2: {
    name: string
    risks: RosetteValueTuple
  }
  l3: {
    name: string
    risks: RosetteValueTuple
  }
  isUpcoming?: boolean
  isUnderReview?: boolean
  className?: string
  background?: 'header' | 'surface'
}

export function BigIndividualRosette(props: Props) {
  const isUnderReview =
    !!props.isUnderReview ||
    Object.values(props.l2.risks.concat(props.l3.risks)).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )

  if (isUnderReview || props.isUpcoming) {
    return (
      <div
        className={cn(
          'relative h-[284px] w-[272px] whitespace-pre p-12 text-center text-xs font-medium uppercase leading-tight',
          props.className,
        )}
      >
        <IndividualPizzaRosetteIcon
          l2={props.l2}
          l3={props.l3}
          isUnderReview={isUnderReview}
          className={cn(props.isUpcoming && 'opacity-30')}
          background={props.background}
        />
        {props.isUpcoming && (
          <UpcomingBadge className="absolute left-[90px] top-[130px]" />
        )}
        <PizzaRosetteLabels
          values={props.l3.risks}
          containerSize={272}
          textRadius={102}
        />
      </div>
    )
  }

  return (
    <IndividualRosetteTooltipContextProvider>
      <Tooltip>
        <div className={cn('relative w-[272px] p-12', props.className)}>
          <TooltipTrigger>
            <IndividualPizzaRosetteIcon
              l2={props.l2}
              l3={props.l3}
              isUnderReview={isUnderReview}
              background={props.background}
            />
          </TooltipTrigger>
          <PizzaRosetteLabels
            values={props.l3.risks}
            containerSize={272}
            textRadius={102}
          />
        </div>
        <RosetteTooltipContent />
      </Tooltip>
    </IndividualRosetteTooltipContextProvider>
  )
}

function RosetteTooltipContent() {
  const context = useIndividualRosetteTooltipContext()
  const content = context?.content
  if (!content) return null

  return (
    <TooltipContent
      side={content.side}
      sideOffset={content.sideOffset}
      onPointerDownOutside={(e) => {
        e.preventDefault()
      }}
      className="flex w-[300px] flex-col gap-2"
    >
      <div className="flex flex-col gap-1">
        <span className="text-[13px] uppercase text-[#787E8D]">
          {context.content?.outerProjectName}
        </span>
        <SentimentText
          sentiment={content.outer.sentiment ?? 'neutral'}
          vibrant={true}
          className="flex items-center gap-1 font-medium"
        >
          {content.outer.value}
        </SentimentText>
        {content.outer.warning && (
          <WarningBar
            icon={RoundedWarningIcon}
            text={content.outer.warning.value}
            color={sentimentToWarningBarColor(content.outer.warning.sentiment)}
          />
        )}
        <span className="text-xs">{content.outer.description}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] uppercase text-[#787E8D]">
          {context.content?.innerProjectName}
        </span>
        <SentimentText
          sentiment={content.inner.sentiment ?? 'neutral'}
          vibrant={true}
          className="flex items-center gap-1 font-medium"
        >
          {content.inner.value}
        </SentimentText>
        {content.inner.warning && (
          <WarningBar
            icon={RoundedWarningIcon}
            text={content.inner.warning.value}
            color={sentimentToWarningBarColor(content.inner.warning.sentiment)}
          />
        )}

        <span className="text-xs">{content.inner.description}</span>
      </div>
    </TooltipContent>
  )
}
