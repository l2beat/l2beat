import { PrivacyAdversaryMergedDot } from '~/pages/privacy/adversaries/PrivacyAdversaryMergedDot'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'

/**
 * Every adversary folded into one dot, the privacy table's headline verdict;
 * hover lists each adversary. Drawn smaller than in the table, to stay quiet
 * beside a project's icon.
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
