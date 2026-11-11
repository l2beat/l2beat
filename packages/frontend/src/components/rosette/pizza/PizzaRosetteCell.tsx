import { TableLink } from '~/components/table/TableLink'
import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'
import type { RosetteValue } from '../types'
import { PizzaRosetteIcon } from './PizzaRosetteIcon'
import { PizzaRosetteTooltip } from './PizzaRosetteTooltip'

interface Props {
  /** Names the link, e.g. "Arbitrum One risk analysis". */
  projectName: string
  href: string
  values: RosetteValue[]
  isUnderReview?: boolean
  /** For the rosette, e.g. its size. */
  iconClassName?: string
  /** For the link around it, e.g. its hover background. */
  linkClassName?: string
}

export function PizzaRosetteCell(props: Props) {
  const isUnderReview =
    !!props.isUnderReview ||
    props.values.some((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip contentInHtml>
      <TooltipTrigger asChild disabledOnTouch>
        <TableLink
          href={props.href}
          aria-label={`${props.projectName} risk analysis`}
          className={props.linkClassName}
        >
          <PizzaRosetteIcon
            values={props.values}
            className={cn('size-6 md:size-8', props.iconClassName)}
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
