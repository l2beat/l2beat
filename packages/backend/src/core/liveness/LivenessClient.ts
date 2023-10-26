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

    const config: LivenessConfig = mergeConfigs(projects)
    const adjustedTo = adjustToForBigqueryCall(from.toNumber(), to.toNumber())

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
    transfersConfigs: LivenessTransfer[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (transfersConfigs.length === 0) return Promise.resolve([])

    const senders = transfersConfigs.map((t) => t.from)
    const receivers = transfersConfigs.map((t) => t.to)

    const query = getTransferQuery(senders, receivers, from, to)

    const queryResult = await this.bigquery.query(query)
    const parsedResult = BigQueryTransfersResult.parse(queryResult)
    return transformTransfersQueryResult(transfersConfigs, parsedResult)
  }

  async getFunctionCalls(
    functionCallsConfigs: LivenessFunctionCall[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    if (functionCallsConfigs.length === 0) return Promise.resolve([])

    const addresses = functionCallsConfigs.map((m) => m.address)
    const methodSelectors = functionCallsConfigs.map((m) =>
      m.selector.toLowerCase(),
    )

    const query = getFunctionCallQuery(addresses, methodSelectors, from, to)
    const queryResult = await this.bigquery.query(query)
    const parsedResult = BigQueryFunctionCallsResult.parse(queryResult)

    return transformFunctionCallsQueryResult(functionCallsConfigs, parsedResult)
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
