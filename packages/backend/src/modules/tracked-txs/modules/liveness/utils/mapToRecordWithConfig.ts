import type { LivenessRecord } from '@l2beat/database'
import type { TrackedTxLivenessConfig } from '@l2beat/shared'

export type LivenessConfig = Pick<TrackedTxLivenessConfig, 'id' | 'subtype'>

export type LivenessRecordWithConfig = LivenessRecord & LivenessConfig

export function mapToRecordWithConfig(
  record: LivenessRecord,
  configurations: LivenessConfig[],
): LivenessRecordWithConfig {
  const config = configurations.find((c) => c.id === record.configurationId)
  if (!config) {
    throw new Error(`Configuration with id ${record.configurationId} not found`)
  }
  return {
    ...record,
    ...config,
  }
}
