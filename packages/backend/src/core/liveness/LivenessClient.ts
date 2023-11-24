import { assert } from '@l2beat/backend-tools'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'

import { Project } from '../../model'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { LivenessConfigurationRecord } from '../../peripherals/database/LivenessConfigurationRepository'
import { LivenessRecord } from '../../peripherals/database/LivenessRepository'
import { LivenessFunctionCall, LivenessTransfer } from './types/LivenessConfig'
import { LivenessConfigurationIdentifier } from './types/LivenessConfigurationIdentifier'
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

export class LivenessClient {
  constructor(private readonly bigquery: BigQueryClient) {}

  async getLivenessData(
    projects: Project[],
    configs: LivenessConfigurationRecord[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<{
    data: LivenessRecord[]
    adjustedTo: UnixTime
    usedConfigurationsIds: number[]
  }> {
    const adjustedTo = adjustToForBigqueryCall(from.toNumber(), to.toNumber())

    const config = mergeConfigs(projects, configs)

    const transfersConfig = config.transfers.filter((c) =>
      isTimestampInRange(
        c.sinceTimestamp,
        c.untilTimestamp,
        c.latestSyncedTimestamp,
        from,
        adjustedTo,
      ),
    )
    const functionCallsConfig = config.functionCalls.filter((c) =>
      isTimestampInRange(
        c.sinceTimestamp,
        c.untilTimestamp,
        c.latestSyncedTimestamp,
        from,
        adjustedTo,
      ),
    )

    const [transfers, functionCalls] = await Promise.all([
      this.getTransfers(transfersConfig, from, adjustedTo),
      this.getFunctionCalls(functionCallsConfig, from, adjustedTo),
    ])

    return {
      data: [...transfers, ...functionCalls],
      adjustedTo,
      usedConfigurationsIds: [
        ...transfersConfig.map((c) => c.livenessConfigurationId),
        ...functionCallsConfig.map((c) => c.livenessConfigurationId),
      ],
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

export function mergeConfigs(
  projects: Project[],
  configs: LivenessConfigurationRecord[],
): {
  transfers: LivenessTransfer[]
  functionCalls: LivenessFunctionCall[]
} {
  // add proper values from configs
  return {
    transfers: projects
      .flatMap((p) => p.livenessConfig?.transfers)
      .filter(notUndefined)
      .map((t) => {
        const config = configs.find(
          (c) => c.identifier === LivenessConfigurationIdentifier(t),
        )
        assert(config, 'Config should not be undefined there')

        return {
          ...t,
          latestSyncedTimestamp: config.lastSyncedTimestamp,
          livenessConfigurationId: config.id,
        }
      }),
    functionCalls: projects
      .flatMap((p) => p.livenessConfig?.functionCalls)
      .filter(notUndefined)
      .map((t) => {
        const config = configs.find(
          (c) => c.identifier === LivenessConfigurationIdentifier(t),
        )
        assert(config, 'Config should not be undefined there')

        return {
          ...t,
          latestSyncedTimestamp: config.lastSyncedTimestamp,
          livenessConfigurationId: config.id,
        }
      }),
  }
}
