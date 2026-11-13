import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableSectionHeader } from '~/components/table/TableSectionHeader'
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
      <TableSectionHeader
        title={group.label}
        description={group.description}
        count={group.entries.length}
      />
      <div className="min-w-0">
        <PrivacySummaryTable
          entries={group.entries}
          hiddenColumns={group.hiddenColumns}
          anonymitySetTooltip={group.anonymitySetTooltip}
        />
      </div>
    </PrimaryCard>
  )
}
