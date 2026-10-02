import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { getPrivacyAdversaryRosetteValues } from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteTrigger } from './PrivacyRosetteTrigger'

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
  const values = getPrivacyAdversaryRosetteValues(adversaries)
  return (
    <PrivacyRosetteTrigger
      values={values}
      isUnderReview={isUnderReview}
      href={href}
      placement="project"
    >
      <span className="flex items-center gap-2 text-left">
        {/* Taller than the other stats' dots; the margin keeps the rows level. */}
        <PizzaRosetteIcon
          values={values}
          className="-my-1 size-8 shrink-0"
          isUnderReview={isUnderReview}
          background={false}
          disableSectionLinking
        />
        <span>{adversaries.promiseLabel}</span>
      </span>
    </PrivacyRosetteTrigger>
  )
}
