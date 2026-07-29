import type { Logger } from '@l2beat/backend-tools'
import type { ActivityRecord } from '@l2beat/database'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { withCoreFeatureRpcMetricsContext } from '../../../../tools/coreFeatureRpcMetrics'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import type { ActivityBlockProvider } from './types'

interface Dependencies {
  provider: ActivityBlockProvider
  projectId: ProjectId
  assessCount: (count: number, blockNumber: number) => number
}

export class BlockTxsCountService {
  constructor(
    private readonly $: Dependencies,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async getTxsCount(
    from: number,
    to: number,
  ): Promise<{
    records: ActivityRecord[]
    latestTimestamp: number
  }> {
    return await withCoreFeatureRpcMetricsContext(
      'activity.count',
      {
        chain: this.$.provider.chain,
        mode: 'block',
      },
      async () => {
        const blocks = await this.$.provider.getBlocks(from, to)

        const countedBlocks = blocks.map((block) => {
          let txsCount = this.$.assessCount(block.txsCount, block.number)

          if (txsCount < 0) {
            this.logger.warn('txsCount is negative', {
              projectId: this.$.projectId,
              blockNumber: block.number,
              txsCount,
            })
            txsCount = 0
          }

          let uopsCount: number | null = null
          if (block.uopsCount !== null) {
            uopsCount = this.$.assessCount(block.uopsCount, block.number)
            if (uopsCount < 0) {
              this.logger.warn('uopsCount is negative', {
                projectId: this.$.projectId,
                blockNumber: block.number,
                uopsCount,
              })
              uopsCount = 0
            }
          }

          return {
            txsCount,
            uopsCount,
            timestamp: UnixTime(block.timestamp),
            number: block.number,
          }
        })

        const latestTimestamp = countedBlocks.at(-1)?.timestamp
        assert(latestTimestamp, 'Latest timestamp is undefined')

        return {
          records: aggregatePerDay(this.$.projectId, countedBlocks),
          latestTimestamp,
        }
      },
    )
  }
}
