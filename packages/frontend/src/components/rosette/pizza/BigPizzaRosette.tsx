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
import {
  RosetteTooltipContextProvider,
  useRosetteTooltipContext,
} from '../RosetteTooltipContext'
import type { RosetteValue } from '../types'
import { PizzaRosetteIcon } from './PizzaRosetteIcon'
import { PizzaRosetteLabels } from './PizzaRosetteLabels'

export interface BigPizzaRosetteProps {
  values: RosetteValue[]
  isUpcoming?: boolean
  isUnderReview?: boolean
  className?: string
  background?: 'header' | 'surface'
  realPizza?: boolean
}

export function BigPizzaRosette(props: BigPizzaRosetteProps) {
  const isUnderReview =
    !!props.isUnderReview ||
    Object.values(props.values).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )

  if (isUnderReview || props.isUpcoming) {
    return (
      <div
        className={cn(
          'relative h-[284px] w-[272px] whitespace-pre p-12 text-center font-medium text-xs uppercase leading-tight',
          props.className,
        )}
      >
        <PizzaRosetteIcon
          values={props.values}
          isUnderReview={isUnderReview}
          className={cn(props.isUpcoming && 'opacity-30')}
          background={props.background}
        />
        {props.isUpcoming && (
          <UpcomingBadge className="absolute top-[130px] left-[90px]" />
        )}
        <PizzaRosetteLabels
          values={props.values}
          containerSize={272}
          textRadius={102}
        />
      </div>
    )
  }

  return (
    <RosetteTooltipContextProvider>
      <Tooltip>
        <div
          className={cn('relative w-[272px] p-12', props.className)}
          data-rosette-hover-disabled={isUnderReview || props.isUpcoming}
        >
          <TooltipTrigger>
            <PizzaRosetteIcon
              values={props.values}
              isUnderReview={isUnderReview}
              background={props.background}
            />
          </TooltipTrigger>
          <PizzaRosetteLabels
            values={props.values}
            containerSize={272}
            textRadius={102}
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
    <TooltipContent
      side="bottom"
      onPointerDownOutside={(e) => {
        e.preventDefault()
      }}
      className="w-[300px]"
    >
      <p className="mb-2 font-medium text-label-value-14">
        {selectedRisk.name}
      </p>
      <SentimentText
        sentiment={selectedRisk.sentiment ?? 'neutral'}
        vibrant={true}
        className="mb-2 flex items-center gap-1 text-heading-18"
      >
        {selectedRisk.value}
      </SentimentText>
      {selectedRisk.warning && (
        <WarningBar
          className="mb-2 px-3 py-2"
          icon={RoundedWarningIcon}
          text={selectedRisk.warning.value}
          color={sentimentToWarningBarColor(selectedRisk.warning.sentiment)}
          ignoreMarkdown
        />
      )}
      <span>{selectedRisk.description}</span>
    </TooltipContent>
  )
}
