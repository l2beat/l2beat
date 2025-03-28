import { TableLink } from '~/components/table/table-link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import type { RosetteValue } from '../types'
import { PizzaRosetteTooltip } from './pizza-rosette-tooltip'
import { RealPizzaRosetteIcon } from './real-pizza-rosette-icon'

interface Props {
  href: string
  values: RosetteValue[]
  isUnderReview?: boolean
}

export function PizzaRosetteCell(props: Props) {
  const isUnderReview =
    !!props.isUnderReview ||
    props.values.some((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip>
      <TooltipTrigger
        className="flex size-full items-center justify-center"
        disabledOnMobile
      >
        <TableLink href={props.href}>
          <RealPizzaRosetteIcon
            values={props.values}
            className="size-6 md:size-8"
            isUnderReview={isUnderReview}
            background={false}
          />
        </TableLink>
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PizzaRosetteTooltip
          values={props.values}
          isUnderReview={isUnderReview}
        />
      </TooltipContent>
    </Tooltip>
  )
}
