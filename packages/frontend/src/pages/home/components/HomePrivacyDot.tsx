import { PrivacyAdversaryDots } from '~/pages/privacy/adversaries/PrivacyAdversaryDots'
import { PrivacyAdversaryMergedDot } from '~/pages/privacy/adversaries/PrivacyAdversaryMergedDot'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'

/**
 * The privacy table's verdict, at the size the ranking has room for: every
 * adversary folded into one dot (hover lists each), or, in a table 640px or
 * wider, one dot per adversary as on the privacy page, each linking to its
 * assessment. Drawn smaller than there, to stay quiet beside the icons.
 */
export function HomePrivacyDot({
  adversaries,
  href,
}: {
  adversaries: PrivacySummaryEntry['adversaries']
  href: string
}) {
  return (
    <span className="flex items-center [&_.rounded-full]:size-3.5!">
      <span className="flex @min-[640px]:hidden">
        <PrivacyAdversaryMergedDot adversaries={adversaries} />
      </span>
      <PrivacyAdversaryDots
        adversaries={adversaries}
        href={href}
        className="@max-[640px]:hidden"
      />
    </span>
  )
}
