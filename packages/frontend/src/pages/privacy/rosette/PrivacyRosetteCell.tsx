import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TableLink } from '~/components/table/TableLink'
import { cn } from '~/utils/cn'
import { getPrivacyAdversariesSentence } from '../adversaries/privacyAdversaryUi'
import {
  PrivacyRosetteIcon,
  type PrivacyRosetteLayout,
} from './PrivacyRosetteIcon'
import { PrivacyRosetteTooltip } from './PrivacyRosetteTooltip'
import {
  getPrivacyRosetteGroups,
  type PrivacyRosetteInput,
} from './privacyRosetteSlices'

interface Props extends PrivacyRosetteInput {
  /** Project page the rosette links into. */
  href: string
  isUnderReview?: boolean
  layout?: PrivacyRosetteLayout
  /** Shown beside the rosette, e.g. the adversary count. */
  children?: React.ReactNode
  /** Overrides the table-cell size of the rosette. */
  iconClassName?: string
  /** Overrides the table-row link styling, e.g. its 52px height cap. */
  linkClassName?: string
}

/**
 * The privacy column: one rosette over everything the page grades. It carries
 * the shape of the assessment; the verdict behind every slice is left to the
 * tooltip, which labels the two halves on the sides they occupy.
 */
export function PrivacyRosetteCell({
  href,
  isUnderReview,
  layout = 'split',
  children,
  iconClassName,
  linkClassName,
  ...input
}: Props) {
  const groups = getPrivacyRosetteGroups(input)
  const { subject, held, total } = getPrivacyAdversariesSentence(
    input.adversaries,
  )

  return (
    // Hoverable so the pointer can move into the tooltip and pick a slice.
    <Tooltip disableHoverableContent={false}>
      <TooltipTrigger
        className="flex size-full items-center justify-center"
        disabledOnMobile
      >
        <TableLink
          href={href}
          className={cn('flex items-center gap-2.5', linkClassName)}
        >
          <PrivacyRosetteIcon
            groups={groups}
            layout={layout}
            isUnderReview={isUnderReview}
            className={cn('size-9 shrink-0 md:size-11', iconClassName)}
            label={`Privacy risk summary: ${subject} is private against ${held} of ${total} adversaries`}
          />
          {children}
        </TableLink>
      </TooltipTrigger>
      {/* Opened to the right and top-aligned so the hover detail, which is
          added at the bottom, grows the tooltip away from the pointer. */}
      <TooltipContent fitContent side="right" align="start">
        <PrivacyRosetteTooltip
          groups={groups}
          layout={layout}
          adversaries={input.adversaries}
          isUnderReview={isUnderReview}
        />
      </TooltipContent>
    </Tooltip>
  )
}
