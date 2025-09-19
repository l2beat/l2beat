import { TableLink } from '~/components/table/TableLink'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'
import type { RosetteValue } from '../types'
import { PizzaRosetteIcon } from './PizzaRosetteIcon'
import { PizzaRosetteTooltip } from './PizzaRosetteTooltip'

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
            disableSectionLinking
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
