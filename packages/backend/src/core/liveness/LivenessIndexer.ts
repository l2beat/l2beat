import { assert } from '@l2beat/backend-tools'
import {
  BigQueryClient,
  FunctionCallQueryParams,
  TransferQueryParams,
} from '@l2beat/shared'
import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { LivenessRecord } from '../../peripherals/database/LivenessRepository'

export interface LivenessFunctionCall extends FunctionCallQueryParams {
  type: LivenessType
}

export interface LivenessTransfer extends TransferQueryParams {
  type: LivenessType
}

export interface LivenessConfig {
  projectId: ProjectId
  transfers?: LivenessTransfer[]
  functionCalls?: LivenessFunctionCall[]
}

export class LivenessIndexer {
  constructor(private readonly bigQueryClient: BigQueryClient) {}

  async fetchTransfers(
    configs: LivenessConfig[],
    from: UnixTime,
    to: UnixTime,
  ): Promise<LivenessRecord[]> {
    const transfers = configs.flatMap((c) => c.transfers).filter(notEmpty)

    const queryResults = await this.bigQueryClient.getTransfers(
      transfers,
      from,
      to,
    )

    const results: LivenessRecord[] = queryResults.map((r) => {
      const project = configs.find((c) =>
        c.transfers?.find(
          (cc) => cc.from === r.from_address && cc.to === r.to_address,
        ),
      )

      assert(project, 'Programmer error: project should not be undefined there')

      const transfer = transfers.find(
        (t) => t.from === r.from_address && t.to === r.to_address,
      )

      assert(
        transfer,
        'Programmer error: transfer should not be undefined there',
      )

      return {
        projectId: project.projectId,
        timestamp: r.block_timestamp,
        blockNumber: r.block_number,
        txHash: r.transaction_hash,
        type: transfer.type,
      }
    })
    return results
  }
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}
