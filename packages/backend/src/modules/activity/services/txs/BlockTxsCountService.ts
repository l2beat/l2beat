import type { Logger } from '@l2beat/backend-tools'
import type { ActivityRecord } from '@l2beat/database'
import type { BlockProvider } from '@l2beat/shared'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import { aggregatePerDay } from '../../utils/aggregatePerDay'
import type { UopsAnalyzer } from '../uops/types'

interface Dependencies {
  provider: BlockProvider
  projectId: ProjectId
  uopsAnalyzer?: UopsAnalyzer
  assessCount: (count: number, blockNumber: number) => number
  logger: Logger
}

export class BlockTxsCountService {
  constructor(private readonly $: Dependencies) {}

  async getTxsCount(
    from: number,
    to: number,
  ): Promise<{
    records: ActivityRecord[]
    latestTimestamp: number
  }> {
    const queries = range(from, to + 1).map(async (blockNumber) => {
      const block = await this.$.provider.getBlockWithTransactions(blockNumber)

      const txs = block.transactions.length
      let txsCount = this.$.assessCount(txs, blockNumber)

      if (txsCount < 0) {
        this.$.logger.warn('txsCount is negative', {
          projectId: this.$.projectId,
          blockNumber,
          txsCount,
        })
        txsCount = 0
      }

      let uopsCount: number | null = null
      if (this.$.uopsAnalyzer) {
        const uops = this.$.uopsAnalyzer.calculateUops(block)
        uopsCount = this.$.assessCount(uops, blockNumber)
        if (uopsCount < 0) {
          this.$.logger.warn('uopsCount is negative', {
            projectId: this.$.projectId,
            blockNumber,
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

    const blocks = await Promise.all(queries)

    const latestTimestamp = blocks.at(-1)?.timestamp
    assert(latestTimestamp, 'Latest timestamp is undefined')

    return {
      records: aggregatePerDay(this.$.projectId, blocks),
      latestTimestamp,
    }
  }
}
