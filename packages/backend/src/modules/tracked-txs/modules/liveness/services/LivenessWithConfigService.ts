import type { Database, LivenessRecord } from '@l2beat/database'
import type { TrackedTxLivenessConfig } from '@l2beat/shared'
import type { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'

export type LivenessConfig = Pick<TrackedTxLivenessConfig, 'id' | 'subtype'>

export type LivenessRecordWithConfig = LivenessRecord & LivenessConfig

export class LivenessWithConfigService {
  constructor(
    private readonly configurations: LivenessConfig[],
    private readonly db: Database,
  ) {}

  async getUpTo(to: UnixTime) {
    const configurationIds = this.configurations.map((c) => c.id)

    const records = await this.db.liveness.getByConfigurationIdUpTo(
      configurationIds,
      to,
    )

    return records.map((record) => this.toRecordWithConfiguration(record))
  }

  async getWithinTimeRange(from: UnixTime, to: UnixTime) {
    const configurationIds = this.configurations.map((c) => c.id)

    const records = await this.db.liveness.getByConfigurationIdWithinTimeRange(
      configurationIds,
      from,
      to,
    )

    return records.map((record) => this.toRecordWithConfiguration(record))
  }

  async getByTypeSince(subtype: TrackedTxsConfigSubtype, since: UnixTime) {
    const configurationIds = this.configurations
      .filter((c) => c.subtype === subtype)
      .map((c) => c.id)

    const records = await this.db.liveness.getByConfigurationIdSince(
      configurationIds,
      since,
    )

    return records.map((record) => this.toRecordWithConfiguration(record))
  }

  toRecordWithConfiguration(record: LivenessRecord): LivenessRecordWithConfig {
    const config = this.configurations.find(
      (c) => c.id === record.configurationId,
    )
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
}
