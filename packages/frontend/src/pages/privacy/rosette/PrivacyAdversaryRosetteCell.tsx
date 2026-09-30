import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import { TableLink } from '~/components/table/TableLink'
import { useDevice } from '~/hooks/useDevice'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  getPrivacyAdversariesSectionHref,
  getPrivacyAdversariesSentence,
  getPrivacyAdversaryRosetteValues,
} from '../adversaries/privacyAdversaryUi'
import {
  PrivacyRosetteDrawer,
  PrivacyRosetteDrawerLink,
} from './PrivacyRosetteDrawer'
import { PrivacyRosetteTooltip } from './PrivacyRosetteTooltip'

interface Props {
  adversaries: PrivacyAdversariesSummary
  /** Project page, whose privacy section the rosette links into. */
  href: string
  isUnderReview?: boolean
}

/**
 * The adversaries on the L2 risk rosette, one slice each. On desktop it links
 * to the privacy section of the project page and opens a tooltip laid out
 * like the L2 "Risk analysis" card; on mobile, where the tooltip is too wide,
 * a tap slides the same analysis up in a drawer, whose button leads to the
 * same section.
 */
export function PrivacyAdversaryRosetteCell({
  adversaries,
  href,
  isUnderReview,
}: Props) {
  const { isMobile } = useDevice()
  const values = getPrivacyAdversaryRosetteValues(adversaries)
  const { subject, held, total } = getPrivacyAdversariesSentence(adversaries)
  const sectionHref = getPrivacyAdversariesSectionHref(href)

  const icon = (
    <PizzaRosetteIcon
      values={values}
      isUnderReview={isUnderReview}
      background={false}
      disableSectionLinking
      className="size-6 md:size-8"
      alt-text={`Privacy risk summary: ${subject} is private against ${held} of ${total} adversaries`}
    />
  )

  if (isMobile) {
    return (
      <PrivacyRosetteDrawer
        adversaries={adversaries}
        isUnderReview={isUnderReview}
        trigger={icon}
        triggerLabel={`Privacy risk analysis: ${subject} is private against ${held}/${total} adversaries.`}
        triggerClassName="size-full"
      >
        <PrivacyRosetteDrawerLink href={sectionHref}>
          Open project page
        </PrivacyRosetteDrawerLink>
      </PrivacyRosetteDrawer>
    )
  }

  return (
    // The gists in the tooltip appear nowhere else on the page, so they are
    // also rendered into the HTML for crawlers, as the L2 rosette does.
    <Tooltip contentInHtml>
      <TooltipTrigger
        className="flex size-full items-center justify-center"
        disabledOnMobile
      >
        <TableLink href={sectionHref}>{icon}</TableLink>
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PrivacyRosetteTooltip
          adversaries={adversaries}
          isUnderReview={isUnderReview}
          hint="Click on the rosette to visit the detailed pages for more info."
        />
      </TooltipContent>
    </Tooltip>
  )
}
