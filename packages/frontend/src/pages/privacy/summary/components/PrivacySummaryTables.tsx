import { CountBadge } from '~/components/badge/CountBadge'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { PrivacyRosetteLegend } from '../../rosette/PrivacyRosetteLegend'
import type { PrivacySummaryGroup } from '../privacySummaryGroups'
import { PrivacySummaryTable } from './PrivacySummaryTable'

/**
 * Groups stack at every width: the page content tops out near 1180px, so two
 * side by side would each be narrower than their table.
 */
export function PrivacySummaryTables({
  groups,
}: {
  groups: PrivacySummaryGroup[]
}) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <PrivacyRosetteLegend />
      {groups.map((group) => (
        <PrivacySummaryGroupCard key={group.field} group={group} />
      ))}
    </div>
  )
}

function PrivacySummaryGroupCard({ group }: { group: PrivacySummaryGroup }) {
  return (
    <PrimaryCard className="flex min-w-0 flex-col">
      <h2 className="flex items-center gap-2 font-bold text-heading-16 md:text-heading-20">
        {group.label}
        <CountBadge>{group.entries.length}</CountBadge>
      </h2>
      <p className="mt-1 font-medium text-label-value-12 text-secondary md:text-label-value-14">
        {group.description}
      </p>
      <div className="mt-2 min-w-0">
        <PrivacySummaryTable
          entries={group.entries}
          hiddenColumns={group.hiddenColumns}
          anonymitySetTooltip={group.anonymitySetTooltip}
        />
      </div>
    </PrimaryCard>
  )
}
