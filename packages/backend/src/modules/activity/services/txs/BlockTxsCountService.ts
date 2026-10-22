import type { Logger } from '@l2beat/backend-tools'
import type { ProjectId } from '@l2beat/shared-pure'
import { withCoreFeatureRpcMetricsContext } from '../../../../tools/coreFeatureRpcMetrics'
import type { ActivityBlock, ActivityBlockProvider } from './types'

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

  async getBlocks(from: number, to: number): Promise<ActivityBlock[]> {
    return await withCoreFeatureRpcMetricsContext(
      'activity.count',
      {
        chain: this.$.provider.chain,
        mode: 'block',
      },
      async () => {
        const blocks = await this.$.provider.getBlocks(from, to)

        return blocks.map((block) => {
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
            timestamp: block.timestamp,
            number: block.number,
          }
        })
      },
    )
  }
}
