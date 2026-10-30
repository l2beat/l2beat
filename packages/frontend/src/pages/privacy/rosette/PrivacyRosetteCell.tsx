import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { getPrivacyAdversaryRosetteValues } from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteTrigger } from './PrivacyRosetteTrigger'

interface Props {
  adversaries: PrivacyAdversariesSummary
  /** The project page. */
  href: string
  isUnderReview: boolean
  /** For the rosette, e.g. its size. */
  iconClassName?: string
}

export function PrivacyRosetteCell({
  adversaries,
  href,
  isUnderReview,
  iconClassName,
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
        className={cn('size-6 md:size-8', iconClassName)}
        isUnderReview={isUnderReview}
        background={false}
        disableSectionLinking
      />
    </PrivacyRosetteTrigger>
  )
}
