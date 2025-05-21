import partition from 'lodash/partition'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import type { CommonScalingEntry } from '~/server/features/scaling/get-common-scaling-entry'

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

  const othersAll = [
    ...migratedRollups,
    ...migratedValidiumsAndOptimiums,
    ...entries.others,
  ].sort(sortFn)

  const [underReviewRollups, activeRollups] = partition(
    rollups,
    (e) => e.statuses?.underReview === 'config',
  )
  const [underReviewValidiums, activeValidiums] = partition(
    validiumsAndOptimiums,
    (e) => e.statuses?.underReview === 'config',
  )
  const [underReviewOthers, activeOthers] = partition(
    othersAll,
    (e) => e.statuses?.underReview === 'config',
  )

  return {
    rollups: activeRollups,
    validiumsAndOptimiums: activeValidiums,
    others: activeOthers,
    underReview: [
      ...underReviewRollups,
      ...underReviewValidiums,
      ...underReviewOthers,
    ],
  }
}
