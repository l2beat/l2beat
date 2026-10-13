import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { getPrivacyAdversaryRosetteValues } from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteTrigger } from './PrivacyRosetteTrigger'

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
  const values = getPrivacyAdversaryRosetteValues(adversaries)
  return (
    <PrivacyRosetteTrigger
      values={values}
      isUnderReview={isUnderReview}
      href={href}
      placement="table"
    >
      <PizzaRosetteIcon
        values={values}
        className="size-6 md:size-8"
        isUnderReview={isUnderReview}
        background={false}
        disableSectionLinking
      />
    </PrivacyRosetteTrigger>
  )
}
