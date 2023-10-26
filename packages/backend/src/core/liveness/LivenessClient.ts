import { BigQueryClient } from '@l2beat/shared'
import { EthereumAddress, notUndefined, UnixTime } from '@l2beat/shared-pure'

import { Project } from '../../model'
import { LivenessRecord } from '../../peripherals/database/LivenessRepository'
import {
  LivenessConfig,
  LivenessFunctionCall,
  LivenessTransfer,
} from './types/LivenessConfig'
import {
  BigQueryFunctionCallsResult,
  BigQueryTransfersResult,
} from './types/model'
import {
  adjustToForBigqueryCall,
  getFunctionCallQuery,
  getTransferQuery,
  isTimestampInRange,
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from './utils'

export interface FunctionCallQueryParams {
  address: EthereumAddress
  selector: string
}

export interface TransferQueryParams {
  from: EthereumAddress
  to: EthereumAddress
}

export class LivenessClient {
  constructor(private readonly bigquery: BigQueryClient) {}

  async getLivenessData(
    projects: Project[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<{ data: LivenessRecord[]; to: UnixTime }> {
    // TODO: find missing data for this range(from,to)

    const adjustedTo = adjustToForBigqueryCall(from.toNumber(), to.toNumber())

    const config: LivenessConfig = mergeConfigs(projects)

    const transfersConfig = config.transfers.filter((c) =>
      isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, from, adjustedTo),
    )
    const functionCallsConfig = config.functionCalls.filter((c) =>
      isTimestampInRange(c.sinceTimestamp, c.untilTimestamp, from, adjustedTo),
    )

    const [transfers, functionCalls] = await Promise.all([
      this.getTransfers(transfersConfig, from, adjustedTo),
      this.getFunctionCalls(functionCallsConfig, from, adjustedTo),
    ])

    return {
      data: [...transfers, ...functionCalls],
      to: adjustedTo,
    }
  }

  async getTransfers(
    transfersConfig: LivenessTransfer[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (transfersConfig.length === 0) return Promise.resolve([])

    const query = getTransferQuery(transfersConfig, from, to)

    const queryResult = await this.bigquery.query(query)
    const parsedResult = BigQueryTransfersResult.parse(queryResult)
    return transformTransfersQueryResult(transfersConfig, parsedResult)
  }

  async getFunctionCalls(
    functionCallsConfig: LivenessFunctionCall[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (functionCallsConfig.length === 0) return Promise.resolve([])

    const query = getFunctionCallQuery(functionCallsConfig, from, to)

    const queryResult = await this.bigquery.query(query)
    const parsedResult = BigQueryFunctionCallsResult.parse(queryResult)
    return transformFunctionCallsQueryResult(functionCallsConfig, parsedResult)
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
