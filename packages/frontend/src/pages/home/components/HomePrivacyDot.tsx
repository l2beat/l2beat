import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import { PrivacyAdversaryMergedDot } from '~/pages/privacy/adversaries/PrivacyAdversaryMergedDot'
import { getPrivacyAdversaryRosetteValues } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { PrivacyRosetteTrigger } from '~/pages/privacy/rosette/PrivacyRosetteTrigger'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'

/**
 * The privacy table's verdict, at the size the ranking has room for: every
 * adversary folded into one dot (hover lists each), or, in a table 640px or
 * wider, the rosette the privacy page shows, at the ranking's 24px like the
 * Layer 2s' risk rosette. Hover shows the assessment, a click opens it.
 */
export function HomePrivacyDot({
  adversaries,
  href,
  isUnderReview,
}: {
  adversaries: PrivacySummaryEntry['adversaries']
  href: string
  isUnderReview: boolean
}) {
  const values = getPrivacyAdversaryRosetteValues(adversaries)
  return (
    <span className="flex items-center">
      <span className="flex @min-[640px]:hidden [&_.rounded-full]:size-3.5!">
        <PrivacyAdversaryMergedDot adversaries={adversaries} />
      </span>
      <span className="flex @max-[640px]:hidden">
        <PrivacyRosetteTrigger
          values={values}
          isUnderReview={isUnderReview}
          href={href}
          placement="table"
        >
          <PizzaRosetteIcon
            values={values}
            className="size-6"
            isUnderReview={isUnderReview}
            background={false}
            disableSectionLinking
          />
        </PrivacyRosetteTrigger>
      </span>
    </span>
  )
}
