import type { Logger } from '@l2beat/backend-tools'
import type { SvmBlockProvider } from '@l2beat/shared'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import { withCoreFeatureRpcMetricsContext } from '../../../../tools/coreFeatureRpcMetrics'
import type { ActivityBlock } from './types'

interface Dependencies {
  provider: SvmBlockProvider
  projectId: ProjectId
}

export class SlotTxsCountService {
  constructor(
    private readonly $: Dependencies,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  /** Empty slots are left out */
  async getBlocks(from: number, to: number): Promise<ActivityBlock[]> {
    return await withCoreFeatureRpcMetricsContext(
      'activity.count',
      {
        chain: this.$.provider.chain,
        mode: 'slot',
      },
      async () => {
        const queries = range(from, to + 1).map(async (slot) => {
          const block = await this.$.provider.getBlockWithTransactions(slot)

          if (!block) {
            this.logger.warn('Empty slot found', {
              slot,
              projectId: this.$.projectId.toString(),
            })
            return undefined
          }

          return {
            txsCount: block.transactionsCount,
            uopsCount: block.transactionsCount,
            timestamp: UnixTime(block.timestamp),
            number: block.number,
          }
        })

        const blocksInSlots = await Promise.all(queries)
        return blocksInSlots.filter((x) => x !== undefined)
      },
    )
  }
}
