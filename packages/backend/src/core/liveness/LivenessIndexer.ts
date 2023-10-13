import { BigQueryClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

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
    projectConfigs: LivenessConfig[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const combinedConfigs = projectConfigs
      .flatMap((c) => c.transfers)
      .filter((c) => isTimestampInRange(c.untilTimestamp, from, to))

    const queryResults = await this.bigQueryClient.getTransfers(
      combinedConfigs,
      from,
      to,
    )

    return transformTransfersQueryResult(combinedConfigs, queryResults)
  }

  async getFunctionCalls(
    projectConfigs: LivenessConfig[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const allConfigs = projectConfigs
      .flatMap((c) => c.functionCalls)
      .filter((c) => isTimestampInRange(c.untilTimestamp, from, to))

    const queryResults = await this.bigQueryClient.getFunctionCalls(
      allConfigs,
      from,
      to,
    )

    return transformFunctionCallsQueryResult(allConfigs, queryResults)
  }
}
