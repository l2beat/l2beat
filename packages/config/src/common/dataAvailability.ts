import type { ProjectId } from '@l2beat/shared-pure'
import type { TableReadyValue } from '../types'

export interface DaProjectTableValue extends TableReadyValue {
  projectId?: ProjectId
}

export function getDacSentiment(config?: {
  membersCount?: number
  requiredSignatures?: number
}) {
  if (!config || !config.membersCount || !config.requiredSignatures)
    return 'bad'

  const assumedHonestMembers =
    config.membersCount - config.requiredSignatures + 1

  if (
    config.membersCount < 6 ||
    assumedHonestMembers / config.membersCount > 1 / 3
  ) {
    return 'bad'
  }

  return 'warning'
}
