import { CountBadge } from '~/components/badge/CountBadge'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'
import { PrivacyRosetteLegend } from '../../rosette/PrivacyRosetteLegend'
import type { PrivacySummaryGroup } from '../privacySummaryGroups'
import { PrivacySummaryTable } from './PrivacySummaryTable'

/** The first group spans the page, the others sit side by side below it. */
export function PrivacySummaryTables({
  groups,
}: {
  groups: PrivacySummaryGroup[]
}) {
  const [first, ...rest] = groups

  return (
    <div className="mt-4 flex flex-col gap-4">
      <PrivacyRosetteLegend />
      {first && <PrivacySummaryGroupCard group={first} />}
      {/* Rows shared through subgrids start both tables on the same line. */}
      <div className="grid gap-4 xl:grid-cols-2 xl:grid-rows-[auto_auto_1fr]">
        {rest.map((group) => (
          <PrivacySummaryGroupCard
            key={group.field}
            group={group}
            className="xl:row-span-3 xl:grid xl:grid-rows-subgrid xl:gap-0"
          />
        ))}
      </div>
    </div>
  )
}

function PrivacySummaryGroupCard({
  group,
  className,
}: {
  group: PrivacySummaryGroup
  className?: string
}) {
  return (
    <PrimaryCard className={cn('flex min-w-0 flex-col', className)}>
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
        />
      </div>
    </PrimaryCard>
  )
}
