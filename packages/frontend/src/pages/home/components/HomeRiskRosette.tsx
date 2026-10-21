import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import { PizzaRosetteTooltip } from '~/components/rosette/pizza/PizzaRosetteTooltip'
import type { RosetteValue } from '~/components/rosette/types'

/**
 * The summary table's risk rosette at the ranking's 24px, so the rows keep
 * their height; hover shows each risk, a click opens the risk page.
 */
export function HomeRiskRosette({
  projectName,
  values,
  href,
  isUnderReview: underReviewConfig,
}: {
  projectName: string
  values: RosetteValue[]
  href: string
  isUnderReview: boolean
}) {
  const isUnderReview =
    underReviewConfig ||
    values.some((value) => value.sentiment === 'UnderReview')
  return (
    <Tooltip contentInHtml>
      <TooltipTrigger asChild disabledOnMobile>
        <a
          href={href}
          aria-label={`${projectName} risk analysis`}
          className="flex"
        >
          <PizzaRosetteIcon
            values={values}
            className="size-6"
            isUnderReview={isUnderReview}
            background={false}
            disableSectionLinking
          />
        </a>
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PizzaRosetteTooltip values={values} isUnderReview={isUnderReview} />
      </TooltipContent>
    </Tooltip>
  )
}
