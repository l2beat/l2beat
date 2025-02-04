import type { Milestone } from '@l2beat/config'

export function mapMilestones(
  milestones: Milestone[],
): Record<number, Milestone> {
  const result: Record<number, Milestone> = {}
  for (const milestone of milestones) {
    const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000)
    result[timestamp] = milestone
  }
  return result
}
