import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipVisualOnly,
} from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import { TableLink } from '~/components/table/TableLink'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  getPrivacyAdversariesSectionHref,
  getPrivacyAdversaryRosetteValues,
} from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteAnalysis } from './PrivacyRosetteAnalysis'
import { PrivacyRosetteDrawer } from './PrivacyRosetteDrawer'

interface Props {
  adversaries: PrivacyAdversariesSummary
  /** The project page. */
  href: string
  isUnderReview: boolean
}

export function PrivacyRosetteCell({
  adversaries,
  href,
  isUnderReview,
}: Props) {
  const sectionHref = getPrivacyAdversariesSectionHref(href)
  const icon = (
    <PizzaRosetteIcon
      values={getPrivacyAdversaryRosetteValues(adversaries)}
      className="size-6 md:size-8"
      isUnderReview={isUnderReview}
      background={false}
      disableSectionLinking
    />
  )

  return (
    <>
      {/* The reasons appear nowhere else on the summary page. */}
      <Tooltip contentInHtml>
        <TooltipTrigger
          className="flex size-full items-center justify-center max-md:hidden"
          disabledOnMobile
        >
          <TableLink href={sectionHref}>{icon}</TableLink>
        </TooltipTrigger>
        <TooltipContent fitContent>
          <PrivacyRosetteAnalysis
            adversaries={adversaries}
            isUnderReview={isUnderReview}
          />
          <TooltipVisualOnly>
            <p className="mt-3 text-secondary text-xs">
              Click on the rosette to visit the detailed pages for more info.
            </p>
          </TooltipVisualOnly>
        </TooltipContent>
      </Tooltip>
      <PrivacyRosetteDrawer
        adversaries={adversaries}
        isUnderReview={isUnderReview}
        sectionHref={sectionHref}
        linkLabel="Open project page"
        triggerLabel="Privacy risk analysis"
        triggerClassName="flex size-full items-center justify-center md:hidden"
      >
        {icon}
      </PrivacyRosetteDrawer>
    </>
  )
}
