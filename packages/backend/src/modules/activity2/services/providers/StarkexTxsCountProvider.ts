import { Logger } from '@l2beat/backend-tools'
import { ActivityRecord } from '@l2beat/database'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { StarkexClient } from '../../../../peripherals/starkex/StarkexClient'
import { ActivityTransactionConfig } from '../../../activity/ActivityTransactionConfig'
import { BaseTxsCountProvider } from '../BaseTxsCountProvider'

export class StarkexTxsCountProvider extends BaseTxsCountProvider {
  private readonly projectIdCopy: ProjectId
  constructor(
    logger: Logger,
    projectId: ProjectId,
    private readonly starkexClient: StarkexClient,
    private readonly projectConfig: ActivityTransactionConfig,
  ) {
    super({ logger, projectId })
    this.projectIdCopy = projectId
  }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    assert(
      this.projectConfig.type === 'starkex',
      'Method not supported for projects other than starkex',
    )
    const projectConfig = this.projectConfig

    const queries = range(from, to + 1).map(async (day) => {
      const productCounts = await Promise.all(
        projectConfig.product.map(
          async (instance) =>
            await this.starkexClient.getDailyCount(day, instance),
        ),
      )

      return {
        count: productCounts.reduce((a, b) => a + b, 0),
        timestamp: UnixTime.fromDays(day),
      }
    })

    const counts = await Promise.all(queries)

    return counts.map((c) => ({
      projectId: this.projectIdCopy,
      timestamp: c.timestamp,
      count: c.count,
      start: c.timestamp.toStartOf('day').toNumber(),
      end: c.timestamp.add(1, 'days').add(-1, 'seconds').toNumber(),
    }))
  }
}
