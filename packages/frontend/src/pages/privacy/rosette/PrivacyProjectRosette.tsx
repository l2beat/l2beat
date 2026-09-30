import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import { useDevice } from '~/hooks/useDevice'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  getPrivacyAdversariesSectionHref,
  getPrivacyAdversariesSentence,
  getPrivacyAdversaryRosetteValues,
  PRIVACY_ADVERSARIES_SECTION_ID,
} from '../adversaries/privacyAdversaryUi'
import {
  PrivacyRosetteDrawer,
  PrivacyRosetteDrawerLink,
} from './PrivacyRosetteDrawer'
import { PrivacyRosetteTooltip } from './PrivacyRosetteTooltip'

/** How long vaul takes to slide the drawer out, in milliseconds. */
const DRAWER_CLOSE_DURATION = 500

interface Props {
  adversaries: PrivacyAdversariesSummary
  /** This project's page, whose privacy section the rosette links into. */
  href: string
  isUnderReview?: boolean
}

/**
 * The adversary rosette in the project summary, beside what the protocol
 * keeps private the way the other stats set a label beside their dot. It
 * opens the same analysis as the summary table rosette: a tooltip on desktop
 * and a drawer on mobile. Both lead down to the privacy section, which has
 * the full assessments.
 */
export function PrivacyProjectRosette({
  adversaries,
  href,
  isUnderReview,
}: Props) {
  const { isMobile } = useDevice()
  const [open, setOpen] = useState(false)
  const values = getPrivacyAdversaryRosetteValues(adversaries)
  const { subject, held, total } = getPrivacyAdversariesSentence(adversaries)
  const summary = `${subject} is private against ${held}/${total} adversaries.`
  const sectionHref = getPrivacyAdversariesSectionHref(href)

  const content = (
    <span className="flex items-center gap-2 text-left">
      {/* Taller than the other stats' dots, so the margin keeps the label
          level with their values. */}
      <PizzaRosetteIcon
        values={values}
        isUnderReview={isUnderReview}
        background={false}
        disableSectionLinking
        className="-my-1 size-8 shrink-0"
        alt-text={`Privacy risk summary: ${subject} is private against ${held} of ${total} adversaries`}
      />
      <span>{adversaries.promiseLabel}</span>
    </span>
  )

  if (isMobile) {
    return (
      <PrivacyRosetteDrawer
        adversaries={adversaries}
        isUnderReview={isUnderReview}
        trigger={content}
        triggerLabel={`Privacy risk analysis: ${summary}`}
        open={open}
        onOpenChange={setOpen}
      >
        <PrivacyRosetteDrawerLink
          href={sectionHref}
          onClick={(e) => {
            // The open drawer locks the page scroll, so the section is
            // scrolled to only once the drawer has slid out.
            e.preventDefault()
            setOpen(false)
            setTimeout(() => {
              document
                .getElementById(PRIVACY_ADVERSARIES_SECTION_ID)
                ?.scrollIntoView({ behavior: 'smooth' })
            }, DRAWER_CLOSE_DURATION)
          }}
        >
          See full assessment
        </PrivacyRosetteDrawerLink>
      </PrivacyRosetteDrawer>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={sectionHref}
          className="flex w-fit"
          aria-label={`Privacy risk analysis: ${summary}`}
        >
          {content}
        </a>
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PrivacyRosetteTooltip
          adversaries={adversaries}
          isUnderReview={isUnderReview}
        />
      </TooltipContent>
    </Tooltip>
  )
}
