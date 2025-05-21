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
      ...entries.underReview,
      ...underReviewRollups,
      ...underReviewValidiums,
      ...underReviewOthers,
    ],
  }
}

export function splitUnderReviewEntries<T extends CommonScalingEntry>(
  entries: TabbedScalingEntries<T>,
) {
  const [underReviewRollups, rollups] = partition(
    entries.rollups,
    (e) => e.statuses?.underReview === 'config',
  )
  const [underReviewValidiums, validiumsAndOptimiums] = partition(
    entries.validiumsAndOptimiums,
    (e) => e.statuses?.underReview === 'config',
  )
  const [underReviewOthers, others] = partition(
    entries.others,
    (e) => e.statuses?.underReview === 'config',
  )

  return {
    rollups,
    validiumsAndOptimiums,
    others,
    underReview: [
      ...underReviewRollups,
      ...underReviewValidiums,
      ...underReviewOthers,
    ],
  }
}
