import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { UpcomingBadge } from '../../badge/UpcomingBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'
import { SentimentText } from '../../SentimentText'
import { sentimentToWarningBarColor, WarningBar } from '../../WarningBar'
import { rosetteParameters } from '../parameters'
import { PizzaRosetteLabels } from '../pizza/PizzaRosetteLabels'
import type { RosetteValueTuple } from './IndividualRosetteIcon'
import { IndividualPizzaRosetteIcon } from './IndividualRosetteIcon'
import {
  IndividualRosetteTooltipContextProvider,
  useIndividualRosetteTooltipContext,
} from './IndividualRosetteTooltipContext'

interface Props {
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
  size?: 'small' | 'regular'
}

export function BigIndividualRosette(props: Props) {
  const isUnderReview =
    !!props.isUnderReview ||
    Object.values(props.l2.risks.concat(props.l3.risks)).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  const parameters = rosetteParameters[props.size ?? 'regular']

  if (isUnderReview || props.isUpcoming) {
    return (
      <div
        className={cn(
          'relative whitespace-pre p-12 pb-7 text-center font-medium text-xs uppercase leading-tight',
          props.className,
        )}
      >
        <IndividualPizzaRosetteIcon
          l2={props.l2}
          l3={props.l3}
          isUnderReview={isUnderReview}
          className={cn(
            props.isUpcoming && 'opacity-30',
            parameters.rosetteClassName,
          )}
          background={props.background}
          disableSectionLinking
        />
        {props.isUpcoming && (
          <UpcomingBadge className="absolute top-[130px] left-[90px]" />
        )}
        <PizzaRosetteLabels
          values={props.l3.risks}
          containerSize={parameters.containerSize}
          textRadius={parameters.textRadius}
          size={props.size}
        />
      </div>
    )
  }

  return (
    <IndividualRosetteTooltipContextProvider>
      <Tooltip>
        <div className={cn('relative p-12 pb-7', props.className)}>
          <TooltipTrigger>
            <IndividualPizzaRosetteIcon
              l2={props.l2}
              l3={props.l3}
              isUnderReview={isUnderReview}
              background={props.background}
              className={parameters.rosetteClassName}
            />
          </TooltipTrigger>
          <PizzaRosetteLabels
            values={props.l3.risks}
            containerSize={parameters.containerSize}
            textRadius={parameters.textRadius}
            size={props.size}
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
        <span className="text-[#787E8D] text-[13px] uppercase">
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
        <span className="text-[#787E8D] text-[13px] uppercase">
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
