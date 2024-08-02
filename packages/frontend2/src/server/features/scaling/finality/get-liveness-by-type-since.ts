import { type LivenessRecord } from '@l2beat/database'
import { type TrackedTxLivenessConfig } from '@l2beat/shared'
import {
  type TrackedTxsConfigSubtype,
  type UnixTime,
} from '@l2beat/shared-pure'
import { db } from '~/server/database'

export type LivenessConfig = Pick<TrackedTxLivenessConfig, 'id' | 'subtype'>

export type LivenessRecordWithConfig = LivenessRecord & LivenessConfig

export async function getLivenessByTypeSince(
  configurations: LivenessConfig[],
  subtype: TrackedTxsConfigSubtype,
  since: UnixTime,
) {
  const configurationIds = configurations
    .filter((c) => c.subtype === subtype)
    .map((c) => c.id)

  const records = await db.liveness.getByConfigurationIdSince(
    configurationIds,
    since,
  )

  function toRecordWithConfiguration(record: LivenessRecord) {
    const config = configurations.find((c) => c.id === record.configurationId)
    if (!config) {
      throw new Error(
        `Configuration with id ${record.configurationId} not found`,
      )
    }
    return {
      ...record,
      ...config,
    }
  }

  return records.map((record) => toRecordWithConfiguration(record))
}
