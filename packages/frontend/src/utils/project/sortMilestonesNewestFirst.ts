import type { Milestone } from '@l2beat/config'

export function sortMilestonesNewestFirst(
  milestones: Milestone[] | undefined,
): Milestone[] {
  return [...(milestones ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}
