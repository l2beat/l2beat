import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  getPrivacyAdversariesSectionHref,
  getPrivacyAdversaryRosetteValues,
} from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteAnalysis } from './PrivacyRosetteAnalysis'
import { PrivacyRosetteDrawer } from './PrivacyRosetteDrawer'

interface Props {
  adversaries: PrivacyAdversariesSummary
  /** This project's page. */
  href: string
  isUnderReview: boolean
}

/** The rosette beside the promise, as the other risk stats set a dot beside their value. */
export function PrivacyProjectRosette({
  adversaries,
  href,
  isUnderReview,
}: Props) {
  const sectionHref = getPrivacyAdversariesSectionHref(href)
  const content = (
    <span className="flex items-center gap-2 text-left">
      {/* Taller than the other stats' dots; the margin keeps the rows level. */}
      <PizzaRosetteIcon
        values={getPrivacyAdversaryRosetteValues(adversaries)}
        className="-my-1 size-8 shrink-0"
        isUnderReview={isUnderReview}
        background={false}
        disableSectionLinking
      />
      <span>{adversaries.promiseLabel}</span>
    </span>
  )

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <a href={sectionHref} className="flex w-fit max-md:hidden">
            {content}
          </a>
        </TooltipTrigger>
        <TooltipContent fitContent>
          <PrivacyRosetteAnalysis
            adversaries={adversaries}
            isUnderReview={isUnderReview}
          />
        </TooltipContent>
      </Tooltip>
      <PrivacyRosetteDrawer
        adversaries={adversaries}
        isUnderReview={isUnderReview}
        sectionHref={sectionHref}
        linkLabel="See full assessment"
        triggerClassName="md:hidden"
      >
        {content}
      </PrivacyRosetteDrawer>
    </>
  )
}
