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
import { PizzaRosetteLabels } from '../pizza/pizza-rosette-labels'
import {
  IndividualPizzaRosetteIcon,
  type RosetteValueTuple,
} from './individual-rosette-icon'
import {
  IndividualRosetteTooltipContextProvider,
  useIndividualRosetteTooltipContext,
} from './individual-rosette-tooltip-context'

export interface Props {
  names: {
    inner: string
    outer: string
  }
  innerValues: RosetteValueTuple
  outerValues: RosetteValueTuple
  isUpcoming?: boolean
  isUnderReview?: boolean
  className?: string
}

export function BigIndividualRosette(props: Props) {
  const isUnderReview =
    !!props.isUnderReview ||
    Object.values(props.innerValues.concat(props.outerValues)).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )

  if (isUnderReview || props.isUpcoming) {
    return (
      <div
        data-role="rosette"
        className={cn(
          'relative whitespace-pre text-center text-xs font-medium uppercase leading-tight',
          props.className,
        )}
      >
        <IndividualPizzaRosetteIcon
          innerValues={props.innerValues}
          outerValues={props.outerValues}
          isUnderReview={isUnderReview}
          className={cn(props.isUpcoming && 'opacity-30')}
        />
        {props.isUpcoming && (
          <UpcomingBadge className="absolute left-[90px] top-[130px]" />
        )}
        <PizzaRosetteLabels
          values={props.innerValues}
          containerSize={228}
          textRadius={102}
        />
      </div>
    )
  }

  return (
    <IndividualRosetteTooltipContextProvider>
      <Tooltip>
        <div
          data-role="rosette"
          className={cn('relative', props.className)}
          data-rosette-hover-disabled={isUnderReview || props.isUpcoming}
        >
          <TooltipTrigger>
            <IndividualPizzaRosetteIcon
              innerValues={props.innerValues}
              outerValues={props.outerValues}
              isUnderReview={isUnderReview}
            />
          </TooltipTrigger>
          <PizzaRosetteLabels
            values={props.innerValues}
            containerSize={228}
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
      className="w-[300px]"
    >
      <SentimentText
        sentiment={content.inner.sentiment}
        className="mb-2 flex items-center gap-1 font-medium"
      >
        {content.inner.value}
      </SentimentText>
      {content.inner.warning && (
        <WarningBar
          className="mb-2"
          icon={RoundedWarningIcon}
          text={content.inner.warning.value}
          color={content.inner.warning.sentiment === 'bad' ? 'red' : 'yellow'}
        />
      )}
      <span className="text-xs">{content.inner.description}</span>
    </TooltipContent>
  )
}
