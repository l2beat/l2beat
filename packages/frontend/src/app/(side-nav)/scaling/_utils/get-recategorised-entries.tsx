import { partition } from 'lodash'
import type { CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'
import type { TabbedScalingEntries } from '~/utils/group-by-tabs'

export function getRecategorisedEntries<T extends CommonScalingEntry>(
  entries: TabbedScalingEntries<T>,
  sortFn: ((a: T, b: T) => number) | undefined,
) {
  const [migratedRollups, rollups] = partition(
    entries.rollups,
    (entry) => entry.statuses?.countdowns?.otherMigration,
  )

  const [migratedValidiumsAndOptimiums, validiumsAndOptimiums] = partition(
    entries.validiumsAndOptimiums,
    (entry) => entry.statuses?.countdowns?.otherMigration,
  )

  const others = [
    ...migratedRollups,
    ...migratedValidiumsAndOptimiums,
    ...entries.others,
  ].sort(sortFn)

  return {
    rollups: rollups.filter(
      (entry) => entry.statuses?.underReview !== 'config',
    ),
    validiumsAndOptimiums: validiumsAndOptimiums.filter(
      (entry) => entry.statuses?.underReview !== 'config',
    ),
    others: others.filter((entry) => entry.statuses?.underReview !== 'config'),
  }
}
