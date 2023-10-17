import { Logger } from '@l2beat/backend-tools'
import { BigQueryClient } from '@l2beat/shared'
import { Hash256, hashJson, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'

import { IndexerStateRepository } from '../../peripherals/database/IndexerStateRepository'
import { LivenessRecord } from '../../peripherals/database/LivenessRepository'
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

const LOGIC_VERSION = 0
const CONFIG_HASH = hashJson('LIVENESS_CONFIG_HASH' + LOGIC_VERSION.toString())

export class LivenessIndexer extends ChildIndexer {
  private readonly indexerId = 'liveness_indexer'

  constructor(
    logger: Logger,
    parentIndexer: HourlyIndexer,
    private readonly bigQueryClient: BigQueryClient,
    private readonly stateRepository: IndexerStateRepository,
    private readonly minTimestamp: UnixTime,
  ) {
    super(logger, [parentIndexer])
  }

  override async start(): Promise<void> {
    // TODO
  }

  override async update(from: number, to: number): Promise<number> {
    // TODO
  }

  // override async invalidate(targetHeight: number): Promise<number> {
  //   // TODO
  // }

  override async getSafeHeight(): Promise<number> {
    const height = await this.stateRepository.getSafeHeight(this.indexerId)
    return height ?? this.minTimestamp.toNumber()
  }

  override async setSafeHeight(height: number): Promise<void> {
    await this.stateRepository.addOrUpdate({
      indexerId: this.indexerId,
      configHash: CONFIG_HASH,
      safeHeight: height,
    })
  }

  async getLivenessData(
    config: LivenessConfig,
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const transfersConfig = config.transfers.filter((c) =>
      isTimestampInRange(c.untilTimestamp, from, to),
    )
    const functionCallsConfig = config.functionCalls.filter((c) =>
      isTimestampInRange(c.untilTimestamp, from, to),
    )
    const transfers = await this.getTransfers(transfersConfig, from, to)
    const functionCalls = await this.getFunctionCalls(
      functionCallsConfig,
      from,
      to,
    )

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
}
