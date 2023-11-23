import { assert } from '@l2beat/backend-tools'
import { BigQueryClient } from '@l2beat/shared'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'

import { Project } from '../../model'
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
    transfersConfig: LivenessTransfer[],
    functionCallsConfig: LivenessFunctionCall[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const [transfers, functionCalls] = await Promise.all([
      this.getTransfers(transfersConfig, from, to),
      this.getFunctionCalls(functionCallsConfig, from, to),
    ])

    return [...transfers, ...functionCalls]
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
