import { Logger } from '@l2beat/backend-tools'
import { ActivityRecord } from '@l2beat/database'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { StarknetClient } from '../../../../peripherals/starknet/StarknetClient'
import { ActivityTransactionConfig } from '../../../activity/ActivityTransactionConfig'
import { TxsCountProvider } from '../TxsCountProvider'

export class StarknetTxsCountProvider extends TxsCountProvider {
  constructor(
    logger: Logger,
    projectId: ProjectId,
    private readonly starknetClient: StarknetClient,
    private readonly projectConfig: ActivityTransactionConfig,
  ) {
    super({ logger, projectId })
  }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    assert(
      this.projectConfig.type === 'starknet',
      'Method not supported for projects other than Starknet',
    )

    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.starknetClient.getBlock(blockNumber)

      return {
        count: block.transactions.length,
        timestamp: new UnixTime(block.timestamp),
        number: block.number,
      }
    })

    const blocks = await Promise.all(queries)
    return this.aggregatePerDay(blocks)
  }
}
