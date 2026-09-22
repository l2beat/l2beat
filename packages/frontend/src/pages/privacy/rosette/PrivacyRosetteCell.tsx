import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TableLink } from '~/components/table/TableLink'
import { getPrivacyAdversariesSentence } from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteIcon } from './PrivacyRosetteIcon'
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
 * The privacy column: one rosette over everything the page grades. It carries
 * the shape of the assessment; the verdict behind every slice is left to the
 * tooltip, which labels the two halves on the sides they occupy.
 */
export function PrivacyRosetteCell({ href, isUnderReview, ...input }: Props) {
  const groups = getPrivacyRosetteGroups(input)
  const { subject, held, total } = getPrivacyAdversariesSentence(
    input.adversaries,
  )

  return (
    <Tooltip>
      <TooltipTrigger
        className="flex size-full items-center justify-center"
        disabledOnMobile
      >
        <TableLink href={href}>
          <PrivacyRosetteIcon
            groups={groups}
            isUnderReview={isUnderReview}
            className="size-9 md:size-11"
            label={`Privacy risk summary: ${subject} is private against ${held} of ${total} adversaries`}
          />
        </TableLink>
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PrivacyRosetteTooltip
          groups={groups}
          adversaries={input.adversaries}
          isUnderReview={isUnderReview}
        />
      </TooltipContent>
    </Tooltip>
  )
}
