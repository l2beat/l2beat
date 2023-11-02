import { assert, Logger } from '@l2beat/backend-tools'
import { Hash256, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'

import { Project } from '../../model'
import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import {
  LivenessConfigurationRecord,
  LivenessConfigurationRepository,
} from '../../peripherals/database/LivenessConfigurationRepository'
import {
  LivenessRecord,
  LivenessRepository,
} from '../../peripherals/database/LivenessRepository'
import { HourlyIndexer } from './HourlyIndexer'
import { LivenessClient } from './LivenessClient'
import { getLivenessConfigHash } from './utils'

export class LivenessIndexer extends ChildIndexer {
  private readonly indexerId = 'liveness_indexer'
  private readonly configHash: Hash256

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly projects: Project[],
    private readonly livenessClient: LivenessClient,
    private readonly stateRepository: IndexerStateRepository,
    private readonly livenessRepository: LivenessRepository,
    private readonly livenessConfigurationRepository: LivenessConfigurationRepository,
    private readonly minTimestamp: UnixTime,
  ) {
    super(logger, [parentIndexer])
    this.configHash = getLivenessConfigHash(this.projects)
  }

  override async start(): Promise<void> {
    // add missing liveness configs to the database
    // fromTimestamp, -- safeguard configuration changes to earlier start times
    // toTimestamp? -- delete superfluous records so they don't appear in query results
    // there cannot be two same hashes in one project, write a test for it, this can be solved via including sinceTimestamp probably
    const oldConfigHash = await this.stateRepository.findConfigHash(
      this.indexerId,
    )

    if (oldConfigHash === undefined || oldConfigHash !== this.configHash) {
      await this.stateRepository.addOrUpdate({
        indexerId: this.indexerId,
        configHash: this.configHash,
        safeHeight: this.minTimestamp.toNumber(),
      })
    }

    await super.start()
  }

  override async update(from: number, to: number): Promise<number> {
    const fromUnixTime = new UnixTime(from)
    const toUnixTime = new UnixTime(to)

    let configs: LivenessConfigurationRecord[] | undefined
    let data: { data: LivenessRecord[]; to: UnixTime } | undefined

    try {
      configs = await this.livenessConfigurationRepository.getAll()

      data = await this.livenessClient.getLivenessData(
        this.projects,
        configs,
        fromUnixTime,
        toUnixTime,
      )
    } catch (e) {
      this.logger.error(e)
      throw e
    }

    assert(data, 'Liveness data should not be undefined there')
    assert(configs, 'Configs should not be undefined there')

    // TODO: run in a transaction
    await this.livenessRepository.addMany(data.data)
    await this.livenessConfigurationRepository.updateMany(
      configs.map((c) => {
        // TODO: fix typescript issue
        assert(data, 'Liveness data should not be undefined there')

        return { ...c, lastSyncedTimestamp: data.to }
      }),
    )

    return Promise.resolve(data.to.toNumber())
  }

  override async getSafeHeight(): Promise<number> {
    const height = await this.stateRepository.findSafeHeight(this.indexerId)
    return height ?? this.minTimestamp.toNumber()
  }

  override async setSafeHeight(height: number): Promise<void> {
    await this.stateRepository.addOrUpdate({
      indexerId: this.indexerId,
      configHash: this.configHash,
      safeHeight: height,
    })
  }

  // This function will not be used, but it is required by the UIF.
  // In our case there is no re-org handling so we do not have to worry
  // that our data will become invalid.
  override async invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}
