import { TrackedTxLivenessConfig } from '@l2beat/shared'
import { TrackedTxsConfigSubtype, UnixTime } from '@l2beat/shared-pure'
import { LivenessRecord, LivenessRepository } from './LivenessRepository'

export type LivenessConfig = Pick<TrackedTxLivenessConfig, 'id' | 'subtype'>

export type LivenessRecordWithConfig = LivenessRecord & LivenessConfig

export class LivenessWithConfigRepository {
  constructor(
    private readonly configurations: LivenessConfig[],
    private readonly livenessRepository: LivenessRepository,
  ) {}

  async getSince(since: UnixTime) {
    const configurationIds = this.configurations.map((c) => c.id)

    const records = await this.livenessRepository.getByConfigurationIdSince(
      configurationIds,
      since,
    )

    return records.map((record) => this.toRecordWithConfiguration(record))
  }

  async getUpTo(to: UnixTime) {
    const configurationIds = this.configurations.map((c) => c.id)

    const records = await this.livenessRepository.getByConfigurationIdUpTo(
      configurationIds,
      to,
    )

    return records.map((record) => this.toRecordWithConfiguration(record))
  }

  async getWithinTimeRange(from: UnixTime, to: UnixTime) {
    const configurationIds = this.configurations.map((c) => c.id)

    const records =
      await this.livenessRepository.getByConfigurationIdWithinTimeRange(
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

    const records = await this.livenessRepository.getByConfigurationIdSince(
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
