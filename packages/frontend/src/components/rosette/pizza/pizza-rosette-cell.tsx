import { TableLink } from '~/app/(side-nav)/scaling/summary/_components/table/table-link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import type { RosetteValue } from '../types'
import { PizzaRosetteIcon } from './pizza-rosette-icon'
import { PizzaRosetteTooltip } from './pizza-rosette-tooltip'

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
          <PizzaRosetteIcon
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
