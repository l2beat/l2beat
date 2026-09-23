import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import { TableLink } from '~/components/table/TableLink'
import {
  getPrivacyAdversariesSentence,
  getPrivacyAdversaryRosetteValues,
} from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteTooltip } from './PrivacyRosetteTooltip'
import {
  getPrivacyRosetteGroups,
  type PrivacyRosetteInput,
} from './privacyRosetteSlices'

interface Props extends PrivacyRosetteInput {
  /** Project page the rosette links into. */
  href: string
  isUnderReview?: boolean
}

/**
 * The adversaries on the L2 risk rosette, one slice each. The tooltip is the
 * privacy one rather than the L2 "Risk analysis" card: it names the promise,
 * lists every adversary, and opens the full assessment on hover.
 */
export function PrivacyAdversaryRosetteCell({
  href,
  isUnderReview,
  ...input
}: Props) {
  const groups = getPrivacyRosetteGroups(input)
  const values = getPrivacyAdversaryRosetteValues(input.adversaries)
  const { subject, held, total } = getPrivacyAdversariesSentence(
    input.adversaries,
  )

  return (
    // Hoverable so the pointer can move into the tooltip and pick a row.
    <Tooltip disableHoverableContent={false}>
      <TooltipTrigger
        className="flex size-full items-center justify-center"
        disabledOnMobile
      >
        <TableLink href={href}>
          <PizzaRosetteIcon
            values={values}
            isUnderReview={isUnderReview}
            background={false}
            disableSectionLinking
            className="size-6 md:size-8"
            alt-text={`Privacy risk summary: ${subject} is private against ${held} of ${total} adversaries`}
          />
        </TableLink>
      </TooltipTrigger>
      {/* Opened to the right and top-aligned so the hover detail, which is
          added at the bottom, grows the tooltip away from the pointer. */}
      <TooltipContent fitContent side="right" align="start">
        <PrivacyRosetteTooltip
          groups={groups}
          adversaries={input.adversaries}
          isUnderReview={isUnderReview}
          adversariesOnly
          rosette={
            <PizzaRosetteIcon
              values={values}
              isUnderReview={isUnderReview}
              background="surface"
              disableSectionLinking
              className="size-[104px] shrink-0"
            />
          }
        />
      </TooltipContent>
    </Tooltip>
  )
}
