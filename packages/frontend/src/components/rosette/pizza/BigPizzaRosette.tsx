import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'
import { SentimentText } from '../../SentimentText'
import { sentimentToWarningBarColor, WarningBar } from '../../WarningBar'
import { rosetteParameters } from '../parameters'
import {
  RosetteTooltipContextProvider,
  useRosetteTooltipContext,
} from '../RosetteTooltipContext'
import type { RosetteValue } from '../types'
import { PizzaRosetteIcon } from './PizzaRosetteIcon'
import { PizzaRosetteLabels } from './PizzaRosetteLabels'

interface BigPizzaRosetteProps {
  values: RosetteValue[]
  isUnderReview?: boolean
  className?: string
  background?: 'header' | 'surface'
  size?: 'small' | 'regular'
  realPizza?: boolean
}

export function BigPizzaRosette(props: BigPizzaRosetteProps) {
  const isUnderReview =
    !!props.isUnderReview ||
    Object.values(props.values).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  const parameters = rosetteParameters[props.size ?? 'regular']

  if (isUnderReview) {
    return (
      <div
        className={cn(
          'relative whitespace-pre p-12 pb-7 text-center font-medium text-xs uppercase leading-tight',
          props.className,
        )}
      >
        <PizzaRosetteIcon
          values={props.values}
          isUnderReview={isUnderReview}
          className={parameters.rosetteClassName}
          background={props.background}
          disableSectionLinking
        />
        <PizzaRosetteLabels
          values={props.values}
          containerSize={parameters.containerSize}
          textRadius={parameters.textRadius}
          size={props.size}
        />
      </div>
    )
  }

  return (
    <RosetteTooltipContextProvider>
      <Tooltip>
        <div className={cn('relative p-12 pb-7', props.className)}>
          <TooltipTrigger>
            <PizzaRosetteIcon
              values={props.values}
              isUnderReview={isUnderReview}
              background={props.background}
              className={parameters.rosetteClassName}
            />
          </TooltipTrigger>
          <PizzaRosetteLabels
            values={props.values}
            containerSize={parameters.containerSize}
            textRadius={parameters.textRadius}
            size={props.size}
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
        className="mb-2 flex items-center gap-1 font-medium text-heading-18"
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
