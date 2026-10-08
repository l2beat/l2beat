import { PrivacyAdversaryMergedDot } from '~/pages/privacy/adversaries/PrivacyAdversaryMergedDot'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'

/**
 * The privacy table's verdict, at the size the ranking has room for: every
 * adversary folded into one dot (hover lists each). Drawn smaller than on the
 * privacy page, to stay quiet beside the icons.
 */
export function HomePrivacyDot({
  adversaries,
}: {
  adversaries: PrivacySummaryEntry['adversaries']
}) {
  return (
    <span className="flex items-center [&_.rounded-full]:size-3.5!">
      <PrivacyAdversaryMergedDot adversaries={adversaries} />
    </span>
  )
}
