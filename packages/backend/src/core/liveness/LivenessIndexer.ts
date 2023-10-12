import { BigQueryClient } from '@l2beat/shared'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'

import { LivenessRecord } from '../../peripherals/database/LivenessRepository'
import { LivenessConfig } from './types/LivenessConfig'
import {
  formatFunctionCallsQueryResult,
  formatTransfersQueryResult,
} from './utils'

export class LivenessIndexer {
  constructor(private readonly bigQueryClient: BigQueryClient) {}

  async fetchTransfers(
    configs: LivenessConfig[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const transfersConfig = configs
      .flatMap((c) => c.transfers)
      .filter(notUndefined)

    const queryResults = await this.bigQueryClient.getTransfers(
      transfersConfig,
      from,
      to,
    )

    return formatTransfersQueryResult(configs, transfersConfig, queryResults)
  }

  async fetchFunctionCalls(
    configs: LivenessConfig[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const functionCallsConfig = configs
      .flatMap((c) => c.functionCalls)
      .filter(notUndefined)

    const queryResults = await this.bigQueryClient.getFunctionCalls(
      functionCallsConfig,
      from,
      to,
    )

    return formatFunctionCallsQueryResult(
      configs,
      functionCallsConfig,
      queryResults,
    )
  }
}
