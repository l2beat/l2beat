import { assert, Logger } from '@l2beat/backend-tools'
import { BigQueryClient } from '@l2beat/shared'
import { Hash256, notUndefined, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'

import { Project } from '../../model'
import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import {
  LivenessRecord,
  LivenessRepository,
} from '../../peripherals/database/LivenessRepository'
import { HourlyIndexer } from './HourlyIndexer'
import {
  LivenessConfig,
  LivenessFunctionCall,
  LivenessTransfer,
} from './types/LivenessConfig'
import {
  getLivenessConfigHash,
  isTimestampInRange,
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from './utils'

export class LivenessIndexer extends ChildIndexer {
  private readonly indexerId = 'liveness_indexer'
  private readonly configHash: Hash256

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly projects: Project[],
    private readonly bigQueryClient: BigQueryClient,
    private readonly stateRepository: IndexerStateRepository,
    private readonly livenessRepository: LivenessRepository,
    private readonly minTimestamp: UnixTime,
  ) {
    super(logger, [parentIndexer])
    this.configHash = getLivenessConfigHash(this.projects)
  }

  override async start(): Promise<void> {
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
    const toUnixTime = adjustToForBigqueryCall(from, to)

    let data: LivenessRecord[] | undefined

    try {
      data = await this.getLivenessData(this.projects, fromUnixTime, toUnixTime)
    } catch (e) {
      this.logger.error(e)
      throw e
    }

    assert(data, 'Liveness data should not be undefined there')

    await this.livenessRepository.addMany(data)

    return Promise.resolve(toUnixTime.toNumber())
  }

  async getLivenessData(
    projects: Project[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    // TODO: find missing data for this range(from,to)

    const config: LivenessConfig = mergeConfigs(projects)

    const transfersConfig = config.transfers.filter((c) =>
      isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, from, to),
    )
    const functionCallsConfig = config.functionCalls.filter((c) =>
      isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, from, to),
    )

    const [transfers, functionCalls] = await Promise.all([
      this.getTransfers(transfersConfig, from, to),
      this.getFunctionCalls(functionCallsConfig, from, to),
    ])

    return [...transfers, ...functionCalls]
  }

  async getTransfers(
    transfersConfigs: LivenessTransfer[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (transfersConfigs.length === 0) return Promise.resolve([])

    const queryResults = await this.bigQueryClient.getTransfers(
      transfersConfigs,
      from,
      to,
    )
    return transformTransfersQueryResult(transfersConfigs, queryResults)
  }

  async getFunctionCalls(
    functionCallsConfigs: LivenessFunctionCall[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (functionCallsConfigs.length === 0) return Promise.resolve([])

    const queryResults = await this.bigQueryClient.getFunctionCalls(
      functionCallsConfigs,
      from,
      to,
    )

    return transformFunctionCallsQueryResult(functionCallsConfigs, queryResults)
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

  getIndexerId(): string {
    return this.indexerId
  }

  getConfigHash(): Hash256 {
    return this.configHash
  }

  // This function will not be used, but it is required by the UIF.
  // In our case there is no re-org handling so we do not have to worry
  // that our data will become invalid.
  override async invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}

export function mergeConfigs(projects: Project[]): LivenessConfig {
  return {
    transfers: projects
      .flatMap((p) => p.livenessConfig?.transfers)
      .filter(notUndefined),
    functionCalls: projects
      .flatMap((p) => p.livenessConfig?.functionCalls)
      .filter(notUndefined),
  }
}

export function adjustToForBigqueryCall(from: number, to: number): UnixTime {
  const fromUnixTime = new UnixTime(from)
  const toUnixTime = new UnixTime(to)

  if (!fromUnixTime.toStartOf('day').equals(toUnixTime.toStartOf('day'))) {
    return fromUnixTime.toNext('day')
  } else {
    return toUnixTime
  }
}
