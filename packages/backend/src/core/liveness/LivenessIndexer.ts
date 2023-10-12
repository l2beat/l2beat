import { BigQueryClient } from '@l2beat/shared'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'

import { LivenessRecord } from '../../peripherals/database/LivenessRepository'
import { LivenessConfig } from './types/LivenessConfig'
import {
  isTimestampInRange,
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from './utils'

export class LivenessIndexer {
  constructor(private readonly bigQueryClient: BigQueryClient) {}

  async getTransfers(
    configs: LivenessConfig[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const transfersConfig = configs
      .flatMap((c) => c.transfers)
      .filter(notUndefined)
      .filter((c) => isTimestampInRange(c.untilTimestamp, from, to))

    const queryResults = await this.bigQueryClient.getTransfers(
      transfersConfig,
      from,
      to,
    )

    return transformTransfersQueryResult(configs, transfersConfig, queryResults)
  }

  async getFunctionCalls(
    configs: LivenessConfig[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const functionCallsConfig = configs
      .flatMap((c) => c.functionCalls)
      .filter(notUndefined)
      .filter((c) => isTimestampInRange(c.untilTimestamp, from, to))

    const queryResults = await this.bigQueryClient.getFunctionCalls(
      functionCallsConfig,
      from,
      to,
    )

    return transformFunctionCallsQueryResult(
      configs,
      functionCallsConfig,
      queryResults,
    )
  }
}
