import { assert, Logger } from '@l2beat/backend-tools'
import { BigQueryClient } from '@l2beat/shared'
import { Hash256, hashJson, notUndefined, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { sortBy } from 'lodash'

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
  isTimestampInRange,
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from './utils'

const LIVENESS_LOGIC_VERSION = 0

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
    // ! write this fn
    this.configHash = getLivenessConfigHash(this.projects)
  }

  override async start(): Promise<void> {
    const oldConfigHash = await this.stateRepository.getConfigHash(
      this.indexerId,
    )

    // TODO: write a test for it
    // expect this.stateRepository.addOrUpdate to be called with {..., newHash, safeHeight: 0}
    if (oldConfigHash && oldConfigHash !== this.configHash) {
      await this.stateRepository.addOrUpdate({
        indexerId: this.indexerId,
        configHash: this.configHash,
        // TODO: should it be zero?
        safeHeight: 0,
      })
    }
    // TODO: check config hash
    await super.start()
  }

  // ! write test if throws error
  override async update(from: number, _to: number): Promise<number> {
    // TODO: think about this logic, should it always add 1 hour?
    const fromUnixTime = new UnixTime(from)
    const toUnixTime = fromUnixTime.add(1, 'hours')

    // TODO: find missing data for this range(from,to)
    let data: LivenessRecord[] | undefined

    try {
      data = await this.getLivenessData(this.projects, fromUnixTime, toUnixTime)
    } catch (e) {
      this.logger.error(e)
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
    const queryResults = await this.bigQueryClient.getFunctionCalls(
      functionCallsConfigs,
      from,
      to,
    )

    return transformFunctionCallsQueryResult(functionCallsConfigs, queryResults)
  }

  override async getSafeHeight(): Promise<number> {
    const height = await this.stateRepository.getSafeHeight(this.indexerId)
    return height ?? this.minTimestamp.toNumber()
  }

  override async setSafeHeight(height: number): Promise<void> {
    await this.stateRepository.addOrUpdate({
      indexerId: this.indexerId,
      configHash: this.configHash,
      safeHeight: height,
    })
  }

  // TODO: add comment why there is no need to delete anything
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

function getLivenessConfigHash(projects: Project[]): Hash256 {
  return hashJson([getEntries(projects), LIVENESS_LOGIC_VERSION])
}

export function getEntries(projects: Project[]) {
  const serializedEntries = projects.map(({ projectId, livenessConfig }) => {
    return {
      projectId: projectId.toString(),
      transfers: livenessConfig?.transfers,
      functionCalls: livenessConfig?.functionCalls,
    }
  })
  return sortBy(serializedEntries, ['projectId'])
}
